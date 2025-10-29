// client/src/components/FlightSearchForm.tsx
// FIXED - Better date picker + pre-filled values support

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface FlightSearchFormProps {
  onSearchStart?: () => void;
  onSearchComplete?: (data: any) => void;
  onSearchError?: (error: string) => void;
  initialValues?: {
    origin?: string;
    destination?: string;
    departDate?: string;
    returnDate?: string;
    passengers?: number;
    tripType?: string;
  };
}

export default function FlightSearchForm({
  onSearchStart,
  onSearchComplete,
  onSearchError,
  initialValues
}: FlightSearchFormProps) {
  const [tripType, setTripType] = useState(initialValues?.tripType || "round-trip");
  const [origin, setOrigin] = useState(initialValues?.origin || "");
  const [destination, setDestination] = useState(initialValues?.destination || "");
  const [departDate, setDepartDate] = useState<Date | undefined>(
    initialValues?.departDate ? new Date(initialValues.departDate) : undefined
  );
  const [returnDate, setReturnDate] = useState<Date | undefined>(
    initialValues?.returnDate ? new Date(initialValues.returnDate) : undefined
  );
  const [passengers, setPassengers] = useState(initialValues?.passengers || 1);
  const [loading, setLoading] = useState(false);

  // Update form when initialValues change
  useEffect(() => {
    if (initialValues) {
      if (initialValues.origin) setOrigin(initialValues.origin);
      if (initialValues.destination) setDestination(initialValues.destination);
      if (initialValues.departDate) setDepartDate(new Date(initialValues.departDate));
      if (initialValues.returnDate) setReturnDate(new Date(initialValues.returnDate));
      if (initialValues.passengers) setPassengers(initialValues.passengers);
      if (initialValues.tripType) setTripType(initialValues.tripType);
    }
  }, [initialValues]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!origin || !destination || !departDate) {
      onSearchError?.("Please fill in all required fields");
      return;
    }

    if (tripType === "round-trip" && !returnDate) {
      onSearchError?.("Please select a return date for round trip");
      return;
    }

    setLoading(true);
    onSearchStart?.();

    try {
      const searchParams = {
        origin: origin.toUpperCase(),
        destination: destination.toUpperCase(),
        departDate: format(departDate, "yyyy-MM-dd"),
        returnDate: tripType === "round-trip" && returnDate ? format(returnDate, "yyyy-MM-dd") : undefined,
        passengers,
        tripType
      };

      const response = await fetch("/api/flights/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchParams),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Search failed");
      }

      onSearchComplete?.({
        flights: data.data || [],
        searchParams,
        isMock: data.mock || false
      });
    } catch (error: any) {
      console.error("Search error:", error);
      onSearchError?.(error.message || "Failed to search flights");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="space-y-6">
      {/* Trip Type Toggle */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant={tripType === "round-trip" ? "default" : "outline"}
          onClick={() => setTripType("round-trip")}
          className="flex-1"
        >
          Round Trip
        </Button>
        <Button
          type="button"
          variant={tripType === "one-way" ? "default" : "outline"}
          onClick={() => setTripType("one-way")}
          className="flex-1"
        >
          One Way
        </Button>
      </div>

      {/* From and To */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="origin" className="text-sm font-medium">
            From
          </Label>
          <div className="relative">
            <Plane className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
            <input
              id="origin"
              type="text"
              placeholder="Delhi, Mumbai, or DEL"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="destination" className="text-sm font-medium">
            To
          </Label>
          <div className="relative">
            <Plane className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rotate-90 pointer-events-none z-10" />
            <input
              id="destination"
              type="text"
              placeholder="Delhi, Mumbai, or BOM"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              required
            />
          </div>
        </div>
      </div>

      {/* Dates with Better Picker */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Departure</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !departDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {departDate ? format(departDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={departDate}
                onSelect={setDepartDate}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {tripType === "round-trip" && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Return</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !returnDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {returnDate ? format(returnDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={returnDate}
                  onSelect={setReturnDate}
                  disabled={(date) => {
                    const today = new Date(new Date().setHours(0, 0, 0, 0));
                    const minDate = departDate || today;
                    return date < minDate;
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>

      {/* Passengers */}
      <div className="space-y-2">
        <Label htmlFor="passengers" className="text-sm font-medium">
          Passengers
        </Label>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setPassengers(Math.max(1, passengers - 1))}
            disabled={passengers <= 1}
          >
            -
          </Button>
          <span className="w-12 text-center font-medium text-lg">{passengers}</span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setPassengers(Math.min(9, passengers + 1))}
            disabled={passengers >= 9}
          >
            +
          </Button>
        </div>
      </div>

      {/* Search Button */}
      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={loading}
        data-search-trigger
      >
        {loading ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
            Searching...
          </>
        ) : (
          <>
            Search Flights →
          </>
        )}
      </Button>
    </form>
  );
}