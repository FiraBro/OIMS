import Notification from "../models/notification.js";
import NotificationService from "../services/notificationService.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

/**
 * Get all notifications for the logged-in user
 * GET /api/v1/notifications
 */
export const getMyNotifications = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20, status, read } = req.query;
  const skip = (page - 1) * limit;

  const query = { userId: req.user._id };
  if (status) query.status = status;
  if (read !== undefined) query.read = read === "true";

  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .lean();

  const total = await Notification.countDocuments(query);

  res.status(200).json({
    status: "success",
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    notifications,
  });
});

/**
 * Mark a notification as read
 * PATCH /api/v1/notifications/:id/read
 */
export const markAsRead = catchAsync(async (req, res, next) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { read: true },
    { new: true }
  );

  if (!notification) {
    return next(new AppError("Notification not found", 404));
  }

  res.status(200).json({
    status: "success",
    notification,
  });
});

/**
 * Create a new notification (Admin only)
 * POST /api/v1/notifications
 */
export const createNotificationController = catchAsync(
  async (req, res, next) => {
    const { userId, title, message, type = "email" } = req.body;

    const notification = await NotificationService.createNotification({
      userId,
      title,
      message,
      type,
    });

    res.status(201).json({
      status: "success",
      notification,
    });
  }
);
