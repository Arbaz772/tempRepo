// client/src/components/FlightResultsModal.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Plane, 
  Clock, 
  ArrowRight, 
  ExternalLink,
  Briefcase,
  X,
  ChevronDown,
  ChevronUp,
  Sparkles
} from "lucide-react";

interface FlightOffer {
  id: string;
  airline: string;
  airlineLogo?: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  stops: number;
  price: number;
  currency: string;
  aircraft: string;
  baggage?: string;
  bookingUrl: string;
  cabinClass: string;
}

interface FlightResultsModalProps {
  open: boolean;
  onClose: () => void;
  flights: FlightOffer[];
  searchParams?: {
    origin: string;
    destination: string;
    departDate: string;
    returnDate?: string;
    passengers: number;
  };
  isMock?: boolean;
}

export default function FlightResultsModal({
  open,
  onClose,
  flights,
  searchParams,
  isMock = false
}: FlightResultsModalProps) {
  const [expandedFlight, setExpandedFlight] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"price" | "duration">("price");

  // Sort flights
  const sortedFlights = [...flights].sort((a, b) => {
    if (sortBy === "price") {
      return a.price - b.price;
    }
    // Sort by duration (convert "2h 15m" to minutes)
    const getDurationMinutes = (duration: string) => {
      const hours = parseInt(duration.match(/(\d+)h/)?.[1] || "0");
      const minutes = parseInt(duration.match(/(\d+)m/)?.[1] || "0");
      return hours * 60 + minutes;
    };
    return getDurationMinutes(a.duration) - getDurationMinutes(b.duration);
  });

  const cheapestPrice = Math.min(...flights.map(f => f.price));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-gradient-to-br from-primary/5 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Plane className="h-6 w-6 text-primary" />
                Flight Results
              </DialogTitle>
              <DialogDescription className="mt-2">
                {searchParams && (
                  <span className="text-base">
                    {searchParams.origin} → {searchParams.destination} • {flights.length} flights found
                  </span>
                )}
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Mock Data Warning */}
          {isMock && (
            <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Showing sample flights. Connect Amadeus API for real-time data.
              </p>
            </div>
          )}

          {/* Sort Options */}
          <div className="flex items-center gap-2 mt-4">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Button
              variant={sortBy === "price" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("price")}
            >
              Cheapest
            </Button>
            <Button
              variant={sortBy === "duration" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("duration")}
            >
              Fastest
            </Button>
          </div>
        </DialogHeader>

        {/* Flight List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {sortedFlights.map((flight) => (
            <Card
              key={flight.id}
              className={`p-6 hover:shadow-lg transition-all duration-300 ${
                flight.price === cheapestPrice
                  ? "border-primary border-2 shadow-primary/20"
                  : ""
              }`}
            >
              {/* Best Deal Badge */}
              {flight.price === cheapestPrice && (
                <div className="mb-4 flex items-center gap-2">
                  <Badge className="bg-primary text-primary-foreground animate-pulse">
                    Best Price
                  </Badge>
                </div>
              )}

              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Flight Info */}
                <div className="flex-1 space-y-4">
                  {/* Airline */}
                  <div className="flex items-center gap-3">
                    {flight.airlineLogo && (
                      <img
                        src={flight.airlineLogo}
                        alt={flight.airline}
                        className="h-10 w-10 rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-lg">{flight.airline}</h3>
                      <p className="text-sm text-muted-foreground">
                        {flight.flightNumber} • {flight.aircraft}
                      </p>
                    </div>
                  </div>

                  {/* Route */}
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{flight.departTime}</p>
                      <p className="text-sm text-muted-foreground">{flight.origin}</p>
                    </div>

                    <div className="flex-1 flex flex-col items-center">
                      <div className="flex items-center gap-2 w-full">
                        <div className="h-px bg-border flex-1" />
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div className="h-px bg-border flex-1" />
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {flight.duration}
                      </p>
                      {flight.stops === 0 ? (
                        <Badge variant="secondary" className="mt-1">
                          Non-stop
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="mt-1">
                          {flight.stops} {flight.stops === 1 ? "stop" : "stops"}
                        </Badge>
                      )}
                    </div>

                    <div className="text-center">
                      <p className="text-2xl font-bold">{flight.arriveTime}</p>
                      <p className="text-sm text-muted-foreground">
                        {flight.destination}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Price & Book */}
                <div className="lg:text-right space-y-3 lg:min-w-[200px]">
                  <div>
                    <p className="text-3xl font-bold">
                      ₹{flight.price.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">per person</p>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => window.open(flight.bookingUrl, "_blank")}
                  >
                    Book Now
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() =>
                      setExpandedFlight(
                        expandedFlight === flight.id ? null : flight.id
                      )
                    }
                  >
                    {expandedFlight === flight.id ? (
                      <>
                        Hide Details
                        <ChevronUp className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        View Details
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedFlight === flight.id && (
                <div className="mt-6 pt-6 border-t grid md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Baggage</p>
                      <p className="text-sm text-muted-foreground">
                        {flight.baggage}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Plane className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Aircraft</p>
                      <p className="text-sm text-muted-foreground">
                        {flight.aircraft}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Class</p>
                      <p className="text-sm text-muted-foreground">
                        {flight.cabinClass}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-muted/30">
          <p className="text-sm text-muted-foreground text-center">
            Prices are per person and include taxes & fees. Click "Book Now" to
            complete your booking on the airline's website.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}