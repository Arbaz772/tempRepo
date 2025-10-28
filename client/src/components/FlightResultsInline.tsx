// client/src/components/FlightResultsInline.tsx
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plane, Clock, ArrowRight, ExternalLink, AlertCircle } from "lucide-react";

interface FlightOffer {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  stops: number;
  price: number;
  currency: string;
  aircraft?: string;
  bookingUrl?: string;
  cabinClass?: string;
  segments?: any[];
}

interface FlightResultsInlineProps {
  flights: FlightOffer[];
  searchParams?: {
    origin: string;
    destination: string;
    departDate: string;
    returnDate?: string;
    passengers: number;
  };
  isMock?: boolean;
  loading?: boolean;
}

export default function FlightResultsInline({
  flights,
  searchParams,
  isMock = false,
  loading = false
}: FlightResultsInlineProps) {
  
  // Debug logging
  console.log("🎭 FlightResultsInline rendered:", {
    flightsCount: flights?.length,
    isMock,
    searchParams,
    loading
  });

  // Format currency
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full mt-8">
        <div className="text-center py-12">
          <Plane className="h-12 w-12 mx-auto text-muted-foreground mb-4 animate-pulse" />
          <h3 className="text-lg font-semibold mb-2">Searching for flights...</h3>
          <p className="text-muted-foreground">
            Please wait while we find the best options for you
          </p>
        </div>
      </div>
    );
  }

  // No results to show
  if (!flights || flights.length === 0) {
    return null;
  }

  return (
    <div className="w-full mt-8 mb-8">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">Flight Results</h2>
            {isMock && (
              <Badge variant="outline" className="ml-2">
                <AlertCircle className="h-3 w-3 mr-1" />
                Mock Data
              </Badge>
            )}
          </div>
          {searchParams && (
            <div className="text-sm text-muted-foreground">
              {searchParams.origin} → {searchParams.destination} • {searchParams.passengers} passenger{searchParams.passengers > 1 ? 's' : ''}
            </div>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          Found {flights.length} flight{flights.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Flight Cards */}
      <div className="space-y-4">
        {flights.map((flight) => (
          <Card key={flight.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col gap-4">
              {/* Flight Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-lg">{flight.airline}</div>
                  <div className="text-sm text-muted-foreground">
                    {flight.flightNumber}
                    {flight.aircraft && ` • ${flight.aircraft}`}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {formatPrice(flight.price, flight.currency)}
                  </div>
                  {flight.cabinClass && (
                    <Badge variant="secondary" className="mt-1">
                      {flight.cabinClass}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Flight Route */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="text-2xl font-bold">{flight.departTime}</div>
                  <div className="text-sm text-muted-foreground">{flight.origin}</div>
                </div>
                
                <div className="flex-1 flex flex-col items-center">
                  <div className="text-xs text-muted-foreground mb-1">{flight.duration}</div>
                  <div className="w-full flex items-center">
                    <div className="flex-1 border-t-2 border-dashed"></div>
                    <Plane className="h-4 w-4 text-muted-foreground rotate-90 mx-2" />
                    <div className="flex-1 border-t-2 border-dashed"></div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {flight.stops === 0 ? (
                      <span className="text-green-600 font-medium">Non-stop</span>
                    ) : (
                      <span className="text-orange-600 font-medium">
                        {flight.stops} stop{flight.stops > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex-1 text-right">
                  <div className="text-2xl font-bold">{flight.arriveTime}</div>
                  <div className="text-sm text-muted-foreground">{flight.destination}</div>
                </div>
              </div>

              {/* Segments Info (if available) */}
              {flight.segments && flight.segments.length > 0 && (
                <div className="pt-4 border-t">
                  <div className="text-xs font-semibold text-muted-foreground mb-2">
                    FLIGHT DETAILS
                  </div>
                  <div className="space-y-2">
                    {flight.segments.map((segment: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                          {segment.departure?.iataCode} → {segment.arrival?.iataCode}
                        </span>
                        <span className="text-xs">
                          ({segment.duration})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Book Button */}
              {flight.bookingUrl && (
                <Button 
                  className="w-full" 
                  onClick={() => window.open(flight.bookingUrl, '_blank')}
                >
                  Book Now
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Mock Data Warning */}
      {isMock && (
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-900 rounded-lg">
          <div className="flex gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Note:</strong> These are sample results. Actual flight availability and prices may vary.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}