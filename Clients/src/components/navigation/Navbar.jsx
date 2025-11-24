import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  console.log(user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
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

  // Animation variants
  const menuVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  const profileVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/95 shadow-lg backdrop-blur-xl py-3 border-b border-pink-100/50"
          : "bg-white/80 backdrop-blur-lg py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-3"
          >
            <Link to="/" onClick={() => setIsMenuOpen(false)}>
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 20,
                    ease: "linear",
                  }}
                  className="w-12 h-12 bg-gradient-to-br from-pink-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine"></div>
                  <svg
                    className="w-6 h-6 text-white relative z-10"
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
                  <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                    InsureWise
                  </span>
                  <div className="h-1 w-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full mt-1"></div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {[
              { to: "/", text: "Home", icon: "🏠" },
              { to: "/#features", text: "Features", icon: "⭐" },
              { to: "/show/claims", text: "Claims", icon: "📋" },
              { to: "/user-stats", text: "Applications", icon: "📊" },
              { to: "/contact", text: "Support", icon: "💬" },
            ].map((link) => (
              <motion.div
                key={link.to}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                <Link
                  to={link.to}
                  className="flex items-center space-x-2 px-4 py-3 rounded-2xl text-gray-700 hover:text-pink-600 transition-all duration-300 font-medium group relative"
                >
                  <span className="text-lg">{link.icon}</span>
                  <span>{link.text}</span>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 group-hover:w-3/4 transition-all duration-300"></div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex items-center space-x-3">
            {user ? (
              <>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <button
                    onClick={handleGetStarted}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2.5 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:from-green-600 hover:to-emerald-700 flex items-center space-x-2"
                  >
                    <span>🚀</span>
                    <span>Apply Now</span>
                  </button>
                </motion.div>

                {/* Profile Dropdown */}
                <div className="relative">
                  <motion.button
                    onClick={toggleProfile}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm border border-pink-200 rounded-2xl px-4 py-2.5 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user.fullName?.charAt(0) || "U"}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-800">
                        {user.fullName || "User"}
                      </p>
                      <p className="text-xs text-gray-500">Welcome back!</p>
                    </div>
                    <motion.div
                      animate={{ rotate: isProfileOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="text-gray-400">▼</span>
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={profileVariants}
                        className="absolute right-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-pink-100/50 overflow-hidden"
                      >
                        <div className="p-4 border-b border-pink-100/50">
                          <p className="font-semibold text-gray-800">
                            {user.fullName}
                          </p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        <div className="p-2">
                          {[
                            { to: "/profile", text: "My Profile", icon: "👤" },
                            {
                              to: "/user-stats",
                              text: "My Applications",
                              icon: "📊",
                            },
                            { to: "/settings", text: "Settings", icon: "⚙️" },
                          ].map((item) => (
                            <Link
                              key={item.to}
                              to={item.to}
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-pink-50 transition-all duration-200 text-gray-700 hover:text-pink-600"
                            >
                              <span className="text-lg">{item.icon}</span>
                              <span className="font-medium">{item.text}</span>
                            </Link>
                          ))}
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-xl hover:bg-red-50 transition-all duration-200 text-red-600 mt-2"
                          >
                            <span className="text-lg">🚪</span>
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
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/auth"
                    className="px-6 py-2.5 rounded-2xl font-semibold text-pink-600 hover:text-pink-700 transition-colors duration-300"
                  >
                    Sign In
                  </Link>
                </motion.div>

                <motion.button
                  onClick={handleGetStarted}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 40px -10px rgba(236, 72, 153, 0.4)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="relative overflow-hidden bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-2.5 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-500 group"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <span>✨</span>
                    <span>Get Started</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
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
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg text-sm"
              >
                Apply
              </motion.button>
            )}
            <motion.button
              onClick={toggleMenu}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="inline-flex items-center justify-center p-3 rounded-2xl text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-all duration-300"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg
                  className="w-6 h-6"
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
                  className="w-6 h-6"
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
            className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl shadow-2xl border-t border-pink-100/50"
          >
            <div className="px-4 py-6 space-y-2">
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
                  whileHover={{ x: 10 }}
                >
                  <Link
                    to={link.to}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-4 rounded-2xl text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-all duration-300 font-medium border border-transparent hover:border-pink-200"
                  >
                    <span className="text-xl">{link.icon}</span>
                    <span className="text-lg">{link.text}</span>
                  </Link>
                </motion.div>
              ))}

              <div className="border-t border-pink-100/50 my-4"></div>

              {user ? (
                <>
                  <motion.div
                    variants={itemVariants}
                    className="px-4 py-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl border border-pink-200"
                  >
                    <p className="font-semibold text-gray-800">
                      {user.fullName}
                    </p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </motion.div>

                  {[
                    { to: "/profile", text: "My Profile", icon: "👤" },
                    { to: "/settings", text: "Settings", icon: "⚙️" },
                  ].map((item) => (
                    <motion.div key={item.to} variants={itemVariants}>
                      <Link
                        to={item.to}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-all duration-200"
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span>{item.text}</span>
                      </Link>
                    </motion.div>
                  ))}

                  <motion.div variants={itemVariants}>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 mt-2"
                    >
                      <span className="text-lg">🚪</span>
                      <span>Logout</span>
                    </button>
                  </motion.div>
                </>
              ) : (
                <motion.div variants={itemVariants} className="space-y-3 pt-4">
                  <Link
                    to="/auth"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-center px-6 py-3 border-2 border-pink-200 text-pink-600 rounded-2xl font-semibold hover:bg-pink-50 transition-all duration-300"
                  >
                    Sign In
                  </Link>
                  <button
                    onClick={handleGetStarted}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
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
