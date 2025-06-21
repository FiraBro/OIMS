import React from "react";
import HomePage from "./pages/home/HomePage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PlanPage from "./pages/plan/PlanPage";
const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/plans", element: <PlanPage /> },
]);
export default function App() {
  return <RouterProvider router={router} />;
}
