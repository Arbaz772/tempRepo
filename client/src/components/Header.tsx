// client/src/components/Header.tsx
// UPDATED - No Login/Signup buttons, clean navigation only

import { Link, useLocation } from "wouter";
import { Plane, TrendingUp, Search, DollarSign, Info } from "lucide-react";

export default function Header() {
  const [location] = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: Plane },
    { name: 'Flights', href: '/flights', icon: Search },
    { name: 'Predictions', href: '/predictions', icon: TrendingUp },
    { name: 'Deals', href: '/deals', icon: DollarSign },
    { name: 'About', href: '/about', icon: Info },
  ];

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

          {/* Mobile Menu Button (if needed) */}
          <div className="md:hidden">
            {/* You can add a mobile menu toggle here if needed */}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t">
        <nav className="flex overflow-x-auto px-4 py-2 gap-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link key={item.name} href={item.href}>
                <a
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-colors
                    ${isActive 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                    }
                  `}
                >
                  <Icon className="h-3 w-3" />
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