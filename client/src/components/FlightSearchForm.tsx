import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Plane, Users, ArrowRight } from "lucide-react";
import { format } from "date-fns";

interface FlightSearchFormProps {
  onSearch?: (params: {
    origin: string;
    destination: string;
    departDate: Date | undefined;
    returnDate: Date | undefined;
    passengers: number;
    tripType: "one-way" | "round-trip";
  }) => void;
}

export default function FlightSearchForm({ onSearch }: FlightSearchFormProps) {
  const [tripType, setTripType] = useState<"one-way" | "round-trip">("round-trip");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departDate, setDepartDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [passengers, setPassengers] = useState(1);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    try {
      // Validation
      if (!origin || !destination) {
        alert("Please enter origin and destination");
        return;
      }

      if (!departDate) {
        alert("Please select a departure date");
        return;
      }

      if (tripType === "round-trip" && !returnDate) {
        alert("Please select a return date for round-trip");
        return;
      }

      setIsSearching(true);

      // Prepare search params
      const searchParams = {
        origin: origin.trim().toUpperCase(),
        destination: destination.trim().toUpperCase(),
        departDate: format(departDate, 'yyyy-MM-dd'),
        returnDate: tripType === "round-trip" && returnDate 
          ? format(returnDate, 'yyyy-MM-dd') 
          : undefined,
        passengers,
        tripType
      };

      console.log("🔍 Searching flights with:", searchParams);

      // Call API
      const response = await fetch('/api/flights/search', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(searchParams)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Search failed');
      }

      console.log("✅ Flight results:", data);

      // Call parent callback
      if (onSearch) {
        onSearch({
          origin,
          destination,
          departDate,
          returnDate: tripType === "round-trip" ? returnDate : undefined,
          passengers,
          tripType
        });
      }

      // TODO: Navigate to results page or show results
      // For now, show alert with count
      alert(`Found ${data.count} flights! Check console for details.`);

    } catch (error: any) {
      console.error('❌ Search failed:', error);
      alert(`Search failed: ${error.message}`);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Card className="backdrop-blur-xl bg-card/95 border-card-border p-6 rounded-2xl shadow-2xl shadow-black/20 hover:shadow-3xl transition-shadow duration-300">
      <div className="flex gap-4 mb-6">
        <Button
          type="button"
          variant={tripType === "one-way" ? "default" : "outline"}
          onClick={() => setTripType("one-way")}
          data-testid="button-one-way"
          className="flex-1"
        >
          One-Way
        </Button>
        <Button
          type="button"
          variant={tripType === "round-trip" ? "default" : "outline"}
          onClick={() => setTripType("round-trip")}
          data-testid="button-round-trip"
          className="flex-1"
        >
          Round-Trip
        </Button>
      </div>
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${tripType === "one-way" ? "lg:grid-cols-4" : "lg:grid-cols-5"}`}>
        <div className="space-y-2">
          <Label htmlFor="origin" className="text-sm font-medium">From</Label>
          <div className="relative">
            <Plane className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="origin"
              data-testid="input-origin"
              placeholder="Delhi (DEL)"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="destination" className="text-sm font-medium">To</Label>
          <div className="relative">
            <Plane className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rotate-90" />
            <Input
              id="destination"
              data-testid="input-destination"
              placeholder="Mumbai (BOM)"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Departure</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                data-testid="button-depart-date"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {departDate ? format(departDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={departDate}
                onSelect={setDepartDate}
                initialFocus
                disabled={(date) => date < new Date()}
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
                  data-testid="button-return-date"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {returnDate ? format(returnDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={returnDate}
                  onSelect={setReturnDate}
                  initialFocus
                  disabled={(date) => departDate ? date < departDate : date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="passengers" className="text-sm font-medium">Passengers</Label>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              data-testid="button-decrease-passengers"
              onClick={() => setPassengers(Math.max(1, passengers - 1))}
            >
              -
            </Button>
            <div className="flex-1 flex items-center justify-center gap-2 border rounded-md h-9 px-3">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span data-testid="text-passenger-count">{passengers}</span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              data-testid="button-increase-passengers"
              onClick={() => setPassengers(Math.min(9, passengers + 1))}
            >
              +
            </Button>
          </div>
        </div>
      </div>

      <Button
        onClick={handleSearch}
        data-testid="button-search-flights"
        className="w-full mt-6 bg-primary hover:bg-primary/90"
        size="lg"
        disabled={isSearching}
      >
        {isSearching ? "Searching..." : "Search Flights"}
        {!isSearching && <ArrowRight className="ml-2 h-4 w-4" />}
      </Button>
    </Card>
  );
}