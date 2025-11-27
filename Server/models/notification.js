import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Notification title is required"],
    },
    message: {
      type: String,
      required: [true, "Notification message is required"],
    },
    type: {
      type: String,
      enum: ["email", "push", "in-app"],
      default: "email",
    },
    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },
    read: {
      type: Boolean,
      default: false,
    },
    sentAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Optional: Index for faster queries
notificationSchema.index({ userId: 1, status: 1, createdAt: -1 });

export default mongoose.model("Notification", notificationSchema);
