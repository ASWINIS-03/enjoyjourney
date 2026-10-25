import express from 'express';
import crypto from 'crypto';
import { dbStore } from '../db.js';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.js';
import { SupportTicketDocument } from '../types.js';

const router = express.Router();

export const SUPPORT_FAQS = [
  {
    category: 'Bookings & Confirmation',
    questions: [
      {
        q: 'How do I know my booking is confirmed?',
        a: 'Once you complete your booking, a unique booking reference code (e.g. EJ-FL-83921) is generated immediately. You will see an instant confirmation screen, an in-website notification, and the voucher appears in My Booking Orders.',
      },
      {
        q: 'Can I select my specific seat for Flights, Buses, and Trains?',
        a: 'Yes! EnjoyJourney features an interactive 2D seat map for Flights (Window, Middle, Aisle), Buses (Upper & Lower sleeper berths), and Trains (AC Chair Car / Sleeper classes). Simply click on an available green seat.',
      },
      {
        q: 'Is this live production data or demonstration data?',
        a: 'All travel schedules, seat inventories, fares, and hotel room allotments shown on EnjoyJourney are demonstration data tailored for BCA academic project demonstration and portfolio testing.',
      },
    ],
  },
  {
    category: 'Cancellations & Refunds',
    questions: [
      {
        q: 'How can I cancel my travel booking?',
        a: 'Go to "My Booking Orders" in the navigation bar, locate your booking, and click "Cancel Booking". You will be asked to choose a cancellation reason. The seats are immediately released back into inventory.',
      },
      {
        q: 'How does the refund process work?',
        a: 'For demonstration bookings, cancellation is processed immediately and the status updates to "Cancelled" with an automatic in-app confirmation notification.',
      },
    ],
  },
  {
    category: 'Special Discounts & Offers',
    questions: [
      {
        q: 'Who is eligible for Special Concessions?',
        a: 'EnjoyJourney offers dedicated concessions for Senior Citizens (60+), Doctors & Healthcare Heroes, School/College Students, Indian Armed Forces & Defence Personnel, Police Officers, and Regular Loyal Customers.',
      },
      {
        q: 'How do I claim and apply an offer?',
        a: 'Visit the Offers page, click "Claim Offer", and enter your relevant ID/Roll/Service number. The offer will be linked to your profile and automatically suggested during booking checkout!',
      },
    ],
  },
];

// 1. Get FAQs and Contact Info
router.get('/info', (req, res) => {
  return res.json({
    email: 'support@enjoyjourney.demo',
    helpline: '+91 (044) 2855-3000 / 1800-EJ-JOURNEY',
    hours: '24/7 Academic Support & Helpdesk',
    headquarters: 'EnjoyJourney Travel Tech, Anna Salai, Chennai, Tamil Nadu 600002',
    faqs: SUPPORT_FAQS,
  });
});

// 2. Get User Support Tickets
router.get('/tickets', authMiddleware, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;
  const tickets = dbStore.getUserSupportTickets(userId);
  return res.json({ tickets });
});

// 3. Submit Support Ticket
router.post('/tickets', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.userId;
    const user = dbStore.getUserById(userId);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const { category, bookingReference, subject, message, priority = 'Medium' } = req.body;

    if (!category || !subject || !message) {
      return res.status(400).json({ error: 'Category, subject, and message are required.' });
    }

    const ticket: SupportTicketDocument = {
      id: 'tkt-' + Math.floor(10000 + Math.random() * 90000),
      userId,
      userEmail: user.email,
      userName: user.fullName,
      category,
      bookingReference,
      subject: subject.trim(),
      message: message.trim(),
      priority,
      status: 'Open',
      adminResponse: 'Thank you for reaching out to EnjoyJourney Support. Our academic helpline has logged your query.',
      createdAt: new Date().toISOString(),
    };

    const savedTicket = dbStore.createSupportTicket(ticket);

    // Notify user in-app
    dbStore.createNotification({
      id: 'notif-' + crypto.randomUUID(),
      userId,
      title: `Support Ticket Created: #${ticket.id}`,
      message: `Your inquiry "${subject}" has been received. Our team will review your request.`,
      category: 'support',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    return res.status(201).json({
      message: 'Support request submitted successfully.',
      ticket: savedTicket,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to submit support request.' });
  }
});

export default router;
