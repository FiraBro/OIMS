import React, { Suspense, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { router } from "./routers";
import { useAuthStore } from "@/stores/authStore";

export default function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  // Run once on app mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <>
      <Suspense fallback={null}>
        <RouterProvider router={router} />
      </Suspense>

      <ToastContainer
        position="top-right" // Moves it to the bottom left
        autoClose={500} // Adjust time (e.g., 4 seconds)
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" // Keeps the background white
      />
    </>
  );
}
