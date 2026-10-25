import express from 'express';
import crypto from 'crypto';
import { dbStore } from '../db.js';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.js';

const router = express.Router();

// 1. Get All Special Offers
router.get('/', (req, res) => {
  const offers = dbStore.getOffers();
  return res.json({ offers, isDemoData: true });
});

// 2. Validate Offer for Booking
router.post('/validate', (req, res) => {
  const { code, amount, category } = req.body;
  if (!code || amount === undefined || !category) {
    return res.status(400).json({ valid: false, message: 'Code, amount, and category are required.' });
  }

  const offer = dbStore.getOfferByCode(code);
  if (!offer) {
    return res.status(404).json({ valid: false, message: 'Invalid or expired offer code.' });
  }

  if (!offer.applicableServices.includes(category)) {
    return res.status(400).json({
      valid: false,
      message: `Offer ${offer.code} is only applicable on ${offer.applicableServices.join(', ')}.`,
    });
  }

  if (amount < offer.minBookingAmount) {
    return res.status(400).json({
      valid: false,
      message: `Minimum booking amount of ₹${offer.minBookingAmount} required for this offer.`,
    });
  }

  const rawDiscount = (amount * offer.discountPercent) / 100;
  const discountAmount = Math.min(rawDiscount, offer.maxDiscount);
  const finalAmount = Math.max(0, amount - discountAmount);

  return res.json({
    valid: true,
    code: offer.code,
    title: offer.title,
    discountPercent: offer.discountPercent,
    discountAmount,
    finalAmount,
    message: `${offer.discountPercent}% discount applied (Saved ₹${discountAmount.toLocaleString('en-IN')}).`,
  });
});

// 3. Claim Offer (Stores verification in user profile)
router.post('/claim', authMiddleware, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;
  const { code, idCardNumber, institutionOrUnit } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Offer code is required.' });
  }

  const offer = dbStore.getOfferByCode(code);
  if (!offer) {
    return res.status(404).json({ error: 'Offer not found.' });
  }

  const user = dbStore.getUserById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const currentClaimed = user.claimedOffers || [];
  if (!currentClaimed.includes(offer.code)) {
    currentClaimed.push(offer.code);
    dbStore.updateUser(userId, { claimedOffers: currentClaimed });

    dbStore.createNotification({
      id: 'notif-' + crypto.randomUUID(),
      userId,
      title: `Special Concession Claimed: ${offer.code}`,
      message: `Your ${offer.category} concession (${offer.discountPercent}% off) is verified. Apply code ${offer.code} during checkout.`,
      category: 'offer',
      isRead: false,
      createdAt: new Date().toISOString(),
    });
  }

  return res.json({
    message: `Offer ${offer.code} claimed successfully!`,
    claimedOffers: currentClaimed,
    offer,
  });
});

export default router;
