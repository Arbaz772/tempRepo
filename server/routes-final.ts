// server/routes.ts
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from './storage.js';
import { 
  searchFlights, 
  getFlightOfferPricing, 
  searchAirports 
} from './services/amadeusService.js';

export async function registerRoutes(app: Express): Promise<Server> {
  
  // ==========================================
  // HEALTH CHECK
  // ==========================================
  app.get("/api/health", async (req, res) => {
    try {
      // Test Amadeus connection
      const hasCredentials = !!(process.env.AMADEUS_API_KEY && process.env.AMADEUS_API_SECRET);
      
      let amadeusStatus = 'not_configured';
      if (hasCredentials) {
        try {
          // Quick test search to verify connection
          await searchAirports('DEL');
          amadeusStatus = 'connected';
        } catch (error) {
          amadeusStatus = 'error';
        }
      }

      res.json({ 
        status: "ok",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        amadeus: {
          configured: hasCredentials,
          status: amadeusStatus,
          hostname: process.env.AMADEUS_HOSTNAME || 'test'
        }
      });
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        error: error.message
      });
    }
  });

  // ==========================================
  // AIRPORT SEARCH ENDPOINT
  // ==========================================
  app.get("/api/airports/search", async (req, res) => {
    try {
      const { city, keyword } = req.query;
      const searchTerm = (city || keyword) as string;
      
      console.log("🔍 Airport search request:", { searchTerm });
      
      // Validation
      if (!searchTerm || typeof searchTerm !== 'string') {
        return res.status(400).json({ 
          success: false,
          error: "Search term is required (use 'city' or 'keyword' parameter)",
          data: []
        });
      }

      if (searchTerm.length < 2) {
        return res.status(400).json({ 
          success: false,
          error: "Search term must be at least 2 characters",
          data: []
        });
      }

      // Try Amadeus API first
      try {
        const airports = await searchAirports(searchTerm);
        console.log(`✅ Amadeus returned ${airports.length} airports for "${searchTerm}"`);
        
        return res.json({
          success: true,
          data: airports || [],
          count: airports?.length || 0,
          source: 'amadeus'
        });
      } catch (amadeusError: any) {
        console.warn("⚠️ Amadeus API failed, using fallback:", amadeusError.message);
        
        // Fallback to local database
        const fallbackAirports = getFallbackAirports(searchTerm);
        console.log(`📋 Fallback returned ${fallbackAirports.length} airports`);
        
        return res.json({
          success: true,
          data: fallbackAirports,
          count: fallbackAirports.length,
          source: 'fallback',
          warning: 'Using local airport database - Amadeus API unavailable'
        });
      }

    } catch (error: any) {
      console.error("❌ Airport search error:", error);
      
      // Final fallback
      const fallbackAirports = getFallbackAirports(req.query.city as string || req.query.keyword as string || '');
      
      res.json({ 
        success: true,
        data: fallbackAirports,
        count: fallbackAirports.length,
        source: 'fallback',
        error: error.message
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
        tripType = "round-trip"
      } = req.body;

      console.log("📥 Flight search request:", {
        origin,
        destination,
        departDate,
        returnDate,
        passengers,
        tripType,
        timestamp: new Date().toISOString()
      });

      // Validation
      if (!origin || !destination || !departDate) {
        return res.status(400).json({ 
          success: false,
          error: "Missing required fields",
          message: "Please provide origin, destination, and departure date" 
        });
      }

      // Validate date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(departDate)) {
        return res.status(400).json({
          success: false,
          error: "Invalid date format",
          message: "Departure date must be in YYYY-MM-DD format"
        });
      }

      if (returnDate && !dateRegex.test(returnDate)) {
        return res.status(400).json({
          success: false,
          error: "Invalid date format",
          message: "Return date must be in YYYY-MM-DD format"
        });
      }

      // Validate passenger count
      const passengerCount = parseInt(passengers.toString());
      if (isNaN(passengerCount) || passengerCount < 1 || passengerCount > 9) {
        return res.status(400).json({
          success: false,
          error: "Invalid passenger count",
          message: "Passengers must be between 1 and 9"
        });
      }

      // Call Amadeus service
      console.log("🔍 Calling Amadeus API...");
      const flights = await searchFlights({
        origin: origin.trim().toUpperCase(),
        destination: destination.trim().toUpperCase(),
        departDate,
        returnDate: tripType === "round-trip" ? returnDate : undefined,
        passengers: passengerCount,
        maxResults: 50 // Increased for better results
      });

      console.log(`✅ Search successful - Found ${flights.length} flights`);
      
      if (flights.length > 0) {
        console.log(`💰 Price range: ${flights[0].currency} ${flights[0].price} - ${flights[flights.length - 1].price}`);
      }

      // Return results
      res.json({
        success: true,
        data: flights,
        count: flights.length,
        mock: false, // CRITICAL: Always false for real Amadeus data
        searchParams: {
          origin,
          destination,
          departDate,
          returnDate,
          passengers: passengerCount,
          tripType
        },
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      console.error("❌ Flight search error:", {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });

      // Return error with helpful message
      res.status(500).json({ 
        success: false,
        error: error.message || "Failed to search flights",
        message: "Unable to search flights at this time. Please try again later.",
        details: process.env.NODE_ENV === 'development' ? {
          errorType: error.name,
          errorMessage: error.message,
          timestamp: new Date().toISOString()
        } : undefined
      });
    }
  });

  // ==========================================
  // GET FLIGHT OFFER DETAILS
  // ==========================================
  app.get("/api/flights/offer/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      console.log("💰 Getting flight offer pricing:", id);
      
      if (!id) {
        return res.status(400).json({
          success: false,
          error: "Offer ID is required"
        });
      }

      const offer = await getFlightOfferPricing(id);
      
      console.log("✅ Flight offer retrieved successfully");
      
      res.json({
        success: true,
        data: offer
      });

    } catch (error: any) {
      console.error("❌ Get flight offer error:", error);
      res.status(500).json({ 
        success: false,
        error: error.message || "Failed to get flight offer",
        message: "Unable to retrieve flight offer details"
      });
    }
  });

  // ==========================================
  // TEST ENDPOINT (Development Only)
  // ==========================================
  if (process.env.NODE_ENV === 'development') {
    app.get("/api/flights/test", async (req, res) => {
      try {
        console.log("🧪 Running test flight search (DEL → BOM)");
        
        const testFlights = await searchFlights({
          origin: 'DEL',
          destination: 'BOM',
          departDate: '2025-11-15',
          passengers: 1,
          maxResults: 10
        });
        
        res.json({
          success: true,
          message: 'Test search completed',
          results: testFlights.length,
          sampleFlight: testFlights[0] || null,
          allFlights: testFlights,
          timestamp: new Date().toISOString()
        });
      } catch (error: any) {
        res.status(500).json({
          success: false,
          error: error.message,
          stack: error.stack
        });
      }
    });
  }

  const httpServer = createServer(app);
  return httpServer;
}

// ==========================================
// FALLBACK AIRPORTS DATABASE
// ==========================================
function getFallbackAirports(query: string): any[] {
  const airports = [
    // Major Indian Airports
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
    { iataCode: 'IXB', name: 'Bagdogra Airport', address: { cityName: 'Bagdogra', countryName: 'India' } },
    { iataCode: 'VNS', name: 'Lal Bahadur Shastri Airport', address: { cityName: 'Varanasi', countryName: 'India' } },
    { iataCode: 'NAG', name: 'Dr. Babasaheb Ambedkar International Airport', address: { cityName: 'Nagpur', countryName: 'India' } },
    { iataCode: 'IXR', name: 'Birsa Munda Airport', address: { cityName: 'Ranchi', countryName: 'India' } },
    { iataCode: 'GAU', name: 'Lokpriya Gopinath Bordoloi International Airport', address: { cityName: 'Guwahati', countryName: 'India' } },
    
    // International Airports
    { iataCode: 'DXB', name: 'Dubai International Airport', address: { cityName: 'Dubai', countryName: 'UAE' } },
    { iataCode: 'SIN', name: 'Singapore Changi Airport', address: { cityName: 'Singapore', countryName: 'Singapore' } },
    { iataCode: 'LHR', name: 'London Heathrow Airport', address: { cityName: 'London', countryName: 'United Kingdom' } },
    { iataCode: 'JFK', name: 'John F Kennedy International Airport', address: { cityName: 'New York', countryName: 'USA' } },
    { iataCode: 'DOH', name: 'Hamad International Airport', address: { cityName: 'Doha', countryName: 'Qatar' } },
    { iataCode: 'AUH', name: 'Abu Dhabi International Airport', address: { cityName: 'Abu Dhabi', countryName: 'UAE' } },
    { iataCode: 'BKK', name: 'Suvarnabhumi Airport', address: { cityName: 'Bangkok', countryName: 'Thailand' } },
    { iataCode: 'KUL', name: 'Kuala Lumpur International Airport', address: { cityName: 'Kuala Lumpur', countryName: 'Malaysia' } },
    { iataCode: 'HKG', name: 'Hong Kong International Airport', address: { cityName: 'Hong Kong', countryName: 'Hong Kong' } },
    { iataCode: 'NRT', name: 'Narita International Airport', address: { cityName: 'Tokyo', countryName: 'Japan' } }
  ];

  // If no query or too short, return top 15 airports
  if (!query || query.length < 2) {
    return airports.slice(0, 15);
  }

  // Filter airports based on search term
  const searchTerm = query.toLowerCase().trim();
  const filtered = airports.filter(airport => 
    airport.iataCode.toLowerCase().includes(searchTerm) ||
    airport.name.toLowerCase().includes(searchTerm) ||
    airport.address.cityName.toLowerCase().includes(searchTerm) ||
    airport.address.countryName.toLowerCase().includes(searchTerm)
  );

  // Return filtered results (max 15)
  return filtered.slice(0, 15);
}