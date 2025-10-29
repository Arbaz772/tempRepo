// client/src/components/FlightSearchForm.tsx
// UPDATED - Accepts initialValues prop for pre-filling from URL params

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";

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
  const [departDate, setDepartDate] = useState(initialValues?.departDate || "");
  const [returnDate, setReturnDate] = useState(initialValues?.returnDate || "");
  const [passengers, setPassengers] = useState(initialValues?.passengers || 1);
  const [loading, setLoading] = useState(false);

  // Update form when initialValues change
  useEffect(() => {
    if (initialValues) {
      if (initialValues.origin) setOrigin(initialValues.origin);
      if (initialValues.destination) setDestination(initialValues.destination);
      if (initialValues.departDate) setDepartDate(initialValues.departDate);
      if (initialValues.returnDate) setReturnDate(initialValues.returnDate);
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
        departDate,
        returnDate: tripType === "round-trip" ? returnDate : undefined,
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
        <div>
          <Label htmlFor="origin">From</Label>
          <Input
            id="origin"
            placeholder="Delhi, Mumbai, or DEL"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="destination">To</Label>
          <Input
            id="destination"
            placeholder="Delhi, Mumbai, or BOM"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Dates */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="departDate">Departure</Label>
          <div className="relative">
            <Input
              id="departDate"
              type="date"
              value={departDate}
              onChange={(e) => setDepartDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
        {tripType === "round-trip" && (
          <div>
            <Label htmlFor="returnDate">Return</Label>
            <div className="relative">
              <Input
                id="returnDate"
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                min={departDate || new Date().toISOString().split('T')[0]}
                required={tripType === "round-trip"}
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        )}
      </div>

      {/* Passengers */}
      <div>
        <Label htmlFor="passengers">Passengers</Label>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPassengers(Math.max(1, passengers - 1))}
            disabled={passengers <= 1}
          >
            -
          </Button>
          <span className="w-12 text-center font-medium">{passengers}</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
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
        data-search-trigger // For auto-trigger from URL params
      >
        {loading ? "Searching..." : "Search Flights →"}
      </Button>
    </form>
  );
}