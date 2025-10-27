// server/routes.ts
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from './storage.js';
import { 
  searchFlights, 
  getFlightOffers, 
  getAirportByCity 
} from './services/amadeusService.js';

export async function registerRoutes(app: Express): Promise<Server> {
  
  // ==========================================
  // HEALTH CHECK
  // ==========================================
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok",
      hasAmadeusKey: !!process.env.AMADEUS_API_KEY,
      hasAmadeusSecret: !!process.env.AMADEUS_API_SECRET,
      nodeEnv: process.env.NODE_ENV
    });
  });

  // ==========================================
  // AIRPORT SEARCH ENDPOINT
  // ==========================================
  app.get("/api/airports/search", async (req, res) => {
    try {
      const { city } = req.query;
      
      console.log("🔍 Airport search request:", { city });
      
      if (!city || typeof city !== 'string') {
        return res.status(400).json({ 
          success: false,
          error: "City parameter is required",
          data: []
        });
      }

      if (city.length < 2) {
        return res.status(400).json({ 
          success: false,
          error: "City name must be at least 2 characters",
          data: []
        });
      }

      try {
        const airports = await getAirportByCity(city);
        console.log(`✅ Found ${airports.length} airports for "${city}"`);
        
        return res.json({
          success: true,
          data: airports || [],
          count: airports?.length || 0
        });
      } catch (amadeusError: any) {
        console.warn("⚠️ Amadeus failed, using fallback", amadeusError.message);
        const fallbackAirports = getFallbackAirports(city);
        
        return res.json({
          success: true,
          data: fallbackAirports,
          count: fallbackAirports.length,
          fallback: true
        });
      }

    } catch (error: any) {
      console.error("❌ Airport search error:", error);
      const fallbackAirports = getFallbackAirports(req.query.city as string || '');
      
      res.json({ 
        success: true,
        data: fallbackAirports,
        count: fallbackAirports.length,
        fallback: true
      });
    }
  });

  // ==========================================
  // FLIGHT SEARCH ENDPOINT
  // ==========================================
  app.post("/api/flights/search", async (req, res) => {
    try {
      const { 
        origin, 
        destination, 
        departDate, 
        returnDate, 
        passengers = 1,
        tripType = "round-trip",
        maxResults = 20 
      } = req.body;

      console.log("📥 Flight search request:", req.body);

      if (!origin || !destination || !departDate) {
        return res.status(400).json({ 
          success: false,
          error: "Missing required fields",
          message: "Please provide origin, destination, and departure date" 
        });
      }

      const flights = await searchFlights({
        origin,
        destination,
        departDate,
        returnDate: tripType === "round-trip" ? returnDate : undefined,
        passengers,
        maxResults
      });

      console.log(`✅ Found ${flights.length} flights`);

      res.json({
        success: true,
        data: flights,
        count: flights.length
      });

    } catch (error: any) {
      console.error("❌ Flight search error:", error);
      res.status(500).json({ 
        success: false,
        error: error.message || "Failed to search flights",
        message: error.message
      });
    }
  });

  // ==========================================
  // GET FLIGHT OFFER DETAILS
  // ==========================================
  app.get("/api/flights/offer/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const offer = await getFlightOffers(id);
      
      res.json({
        success: true,
        data: offer
      });

    } catch (error: any) {
      console.error("❌ Get flight offer error:", error);
      res.status(500).json({ 
        success: false,
        error: error.message || "Failed to get flight offer",
        message: error.message
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// ==========================================
// FALLBACK AIRPORTS
// ==========================================
function getFallbackAirports(query: string): any[] {
  const airports = [
    { iataCode: 'DEL', name: 'Indira Gandhi International Airport', address: { cityName: 'Delhi', countryName: 'India' } },
    { iataCode: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', address: { cityName: 'Mumbai', countryName: 'India' } },
    { iataCode: 'BLR', name: 'Kempegowda International Airport', address: { cityName: 'Bangalore', countryName: 'India' } },
    { iataCode: 'MAA', name: 'Chennai International Airport', address: { cityName: 'Chennai', countryName: 'India' } },
    { iataCode: 'HYD', name: 'Rajiv Gandhi International Airport', address: { cityName: 'Hyderabad', countryName: 'India' } },
    { iataCode: 'CCU', name: 'Netaji Subhas Chandra Bose International Airport', address: { cityName: 'Kolkata', countryName: 'India' } },
    { iataCode: 'PNQ', name: 'Pune Airport', address: { cityName: 'Pune', countryName: 'India' } },
    { iataCode: 'AMD', name: 'Sardar Vallabhbhai Patel International Airport', address: { cityName: 'Ahmedabad', countryName: 'India' } },
    { iataCode: 'GOI', name: 'Dabolim Airport', address: { cityName: 'Goa', countryName: 'India' } },
    { iataCode: 'COK', name: 'Cochin International Airport', address: { cityName: 'Kochi', countryName: 'India' } },
    { iataCode: 'JAI', name: 'Jaipur International Airport', address: { cityName: 'Jaipur', countryName: 'India' } },
    { iataCode: 'LKO', name: 'Chaudhary Charan Singh International Airport', address: { cityName: 'Lucknow', countryName: 'India' } },
    { iataCode: 'IXC', name: 'Chandigarh International Airport', address: { cityName: 'Chandigarh', countryName: 'India' } },
    { iataCode: 'SXR', name: 'Sheikh ul-Alam International Airport', address: { cityName: 'Srinagar', countryName: 'India' } },
    { iataCode: 'TRV', name: 'Trivandrum International Airport', address: { cityName: 'Thiruvananthapuram', countryName: 'India' } },
    { iataCode: 'DXB', name: 'Dubai International Airport', address: { cityName: 'Dubai', countryName: 'UAE' } },
    { iataCode: 'SIN', name: 'Singapore Changi Airport', address: { cityName: 'Singapore', countryName: 'Singapore' } },
    { iataCode: 'LHR', name: 'London Heathrow Airport', address: { cityName: 'London', countryName: 'United Kingdom' } },
    { iataCode: 'JFK', name: 'John F Kennedy International Airport', address: { cityName: 'New York', countryName: 'USA' } },
    { iataCode: 'DOH', name: 'Hamad International Airport', address: { cityName: 'Doha', countryName: 'Qatar' } }
  ];

  if (!query || query.length < 2) {
    return airports.slice(0, 10);
  }

  const searchTerm = query.toLowerCase();
  const filtered = airports.filter(airport => 
    airport.iataCode.toLowerCase().includes(searchTerm) ||
    airport.name.toLowerCase().includes(searchTerm) ||
    airport.address.cityName.toLowerCase().includes(searchTerm)
  );

  return filtered.slice(0, 10);
}