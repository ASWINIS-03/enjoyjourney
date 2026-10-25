import express from 'express';
import crypto from 'crypto';
import { dbStore } from '../db.js';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.js';
import { BookingDocument } from '../types.js';

const router = express.Router();

function generateBookingReference(category: string): string {
  const prefixMap: Record<string, string> = {
    flight: 'FL',
    bus: 'BS',
    cab: 'CB',
    hotel: 'HT',
    metro: 'MT',
    train: 'TR',
  };
  const code = prefixMap[category] || 'TRV';
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `EJ-${code}-${randomNum}`;
}

// 1. Create a New Booking (Strictly Protected & Atomic Validation)
router.post('/', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.userId;
    const user = dbStore.getUserById(userId);
    if (!user) return res.status(404).json({ error: 'User profile not found.' });

    const {
      category,
      serviceId,
      serviceName,
      serviceNumber,
      origin,
      destination,
      travelDate,
      departureTime,
      arrivalTime,
      returnDate,
      checkInDate,
      checkOutDate,
      nightsCount,
      passengersCount = 1,
      passengers = [],
      selectedSeats = [],
      travelClass,
      roomType,
      cabType,
      baseAmount,
      appliedOfferCode,
    } = req.body;

    if (!category || !serviceName || baseAmount === undefined) {
      return res.status(400).json({ error: 'Missing mandatory booking details.' });
    }

    // 1. Prevent Double-Booking & Atomically Reserve Inventory
    if (category === 'flight') {
      if (selectedSeats.length > 0) {
        const reserveRes = dbStore.reserveFlightSeats(serviceId, selectedSeats, travelClass || 'Economy');
        if (!reserveRes.success) {
          return res.status(409).json({ error: reserveRes.message });
        }
      }
    } else if (category === 'bus') {
      if (selectedSeats.length > 0) {
        const reserveRes = dbStore.reserveBusSeats(serviceId, selectedSeats);
        if (!reserveRes.success) {
          return res.status(409).json({ error: reserveRes.message });
        }
      }
    } else if (category === 'train') {
      if (selectedSeats.length > 0) {
        const reserveRes = dbStore.reserveTrainSeats(serviceId, travelClass || 'CC', selectedSeats);
        if (!reserveRes.success) {
          return res.status(409).json({ error: reserveRes.message });
        }
      }
    } else if (category === 'hotel') {
      if (!checkInDate || !checkOutDate) {
        return res.status(400).json({ error: 'Check-in and Check-out dates are required for hotel booking.' });
      }
      if (new Date(checkOutDate) <= new Date(checkInDate)) {
        return res.status(400).json({ error: 'Check-out date must be after check-in date.' });
      }
      const reserveRes = dbStore.reserveHotelRoom(serviceId, roomType || 'r1', checkInDate, checkOutDate, 1);
      if (!reserveRes.success) {
        return res.status(409).json({ error: reserveRes.message });
      }
    }

    // 2. Server-side Offer & Discount Validation
    let discountAmount = 0;
    let validatedOfferCode: string | undefined = undefined;

    if (appliedOfferCode) {
      const offer = dbStore.getOfferByCode(appliedOfferCode);
      if (offer && offer.active && offer.applicableServices.includes(category)) {
        if (baseAmount >= offer.minBookingAmount) {
          const rawDiscount = (baseAmount * offer.discountPercent) / 100;
          discountAmount = Math.min(rawDiscount, offer.maxDiscount);
          validatedOfferCode = offer.code;
        }
      }
    }

    const discountedBase = Math.max(0, baseAmount - discountAmount);
    // Standard 5% GST on travel & hospitality
    const taxesAmount = Math.round(discountedBase * 0.05);
    const totalAmount = discountedBase + taxesAmount;

    const bookingRef = generateBookingReference(category);
    const newBooking: BookingDocument = {
      id: 'bk-' + crypto.randomUUID(),
      bookingReference: bookingRef,
      userId,
      userEmail: user.email,
      userName: user.fullName,
      userMobile: user.mobile,
      category,
      serviceName,
      serviceNumber,
      origin,
      destination,
      travelDate,
      departureTime,
      arrivalTime,
      returnDate,
      checkInDate,
      checkOutDate,
      nightsCount,
      passengersCount,
      passengers: passengers.length > 0 ? passengers : [{ name: user.fullName }],
      selectedSeats,
      travelClass,
      roomType,
      cabType,
      baseAmount,
      taxesAmount,
      discountAmount,
      discountCode: validatedOfferCode,
      totalAmount,
      status: 'Confirmed',
      qrCodeData: `ENJOYJOURNEY:${bookingRef}:${userId}:${category}:${totalAmount}`,
      isDemoData: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const createdBooking = dbStore.createBooking(newBooking);

    // 3. Dispatch In-Website Notification
    dbStore.createNotification({
      id: 'notif-' + crypto.randomUUID(),
      userId,
      title: 'Booking Confirmed!',
      message: `Your ${category.toUpperCase()} booking (${bookingRef}) for ${serviceName} is confirmed! Total: ₹${totalAmount.toLocaleString('en-IN')}.`,
      category: 'booking',
      bookingReference: bookingRef,
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    return res.status(201).json({
      message: 'Booking confirmed successfully!',
      booking: createdBooking,
    });
  } catch (err) {
    console.error('Booking creation error:', err);
    return res.status(500).json({ error: 'Failed to create booking.' });
  }
});

// 2. Get All Bookings for Logged-In User
router.get('/', authMiddleware, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;
  const bookings = dbStore.getBookingsByUserId(userId);
  return res.json({ bookings });
});

// 2b. Dashboard Summary & Analytics
router.get('/dashboard-stats', authMiddleware, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;
  const user = dbStore.getUserById(userId);
  const bookings = dbStore.getBookingsByUserId(userId);
  const notifications = dbStore.getUserNotifications(userId);
  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter((b) => b.status === 'Confirmed');
  const cancelledBookings = bookings.filter((b) => b.status === 'Cancelled');

  const totalSpent = confirmedBookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalSaved = confirmedBookings.reduce((sum, b) => sum + (b.discountAmount || 0), 0);

  const categoryBreakdown: Record<string, number> = {
    flight: 0,
    bus: 0,
    cab: 0,
    hotel: 0,
    metro: 0,
    train: 0,
  };

  bookings.forEach((b) => {
    if (categoryBreakdown[b.category] !== undefined) {
      categoryBreakdown[b.category]++;
    }
  });

  // Calculate Loyalty Points (1 point for every ₹10 spent on confirmed trips)
  const loyaltyPoints = Math.floor(totalSpent / 10);
  let loyaltyTier = 'Silver Traveler';
  if (loyaltyPoints > 3000) {
    loyaltyTier = 'Platinum Elite';
  } else if (loyaltyPoints > 1000) {
    loyaltyTier = 'Gold Voyager';
  }

  // Upcoming confirmed trip (if any)
  const upcomingTrip = confirmedBookings.find((b) => {
    const tripDate = b.travelDate || b.checkInDate;
    return tripDate ? new Date(tripDate) >= new Date(new Date().setHours(0, 0, 0, 0)) : true;
  }) || confirmedBookings[0] || null;

  return res.json({
    totalBookings,
    confirmedCount: confirmedBookings.length,
    cancelledCount: cancelledBookings.length,
    totalSpent,
    totalSaved,
    categoryBreakdown,
    recentBookings: bookings.slice(0, 5),
    upcomingTrip,
    claimedOffersCount: user?.claimedOffers?.length || 0,
    claimedOffers: user?.claimedOffers || [],
    unreadNotificationsCount,
    loyaltyPoints,
    loyaltyTier,
  });
});

// 3. Get Single Booking by ID
router.get('/:id', authMiddleware, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;
  const booking = dbStore.getBookingById(req.params.id, userId);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found or unauthorized.' });
  }
  return res.json({ booking });
});

// 4. Cancel Booking
router.post('/:id/cancel', authMiddleware, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;
  const { reason } = req.body;

  const result = dbStore.cancelBooking(req.params.id, userId, reason);
  if (!result || !result.booking) {
    return res.status(404).json({ error: 'Booking not found or unauthorized.' });
  }

  if (result.alreadyCancelled) {
    return res.status(400).json({ error: 'This booking is already cancelled.' });
  }

  // Create cancellation notification
  dbStore.createNotification({
    id: 'notif-' + crypto.randomUUID(),
    userId,
    title: 'Booking Cancelled',
    message: `Your booking ${result.booking.bookingReference} (${result.booking.serviceName}) has been cancelled. Refund processing initiated.`,
    category: 'booking',
    bookingReference: result.booking.bookingReference,
    isRead: false,
    createdAt: new Date().toISOString(),
  });

  return res.json({
    message: 'Booking has been successfully cancelled.',
    booking: result.booking,
  });
});

export default router;
