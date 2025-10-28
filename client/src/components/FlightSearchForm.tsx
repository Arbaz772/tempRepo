// client/src/components/FlightSearchForm.tsx
// IMPROVED VERSION WITH RETRY LOGIC

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Plane, Users, ArrowRight, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { format } from "date-fns";

interface Airport {
  iataCode: string;
  name: string;
  cityName: string;
  countryName: string;
}

interface FlightSearchFormProps {
  onSearchStart?: () => void;
  onSearchComplete?: (data: {
    flights: any[];
    searchParams: any;
    isMock: boolean;
  }) => void;
  onSearchError?: (error: string) => void;
}

export default function FlightSearchForm({ 
  onSearchStart,
  onSearchComplete,
  onSearchError 
}: FlightSearchFormProps) {
  const [tripType, setTripType] = useState<"one-way" | "round-trip">("round-trip");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departDate, setDepartDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [passengers, setPassengers] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  
  // Autocomplete states
  const [originSuggestions, setOriginSuggestions] = useState<Airport[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<Airport[]>([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [isLoadingOrigin, setIsLoadingOrigin] = useState(false);
  const [isLoadingDestination, setIsLoadingDestination] = useState(false);
  
  // Validation and retry state
  const [validationError, setValidationError] = useState<string>("");
  const [canRetry, setCanRetry] = useState(false);
  const [lastSearchParams, setLastSearchParams] = useState<any>(null);
  
  const originRef = useRef<HTMLDivElement>(null);
  const destinationRef = useRef<HTMLDivElement>(null);

  // Debounced airport search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (origin.length >= 2) {
        searchAirports(origin, 'origin');
      } else {
        setOriginSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [origin]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (destination.length >= 2) {
        searchAirports(destination, 'destination');
      } else {
        setDestinationSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [destination]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (originRef.current && !originRef.current.contains(event.target as Node)) {
        setShowOriginSuggestions(false);
      }
      if (destinationRef.current && !destinationRef.current.contains(event.target as Node)) {
        setShowDestinationSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchAirports = async (query: string, type: 'origin' | 'destination') => {
    try {
      const setLoading = type === 'origin' ? setIsLoadingOrigin : setIsLoadingDestination;
      const setSuggestions = type === 'origin' ? setOriginSuggestions : setDestinationSuggestions;
      
      setLoading(true);
      
      const response = await fetch(`/api/airports/search?city=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        const airports = data.data.map((airport: any) => ({
          iataCode: airport.iataCode,
          name: airport.name,
          cityName: airport.address?.cityName || '',
          countryName: airport.address?.countryName || ''
        }));
        setSuggestions(airports);
      }
    } catch (error) {
      console.error('Airport search error:', error);
    } finally {
      const setLoading = type === 'origin' ? setIsLoadingOrigin : setIsLoadingDestination;
      setLoading(false);
    }
  };

  const selectAirport = (airport: Airport, type: 'origin' | 'destination') => {
    if (type === 'origin') {
      setOrigin(airport.iataCode);
      setShowOriginSuggestions(false);
    } else {
      setDestination(airport.iataCode);
      setShowDestinationSuggestions(false);
    }
  };

  const performSearch = async (searchParams: any) => {
    try {
      setIsSearching(true);
      setCanRetry(false);
      
      if (onSearchStart) {
        onSearchStart();
      }

      console.log("🔍 Searching flights with:", searchParams);

      const response = await fetch('/api/flights/search', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(searchParams)
      });

      // Handle non-JSON responses (like HTML error pages)
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned an invalid response. Please try again.');
      }

      const data = await response.json();

      console.log("📦 API Response:", data);

      // Handle 503 Service Unavailable (Amadeus system errors)
      if (response.status === 503 || data.code === 'AMADEUS_SYSTEM_ERROR') {
        setCanRetry(true);
        setLastSearchParams(searchParams);
        const errorMsg = data.error || "Flight search service is temporarily unavailable. Please try again.";
        setValidationError(errorMsg);
        if (onSearchError) {
          onSearchError(errorMsg);
        }
        setTimeout(() => setValidationError(""), 8000);
        return;
      }

      if (!response.ok) {
        const errorMessage = data.error || data.message || 'Search failed';
        throw new Error(errorMessage);
      }

      console.log("✅ Flight results:", data);

      // Check if we got results
      if (!data.data || data.data.length === 0) {
        const errorMsg = data.message || "😔 No flights found for this route and dates. Try different dates or airports.";
        setValidationError(errorMsg);
        if (onSearchError) {
          onSearchError(errorMsg);
        }
        setTimeout(() => setValidationError(""), 6000);
        return;
      }

      // Notify parent with results
      if (onSearchComplete) {
        onSearchComplete({
          flights: data.data || [],
          searchParams: {
            origin: searchParams.origin,
            destination: searchParams.destination,
            departDate: searchParams.departDate,
            returnDate: searchParams.returnDate,
            passengers: searchParams.passengers
          },
          isMock: data.mock || false
        });
      }
      
      setValidationError("");
      setCanRetry(false);

    } catch (error: any) {
      console.error("❌ Search error:", error);
      
      let errorMessage = "Failed to search flights. ";
      
      if (error.message.includes("invalid response")) {
        errorMessage = "Server error occurred. Please try again in a moment.";
        setCanRetry(true);
        setLastSearchParams(searchParams);
      } else if (error.message.includes("SYSTEM ERROR") || error.message.includes("temporarily unavailable")) {
        errorMessage = "Flight search service is temporarily down. Please try again.";
        setCanRetry(true);
        setLastSearchParams(searchParams);
      } else if (error.message.includes("No flights found")) {
        errorMessage = "😔 No flights found for this route and dates. Try different dates or airports.";
      } else if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
        errorMessage = "Network error. Please check your connection and try again.";
        setCanRetry(true);
        setLastSearchParams(searchParams);
      } else {
        errorMessage += error.message || "Please try again.";
      }
      
      setValidationError(errorMessage);
      if (onSearchError) {
        onSearchError(errorMessage);
      }
      setTimeout(() => setValidationError(""), 10000);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = async () => {
    // Clear previous errors
    setValidationError("");

    // Validation
    if (!origin || !destination) {
      setValidationError("✈️ Please enter both origin and destination airports");
      setTimeout(() => setValidationError(""), 4000);
      return;
    }

    if (!departDate) {
      setValidationError("📅 Please select a departure date");
      setTimeout(() => setValidationError(""), 4000);
      return;
    }

    if (tripType === "round-trip" && !returnDate) {
      setValidationError("🔄 Please select a return date for round-trip");
      setTimeout(() => setValidationError(""), 4000);
      return;
    }

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

    await performSearch(searchParams);
  };

  const handleRetry = () => {
    if (lastSearchParams) {
      performSearch(lastSearchParams);
    }
  };

  return (
    <Card className="p-6 bg-card shadow-lg">
      {/* TRIP TYPE SELECTOR */}
      <div className="flex gap-4 mb-6">
        <Button
          variant={tripType === "round-trip" ? "default" : "outline"}
          onClick={() => setTripType("round-trip")}
          className="flex-1"
        >
          Round Trip
        </Button>
        <Button
          variant={tripType === "one-way" ? "default" : "outline"}
          onClick={() => setTripType("one-way")}
          className="flex-1"
        >
          One Way
        </Button>
      </div>

      {/* VALIDATION ERROR DISPLAY */}
      {validationError && (
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-destructive font-medium">{validationError}</p>
              {canRetry && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3"
                  onClick={handleRetry}
                  disabled={isSearching}
                >
                  <RefreshCw className="h-3 w-3 mr-2" />
                  Retry Search
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ORIGIN INPUT WITH AUTOCOMPLETE */}
        <div className="space-y-2 relative" ref={originRef}>
          <Label htmlFor="origin" className="text-sm font-medium">From</Label>
          <div className="relative">
            <Plane className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            <Input
              id="origin"
              placeholder="Delhi, Mumbai, or DEL"
              value={origin}
              onChange={(e) => {
                setOrigin(e.target.value);
                setShowOriginSuggestions(true);
              }}
              onFocus={() => origin.length >= 2 && setShowOriginSuggestions(true)}
              className="pl-10 pr-10"
            />
            {isLoadingOrigin && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
          
          {showOriginSuggestions && originSuggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto">
              {originSuggestions.map((airport) => (
                <button
                  key={airport.iataCode}
                  type="button"
                  onClick={() => selectAirport(airport, 'origin')}
                  className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-start gap-3 border-b last:border-b-0"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded bg-primary/10 text-primary font-bold text-sm flex-shrink-0">
                    {airport.iataCode}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{airport.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {airport.cityName}, {airport.countryName}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* DESTINATION INPUT WITH AUTOCOMPLETE */}
        <div className="space-y-2 relative" ref={destinationRef}>
          <Label htmlFor="destination" className="text-sm font-medium">To</Label>
          <div className="relative">
            <Plane className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rotate-90 z-10" />
            <Input
              id="destination"
              placeholder="Delhi, Mumbai, or BOM"
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setShowDestinationSuggestions(true);
              }}
              onFocus={() => destination.length >= 2 && setShowDestinationSuggestions(true)}
              className="pl-10 pr-10"
            />
            {isLoadingDestination && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
          
          {showDestinationSuggestions && destinationSuggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto">
              {destinationSuggestions.map((airport) => (
                <button
                  key={airport.iataCode}
                  type="button"
                  onClick={() => selectAirport(airport, 'destination')}
                  className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-start gap-3 border-b last:border-b-0"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded bg-primary/10 text-primary font-bold text-sm flex-shrink-0">
                    {airport.iataCode}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{airport.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {airport.cityName}, {airport.countryName}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* DEPARTURE DATE */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Departure</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
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

        {/* RETURN DATE */}
        {tripType === "round-trip" && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Return</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
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

        {/* PASSENGERS */}
        <div className="space-y-2">
          <Label htmlFor="passengers" className="text-sm font-medium">Passengers</Label>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setPassengers(Math.max(1, passengers - 1))}
            >
              -
            </Button>
            <div className="flex-1 flex items-center justify-center gap-2 border rounded-md h-9 px-3">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{passengers}</span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setPassengers(Math.min(9, passengers + 1))}
            >
              +
            </Button>
          </div>
        </div>
      </div>

      <Button
        onClick={handleSearch}
        className="w-full mt-6 bg-primary hover:bg-primary/90"
        size="lg"
        disabled={isSearching}
      >
        {isSearching ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Searching...
          </>
        ) : (
          <>
            Search Flights
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </Card>
  );
}