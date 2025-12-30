// App.jsx
import React, { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./contexts/AuthContext";
import { router } from "./routers";
export default function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<LoadingSpinner />}>
        <RouterProvider router={router} />
      </Suspense>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        pauseOnHover
        draggable
        theme="light"
        limit={3}
      />
    </AuthProvider>
  );
}

/* ---------------- Loading UI ---------------- */
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin" />
        <div className="absolute inset-0 h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-200 opacity-20" />
      </div>
    </div>
  );
}
