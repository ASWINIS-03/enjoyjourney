import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { dbStore } from '../db.js';
import { authMiddleware, AuthenticatedRequest, generateToken } from '../middleware/auth.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/emailService.js';
import { UserDocument } from '../types.js';

const router = express.Router();

function sanitizeUser(user: UserDocument) {
  const { passwordHash, verificationCode, resetPasswordCode, ...safeUser } = user;
  return safeUser;
}

// 1. Sign Up / Register
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, mobile, password, confirmPassword, termsAccepted } = req.body;

    if (!fullName || !email || !mobile || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    if (!termsAccepted) {
      return res.status(400).json({ error: 'Please agree to the Terms and Conditions to proceed.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Password and Confirm Password do not match.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const emailClean = email.trim().toLowerCase();
    const existing = dbStore.getUserByEmail(emailClean);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email address already exists. Please sign in or use another email.' });
    }

    // Generate 6-digit OTP
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser: UserDocument = {
      id: 'usr-' + crypto.randomUUID(),
      fullName: fullName.trim(),
      email: emailClean,
      mobile: mobile.trim(),
      passwordHash,
      isEmailVerified: false,
      verificationCode,
      verificationCodeExpires,
      claimedOffers: ['REGULAR10'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dbStore.createUser(newUser);

    const emailStatus = await sendVerificationEmail(emailClean, verificationCode);

    return res.status(201).json({
      message: 'Account created successfully. Please enter your 6-digit verification code.',
      email: emailClean,
      emailStatus,
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Internal server error during account creation.' });
  }
});

// 2. Email Verification
router.post('/verify-email', (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ error: 'Email and verification code are required.' });
    }

    const emailClean = email.trim().toLowerCase();
    const user = dbStore.getUserByEmail(emailClean);
    if (!user) {
      return res.status(404).json({ error: 'User account not found.' });
    }

    if (user.isEmailVerified) {
      const token = generateToken(user);
      return res.json({ message: 'Email is already verified.', user: sanitizeUser(user), token });
    }

    if (!user.verificationCode || user.verificationCode !== code.trim()) {
      return res.status(400).json({ error: 'Invalid verification code. Please check and try again.' });
    }

    if (user.verificationCodeExpires && new Date() > new Date(user.verificationCodeExpires)) {
      return res.status(400).json({ error: 'Verification code has expired. Please request a new code.' });
    }

    // Activate user
    const updated = dbStore.updateUser(user.id, {
      isEmailVerified: true,
      verificationCode: undefined,
      verificationCodeExpires: undefined,
    });

    if (!updated) {
      return res.status(500).json({ error: 'Failed to update user verification status.' });
    }

    // Add Welcome notification
    dbStore.createNotification({
      id: 'notif-' + crypto.randomUUID(),
      userId: user.id,
      title: 'Email Verified Successfully!',
      message: 'Your EnjoyJourney account is activated. Explore flights, buses, cabs, hotels, and trains with special discounts.',
      category: 'account',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    const token = generateToken(updated);
    return res.json({
      message: 'Email verified successfully! Welcome to EnjoyJourney.',
      user: sanitizeUser(updated),
      token,
    });
  } catch (err) {
    console.error('Verify email error:', err);
    return res.status(500).json({ error: 'Error during email verification.' });
  }
});

// 3. Resend Code
router.post('/resend-code', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required.' });

    const emailClean = email.trim().toLowerCase();
    const user = dbStore.getUserByEmail(emailClean);
    if (!user) return res.status(404).json({ error: 'Account not found with this email.' });

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    dbStore.updateUser(user.id, {
      verificationCode: newCode,
      verificationCodeExpires: expires,
    });

    const emailStatus = await sendVerificationEmail(emailClean, newCode);

    return res.json({
      message: 'A fresh verification code has been generated.',
      emailStatus,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to resend code.' });
  }
});

// 4. Sign In / Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const emailClean = email.trim().toLowerCase();
    const user = dbStore.getUserByEmail(emailClean);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email address or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email address or password.' });
    }

    if (!user.isEmailVerified) {
      // Re-generate OTP so user can verify
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      dbStore.updateUser(user.id, { verificationCode, verificationCodeExpires: expires });
      const emailStatus = await sendVerificationEmail(user.email, verificationCode);

      return res.status(403).json({
        error: 'Please verify your email address before signing in.',
        needsVerification: true,
        email: user.email,
        emailStatus,
      });
    }

    const token = generateToken(user);
    return res.json({
      message: 'Welcome back to EnjoyJourney!',
      user: sanitizeUser(user),
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error during sign in.' });
  }
});

// 5. Forgot Password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email address is required.' });

    const emailClean = email.trim().toLowerCase();
    const user = dbStore.getUserByEmail(emailClean);
    if (!user) {
      // Security standard: don't reveal if account exists or not
      return res.json({ message: 'If this email is registered, password reset instructions have been generated.' });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    dbStore.updateUser(user.id, {
      resetPasswordCode: resetCode,
      resetPasswordExpires: expires,
    });

    const emailStatus = await sendPasswordResetEmail(emailClean, resetCode);

    return res.json({
      message: 'Password reset code generated.',
      email: emailClean,
      emailStatus,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Server error during password reset request.' });
  }
});

// 6. Reset Password with Code
router.post('/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword, confirmPassword } = req.body;
    if (!email || !code || !newPassword) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'New password and confirmation do not match.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const emailClean = email.trim().toLowerCase();
    const user = dbStore.getUserByEmail(emailClean);
    if (!user || !user.resetPasswordCode || user.resetPasswordCode !== code.trim()) {
      return res.status(400).json({ error: 'Invalid or incorrect reset code.' });
    }

    if (user.resetPasswordExpires && new Date() > new Date(user.resetPasswordExpires)) {
      return res.status(400).json({ error: 'Password reset code has expired. Please request a new one.' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    dbStore.updateUser(user.id, {
      passwordHash,
      resetPasswordCode: undefined,
      resetPasswordExpires: undefined,
    });

    return res.json({ message: 'Password reset successful! You can now sign in with your new password.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to reset password.' });
  }
});

// 7. Get Current User Profile (Protected)
router.get('/me', authMiddleware, (req: AuthenticatedRequest, res) => {
  const user = dbStore.getUserById(req.user!.userId);
  if (!user) {
    return res.status(404).json({ error: 'User profile not found.' });
  }
  return res.json({ user: sanitizeUser(user) });
});

// 8. Update Profile (Protected)
router.put('/profile', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const { fullName, mobile, city, emergencyContact } = req.body;
    const userId = req.user!.userId;

    const user = dbStore.getUserById(userId);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const updated = dbStore.updateUser(userId, {
      fullName: fullName ? fullName.trim() : user.fullName,
      mobile: mobile ? mobile.trim() : user.mobile,
      city: city ? city.trim() : user.city,
      emergencyContact: emergencyContact ? emergencyContact.trim() : user.emergencyContact,
    });

    return res.json({ message: 'Profile updated successfully.', user: sanitizeUser(updated!) });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// 9. Change Password (Protected)
router.post('/change-password', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user!.userId;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'New passwords do not match.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters.' });
    }

    const user = dbStore.getUserById(userId);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect current password.' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    dbStore.updateUser(userId, { passwordHash });

    dbStore.createNotification({
      id: 'notif-' + crypto.randomUUID(),
      userId,
      title: 'Security Alert: Password Changed',
      message: 'Your EnjoyJourney account password was updated successfully.',
      category: 'account',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    return res.json({ message: 'Password changed successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to change password.' });
  }
});

export default router;
