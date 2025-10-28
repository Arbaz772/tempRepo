// client/src/components/FlightResultsInline.tsx
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plane, Clock, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Calculate pagination
  const totalPages = Math.ceil((flights?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFlights = flights?.slice(startIndex, endIndex) || [];

  // Reset to page 1 when flights change
  useState(() => {
    setCurrentPage(1);
  });

  // Debug logging
  console.log("🎭 FlightResultsInline rendered:", {
    flightsCount: flights?.length,
    currentPage,
    totalPages,
    currentFlights: currentFlights.length,
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

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of results
    document.getElementById('flight-results')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
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
          </div>
          {searchParams && (
            <div className="text-sm text-muted-foreground">
              {searchParams.origin} → {searchParams.destination} • {searchParams.passengers} passenger{searchParams.passengers > 1 ? 's' : ''}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(endIndex, flights.length)} of {flights.length} flight{flights.length !== 1 ? 's' : ''}
          </div>
          {totalPages > 1 && (
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
          )}
        </div>
      </div>

      {/* Flight Cards */}
      <div className="space-y-4">
        {currentFlights.map((flight) => (
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between border-t pt-6">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(endIndex, flights.length)} of {flights.length} results
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={previousPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            
            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first, last, current, and adjacent pages
                const showPage = 
                  page === 1 || 
                  page === totalPages || 
                  page === currentPage || 
                  page === currentPage - 1 || 
                  page === currentPage + 1;
                
                const showEllipsis = 
                  (page === 2 && currentPage > 3) ||
                  (page === totalPages - 1 && currentPage < totalPages - 2);

                if (showEllipsis) {
                  return <span key={page} className="px-2 text-muted-foreground">...</span>;
                }

                if (!showPage) {
                  return null;
                }

                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(page)}
                    className="min-w-[40px]"
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}