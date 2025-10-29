// client/src/pages/Flights.tsx
// This page has the search form and redirects to homepage with results

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FlightSearchForm from "@/components/FlightSearchForm";
import { Loader2, Plane } from "lucide-react";

export default function Flights() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSearchStart = () => {
    console.log("🚀 Flight search started");
    setLoading(true);
  };

  const handleSearchComplete = (data: any) => {
    console.log("✅ Search complete, redirecting to homepage with results:", {
      flightsCount: data.flights?.length,
      searchParams: data.searchParams
    });
    
    // Store results in sessionStorage (survives page navigation)
    sessionStorage.setItem('flightSearchResults', JSON.stringify({
      flights: data.flights,
      searchParams: data.searchParams,
      isMock: data.isMock,
      timestamp: new Date().toISOString()
    }));

    // Navigate to homepage
    navigate('/', {
      state: {
        flights: data.flights,
        searchParams: data.searchParams,
        isMock: data.isMock
      }
    });
  };

  const handleSearchError = (error: string) => {
    console.log("❌ Search error:", error);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-900 to-blue-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="text-4xl">✈️</div>
              <h1 className="text-4xl md:text-5xl font-bold">
                Find Your Perfect Flight
              </h1>
            </div>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Compare prices across all airlines. Get AI predictions for the best flight booking time.
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-4xl mx-auto">
            <FlightSearchForm 
              onSearchStart={handleSearchStart}
              onSearchComplete={handleSearchComplete}
              onSearchError={handleSearchError}
            />
          </div>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative mb-8">
                <Plane className="h-16 w-16 text-primary animate-bounce" />
                <Loader2 className="h-20 w-20 text-primary/30 animate-spin absolute -top-2 -left-2" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Searching for flights...</h3>
              <p className="text-muted-foreground">You'll be redirected to results shortly...</p>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      {!loading && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Why Choose SkaiLinker?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Powered by advanced AI to help you find the best flight booking deals world-wide
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center p-6 bg-card rounded-lg border shadow-sm">
                <div className="text-5xl mb-4">🤖</div>
                <h3 className="text-xl font-semibold mb-3">AI Price Predictions</h3>
                <p className="text-muted-foreground">
                  Advanced algorithms predict price trends to help you book at the perfect time.
                </p>
              </div>

              <div className="text-center p-6 bg-card rounded-lg border shadow-sm">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-3">Multi-Source Comparison</h3>
                <p className="text-muted-foreground">
                  Compare flight prices from all major airlines and booking platforms.
                </p>
              </div>

              <div className="text-center p-6 bg-card rounded-lg border shadow-sm">
                <div className="text-5xl mb-4">🔔</div>
                <h3 className="text-xl font-semibold mb-3">Price Alerts</h3>
                <p className="text-muted-foreground">
                  Get notified when prices drop for your favorite routes and destinations.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}