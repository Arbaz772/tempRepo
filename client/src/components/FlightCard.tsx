import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plane, Clock, ArrowRight, Briefcase, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface FlightCardProps {
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
  aircraft: string;
  baggage?: string;
  prediction?: {
    trend: "up" | "down" | "stable";
    message: string;
  };
  isBestDeal?: boolean;
}

export default function FlightCard({
  id,
  airline,
  flightNumber,
  origin,
  destination,
  departTime,
  arriveTime,
  duration,
  stops,
  price,
  aircraft,
  baggage = "15 kg",
  prediction,
  isBestDeal = false,
}: FlightCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Card className={`p-6 hover-elevate transition-all duration-300 hover:shadow-xl hover:scale-[1.01] ${isBestDeal ? 'border-primary border-2 shadow-primary/20 shadow-lg' : ''}`}>
      {isBestDeal && (
        <div className="mb-4 flex items-center gap-2">
          <Badge className="bg-primary text-primary-foreground animate-pulse" data-testid="badge-best-deal">
            AI Recommended - Best Deal
          </Badge>
          <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
        </div>
      )}
      
      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Plane className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg" data-testid={`text-airline-${id}`}>{airline}</h3>
              <p className="text-sm text-muted-foreground">{flightNumber} • {aircraft}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold font-display" data-testid={`text-depart-time-${id}`}>{departTime}</p>
              <p className="text-sm text-muted-foreground">{origin}</p>
            </div>
            
            <div className="flex-1 flex flex-col items-center">
              <div className="flex items-center gap-2 w-full">
                <div className="h-px bg-border flex-1" />
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div className="h-px bg-border flex-1" />
              </div>
              <p className="text-sm text-muted-foreground mt-1">{duration}</p>
              {stops > 0 && (
                <Badge variant="secondary" className="mt-1" data-testid={`badge-stops-${id}`}>
                  {stops} {stops === 1 ? 'stop' : 'stops'}
                </Badge>
              )}
            </div>

            <div className="text-center">
              <p className="text-2xl font-bold font-display" data-testid={`text-arrive-time-${id}`}>{arriveTime}</p>
              <p className="text-sm text-muted-foreground">{destination}</p>
            </div>
          </div>

          {prediction && (
            <Badge 
              variant="secondary" 
              className={`${prediction.trend === 'down' ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-orange-500/10 text-orange-600 dark:text-orange-400'}`}
              data-testid={`badge-prediction-${id}`}
            >
              {prediction.message}
            </Badge>
          )}
        </div>

        <div className="lg:text-right space-y-3 lg:min-w-[180px]">
          <div>
            <p className="text-3xl font-bold font-display tabular-nums" data-testid={`text-price-${id}`}>₹{price.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">per person</p>
          </div>
          <Button className="w-full" data-testid={`button-book-${id}`}>
            Book Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => setShowDetails(!showDetails)}
            data-testid={`button-details-${id}`}
          >
            {showDetails ? 'Hide Details' : 'View Details'}
            {showDetails ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </div>

      {showDetails && (
        <div className="mt-6 pt-6 border-t grid md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Baggage</p>
              <p className="text-sm text-muted-foreground">{baggage}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Plane className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Aircraft</p>
              <p className="text-sm text-muted-foreground">{aircraft}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Duration</p>
              <p className="text-sm text-muted-foreground">{duration}</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
