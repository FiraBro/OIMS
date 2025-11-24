import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ResetPasswordModal({
  show,
  token,
  newPassword,
  newPasswordConfirm,
  onTokenChange,
  onPasswordChange,
  onPasswordConfirmChange,
  onSubmit,
  onClose,
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-center">
              Reset Password
            </h2>

            <p className="text-gray-600 text-sm mb-4 text-center">
              Enter the reset token sent to your email and create a new
              password.
            </p>

            {/* Reset Token */}
            <input
              type="text"
              placeholder="Reset Token"
              value={token}
              onChange={(e) => onTokenChange(e.target.value)}
              className="w-full px-4 py-3 mb-3 border border-gray-300 rounded-xl 
                         focus:ring-2 focus:ring-pink-400 focus:border-transparent"
            />

            {/* New Password */}
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => onPasswordChange(e.target.value)}
              className="w-full px-4 py-3 mb-3 border border-gray-300 rounded-xl 
                         focus:ring-2 focus:ring-pink-400 focus:border-transparent"
            />

            {/* Confirm Password */}
            <input
              type="password"
              placeholder="Confirm New Password"
              value={newPasswordConfirm}
              onChange={(e) => onPasswordConfirmChange(e.target.value)}
              className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-xl 
                         focus:ring-2 focus:ring-pink-400 focus:border-transparent"
            />

            <button
              onClick={onSubmit}
              className="w-full bg-pink-500 text-white py-3 rounded-xl font-semibold hover:bg-pink-600 transition"
            >
              Reset Password
            </button>

            <button
              onClick={onClose}
              className="w-full mt-3 text-gray-600 hover:text-gray-800 transition"
            >
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
