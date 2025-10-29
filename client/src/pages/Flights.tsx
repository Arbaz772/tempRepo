import { useState } from "react";
import FlightSearchForm from "@/components/FlightSearchForm";
import FlightResultsInline from "@/components/FlightResultsInline";
import FilterPanel from "@/components/FilterPanel";
import AIPredictionPanel from "@/components/AIPredictionPanel";
import PriceTrendChart from "@/components/PriceTrendChart";
import { Loader2, Plane } from "lucide-react";

export default function Flights() {
  const [flights, setFlights] = useState<any[]>([]);
  const [searchParams, setSearchParams] = useState<any>(null);
  const [isMock, setIsMock] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearchStart = () => {
    console.log("🚀 Search started");
    setLoading(true);
    setFlights([]); // Clear previous results
  };

  const handleSearchComplete = (data: any) => {
    console.log("🔥 handleSearchComplete - DATA RECEIVED:", {
      hasFlights: !!data.flights,
      flightsLength: data.flights?.length,
      isArray: Array.isArray(data.flights),
      flights: data.flights
    });
    
    // CRITICAL: Set state immediately
    setFlights(data.flights || []);
    setSearchParams(data.searchParams || null);
    setIsMock(data.isMock || false);
    setLoading(false);
    
    console.log("🔥 State set, flights count:", data.flights?.length);
  };

  const handleSearchError = (error: string) => {
    console.log("❌ Search error:", error);
    setLoading(false);
    setFlights([]);
  };

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

  console.log("🎨 Rendering Flights page:", { 
    loading, 
    flightsCount: flights.length,
    hasSearchParams: !!searchParams 
  });

  return (
    <div className="bg-background">
      {/* SEARCH FORM */}
      <div className="bg-card/30 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <FlightSearchForm 
            onSearchStart={handleSearchStart}
            onSearchComplete={handleSearchComplete}
            onSearchError={handleSearchError}
          />
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-8">
              <Plane className="h-16 w-16 text-primary animate-bounce" />
              <Loader2 className="h-20 w-20 text-primary/30 animate-spin absolute -top-2 -left-2" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">Searching for flights...</h3>
            <p className="text-muted-foreground">Finding the best options for you</p>
          </div>
        </div>
      )}

      {/* RESULTS - SIMPLIFIED CONDITION */}
      {!loading && flights.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {console.log("✅ RENDERING RESULTS - Flights count:", flights.length)}
          
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Filters */}
            <aside className="lg:col-span-1">
              <div className="space-y-6 sticky top-24">
                <FilterPanel onFilterChange={(filters) => console.log('Filters:', filters)} />
              </div>
            </aside>

            {/* Main Content */}
            <main className="lg:col-span-3 space-y-6">
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
              <div id="flight-results-section">
                {console.log("🎭 About to render FlightResultsInline with flights:", flights.length)}
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
      )}

      {/* EMPTY STATE */}
      {!loading && flights.length === 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
                <div className="text-xs text-muted-foreground">AI-powered flight recommendations</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-3xl mb-2">💰</div>
                <div className="font-medium mb-1">Best Prices</div>
                <div className="text-xs text-muted-foreground">Compare across multiple airlines</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-3xl mb-2">📊</div>
                <div className="font-medium mb-1">Price Insights</div>
                <div className="text-xs text-muted-foreground">Predict future price changes</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}