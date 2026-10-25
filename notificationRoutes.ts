import express from 'express';
import { dbStore } from '../db.js';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.js';

const router = express.Router();

// 1. Get Notifications for Logged-In User
router.get('/', authMiddleware, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;
  const notifications = dbStore.getUserNotifications(userId);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return res.json({ notifications, unreadCount });
});

// 2. Mark Single Notification as Read
router.post('/:id/read', authMiddleware, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;
  const success = dbStore.markNotificationRead(req.params.id, userId);
  return res.json({ success });
});

// 3. Mark All Notifications as Read
router.post('/mark-all-read', authMiddleware, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;
  const updatedCount = dbStore.markAllNotificationsRead(userId);
  return res.json({ success: true, updatedCount });
});

export default router;
