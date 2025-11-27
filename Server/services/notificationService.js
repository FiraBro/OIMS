import User from "../models/user.js";
import Notification from "../models/notification.js";
import AppError from "../utils/AppError.js";
import sendEmail from "../utils/sendEmail.js";
class NotificationService {
  /**
   * Send pending notifications to users (email, push, etc.)
   */
  async sendPendingNotifications() {
    try {
      // Find all notifications that are pending or not sent
      const notifications = await Notification.find({
        status: "pending",
      }).lean();

      for (const note of notifications) {
        const user = await User.findById(note.userId).lean();
        if (!user) continue;

        // Example: send email
        await sendEmail({
          to: user.email,
          subject: note.title,
          text: note.message,
        });

        // Mark notification as sent
        await Notification.findByIdAndUpdate(note._id, { status: "sent" });
      }
    } catch (error) {
      throw new AppError("Failed to send notifications: " + error.message, 500);
    }
  }

  /**
   * Create a new notification
   */
  async createNotification({ userId, title, message }) {
    return await Notification.create({
      userId,
      title,
      message,
      status: "pending",
    });
  }
}

export default new NotificationService();
