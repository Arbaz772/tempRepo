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
  }) => void;
}

export default function FlightSearchForm({ onSearch }: FlightSearchFormProps) {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departDate, setDepartDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [passengers, setPassengers] = useState(1);

  const handleSearch = () => {
    onSearch?.({ origin, destination, departDate, returnDate, passengers });
    console.log("Search triggered", { origin, destination, departDate, returnDate, passengers });
  };

  return (
    <Card className="backdrop-blur-xl bg-card/95 border-card-border p-6 rounded-2xl shadow-2xl shadow-black/20 hover:shadow-3xl transition-shadow duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
              />
            </PopoverContent>
          </Popover>
        </div>

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
              />
            </PopoverContent>
          </Popover>
        </div>

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
      >
        Search Flights
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </Card>
  );
}
