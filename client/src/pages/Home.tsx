// client/src/pages/Home.tsx
// Homepage that receives and displays flight search results

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FlightResultsInline from "@/components/FlightResultsInline";
import FilterPanel from "@/components/FilterPanel";
import AIPredictionPanel from "@/components/AIPredictionPanel";
import PriceTrendChart from "@/components/PriceTrendChart";
import { Search, TrendingUp, Bell, Sparkles } from "lucide-react";

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [flights, setFlights] = useState<any[]>([]);
  const [searchParams, setSearchParams] = useState<any>(null);
  const [isMock, setIsMock] = useState(false);

  // Load results on component mount
  useEffect(() => {
    console.log("🏠 Homepage mounted, checking for flight results...");

    // Try to get results from navigation state first
    if (location.state?.flights) {
      console.log("✅ Found results in navigation state:", location.state.flights.length, "flights");
      setFlights(location.state.flights);
      setSearchParams(location.state.searchParams);
      setIsMock(location.state.isMock || false);
      
      // Scroll to results
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
      
      return;
    }

    // Fallback: Try sessionStorage
    try {
      const stored = sessionStorage.getItem('flightSearchResults');
      if (stored) {
        const data = JSON.parse(stored);
        console.log("✅ Found results in sessionStorage:", data.flights?.length, "flights");
        
        // Check if results are recent (within last 5 minutes)
        const resultAge = Date.now() - new Date(data.timestamp).getTime();
        if (resultAge < 5 * 60 * 1000) {
          setFlights(data.flights || []);
          setSearchParams(data.searchParams);
          setIsMock(data.isMock || false);
          
          // Scroll to results
          setTimeout(() => {
            document.getElementById('results-section')?.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            });
          }, 100);
        } else {
          console.log("⚠️ Results are too old, clearing sessionStorage");
          sessionStorage.removeItem('flightSearchResults');
        }
      }
    } catch (error) {
      console.error("Error loading results from sessionStorage:", error);
    }
  }, [location]);

  const handleNewSearch = () => {
    navigate('/flights');
  };

  const handleClearResults = () => {
    setFlights([]);
    setSearchParams(null);
    sessionStorage.removeItem('flightSearchResults');
  };

  // Price trend data
  const priceData = [
    { date: 'Jan 1', price: 5200 },
    { date: 'Jan 5', price: 4800 },
    { date: 'Jan 10', price: 5500 },
    { date: 'Jan 15', price: 4900 },
    { date: 'Jan 20', price: 4500 },
    { date: 'Jan 25', price: 4700 },
    { date: 'Jan 30', price: 4400 },
  ];

  const predictedData = [
    { date: 'Feb 1', price: 4200 },
    { date: 'Feb 3', price: 4100 },
    { date: 'Feb 5', price: 4300 },
  ];

  console.log("🏠 Homepage rendering:", { 
    hasFlights: flights.length > 0,
    flightsCount: flights.length,
    hasSearchParams: !!searchParams 
  });

  return (
    <div className="min-h-screen bg-background">
      
      {/* HERO SECTION - Show when NO results */}
      {flights.length === 0 && (
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
                onClick={handleNewSearch}
                size="lg"
                className="bg-white text-blue-900 hover:bg-blue-50 text-lg px-8 py-6"
              >
                <Search className="mr-2 h-5 w-5" />
                Search Flights
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* COMPACT HEADER - Show when results exist */}
      {flights.length > 0 && (
        <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-yellow-300" />
                <div>
                  <h1 className="text-2xl font-bold">SkaiLinker</h1>
                  <p className="text-sm text-blue-200">AI-Powered Flight Search</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={handleNewSearch}
                  variant="outline"
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                >
                  <Search className="mr-2 h-4 w-4" />
                  New Search
                </Button>
                <Button 
                  onClick={handleClearResults}
                  variant="ghost"
                  className="text-white hover:bg-white/10"
                >
                  Clear Results
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FLIGHT RESULTS SECTION */}
      {flights.length > 0 && (
        <section id="results-section" className="py-8 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {console.log("✅ RENDERING RESULTS on HOMEPAGE - Flights:", flights.length)}
            
            <div className="grid lg:grid-cols-4 gap-8">
              
              {/* LEFT SIDEBAR - Filters */}
              <aside className="lg:col-span-1">
                <div className="space-y-6 sticky top-24">
                  <FilterPanel onFilterChange={(filters) => console.log('Filters:', filters)} />
                </div>
              </aside>

              {/* MAIN CONTENT */}
              <main className="lg:col-span-3 space-y-6">
                
                {/* AI PREDICTIONS & TRENDS */}
                {searchParams && (
                  <div className="grid lg:grid-cols-2 gap-6">
                    <AIPredictionPanel
                      route={`${searchParams.origin} → ${searchParams.destination}`}
                      prediction={{
                        recommendation: "book_now",
                        confidence: 87,
                        bestTimeToBook: "Within next 48 hours",
                        expectedSavings: 850,
                        priceDirection: "down"
                      }}
                    />
                    <PriceTrendChart 
                      route={`${searchParams.origin} → ${searchParams.destination}`}
                      data={priceData} 
                      predictedData={predictedData}
                    />
                  </div>
                )}

                {/* FLIGHT RESULTS */}
                <FlightResultsInline
                  flights={flights}
                  searchParams={searchParams}
                  isMock={isMock}
                  loading={false}
                />
              </main>
            </div>
          </div>
        </section>
      )}

      {/* FEATURES SECTION - Show when NO results */}
      {flights.length === 0 && (
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
                onClick={handleNewSearch}
                size="lg"
                className="text-lg px-8 py-6"
              >
                <Search className="mr-2 h-5 w-5" />
                Start Searching Now
              </Button>
            </div>
          </div>
        </section>
      )}

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