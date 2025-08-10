import React, { useState, useRef, useEffect } from "react";
import { User } from 'lucide-react';

type HeaderProps = {
  isLoggedIn: boolean;
  userName?: string;
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onLogout: () => void;
  onReset: () => void;
};

const Header: React.FC<HeaderProps> = ({
  isLoggedIn,
  userName,
  onLoginClick,
  onRegisterClick,
  onLogout,
  onReset,
}) => {
  // Dropdown for user/profile menu
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <header className="w-full bg-white shadow-sm py-4 px-6 flex items-center justify-between">
      <div className="text-2xl font-bold text-blue-600">SpeakMate</div>
      <div className="flex items-center gap-4 relative">
        {isLoggedIn ? (
          <div className="relative" ref={menuRef}>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 focus:outline-none"
              onClick={() => setMenuOpen((v) => !v)}
              aria-haspopup="true"
              aria-expanded={menuOpen}
            >
              <User className="w-5 h-5" />
              <span className="font-medium">{userName || 'Profile'}</span>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-20 animate-fade-in">
                <button
                  onClick={onLogout}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 text-blue-600"
                >Logout</button>
                <button
                  onClick={onReset}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-600"
                >Reset</button>
              </div>
            )}
          </div>
        ) : (
          <div className="relative" ref={menuRef}>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
              onClick={() => setMenuOpen((v) => !v)}
              aria-haspopup="true"
              aria-expanded={menuOpen}
            >
              <User className="w-5 h-5" />
              <span className="font-medium">Account</span>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-20 animate-fade-in">
                <button
                  onClick={onLoginClick}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 text-blue-600"
                >Login</button>
                <button
                  onClick={onRegisterClick}
                  className="w-full text-left px-4 py-2 hover:bg-green-50 text-green-600"
                >Register</button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;