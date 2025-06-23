import React from "react";
import Navbar from "../components/navigation/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "../components/footer/Footer";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Main content area with margin top */}
      <main className="flex-grow mt-16">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
