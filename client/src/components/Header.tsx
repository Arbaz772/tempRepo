import { Button } from "@/components/ui/button";
import { Plane, Menu, X, Cloud } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import skaiLinkerIcon from "/attached_assets/generated_images/SkaiLinker_Icon.png";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-2 group cursor-pointer">
              <div className="relative h-8 w-8 rounded-lg bg-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/20 overflow-visible">
                <img src={skaiLinkerIcon} alt="Custom Icon" className="h-8 w-8 object-contain z-10 rounded-lg" />
              </div>
              <span className="text-xl font-bold font-display bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent" data-testid="text-logo">
                SkaiLinker
              </span>
            </a>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/flights">
              <a>
                <Button
                  variant={isActive("/flights") ? "default" : "ghost"}
                  data-testid="link-flights"
                >
                  Flights
                </Button>
              </a>
            </Link>
            <Link href="/predictions">
              <a>
                <Button
                  variant={isActive("/predictions") ? "default" : "ghost"}
                  data-testid="link-predictions"
                >
                  Predictions
                </Button>
              </a>
            </Link>
            <Link href="/deals">
              <a>
                <Button
                  variant={isActive("/deals") ? "default" : "ghost"}
                  data-testid="link-deals"
                >
                  Deals
                </Button>
              </a>
            </Link>
            <Link href="/about">
              <a>
                <Button
                  variant={isActive("/about") ? "default" : "ghost"}
                  data-testid="link-about"
                >
                  About
                </Button>
              </a>
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" data-testid="button-login">Login</Button>
            <Button data-testid="button-signup">Sign Up</Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link href="/flights">
              <a className="block">
                <Button variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                  Flights
                </Button>
              </a>
            </Link>
            <Link href="/predictions">
              <a className="block">
                <Button variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                  Predictions
                </Button>
              </a>
            </Link>
            <Link href="/deals">
              <a className="block">
                <Button variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                  Deals
                </Button>
              </a>
            </Link>
            <Link href="/about">
              <a className="block">
                <Button variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                  About
                </Button>
              </a>
            </Link>
            <div className="pt-2 space-y-2">
              <Button variant="ghost" className="w-full">Login</Button>
              <Button className="w-full">Sign Up</Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
