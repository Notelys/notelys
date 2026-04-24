import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.js';
import { newNotification, getNotifications, allNotificationsCount } from '../controllers/notification.controller.js';

const router = Router();

// All protected
router.get("/new-notification", verifyJWT, newNotification);
router.post("/notifications", verifyJWT, getNotifications);
router.post("/all-notifications-count", verifyJWT, allNotificationsCount);

export default router;
