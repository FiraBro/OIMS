import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FiMenu } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGetStarted = () => {
    if (user) navigate("/apply");
    else navigate("/auth");
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  const links = [
    { to: "/", text: "Home" },
    { to: "/#features", text: "Features" },
    { to: "/show/claims", text: "Claims" },
    { to: "/user-stats", text: "Applications" },
    { to: "/contact", text: "Support" },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 shadow-xl backdrop-blur-xl py-2"
          : "bg-white/90 backdrop-blur-lg py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-3 font-bold text-xl text-blue-600"
        >
          OHIMS
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-4">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg font-medium transition-all duration-150"
            >
              {link.text}
            </Link>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden lg:flex items-center gap-2">
          {user ? (
            <>
              <Button variant="default" onClick={handleGetStarted}>
                Apply Now
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="w-10 h-10 cursor-pointer">
                    <AvatarImage
                      src={user.avatar || ""}
                      alt={user.fullName || "User"}
                    />
                    <AvatarFallback>
                      {user.fullName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white border">
                  <DropdownMenuItem>{user.fullName}</DropdownMenuItem>
                  <DropdownMenuItem>{user.email}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/user-stats")}>
                    Applications
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => navigate("/auth")}>
                Sign In
              </Button>
              <Button onClick={handleGetStarted}>Get Started</Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-2">
          <Button variant="default" onClick={handleGetStarted} size="sm">
            {user ? "Apply" : "Start"}
          </Button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-all"
          >
            <FiMenu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden mt-2 bg-white shadow-md border-t border-border">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all"
            >
              {link.text}
            </Link>
          ))}
          <div className="border-t border-border my-2" />
          {user ? (
            <div className="px-4 py-2 space-y-2">
              <p className="font-semibold">{user.fullName}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
              <Button onClick={handleGetStarted} className="w-full">
                Apply Now
              </Button>
              <Button
                onClick={handleLogout}
                variant="destructive"
                className="w-full"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="px-4 py-2 space-y-2">
              <Button
                onClick={() => navigate("/auth")}
                variant="outline"
                className="w-full"
              >
                Sign In
              </Button>
              <Button onClick={handleGetStarted} className="w-full">
                Get Started
              </Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
