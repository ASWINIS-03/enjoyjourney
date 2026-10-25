import React, { useState } from 'react';
import { Eye, EyeOff, ShieldCheck, Mail, Lock, Phone, User as UserIcon, Compass, Sparkles, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

type AuthView = 'signin' | 'signup' | 'verify' | 'forgot' | 'reset';

export const AuthPage: React.FC = () => {
  const { login, quickDemoLogin } = useAuth();

  const [view, setView] = useState<AuthView>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Sign In Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign Up Form State
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Email Verification State
  const [verifyEmail, setVerifyEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [demoCodeNotice, setDemoCodeNotice] = useState<string | null>(null);

  // Forgot / Reset Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const clearAlerts = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  // 1. Handle Sign In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAlerts();
    setLoading(true);

    try {
      await login(loginEmail, loginPassword);
    } catch (err: any) {
      if (err.data?.needsVerification) {
        setVerifyEmail(err.data.email);
        setView('verify');
        if (err.data.emailStatus?.demoCode) {
          setDemoCodeNotice(err.data.emailStatus.demoCode);
        }
        setErrorMessage(err.message || 'Please verify your email address to activate your account.');
      } else {
        setErrorMessage(err.message || 'Invalid email or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAlerts();

    if (!termsAccepted) {
      setErrorMessage('You must accept the Terms & Conditions to create an account.');
      return;
    }

    if (signupPassword !== confirmPassword) {
      setErrorMessage('Password and Confirm Password do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.register({
        fullName,
        email: signupEmail,
        mobile,
        password: signupPassword,
        confirmPassword,
        termsAccepted,
      });

      setVerifyEmail(res.email);
      setView('verify');
      if (res.emailStatus?.demoCode) {
        setDemoCodeNotice(res.emailStatus.demoCode);
      }
      setSuccessMessage(res.message);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Verify Email
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAlerts();
    setLoading(true);

    try {
      const res = await api.verifyEmail(verifyEmail, verificationCode);
      setSuccessMessage(res.message);
      // Auto login with the verified token
      await login(verifyEmail, signupPassword || loginPassword);
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid verification code.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Handle Resend Code
  const handleResendCode = async () => {
    clearAlerts();
    setLoading(true);
    try {
      const res = await api.resendCode(verifyEmail);
      if (res.emailStatus?.demoCode) {
        setDemoCodeNotice(res.emailStatus.demoCode);
      }
      setSuccessMessage(res.message);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to resend code.');
    } finally {
      setLoading(false);
    }
  };

  // 5. Handle Forgot Password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAlerts();
    setLoading(true);
    try {
      const res = await api.forgotPassword(forgotEmail);
      setView('reset');
      if (res.emailStatus?.demoCode) {
        setDemoCodeNotice(res.emailStatus.demoCode);
      }
      setSuccessMessage(res.message);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error processing request.');
    } finally {
      setLoading(false);
    }
  };

  // 6. Handle Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAlerts();
    if (newPassword !== confirmNewPassword) {
      setErrorMessage('New passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.resetPassword({
        email: forgotEmail,
        code: resetCode,
        newPassword,
        confirmPassword: confirmNewPassword,
      });
      setSuccessMessage(res.message);
      setView('signin');
      setLoginEmail(forgotEmail);
      setLoginPassword('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden">
      {/* Background Graphic Elements */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="text-center mb-6 z-10">
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-800/80 border border-slate-700/80 rounded-full mb-3 shadow-lg">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-slate-950 font-black shadow-md">
            <Compass className="w-5 h-5 text-slate-950 animate-spin-slow" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white">
            Enjoy<span className="text-teal-400">Journey</span>
          </span>
        </div>
        <p className="text-slate-400 text-sm font-medium">Explore More. Travel Better. — Full-Stack Travel Booking</p>
      </div>

      {/* Main Authentication Card */}
      <div className="w-full max-w-md bg-slate-800/90 backdrop-blur-xl border border-slate-700/70 rounded-2xl shadow-2xl p-6 sm:p-8 z-10">
        {/* Navigation Tabs (Sign In vs Sign Up) */}
        {(view === 'signin' || view === 'signup') && (
          <div className="flex border-b border-slate-700 mb-6">
            <button
              type="button"
              onClick={() => {
                setView('signin');
                clearAlerts();
              }}
              className={`flex-1 pb-3 text-sm font-semibold transition-colors border-b-2 ${
                view === 'signin'
                  ? 'border-teal-400 text-teal-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setView('signup');
                clearAlerts();
              }}
              className={`flex-1 pb-3 text-sm font-semibold transition-colors border-b-2 ${
                view === 'signup'
                  ? 'border-teal-400 text-teal-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Back Buttons for Secondary Views */}
        {(view === 'verify' || view === 'forgot' || view === 'reset') && (
          <button
            type="button"
            onClick={() => {
              setView('signin');
              clearAlerts();
            }}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-teal-300 mb-4 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Sign In
          </button>
        )}

        {/* Status Alerts */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-500/15 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-500/15 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Demo OTP Notice Box (Transparent & Compliant) */}
        {demoCodeNotice && (view === 'verify' || view === 'reset') && (
          <div className="mb-5 p-3.5 bg-amber-500/15 border border-amber-500/40 rounded-xl text-amber-200 text-xs">
            <div className="font-semibold flex items-center gap-1.5 text-amber-300 mb-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Demonstration Mode OTP</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed mb-2">
              Since SMTP email service is not configured with live credentials, your verification code is displayed directly below for academic review:
            </p>
            <div className="text-center py-2 bg-slate-900/80 rounded-lg border border-amber-500/30 text-lg font-mono font-bold tracking-widest text-amber-400">
              {demoCodeNotice}
            </div>
          </div>
        )}

        {/* VIEW 1: SIGN IN */}
        {view === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setView('forgot');
                    clearAlerts();
                  }}
                  className="text-xs text-teal-400 hover:text-teal-300 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-9 pr-10 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-teal-500 focus:ring-teal-400 focus:ring-offset-slate-900"
              />
              <label htmlFor="remember" className="ml-2 text-xs text-slate-300">
                Remember Me
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-teal-500/20 transition-all disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In to EnjoyJourney'}
            </button>

            {/* Quick 1-Click Demo Evaluation Shortcut */}
            <div className="pt-3 border-t border-slate-700/60 text-center">
              <p className="text-[11px] text-slate-400 mb-2">College Project / Portfolio Evaluation Shortcut:</p>
              <button
                type="button"
                onClick={quickDemoLogin}
                className="w-full py-2 px-3 bg-slate-700/60 hover:bg-slate-700 text-teal-300 border border-teal-500/40 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Instant Demo Login (Alex Traveler)</span>
              </button>
            </div>
          </form>
        )}

        {/* VIEW 2: SIGN UP / CREATE ACCOUNT */}
        {view === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Sivaraj Kuttila"
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Mobile Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="10-digit Indian Mobile"
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type password"
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                required
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded bg-slate-900 border-slate-700 text-teal-500 focus:ring-teal-400"
              />
              <label htmlFor="terms" className="ml-2 text-xs text-slate-300 leading-tight">
                I agree to the EnjoyJourney{' '}
                <span className="text-teal-400 hover:underline cursor-pointer">Terms & Conditions</span> and{' '}
                <span className="text-teal-400 hover:underline cursor-pointer">Privacy Policy</span>.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-teal-500/20 transition-all disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account & Verify'}
            </button>
          </form>
        )}

        {/* VIEW 3: EMAIL VERIFICATION */}
        {view === 'verify' && (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="text-center mb-2">
              <ShieldCheck className="w-10 h-10 text-teal-400 mx-auto mb-2" />
              <h3 className="text-base font-bold text-white">Email Verification</h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter the 6-digit one-time code generated for <br />
                <span className="font-semibold text-teal-300">{verifyEmail}</span>
              </p>
            </div>

            <div>
              <input
                type="text"
                required
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • • • •"
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl py-3 text-center text-xl font-mono tracking-widest text-teal-300 placeholder-slate-600 focus:outline-none focus:border-teal-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading || verificationCode.length < 6}
              className="w-full py-2.5 px-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-teal-500/20 transition-all disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Activate Account'}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={loading}
                className="text-xs text-teal-400 hover:text-teal-300 underline font-medium"
              >
                Didn't receive the code? Resend
              </button>
            </div>
          </form>
        )}

        {/* VIEW 4: FORGOT PASSWORD */}
        {view === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="text-center mb-2">
              <h3 className="text-base font-bold text-white">Reset Your Password</h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter your registered email address to receive a secure password recovery code.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-teal-500/20 transition-all disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Send Password Reset Code'}
            </button>
          </form>
        )}

        {/* VIEW 5: RESET PASSWORD */}
        {view === 'reset' && (
          <form onSubmit={handleResetPassword} className="space-y-3.5">
            <div className="text-center mb-2">
              <h3 className="text-base font-bold text-white">Set New Password</h3>
              <p className="text-xs text-slate-400 mt-1">Enter the 6-digit reset code and choose a new password.</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Reset Code</label>
              <input
                type="text"
                required
                maxLength={6}
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value.replace(/\D/g, ''))}
                placeholder="6-digit reset code"
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2 text-center text-sm font-mono tracking-wider text-teal-300 focus:outline-none focus:border-teal-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Re-type new password"
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-teal-500/20 transition-all disabled:opacity-50"
            >
              {loading ? 'Updating Password...' : 'Save New Password & Sign In'}
            </button>
          </form>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-6 text-center text-xs text-slate-500 max-w-sm">
        <p>BCA College Project Portfolio Demonstration</p>
        <p className="mt-1">EnjoyJourney Travel Booking System &copy; 2026</p>
      </div>
    </div>
  );
};
