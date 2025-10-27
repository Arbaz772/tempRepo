import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from './storage.js';
import { 
  searchFlights, 
  getFlightOffers, 
  getAirportByCity 
} from './services/amadeusService.js';

export async function registerRoutes(app: Express): Promise<Server> {
  
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

      // Validate required fields
      if (!origin || !destination || !departDate) {
        return res.status(400).json({ 
          error: "Missing required fields: origin, destination, departDate" 
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

      res.json({
        success: true,
        data: flights,
        count: flights.length
      });

    } catch (error: any) {
      console.error("Flight search error:", error);
      res.status(500).json({ 
        error: "Failed to search flights", 
        message: error.message 
      });
    }
  });

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
      console.error("Get flight offer error:", error);
      res.status(500).json({ 
        error: "Failed to get flight offer", 
        message: error.message 
      });
    }
  });

  /**
   * Search airport by city name
   * GET /api/airports/search?city=Delhi
   */
  app.get("/api/airports/search", async (req, res) => {
    try {
      const { city } = req.query;
      
      if (!city || typeof city !== 'string') {
        return res.status(400).json({ 
          error: "City parameter is required" 
        });
      }

      const airports = await getAirportByCity(city);
      
      res.json({
        success: true,
        data: airports
      });

    } catch (error: any) {
      console.error("Airport search error:", error);
      res.status(500).json({ 
        error: "Failed to search airports", 
        message: error.message 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}