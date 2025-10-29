// client/src/components/FlightResultsInline.tsx
// WITH AFFILIATE LINK SUPPORT

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plane, Clock, IndianRupee, Calendar, ExternalLink } from "lucide-react";
import { format } from "date-fns";

interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  currency: string;
  availableSeats: number;
  class: string;
  stops: number;
  departDate?: string;
}

interface FlightResultsInlineProps {
  flights: Flight[];
  searchParams: any;
  isMock?: boolean;
  loading?: boolean;
}

// =================================================================
// AFFILIATE CONFIGURATION
// =================================================================
// TODO: After Skyscanner approves your affiliate application,
// replace these values with your actual credentials:

const AFFILIATE_CONFIG = {
  // Set to true once you have affiliate credentials
  enabled: false,
  
  // Your Skyscanner affiliate ID (you'll get this after approval)
  affiliateId: 'YOUR_AFFILIATE_ID',
  
  // Optional: Your custom tracking parameters
  campaignId: 'skailinker',
  
  // Market (IN for India)
  market: 'IN',
};

// =================================================================

export default function FlightResultsInline({
  flights,
  searchParams,
  isMock = false,
  loading = false
}: FlightResultsInlineProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const flightsPerPage = 10;

  // Calculate pagination
  const indexOfLastFlight = currentPage * flightsPerPage;
  const indexOfFirstFlight = indexOfLastFlight - flightsPerPage;
  const currentFlights = flights.slice(indexOfFirstFlight, indexOfLastFlight);
  const totalPages = Math.ceil(flights.length / flightsPerPage);

  // Generate Skyscanner URL with optional affiliate tracking
  const generateSkyscannerUrl = (flight: Flight) => {
    const origin = searchParams?.origin || flight.origin;
    const destination = searchParams?.destination || flight.destination;
    const departDate = searchParams?.departDate || flight.departDate || format(new Date(), 'yyyy-MM-dd');
    const returnDate = searchParams?.returnDate;
    const adults = searchParams?.passengers || 1;

    // Format date: YYMMDD
    const formatDateForSkyscanner = (dateStr: string) => {
      const date = new Date(dateStr);
      const yy = date.getFullYear().toString().slice(-2);
      const mm = (date.getMonth() + 1).toString().padStart(2, '0');
      const dd = date.getDate().toString().padStart(2, '0');
      return `${yy}${mm}${dd}`;
    };

    const departFormatted = formatDateForSkyscanner(departDate);
    const returnFormatted = returnDate ? formatDateForSkyscanner(returnDate) : '';

    // Build base URL
    const baseUrl = 'https://www.skyscanner.co.in/transport/flights';
    const originCode = origin.toLowerCase();
    const destCode = destination.toLowerCase();
    
    let url = `${baseUrl}/${originCode}/${destCode}/${departFormatted}`;
    
    if (returnFormatted) {
      url += `/${returnFormatted}`;
    }
    
    // Add query parameters
    const params = new URLSearchParams();
    params.append('adults', adults.toString());
    
    // Add affiliate parameters if enabled
    if (AFFILIATE_CONFIG.enabled && AFFILIATE_CONFIG.affiliateId !== 'YOUR_AFFILIATE_ID') {
      params.append('associateid', AFFILIATE_CONFIG.affiliateId);
      
      // Optional: Add campaign tracking
      if (AFFILIATE_CONFIG.campaignId) {
        params.append('utm_source', AFFILIATE_CONFIG.campaignId);
        params.append('utm_medium', 'referral');
        params.append('utm_campaign', 'flight_booking');
      }
    }
    
    url += `/?${params.toString()}`;

    return url;
  };

  const handleBookNow = (flight: Flight) => {
    const skyscannerUrl = generateSkyscannerUrl(flight);
    
    // Log for tracking (optional - remove in production)
    if (AFFILIATE_CONFIG.enabled) {
      console.log('🔗 Affiliate link clicked:', skyscannerUrl);
    }
    
    window.open(skyscannerUrl, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-24 bg-muted rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (!flights || flights.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="text-5xl mb-4">✈️</div>
        <h3 className="text-xl font-semibold mb-2">No flights found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search criteria
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Available Flights</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {flights.length} flight{flights.length !== 1 ? 's' : ''} found
            {isMock && " (Sample data)"}
          </p>
        </div>
        {searchParams && (
          <div className="text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {format(new Date(searchParams.departDate), 'MMM dd, yyyy')}
                {searchParams.returnDate && 
                  ` - ${format(new Date(searchParams.returnDate), 'MMM dd, yyyy')}`
                }
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Flight Cards */}
      <div className="space-y-4">
        {currentFlights.map((flight) => (
          <Card key={flight.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Flight Info */}
              <div className="flex-1 space-y-3">
                
                {/* Airline and Flight Number */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Plane className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">{flight.airline}</div>
                      <div className="text-xs text-muted-foreground">
                        {flight.flightNumber}
                      </div>
                    </div>
                  </div>
                  
                  {flight.stops === 0 && (
                    <Badge variant="secondary" className="ml-2">
                      Non-stop
                    </Badge>
                  )}
                  
                  {flight.stops > 0 && (
                    <Badge variant="outline">
                      {flight.stops} stop{flight.stops > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>

                {/* Route and Time */}
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{flight.departureTime}</div>
                    <div className="text-sm text-muted-foreground">{flight.origin}</div>
                  </div>
                  
                  <div className="flex-1 flex items-center gap-2 px-4">
                    <div className="h-px bg-border flex-1"></div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{flight.duration}</span>
                    </div>
                    <div className="h-px bg-border flex-1"></div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold">{flight.arrivalTime}</div>
                    <div className="text-sm text-muted-foreground">{flight.destination}</div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{flight.class}</span>
                  <span>•</span>
                  <span>{flight.availableSeats} seats available</span>
                </div>
              </div>

              {/* Price and Book Button */}
              <div className="md:text-right space-y-3 md:ml-6">
                <div>
                  <div className="flex items-baseline justify-end gap-1">
                    <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    <span className="text-3xl font-bold">{flight.price.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    per person
                  </div>
                </div>
                
                {/* Book Button */}
                <Button 
                  className="w-full md:w-auto min-w-[140px]" 
                  size="lg"
                  onClick={() => handleBookNow(flight)}
                >
                  Book
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="w-10"
              >
                {page}
              </Button>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Mock Data Notice */}
      {isMock && (
        <Card className="p-4 bg-muted/50 border-dashed">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="text-lg">ℹ️</div>
            <div>
              <div className="font-medium">Sample Data</div>
              <div className="text-xs">
                These are sample flights for demonstration. Click "Book" to search on Skyscanner with real-time prices.
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}