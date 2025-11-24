import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ForgotPasswordModal({
  show,
  email,
  onEmailChange,
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
            className="bg-white w-96 p-6 rounded-2xl shadow-xl"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-center">
              Forgot Password
            </h2>

            <p className="text-gray-600 text-sm mb-3 text-center">
              Enter your email and we’ll send you a reset link.
            </p>

            <input
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl mb-4 focus:ring-2 focus:ring-pink-400 focus:border-transparent"
            />

            <button
              onClick={onSubmit}
              className="w-full bg-pink-500 text-white py-3 rounded-xl font-semibold hover:bg-pink-600 transition"
            >
              Send Reset Link
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
