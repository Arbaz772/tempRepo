// client/src/pages/Home.tsx
// SIMPLE VERSION - No routing required

import { Sparkles, Search, TrendingUp, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  
  const handleSearchClick = () => {
    // If you have routing set up, use this:
    // window.location.href = '/flights';
    
    // Or if flights page is at a different path:
    window.location.href = '/flights';
  };

  return (
    <div className="min-h-screen bg-background">
      
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-b from-blue-900 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sparkles className="h-12 w-12 text-yellow-300" />
              <h1 className="text-5xl md:text-6xl font-bold">
                SkaiLinker
              </h1>
            </div>
            <p className="text-2xl text-blue-100 mb-3">
              AI-Powered Flight Booking
            </p>
            <p className="text-lg text-blue-200 max-w-2xl mx-auto mb-12">
              Compare prices across all airlines. Get AI predictions for the best flight booking time.
            </p>
            
            <Button 
              onClick={handleSearchClick}
              size="lg"
              className="bg-white text-blue-900 hover:bg-blue-50 text-lg px-8 py-6"
            >
              <Search className="mr-2 h-5 w-5" />
              Search Flights
            </Button>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose SkaiLinker?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powered by advanced AI to help you find the best flight booking deals world-wide
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-2xl">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">AI Price Predictions</h3>
              <p className="text-muted-foreground text-lg">
                Our advanced algorithms predict price trends to help you book flights at the perfect time and save money.
              </p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-2xl">
              <div className="bg-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Multi-Source Comparison</h3>
              <p className="text-muted-foreground text-lg">
                Compare flight prices from all major airlines and booking platforms in one convenient place.
              </p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-2xl">
              <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bell className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Price Alerts</h3>
              <p className="text-muted-foreground text-lg">
                Get notified when prices drop for your favorite routes and destinations. Never miss a deal.
              </p>
            </div>
          </div>

          <div className="text-center mt-16">
            <Button 
              onClick={handleSearchClick}
              size="lg"
              className="text-lg px-8 py-6"
            >
              <Search className="mr-2 h-5 w-5" />
              Start Searching Now
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2025 SkaiLinker. AI-Powered Flight Booking Platform.
          </p>
        </div>
      </footer>
    </div>
  );
}