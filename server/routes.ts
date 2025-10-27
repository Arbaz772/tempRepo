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
  /**
   * Search airports by city name with better error handling
   * GET /api/airports/search?city=Delhi
   */
  app.get("/api/airports/search", async (req, res) => {
    try {
      const { city } = req.query;
      
      console.log("🔍 Airport search request:", { city });
      
      // Validation
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

      // Try to get airports from Amadeus
      try {
        const airports = await getAirportByCity(city);
        
        console.log(`✅ Found ${airports.length} airports for "${city}"`);
        
        // Return even if empty array
        return res.json({
          success: true,
          data: airports || [],
          count: airports?.length || 0
        });
      } catch (amadeusError: any) {
        // If Amadeus fails, return popular airports as fallback
        console.warn("⚠️ Amadeus airport search failed, using fallback", amadeusError.message);
        
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
      
      // Return fallback airports even on error
      const fallbackAirports = getFallbackAirports(req.query.city as string || '');
      
      res.json({ 
        success: true,
        data: fallbackAirports,
        count: fallbackAirports.length,
        fallback: true,
        warning: "Using cached airport data"
      });
    }
  });

  // ==========================================
  // FLIGHT SEARCH ENDPOINT
  // ==========================================
  /**
   * Search flights based on user input
   * POST /api/flights/search
   */
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

      // Validate required fields
      if (!origin || !destination || !departDate) {
        return res.status(400).json({ 
          success: false,
          error: "Missing required fields",
          message: "Please provide origin, destination, and departure date" 
        });
      }

      // Search flights using Amadeus API
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
  /**
   * Get specific flight offer details
   * GET /api/flights/offer/:id
   */
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
    }
  }