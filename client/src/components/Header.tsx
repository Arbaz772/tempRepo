// client/src/components/Header.tsx
// MERGED - Your navigation + Profile dropdown + Logout

import { Link, useLocation } from "wouter";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { 
  Plane, 
  TrendingUp, 
  Search, 
  DollarSign, 
  Info,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X
} from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const { user, name, email, picture, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigation = [
    { name: 'Home', href: '/', icon: Plane },
    { name: 'Flights', href: '/flights', icon: Search },
    { name: 'Predictions', href: '/predictions', icon: TrendingUp },
    { name: 'Deals', href: '/deals', icon: DollarSign },
    { name: 'About', href: '/about', icon: Info },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img 
                src="/assets/SkaiLinker_Icon.png" 
                alt="SkaiLinker" 
                className="h-10 w-10"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/40x40/3B82F6/FFFFFF?text=SK';
                }}
              />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                SkaiLinker
              </span>
            </a>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              
              return (
                <Link key={item.name} href={item.href}>
                  <a
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors
                      ${isActive 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </a>
                </Link>
              );
            })}
          </nav>

          {/* Right Side - Profile & Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Profile Section - NEW! */}
            {user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary rounded-full"
                  aria-label="User menu"
                  aria-expanded={isDropdownOpen}
                >
                  {/* Profile Picture or Initials */}
                  {picture ? (
                    <img
                      src={picture}
                      alt={name || 'User'}
                      className="w-9 h-9 rounded-full border-2 border-primary object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm border-2 border-primary">
                      {getInitials(name)}
                    </div>
                  )}

                  {/* Dropdown Arrow - Hidden on mobile */}
                  <ChevronDown 
                    className={`hidden sm:block w-4 h-4 text-muted-foreground transition-transform ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-background border rounded-lg shadow-lg py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b">
                      <div className="flex items-center gap-3">
                        {picture ? (
                          <img
                            src={picture}
                            alt={name || 'User'}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-lg">
                            {getInitials(name)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground truncate">
                            {name || 'User'}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {email || 'user@example.com'}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                              Signed in with Google
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link href="/profile">
                        <a
                          className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <User className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">View Profile</p>
                            <p className="text-xs text-muted-foreground">
                              Manage your account
                            </p>
                          </div>
                        </a>
                      </Link>

                      <Link href="/settings">
                        <a
                          className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <Settings className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Settings</p>
                            <p className="text-xs text-muted-foreground">
                              Preferences & notifications
                            </p>
                          </div>
                        </a>
                      </Link>

                      <Link href="/saved">
                        <a
                          className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <Plane className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Saved Flights</p>
                            <p className="text-xs text-muted-foreground">
                              Your bookmarked routes
                            </p>
                          </div>
                        </a>
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <div className="text-left">
                          <p className="font-medium">Log out</p>
                          <p className="text-xs text-muted-foreground">
                            Sign out of your account
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden border-t ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <nav className="flex flex-col px-4 py-2 gap-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link key={item.name} href={item.href}>
                <a
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </a>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}