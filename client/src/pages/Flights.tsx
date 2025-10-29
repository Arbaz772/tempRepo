import { useState, useEffect } from "react";
import FlightSearchForm from "@/components/FlightSearchForm";
import FlightResultsInline from "@/components/FlightResultsInline";
import FilterPanel from "@/components/FilterPanel";
import AIPredictionPanel from "@/components/AIPredictionPanel";
import PriceTrendChart from "@/components/PriceTrendChart";
import { Loader2, Plane } from "lucide-react";

export default function Flights() {
  // Flight results state
  const [flights, setFlights] = useState<any[]>([]);
  const [searchParams, setSearchParams] = useState<any>(null);
  const [isMock, setIsMock] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔍 DEBUG: Watch state changes
  useEffect(() => {
    console.log("🎯 State changed:", {
      flightsCount: flights.length,
      loading,
      hasSearchParams: !!searchParams,
      isMock,
      flights: flights.slice(0, 2) // Show first 2 flights as sample
    });
  }, [flights, loading, searchParams, isMock]);

  // Handler when search starts
  const handleSearchStart = () => {
    console.log("🚀 handleSearchStart called");
    setLoading(true);
  };

  // Handler when search completes
  const handleSearchComplete = (data: any) => {
    console.log("🔥 handleSearchComplete CALLED!", data);
    console.log("🔥 Flights array:", data.flights);
    console.log("🔥 Number of flights:", data.flights?.length);
    console.log("🔥 Search params:", data.searchParams);
    console.log("🔥 Is mock:", data.isMock);
    
    setFlights(data.flights);
    setSearchParams(data.searchParams);
    setIsMock(data.isMock);
    setLoading(false);
    
    console.log("🔥 After setState - should trigger render");
    console.log("🔥 State will update to:", {
      flightsCount: data.flights?.length,
      loading: false
    });
    
    // Scroll to results section after a delay
    setTimeout(() => {
      const element = document.getElementById('flight-results-section');
      console.log("📍 Scrolling to results, element found:", !!element);
      element?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 300);
  };

  // Handler when search has error
  const handleSearchError = (error: string) => {
    console.log("❌ handleSearchError called:", error);
    setLoading(false);
    setFlights([]);
  };

  // Price trend data (you can make this dynamic based on search)
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

  console.log("🎨 Flights component rendering, current state:", {
    flightsCount: flights.length,
    loading,
    hasSearchParams: !!searchParams
  });

  return (
    <div className="bg-background">
      {/* SEARCH FORM SECTION */}
      <div className="bg-card/30 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <FlightSearchForm 
            onSearchStart={handleSearchStart}
            onSearchComplete={handleSearchComplete}
            onSearchError={handleSearchError}
          />
        </div>
      </div>

      {/* LOADING STATE - Show prominent spinner while searching */}
      {(() => {
        console.log("🔍 Checking loading state:", loading);
        return loading && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {console.log("⏳ RENDERING LOADING SPINNER")}
            <div className="flex flex-col items-center justify-center py-20">
              {/* Animated Plane Icon */}
              <div className="relative mb-8">
                <Plane className="h-16 w-16 text-primary animate-bounce" />
                <Loader2 className="h-20 w-20 text-primary/30 animate-spin absolute -top-2 -left-2" />
              </div>
              
              {/* Loading Text */}
              <h3 className="text-2xl font-semibold mb-3 text-foreground">
                Searching for flights...
              </h3>
              <p className="text-muted-foreground mb-2">
                Finding the best options for you
              </p>
              <p className="text-sm text-muted-foreground">
                {searchParams?.origin || "..."} → {searchParams?.destination || "..."} • {searchParams?.passengers || 1} passenger{searchParams?.passengers > 1 ? 's' : ''}
              </p>
              
              {/* Loading Progress Dots */}
              <div className="flex gap-2 mt-6">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse delay-75"></div>
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* RESULTS SECTION - Only show after search completes */}
      {(() => {
        console.log("🔍 Checking results render condition:", {
          loading,
          flightsLength: flights.length,
          shouldRender: !loading && flights.length > 0
        });
        
        return !loading && flights.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {console.log("✅ RENDERING RESULTS SECTION with", flights.length, "flights")}
            <div className="grid lg:grid-cols-4 gap-8">
              
              {/* LEFT SIDEBAR - Filters */}
              <aside className="lg:col-span-1">
                <div className="space-y-6 sticky top-24">
                  <FilterPanel onFilterChange={(filters) => console.log('Filters:', filters)} />
                </div>
              </aside>

              {/* MAIN CONTENT - Predictions, Trends, and Results */}
              <main className="lg:col-span-3 space-y-6">
                
                {/* AI PREDICTION & PRICE TRENDS */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <AIPredictionPanel
                    route={`${searchParams?.origin} → ${searchParams?.destination}`}
                    prediction={{
                      recommendation: "book_now",
                      confidence: 87,
                      bestTimeToBook: "Within next 48 hours",
                      expectedSavings: 850,
                      priceDirection: "down"
                    }}
                  />
                  <PriceTrendChart 
                    route={`${searchParams?.origin} → ${searchParams?.destination}`}
                    data={priceData} 
                    predictedData={predictedData}
                  />
                </div>

                {/* FLIGHT RESULTS WITH PAGINATION */}
                <div id="flight-results-section">
                  {console.log("🎭 About to render FlightResultsInline with", flights.length, "flights")}
                  <FlightResultsInline
                    flights={flights}
                    searchParams={searchParams}
                    isMock={isMock}
                    loading={false}
                  />
                </div>
              </main>
            </div>
          </div>
        );
      })()}

      {/* EMPTY STATE - Before any search */}
      {(() => {
        console.log("🔍 Checking empty state condition:", {
          loading,
          flightsLength: flights.length,
          shouldShowEmpty: !loading && flights.length === 0
        });
        
        return !loading && flights.length === 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {console.log("📭 RENDERING EMPTY STATE")}
            <div className="max-w-2xl mx-auto text-center">
              <div className="text-7xl mb-6">✈️</div>
              <h2 className="text-2xl font-semibold mb-3">Start Your Journey</h2>
              <p className="text-muted-foreground mb-6">
                Enter your travel details above to find the best flight options
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-4 border rounded-lg">
                  <div className="text-3xl mb-2">🔍</div>
                  <div className="font-medium mb-1">Smart Search</div>
                  <div className="text-xs text-muted-foreground">
                    AI-powered flight recommendations
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-3xl mb-2">💰</div>
                  <div className="font-medium mb-1">Best Prices</div>
                  <div className="text-xs text-muted-foreground">
                    Compare across multiple airlines
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-3xl mb-2">📊</div>
                  <div className="font-medium mb-1">Price Insights</div>
                  <div className="text-xs text-muted-foreground">
                    Predict future price changes
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}