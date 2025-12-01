import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGetStarted = () => {
    if (user) {
      navigate("/apply");
    } else {
      navigate("/auth");
    }
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // Faster animation variants
  const navVariants = {
    hidden: { y: -80, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.4,
      },
    },
  };

  const menuVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        staggerChildren: 0.07,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.2 },
    },
  };

  const profileVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: -5,
      transition: { duration: 0.15 },
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.2 },
    },
  };

  const floatingVariants = {
    hover: {
      y: -3,
      boxShadow:
        "0 10px 25px -5px rgba(236, 72, 153, 0.4), 0 10px 10px -5px rgba(236, 72, 153, 0.04)",
      transition: { duration: 0.2, ease: "easeOut" },
    },
    tap: {
      y: 0,
      scale: 0.98,
    },
  };

  return (
    <motion.nav
      animate="visible"
      variants={navVariants}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 shadow-xl backdrop-blur-xl py-2 border-b border-pink-100/30"
          : "bg-white/90 backdrop-blur-lg py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div
            whileHover="hover"
            whileTap="tap"
            variants={floatingVariants}
            className="flex items-center space-x-3"
          >
            <Link to="/" onClick={() => setIsMenuOpen(false)}>
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 8,
                    ease: "linear",
                    repeatDelay: 0,
                  }}
                  className="w-10 h-10 bg-gradient-to-br from-pink-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine"></div>
                  <svg
                    className="w-5 h-5 text-white relative z-10"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 15a3 3 0 100-6 3 3 0 000 6z"
                      fill="currentColor"
                    />
                    <path
                      d="M19 4a2 2 0 00-2-2H7a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V4z"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </motion.div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                    InsureWise
                  </span>
                  <div className="h-1 w-10 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full mt-1"></div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-0">
            {[
              { to: "/", text: "Home" },
              { to: "/#features", text: "Features" },
              { to: "/show/claims", text: "Claims" },
              { to: "/user-stats", text: "Applications" },
              { to: "/contact", text: "Support" },
            ].map((link) => (
              <motion.div
                key={link.to}
                whileHover="hover"
                whileTap="tap"
                variants={floatingVariants}
              >
                <Link
                  to={link.to}
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-gray-700 hover:text-pink-600 transition-all duration-200 font-medium group relative overflow-hidden"
                >
                  <span className="text-sm">{link.text}</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 group-hover:w-full transition-all duration-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl"></div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex items-center space-x-2">
            {user ? (
              <>
                <motion.div
                  whileHover="hover"
                  whileTap="tap"
                  variants={floatingVariants}
                >
                  <button
                    onClick={handleGetStarted}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 text-sm"
                  >
                    <span>Apply Now</span>
                  </button>
                </motion.div>

                {/* Profile Dropdown */}
                <div className="relative">
                  <motion.button
                    onClick={toggleProfile}
                    whileHover="hover"
                    whileTap="tap"
                    variants={floatingVariants}
                    className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-pink-200 rounded-xl px-3 py-2 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user.fullName?.charAt(0) || "U"}
                    </div>
                    <div className="text-left max-w-32">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {user.fullName || "User"}
                      </p>
                    </div>
                    <motion.div
                      animate={{ rotate: isProfileOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-gray-400 text-xs">▼</span>
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={profileVariants}
                        className="absolute right-0 top-full mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-pink-100/30 overflow-hidden"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <div className="p-3 border-b border-pink-100/30 bg-gradient-to-r from-pink-50 to-purple-50">
                          <p className="font-semibold text-gray-800 text-sm">
                            {user.fullName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user.email}
                          </p>
                        </div>
                        <div className="p-1">
                          {[
                            { to: "/profile", text: "My Profile" },
                            {
                              to: "/user-stats",
                              text: "My Applications",
                            },
                            { to: "/settings", text: "Settings" },
                          ].map((item) => (
                            <Link
                              key={item.to}
                              to={item.to}
                              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-pink-50 transition-all duration-150 text-gray-700 hover:text-pink-600 text-sm"
                            >
                              <span className="font-medium">{item.text}</span>
                            </Link>
                          ))}
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg hover:bg-red-50 transition-all duration-150 text-red-600 text-sm mt-1"
                          >
                            <span className="font-medium">Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <motion.div
                  whileHover="hover"
                  whileTap="tap"
                  variants={floatingVariants}
                >
                  <Link
                    to="/auth"
                    className="px-5 py-2 rounded-xl font-semibold text-pink-600 hover:text-pink-700 transition-colors duration-200 text-sm"
                  >
                    Sign In
                  </Link>
                </motion.div>

                <motion.button
                  onClick={handleGetStarted}
                  whileHover="hover"
                  whileTap="tap"
                  variants={floatingVariants}
                  className="relative overflow-hidden bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold shadow-xl transition-all duration-200 group text-sm"
                >
                  <span className="relative z-10 flex items-center space-x-1">
                    <span>✨</span>
                    <span>Get Started</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </motion.button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            {user && (
              <motion.button
                onClick={handleGetStarted}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-lg font-semibold shadow-lg text-xs"
              >
                Apply
              </motion.button>
            )}
            <motion.button
              onClick={toggleMenu}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-all duration-200"
              aria-label="Toggle menu"
            >
              <motion.div
                animate={isMenuOpen ? "open" : "closed"}
                variants={{
                  open: { rotate: 90 },
                  closed: { rotate: 0 },
                }}
                transition={{ duration: 0.2 }}
              >
                {isMenuOpen ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </motion.div>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
            className="lg:hidden absolute top-full left-0 right-0 bg-white/98 backdrop-blur-xl shadow-2xl border-t border-pink-100/30 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {[
                { to: "/", text: "Home", icon: "🏠" },
                { to: "/#features", text: "Features", icon: "⭐" },
                { to: "/show/claims", text: "Claims", icon: "📋" },
                { to: "/user-stats", text: "Applications", icon: "📊" },
                { to: "/contact", text: "Support", icon: "💬" },
              ].map((link) => (
                <motion.div
                  key={link.to}
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.15 }}
                >
                  <Link
                    to={link.to}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 px-3 py-3 rounded-xl text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-all duration-150 font-medium"
                  >
                    <span className="text-lg">{link.icon}</span>
                    <span className="text-base">{link.text}</span>
                  </Link>
                </motion.div>
              ))}

              <div className="border-t border-pink-100/30 my-2"></div>

              {user ? (
                <>
                  <motion.div
                    variants={itemVariants}
                    className="px-3 py-2 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-200"
                  >
                    <p className="font-semibold text-gray-800 text-sm">
                      {user.fullName}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </motion.div>

                  {[
                    { to: "/profile", text: "My Profile", icon: "👤" },
                    { to: "/settings", text: "Settings", icon: "⚙️" },
                  ].map((item) => (
                    <motion.div key={item.to} variants={itemVariants}>
                      <Link
                        to={item.to}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-all duration-150 text-sm"
                      >
                        <span className="text-base">{item.icon}</span>
                        <span>{item.text}</span>
                      </Link>
                    </motion.div>
                  ))}

                  <motion.div variants={itemVariants}>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-150 text-sm mt-1"
                    >
                      <span className="text-base">🚪</span>
                      <span>Logout</span>
                    </button>
                  </motion.div>
                </>
              ) : (
                <motion.div variants={itemVariants} className="space-y-2 pt-2">
                  <Link
                    to="/auth"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-center px-4 py-2.5 border border-pink-200 text-pink-600 rounded-xl font-semibold hover:bg-pink-50 transition-all duration-200 text-sm"
                  >
                    Sign In
                  </Link>
                  <button
                    onClick={handleGetStarted}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2.5 rounded-xl font-semibold shadow-lg transition-all duration-200 text-sm"
                  >
                    Get Started Free
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
