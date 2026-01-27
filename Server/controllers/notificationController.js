import Notification from "../models/notification.js";
import NotificationService from "../services/notificationService.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

/**
 * @desc    Get all notifications for the logged-in user
 * @route   GET /api/v1/notifications
 */
export const getMyNotifications = catchAsync(async (req, res, next) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 20, 100); // cap limit to 100
  const skip = (page - 1) * limit;

  const { category, isRead } = req.query;

  const query = { userId: req.user.id };
  if (category) query.category = category;
  if (isRead !== undefined) query.isRead = isRead === "true";

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Notification.countDocuments(query),
    Notification.countDocuments({ userId: req.user.id, isRead: false }),
  ]);

  res.status(200).json({
    status: "success",
    page,
    limit,
    total,
    unreadCount,
    data: notifications,
  });
});

/**
 * @desc    Mark a specific notification as read
 * @route   PATCH /api/v1/notifications/:id/read
 */
export const markAsRead = catchAsync(async (req, res, next) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { isRead: true },
    { new: true }
  );

  if (!notification) return next(new AppError("Notification not found", 404));

  res.status(200).json({
    status: "success",
    data: notification,
  });
});

/**
 * @desc    Mark ALL notifications as read (Bulk update)
 * @route   PATCH /api/v1/notifications/mark-all-read
 */
export const markAllAsRead = catchAsync(async (req, res, next) => {
  const result = await Notification.updateMany(
    { userId: req.user.id, isRead: false },
    { isRead: true }
  );

  res.status(200).json({
    status: "success",
    message: `${result.modifiedCount} notification(s) marked as read`,
  });
});

/**
 * @desc    Admin: Send a custom notification using templates
 * @route   POST /api/v1/notifications/send
 */
export const createNotificationController = catchAsync(async (req, res, next) => {
  const { userId, eventKey, data } = req.body;

  if (!userId || !eventKey) {
    return next(new AppError("userId and eventKey are required", 400));
  }

  const notification = await NotificationService.trigger(eventKey, userId, data);

  if (!notification) {
    return next(new AppError("Failed to create notification", 500));
  }

  res.status(201).json({
    status: "success",
    data: notification,
  });
});

/**
 * @desc    Delete a notification
 * @route   DELETE /api/v1/notifications/:id
 */
export const deleteNotification = catchAsync(async (req, res, next) => {
  const notification = await Notification.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id,
  });

  if (!notification) return next(new AppError("Notification not found", 404));

  res.status(204).send(); // No content
});
