import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useUser } from "../hooks/useUser";
import { FiCreditCard, FiFileText, FiLogOut, FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const popupRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();
  // Get user data from Redux store
  const { userData } = useSelector((state) => state.user);
  const { logoutHandler } = useUser();

  // Close popup and mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle user logout
  const handleLogout = async () => {
    try {
      await logoutHandler();
      setShowPopup(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Get user's first initial for avatar
  const getUserInitial = () => {
    if (userData?.name) {
      return userData.name.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <nav className="w-full bg-surface border-b border-border sticky top-0 z-50 glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-medium text-sm">N</span>
            </div>
            <span className="text-base font-medium text-text-primary">ExamNotes.Ai</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              to="/pricing"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Pricing
            </Link>

            {userData && (
              <Link
                to="/pricing"
                className="flex items-center space-x-1.5 bg-surface px-3 py-1.5 rounded-lg border border-border hover:bg-background transition-colors"
              >
                <FiCreditCard className="w-4 h-4 text-primary" />
                <span className="text-primary font-medium text-sm">
                  {userData.credits} Credits
                </span>
              </Link>
            )}

            {/* Auth Section */}
            {userData ? (
              /* User Profile Dropdown */
              <div className="relative" ref={popupRef}>
                <button
                  onClick={() => setShowPopup(!showPopup)}
                  className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-medium text-sm hover:bg-primary/90 transition-colors"
                >
                  {getUserInitial()}
                </button>

                {/* Popup Menu */}
                {showPopup && (
                  <div className="absolute right-0 mt-2 w-56 bg-surface rounded-lg shadow-sm border border-border py-1.5 z-50">
                    {/* User Info */}
                    <div className="px-4 py-2.5 border-b border-border">
                      <p className="text-sm font-medium text-text-primary">
                        {userData.name}
                      </p>
                      <p className="text-xs text-text-secondary">{userData.email}</p>
                    </div>

                    {/* Menu Items */}
                    <Link
                      to="/dashboard"
                      onClick={() => setShowPopup(false)}
                      className="flex items-center px-4 py-2 text-sm text-text-secondary hover:bg-background transition-colors"
                    >
                      <FiFileText className="w-4 h-4 mr-2.5 text-text-secondary" />
                      My Notes History
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 transition-colors"
                    >
                      <FiLogOut className="w-4 h-4 mr-2.5" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Login/Signup Buttons */
              <div>
                <Link
                  to="/auth"
                  className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-text-secondary hover:text-text-primary"
            >
              {showMobileMenu ? (
                <FiX className="w-5 h-5" />
              ) : (
                <FiMenu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {showMobileMenu && (
          <div
            ref={mobileMenuRef}
            className="md:hidden border-2 shadow border-border py-4 bg-surface"
          >
            <div className="space-y-2">
              <Link
                to="/"
                onClick={() => setShowMobileMenu(false)}
                className="block px-4 py-2 text-sm text-text-secondary hover:bg-background rounded-lg"
              >
                Home
              </Link>
              <Link
                to="/pricing"
                onClick={() => setShowMobileMenu(false)}
                className="block px-4 py-2 text-sm text-text-secondary hover:bg-background rounded-lg"
              >
                Pricing
              </Link>

              {userData && (
                <>
                  <div className="px-4 py-2 border-t border-border mt-2 pt-4">
                    <p className="text-xs text-text-secondary">Signed in as</p>
                    <p className="text-sm font-medium text-text-primary">{userData.name}</p>
                    <p className="text-xs text-text-secondary">{userData.credits} credits</p>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setShowMobileMenu(false)}
                    className="block px-4 py-2 text-sm text-text-secondary hover:bg-background rounded-lg"
                  >
                    My Notes History
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowMobileMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 rounded-lg"
                  >
                    Logout
                  </button>
                </>
              )}

              {!userData && (
                <div className="px-4 pt-2">
                  <Link
                    to="/auth"
                    onClick={() => setShowMobileMenu(false)}
                    className="block w-full py-2 bg-primary text-white text-center rounded-lg text-sm font-medium hover:bg-primary/90"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;