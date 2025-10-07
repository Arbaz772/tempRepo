import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plane, Mail, MapPin, Phone, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card/50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <Plane className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold font-display bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                SkyFind
              </span>
            </div>
            <p className="text-muted-foreground max-w-sm">
              Your intelligent flight booking companion. Compare prices, predict trends, and book the best deals across India with AI-powered insights.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Mumbai, Maharashtra, India</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>support@skyfind.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>+91 1800 123 4567</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold font-display mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button className="text-muted-foreground hover:text-primary transition-colors text-sm" data-testid="footer-link-flights">
                  Search Flights
                </button>
              </li>
              <li>
                <button className="text-muted-foreground hover:text-primary transition-colors text-sm" data-testid="footer-link-predictions">
                  Price Predictions
                </button>
              </li>
              <li>
                <button className="text-muted-foreground hover:text-primary transition-colors text-sm" data-testid="footer-link-deals">
                  Best Deals
                </button>
              </li>
              <li>
                <button className="text-muted-foreground hover:text-primary transition-colors text-sm" data-testid="footer-link-alerts">
                  Price Alerts
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold font-display mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <button className="text-muted-foreground hover:text-primary transition-colors text-sm" data-testid="footer-link-about">
                  About Us
                </button>
              </li>
              <li>
                <button className="text-muted-foreground hover:text-primary transition-colors text-sm" data-testid="footer-link-careers">
                  Careers
                </button>
              </li>
              <li>
                <button className="text-muted-foreground hover:text-primary transition-colors text-sm" data-testid="footer-link-press">
                  Press
                </button>
              </li>
              <li>
                <button className="text-muted-foreground hover:text-primary transition-colors text-sm" data-testid="footer-link-blog">
                  Blog
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold font-display mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <button className="text-muted-foreground hover:text-primary transition-colors text-sm" data-testid="footer-link-help">
                  Help Center
                </button>
              </li>
              <li>
                <button className="text-muted-foreground hover:text-primary transition-colors text-sm" data-testid="footer-link-contact">
                  Contact Us
                </button>
              </li>
              <li>
                <button className="text-muted-foreground hover:text-primary transition-colors text-sm" data-testid="footer-link-privacy">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button className="text-muted-foreground hover:text-primary transition-colors text-sm" data-testid="footer-link-terms">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="py-6 border-t">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} SkyFind. All rights reserved.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="h-9 w-9 hover-elevate" data-testid="social-facebook">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 hover-elevate" data-testid="social-twitter">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 hover-elevate" data-testid="social-instagram">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 hover-elevate" data-testid="social-linkedin">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="pb-8">
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="font-semibold font-display text-lg mb-1">Stay Updated</h3>
                <p className="text-sm text-muted-foreground">Get the latest deals and AI insights delivered to your inbox</p>
              </div>
              <div className="flex gap-2 w-full md:w-auto md:min-w-[300px]">
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1"
                  data-testid="input-newsletter-email"
                />
                <Button className="bg-primary hover:bg-primary/90" data-testid="button-subscribe">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
