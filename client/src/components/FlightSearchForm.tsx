// client/src/components/FlightSearchForm.tsx
// COMPLETE - With comprehensive input validation and error messages

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plane, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";
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

interface ValidationErrors {
  origin?: string;
  destination?: string;
  departDate?: string;
  returnDate?: string;
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
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showErrors, setShowErrors] = useState(false);

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

  // Clear error when field is updated
  useEffect(() => {
    if (origin && errors.origin) {
      setErrors(prev => ({ ...prev, origin: undefined }));
    }
  }, [origin]);

  useEffect(() => {
    if (destination && errors.destination) {
      setErrors(prev => ({ ...prev, destination: undefined }));
    }
  }, [destination]);

  useEffect(() => {
    if (departDate && errors.departDate) {
      setErrors(prev => ({ ...prev, departDate: undefined }));
    }
  }, [departDate]);

  useEffect(() => {
    if (returnDate && errors.returnDate) {
      setErrors(prev => ({ ...prev, returnDate: undefined }));
    }
  }, [returnDate]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Validate origin
    if (!origin || origin.trim() === "") {
      newErrors.origin = "Please enter departure city or airport code";
    } else if (origin.trim().length < 2) {
      newErrors.origin = "Origin must be at least 2 characters";
    }

    // Validate destination
    if (!destination || destination.trim() === "") {
      newErrors.destination = "Please enter arrival city or airport code";
    } else if (destination.trim().length < 2) {
      newErrors.destination = "Destination must be at least 2 characters";
    }

    // Validate same origin and destination
    if (origin && destination && origin.toUpperCase() === destination.toUpperCase()) {
      newErrors.origin = "Origin and destination cannot be the same";
      newErrors.destination = "Origin and destination cannot be the same";
    }

    // Validate departure date
    if (!departDate) {
      newErrors.departDate = "Please select a departure date";
    }

    // Validate return date for round trip
    if (tripType === "round-trip") {
      if (!returnDate) {
        newErrors.returnDate = "Please select a return date for round trip";
      } else if (departDate && returnDate < departDate) {
        newErrors.returnDate = "Return date cannot be before departure date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrors(true);

    // Validate form
    if (!validateForm()) {
      // Show first error message
      const firstError = Object.values(errors).find(err => err);
      if (firstError) {
        onSearchError?.(firstError);
      }
      return;
    }

    setLoading(true);
    onSearchStart?.();

    try {
      const searchParams = {
        origin: origin.toUpperCase().trim(),
        destination: destination.toUpperCase().trim(),
        departDate: format(departDate!, "yyyy-MM-dd"),
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
      
      // Clear errors on success
      setErrors({});
      setShowErrors(false);
    } catch (error: any) {
      console.error("Search error:", error);
      onSearchError?.(error.message || "Failed to search flights. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const hasAnyError = Object.keys(errors).length > 0;

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

      {/* Error Alert */}
      {showErrors && hasAnyError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please fix the following errors:
            <ul className="list-disc list-inside mt-2 space-y-1">
              {errors.origin && <li>{errors.origin}</li>}
              {errors.destination && <li>{errors.destination}</li>}
              {errors.departDate && <li>{errors.departDate}</li>}
              {errors.returnDate && <li>{errors.returnDate}</li>}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* From and To */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="origin" className="text-sm font-medium">
            From <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Plane className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
            <input
              id="origin"
              type="text"
              placeholder="Delhi, Mumbai, or DEL"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className={cn(
                "flex h-10 w-full rounded-md border bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                showErrors && errors.origin
                  ? "border-red-500 focus-visible:ring-red-500"
                  : "border-input"
              )}
            />
          </div>
          {showErrors && errors.origin && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.origin}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="destination" className="text-sm font-medium">
            To <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Plane className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rotate-90 pointer-events-none z-10" />
            <input
              id="destination"
              type="text"
              placeholder="Delhi, Mumbai, or BOM"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className={cn(
                "flex h-10 w-full rounded-md border bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                showErrors && errors.destination
                  ? "border-red-500 focus-visible:ring-red-500"
                  : "border-input"
              )}
            />
          </div>
          {showErrors && errors.destination && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.destination}
            </p>
          )}
        </div>
      </div>

      {/* Dates with Better Picker */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Departure <span className="text-red-500">*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !departDate && "text-muted-foreground",
                  showErrors && errors.departDate && "border-red-500"
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
          {showErrors && errors.departDate && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.departDate}
            </p>
          )}
        </div>

        {tripType === "round-trip" && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Return <span className="text-red-500">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !returnDate && "text-muted-foreground",
                    showErrors && errors.returnDate && "border-red-500"
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
            {showErrors && errors.returnDate && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.returnDate}
              </p>
            )}
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
          <span className="text-sm text-muted-foreground">
            (Max 9 passengers)
          </span>
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

      {/* Helper Text */}
      <p className="text-xs text-muted-foreground text-center">
        <span className="text-red-500">*</span> Required fields
      </p>
    </form>
  );
}