// server/services/amadeusService.ts
import Amadeus from 'amadeus';

// Initialize Amadeus client with proper error handling
const hostname = process.env.AMADEUS_HOSTNAME || (process.env.NODE_ENV === 'production' ? 'production' : 'test');

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_API_KEY || process.env.AMADEUS_CLIENT_ID || '',
  clientSecret: process.env.AMADEUS_API_SECRET || process.env.AMADEUS_CLIENT_SECRET || '',
  hostname: hostname as 'production' | 'test'
});

// Verify Amadeus configuration on startup
console.log('🔧 Amadeus Configuration:', {
  clientId: (process.env.AMADEUS_API_KEY || process.env.AMADEUS_CLIENT_ID) ? '✓ Set' : '✗ Missing',
  clientSecret: (process.env.AMADEUS_API_SECRET || process.env.AMADEUS_CLIENT_SECRET) ? '✓ Set' : '✗ Missing',
  hostname: hostname,
  environment: process.env.NODE_ENV || 'development'
});

// ==========================================
// INTERFACES
// ==========================================

interface FlightSearchParams {
  origin: string;
  destination: string;
  departDate: string;
  returnDate?: string;
  passengers: number;
  maxResults?: number;
}

interface FlightOffer {
  id: string;
  airline: string;
  airlineLogo?: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departTime: string;
  arriveTime: string;
  departDate: string;
  arriveDate: string;
  duration: string;
  stops: number;
  price: number;
  currency: string;
  aircraft: string;
  baggage?: string;
  bookingUrl: string;
  cabinClass: string;
  segments: FlightSegment[];
  numberOfBookableSeats?: number;
  validatingAirlineCodes?: string[];
}

interface FlightSegment {
  departure: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  arrival: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  carrierCode: string;
  number: string;
  aircraft: {
    code: string;
  };
  duration: string;
  operatingCarrierCode?: string;
}

// ==========================================
// MAIN SEARCH FUNCTION
// ==========================================

/**
 * Search flights using Amadeus API
 */
export async function searchFlights(params: FlightSearchParams): Promise<FlightOffer[]> {
  try {
    const { 
      origin, 
      destination, 
      departDate, 
      returnDate, 
      passengers, 
      maxResults = 50 // Increased for better results
    } = params;

    // Validate inputs
    if (!origin || !destination || !departDate) {
      throw new Error('Missing required parameters: origin, destination, and departDate');
    }

    const searchParams = {
      originLocationCode: origin.toUpperCase(),
      destinationLocationCode: destination.toUpperCase(),
      departureDate: departDate,
      adults: passengers.toString(),
      max: maxResults.toString(),
      currencyCode: 'INR',
      ...(returnDate && { returnDate })
    };

    console.log("🔍 Amadeus Flight Search Request:", searchParams);

    // Call Amadeus Flight Offers Search API
    const response = await amadeus.shopping.flightOffersSearch.get(searchParams);

    console.log("✅ Amadeus API Response:", {
      status: 'success',
      flightCount: response.data?.length || 0,
      hasData: !!response.data
    });

    const flightOffers = response.data;
    // Access dictionaries from response.result if available
    const dictionaries = (response as any).result?.dictionaries;
    
    if (!flightOffers || flightOffers.length === 0) {
      console.warn("⚠️ No flights found for this route and date");
      return [];
    }

    // Transform Amadeus response to our format
    const transformedFlights: FlightOffer[] = flightOffers
      .map((offer: any) => {
        try {
          return transformFlightOffer(offer, dictionaries);
        } catch (error) {
          console.error('Error transforming flight offer:', error);
          return null;
        }
      })
      .filter((flight): flight is FlightOffer => flight !== null)
      .sort((a, b) => a.price - b.price); // Sort by price

    console.log("📊 Transformed Flights:", {
      total: transformedFlights.length,
      priceRange: transformedFlights.length > 0 ? {
        min: transformedFlights[0].price,
        max: transformedFlights[transformedFlights.length - 1].price,
        currency: transformedFlights[0].currency
      } : null
    });

    return transformedFlights;

  } catch (error: any) {
    console.error("❌ Amadeus API Error:", {
      message: error.message,
      description: error.description,
      code: error.code,
      statusCode: error.response?.statusCode,
      body: error.response?.body
    });

    // Return user-friendly error message
    if (error.response?.body?.errors) {
      const amadeusError = error.response.body.errors[0];
      throw new Error(
        amadeusError.detail || 
        amadeusError.title || 
        `Amadeus API error: ${error.message}`
      );
    }

    throw new Error(`Flight search failed: ${error.message}`);
  }
}

// ==========================================
// FLIGHT OFFER TRANSFORMATION
// ==========================================

/**
 * Transform a single Amadeus flight offer to our format
 */
function transformFlightOffer(offer: any, dictionaries?: any): FlightOffer {
  const itinerary = offer.itineraries[0]; // Get first itinerary (outbound)
  const firstSegment = itinerary.segments[0];
  const lastSegment = itinerary.segments[itinerary.segments.length - 1];
  
  // Calculate total stops
  const stops = itinerary.segments.length - 1;
  
  // Get airline info - use dictionaries if available, fallback to helper function
  const airlineCode = firstSegment.carrierCode;
  const airlineName = dictionaries?.carriers?.[airlineCode] || getAirlineName(airlineCode);
  
  // Get aircraft info
  const aircraftCode = firstSegment.aircraft?.code;
  const aircraftName = dictionaries?.aircraft?.[aircraftCode] || getAircraftName(aircraftCode);
  
  // Format times and dates
  const departTime = formatTime(firstSegment.departure.at);
  const arriveTime = formatTime(lastSegment.arrival.at);
  const departDate = formatDate(firstSegment.departure.at);
  const arriveDate = formatDate(lastSegment.arrival.at);
  
  // Calculate duration
  const duration = formatDuration(itinerary.duration);
  
  // Get price
  const price = Math.round(parseFloat(offer.price.total));
  const currency = offer.price.currency;
  
  // Get baggage info
  const baggage = getBaggageInfo(offer.travelerPricings?.[0]);
  
  // Get cabin class
  const cabinClass = offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin || 'ECONOMY';
  
  // Generate booking URL
  const bookingUrl = generateAffiliateLink(offer.id, firstSegment.departure.iataCode, lastSegment.arrival.iataCode);
  
  return {
    id: offer.id,
    airline: airlineName,
    airlineLogo: getAirlineLogo(airlineCode),
    flightNumber: `${airlineCode} ${firstSegment.number}`,
    origin: firstSegment.departure.iataCode,
    destination: lastSegment.arrival.iataCode,
    departTime,
    arriveTime,
    departDate,
    arriveDate,
    duration,
    stops,
    price,
    currency,
    aircraft: aircraftName,
    baggage,
    bookingUrl,
    cabinClass,
    segments: itinerary.segments.map((seg: any) => ({
      departure: {
        iataCode: seg.departure.iataCode,
        terminal: seg.departure.terminal,
        at: seg.departure.at
      },
      arrival: {
        iataCode: seg.arrival.iataCode,
        terminal: seg.arrival.terminal,
        at: seg.arrival.at
      },
      carrierCode: seg.carrierCode,
      number: seg.number,
      aircraft: {
        code: seg.aircraft?.code || 'N/A'
      },
      duration: formatDuration(seg.duration),
      operatingCarrierCode: seg.operating?.carrierCode
    })),
    numberOfBookableSeats: offer.numberOfBookableSeats,
    validatingAirlineCodes: offer.validatingAirlineCodes
  };
}

// ==========================================
// ADDITIONAL API FUNCTIONS
// ==========================================

/**
 * Get specific flight offer details for pricing confirmation
 */
export async function getFlightOfferPricing(offerId: string): Promise<any> {
  try {
    console.log('💰 Getting flight offer pricing for:', offerId);
    
    const response = await amadeus.shopping.flightOffers.pricing.post(
      JSON.stringify({
        data: {
          type: 'flight-offers-pricing',
          flightOffers: [{ id: offerId }]
        }
      })
    );
    
    console.log('✅ Flight pricing retrieved successfully');
    return response.data;
  } catch (error: any) {
    console.error("❌ Get flight offer pricing error:", error);
    throw new Error(`Failed to get flight pricing: ${error.message}`);
  }
}

/**
 * Search airports by city name or IATA code
 */
export async function searchAirports(keyword: string): Promise<any[]> {
  try {
    console.log('🔍 Searching airports for:', keyword);
    
    const response = await amadeus.referenceData.locations.get({
      keyword: keyword,
      subType: 'AIRPORT,CITY'
    });
    
    console.log('✅ Found airports:', response.data?.length || 0);
    return response.data || [];
  } catch (error: any) {
    console.error("❌ Airport search error:", error);
    throw new Error(`Airport search failed: ${error.message}`);
  }
}

/**
 * Get airport details by IATA code
 */
export async function getAirportByCode(iataCode: string): Promise<any> {
  try {
    const response = await amadeus.referenceData.locations.get({
      keyword: iataCode,
      subType: 'AIRPORT'
    });
    
    return response.data?.[0];
  } catch (error: any) {
    console.error("❌ Get airport error:", error);
    throw new Error(`Failed to get airport: ${error.message}`);
  }
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Get airline name from code
 */
function getAirlineName(code: string): string {
  const airlines: Record<string, string> = {
    // Indian Airlines
    'AI': 'Air India',
    '6E': 'IndiGo',
    'SG': 'SpiceJet',
    'UK': 'Vistara',
    'G8': 'Go First',
    'I5': 'Air Asia India',
    'QP': 'Akasa Air',
    // International Airlines
    'EK': 'Emirates',
    'QR': 'Qatar Airways',
    'BA': 'British Airways',
    'LH': 'Lufthansa',
    'AF': 'Air France',
    'KL': 'KLM',
    'SQ': 'Singapore Airlines',
    'TK': 'Turkish Airlines',
    'EY': 'Etihad Airways',
    'TG': 'Thai Airways',
    'CX': 'Cathay Pacific',
    'JL': 'Japan Airlines',
    'NH': 'ANA',
    'DL': 'Delta Air Lines',
    'AA': 'American Airlines',
    'UA': 'United Airlines'
  };
  
  return airlines[code] || code;
}

/**
 * Get airline logo URL
 */
function getAirlineLogo(code: string): string {
  // Using reliable CDN for airline logos
  return `https://images.kiwi.com/airlines/64/${code}.png`;
}

/**
 * Get aircraft name from code
 */
function getAircraftName(code: string): string {
  const aircraft: Record<string, string> = {
    // Airbus
    '319': 'Airbus A319',
    '320': 'Airbus A320',
    '321': 'Airbus A321',
    '32N': 'Airbus A320neo',
    '32Q': 'Airbus A321neo',
    '332': 'Airbus A330-200',
    '333': 'Airbus A330-300',
    '359': 'Airbus A350-900',
    '388': 'Airbus A380',
    // Boeing
    '737': 'Boeing 737',
    '738': 'Boeing 737-800',
    '73H': 'Boeing 737-800',
    '73J': 'Boeing 737-900',
    '7M8': 'Boeing 737 MAX 8',
    '7M9': 'Boeing 737 MAX 9',
    '763': 'Boeing 767-300',
    '772': 'Boeing 777-200',
    '773': 'Boeing 777-300',
    '77W': 'Boeing 777-300ER',
    '787': 'Boeing 787',
    '788': 'Boeing 787-8',
    '789': 'Boeing 787-9',
    '78J': 'Boeing 787-10',
    // ATR
    'AT7': 'ATR 72',
    'AT5': 'ATR 42',
    // Bombardier
    'CR9': 'Bombardier CRJ-900',
    'CRJ': 'Bombardier CRJ',
    // Embraer
    'E90': 'Embraer E190',
    'E95': 'Embraer E195'
  };
  
  return aircraft[code] || `Aircraft ${code}`;
}

/**
 * Format time from ISO string (24-hour format)
 */
function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
}

/**
 * Format date from ISO string
 */
function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Format duration from ISO 8601 duration (PT2H15M)
 */
function formatDuration(duration: string): string {
  const hours = duration.match(/(\d+)H/)?.[1];
  const minutes = duration.match(/(\d+)M/)?.[1];
  
  if (hours && minutes) {
    return `${hours}h ${minutes}m`;
  } else if (hours) {
    return `${hours}h`;
  } else if (minutes) {
    return `${minutes}m`;
  }
  
  return duration.replace('PT', '');
}

/**
 * Get baggage information
 */
function getBaggageInfo(travelerPricing: any): string {
  try {
    const baggageInfo = travelerPricing?.fareDetailsBySegment?.[0]?.includedCheckedBags;
    
    if (!baggageInfo) {
      return '1 piece'; // Default
    }
    
    if (baggageInfo.quantity) {
      return `${baggageInfo.quantity} piece${baggageInfo.quantity > 1 ? 's' : ''}`;
    }
    
    if (baggageInfo.weight) {
      return `${baggageInfo.weight} ${baggageInfo.weightUnit || 'kg'}`;
    }
    
    return '1 piece';
  } catch (error) {
    return '1 piece';
  }
}

/**
 * Generate affiliate booking link
 * Replace with your actual affiliate program
 */
function generateAffiliateLink(offerId: string, origin: string, destination: string): string {
  const affiliateId = process.env.AFFILIATE_ID || 'skailinker';
  
  // Option 1: Skyscanner affiliate link
  const skyscannerUrl = `https://www.skyscanner.co.in/transport/flights/${origin.toLowerCase()}/${destination.toLowerCase()}?associateid=${affiliateId}`;
  
  // Option 2: Google Flights (no direct affiliate)
  // const googleFlightsUrl = `https://www.google.com/travel/flights/search?q=flights%20from%20${origin}%20to%20${destination}`;
  
  // Option 3: Your own booking page with offer ID
  // const bookingUrl = `${process.env.BASE_URL}/book?offer=${offerId}`;
  
  return skyscannerUrl;
}

/**
 * Test Amadeus connection
 */
export async function testAmadeusConnection(): Promise<boolean> {
  try {
    console.log('🧪 Testing Amadeus connection...');
    
    const response = await amadeus.referenceData.locations.get({
      keyword: 'DEL',
      subType: 'AIRPORT'
    });
    
    console.log('✅ Amadeus connection successful');
    return true;
  } catch (error: any) {
    console.error('❌ Amadeus connection failed:', error.message);
    return false;
  }
}

export default {
  searchFlights,
  getFlightOfferPricing,
  searchAirports,
  getAirportByCode,
  testAmadeusConnection
};