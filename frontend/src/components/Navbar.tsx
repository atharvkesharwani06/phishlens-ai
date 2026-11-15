import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, Search, History, BookOpen, FlaskConical, ShieldCheck, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Analyze', path: '/analyze', icon: Search },
    { label: 'History', path: '/history', icon: History },
    { label: 'Learn', path: '/learn', icon: BookOpen },
    { label: 'Demo Center', path: '/demo', icon: FlaskConical },
    { label: 'How It Works', path: '/about', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E2E8E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" onClick={() => setMobileMenuOpen(false)}>
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#E6F4F1] border border-[#E2E8E5] text-[#087F75] group-hover:border-[#087F75]/40 transition-colors">
              <Shield className="w-5 h-5 text-[#087F75]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-[#172321] font-sans">
                  PHISH<span className="text-[#087F75]">LENS</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#E6F4F1] text-[#087F75] border border-[#087F75]/20 font-semibold tracking-wider">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-[#697773] tracking-wide font-sans hidden sm:block">
                Explainable Threat Detection
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#E6F4F1] text-[#087F75] font-semibold border border-[#087F75]/20'
                      : 'text-[#697773] hover:text-[#172321] hover:bg-[#F7F8F6]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#087F75]' : 'text-[#697773]'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions & Mobile Menu Toggle */}
          <div className="flex items-center gap-2">
            <Link
              to="/analyze"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold bg-[#087F75] hover:bg-[#076c64] active:scale-[0.98] text-white shadow-xs transition-all duration-150"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Scan Threat</span>
              <span className="sm:hidden">Scan</span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-[#697773] hover:text-[#172321] hover:bg-[#F7F8F6] active:scale-95 border border-[#E2E8E5] transition-all duration-150 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 text-[#172321]" /> : <Menu className="w-4 h-4 text-[#172321]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E2E8E5] bg-[#FFFFFF] px-4 pt-2 pb-4 space-y-1 shadow-lg animate-drawer-slide">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[#E6F4F1] text-[#087F75] font-semibold border border-[#087F75]/20'
                    : 'text-[#697773] hover:text-[#172321] hover:bg-[#F7F8F6]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#087F75]' : 'text-[#697773]'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
