import Amadeus from 'amadeus';

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_API_KEY || '',
  clientSecret: process.env.AMADEUS_API_SECRET || '',
  hostname: process.env.NODE_ENV === 'production' ? 'production' : 'test'
});

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
  duration: string;
  stops: number;
  price: number;
  currency: string;
  aircraft: string;
  baggage?: string;
  bookingUrl: string;
  cabinClass: string;
  segments: FlightSegment[];
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
}

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
      maxResults = 20 
    } = params;

    // Call Amadeus Flight Offers Search API
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: origin.toUpperCase(),
      destinationLocationCode: destination.toUpperCase(),
      departureDate: departDate,
      returnDate: returnDate || undefined,
      adults: passengers.toString(),
      max: maxResults.toString(),
      currencyCode: 'INR'
    });

    const flightOffers = response.data;
    
    // Transform Amadeus response to our format
    const transformedFlights: FlightOffer[] = flightOffers.map((offer: any) => {
      const firstSegment = offer.itineraries[0].segments[0];
      const lastSegment = offer.itineraries[0].segments[offer.itineraries[0].segments.length - 1];
      
      // Calculate total stops
      const stops = offer.itineraries[0].segments.length - 1;
      
      // Get airline info
      const airlineCode = firstSegment.carrierCode;
      const airlineName = getAirlineName(airlineCode);
      
      // Format times
      const departTime = formatTime(firstSegment.departure.at);
      const arriveTime = formatTime(lastSegment.arrival.at);
      
      // Calculate duration
      const duration = formatDuration(offer.itineraries[0].duration);
      
      // Get price
      const price = parseFloat(offer.price.total);
      
      // Generate booking URL (affiliate link)
      const bookingUrl = generateAffiliateLink(offer.id, origin, destination);
      
      return {
        id: offer.id,
        airline: airlineName,
        airlineLogo: getAirlineLogo(airlineCode),
        flightNumber: `${airlineCode} ${firstSegment.number}`,
        origin: firstSegment.departure.iataCode,
        destination: lastSegment.arrival.iataCode,
        departTime,
        arriveTime,
        duration,
        stops,
        price: Math.round(price),
        currency: offer.price.currency,
        aircraft: getAircraftName(firstSegment.aircraft.code),
        baggage: offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.includedCheckedBags?.quantity 
          ? `${offer.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.quantity * 23} kg`
          : '15 kg',
        bookingUrl,
        cabinClass: offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin || 'ECONOMY',
        segments: offer.itineraries[0].segments
      };
    });

    return transformedFlights;

  } catch (error: any) {
    console.error("Amadeus API Error:", error.response?.data || error.message);
    throw new Error(`Flight search failed: ${error.message}`);
  }
}

/**
 * Get specific flight offer details
 */
export async function getFlightOffers(offerId: string): Promise<any> {
  try {
    const response = await amadeus.shopping.flightOffers.pricing.post(
      JSON.stringify({
        data: {
          type: 'flight-offers-pricing',
          flightOffers: [{ id: offerId }]
        }
      })
    );
    
    return response.data;
  } catch (error: any) {
    console.error("Get flight offer error:", error);
    throw new Error(`Failed to get flight offer: ${error.message}`);
  }
}

/**
 * Search airports by city name
 */
export async function getAirportByCity(city: string): Promise<any[]> {
  try {
    const response = await amadeus.referenceData.locations.get({
      keyword: city,
      subType: 'CITY,AIRPORT'
    });
    
    return response.data;
  } catch (error: any) {
    console.error("Airport search error:", error);
    throw new Error(`Airport search failed: ${error.message}`);
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
    'AI': 'Air India',
    '6E': 'IndiGo',
    'SG': 'SpiceJet',
    'UK': 'Vistara',
    'G8': 'Go First',
    'I5': 'Air Asia India',
    'QP': 'Akasa Air',
    'EK': 'Emirates',
    'QR': 'Qatar Airways',
    'BA': 'British Airways',
    'LH': 'Lufthansa',
    'AF': 'Air France',
    'KL': 'KLM',
    'SQ': 'Singapore Airlines',
    'TK': 'Turkish Airlines'
  };
  
  return airlines[code] || code;
}

/**
 * Get airline logo URL
 */
function getAirlineLogo(code: string): string {
  return `https://images.kiwi.com/airlines/64/${code}.png`;
}

/**
 * Get aircraft name from code
 */
function getAircraftName(code: string): string {
  const aircraft: Record<string, string> = {
    '320': 'Airbus A320',
    '321': 'Airbus A321',
    '32N': 'Airbus A320neo',
    '32Q': 'Airbus A321neo',
    '738': 'Boeing 737-800',
    '73H': 'Boeing 737-800',
    '7M8': 'Boeing 737 MAX 8',
    '77W': 'Boeing 777-300ER',
    '789': 'Boeing 787-9'
  };
  
  return aircraft[code] || `Aircraft ${code}`;
}

/**
 * Format time from ISO string
 */
function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
}

/**
 * Format duration from ISO 8601 duration
 */
function formatDuration(duration: string): string {
  // Duration format: PT2H15M
  const hours = duration.match(/(\d+)H/)?.[1] || '0';
  const minutes = duration.match(/(\d+)M/)?.[1] || '0';
  return `${hours}h ${minutes}m`;
}

/**
 * Generate affiliate booking link
 */
function generateAffiliateLink(offerId: string, origin: string, destination: string): string {
 const affiliateId = process.env.AFFILIATE_ID || 'skailinker';
  return `https://www.skyscanner.co.in/transport/flights/${origin}/${destination}?affiliateid=${affiliateId}&offer=${offerId}`;
}