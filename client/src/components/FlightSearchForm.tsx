// client/src/components/FlightSearchForm.tsx
import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Plane, Users, ArrowRight, Loader2 } from "lucide-react";
import { format } from "date-fns";
import FlightResultsModal from "./FlightResultsModal";

interface Airport {
  iataCode: string;
  name: string;
  cityName: string;
  countryName: string;
}

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
  
  // Autocomplete states
  const [originSuggestions, setOriginSuggestions] = useState<Airport[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<Airport[]>([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [isLoadingOrigin, setIsLoadingOrigin] = useState(false);
  const [isLoadingDestination, setIsLoadingDestination] = useState(false);
  
  // Modal state
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [flightResults, setFlightResults] = useState<any[]>([]);
  const [searchedParams, setSearchedParams] = useState<any>(null);
  const [apiEnvironment, setApiEnvironment] = useState<string>('test');
  const [apiSource, setApiSource] = useState<string>('amadeus_api');
  
  // Validation state
  const [validationError, setValidationError] = useState<string>("");
  
  const originRef = useRef<HTMLDivElement>(null);
  const destinationRef = useRef<HTMLDivElement>(null);

  // Debug modal state
  useEffect(() => {
    console.log("🎭 Modal state:", { 
      showResultsModal, 
      flightsCount: flightResults.length,
      environment: apiEnvironment,
      source: apiSource
    });
  }, [showResultsModal, flightResults, apiEnvironment, apiSource]);

  // Debounced airport search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (origin.length >= 2) {
        searchAirports(origin, 'origin');
      } else {
        setOriginSuggestions([]