import { Button } from "@/components/ui/button";
import { Plane, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/20">
              <Plane className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold font-display bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent" data-testid="text-logo">SkyFind</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Button variant="ghost" data-testid="link-flights">Flights</Button>
            <Button variant="ghost" data-testid="link-predictions">Predictions</Button>
            <Button variant="ghost" data-testid="link-deals">Deals</Button>
            <Button variant="ghost" data-testid="link-about">About</Button>
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
            <Button variant="ghost" className="w-full justify-start">Flights</Button>
            <Button variant="ghost" className="w-full justify-start">Predictions</Button>
            <Button variant="ghost" className="w-full justify-start">Deals</Button>
            <Button variant="ghost" className="w-full justify-start">About</Button>
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
