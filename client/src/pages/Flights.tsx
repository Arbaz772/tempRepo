import { useState } from "react";
import Header from "@/components/Header";
import FlightSearchForm from "@/components/FlightSearchForm";
import FlightCard from "@/components/FlightCard";
import FilterPanel from "@/components/FilterPanel";
import SortBar from "@/components/SortBar";
import AIPredictionPanel from "@/components/AIPredictionPanel";
import PriceTrendChart from "@/components/PriceTrendChart";

export default function Flights() {
  const [sortBy, setSortBy] = useState<"cheapest" | "fastest" | "best" | "recommended">("recommended");

  const mockFlights = [
    {
      id: "1",
      airline: "Air India",
      flightNumber: "AI 860",
      origin: "DEL",
      destination: "BOM",
      departTime: "06:00",
      arriveTime: "08:15",
      duration: "2h 15m",
      stops: 0,
      price: 4500,
      aircraft: "Boeing 737",
      prediction: {
        trend: "down" as const,
        message: "Price likely to drop 12% in next 3 days"
      },
      isBestDeal: true
    },
    {
      id: "2",
      airline: "IndiGo",
      flightNumber: "6E 2134",
      origin: "DEL",
      destination: "BOM",
      departTime: "10:30",
      arriveTime: "12:50",
      duration: "2h 20m",
      stops: 0,
      price: 5200,
      aircraft: "Airbus A320"
    },
    {
      id: "3",
      airline: "Vistara",
      flightNumber: "UK 993",
      origin: "DEL",
      destination: "BOM",
      departTime: "14:15",
      arriveTime: "16:30",
      duration: "2h 15m",
      stops: 0,
      price: 6800,
      aircraft: "Airbus A320neo",
      prediction: {
        trend: "up" as const,
        message: "Price expected to rise 8%"
      }
    },
    {
      id: "4",
      airline: "SpiceJet",
      flightNumber: "SG 8162",
      origin: "DEL",
      destination: "BOM",
      departTime: "18:45",
      arriveTime: "21:15",
      duration: "2h 30m",
      stops: 0,
      price: 4800,
      aircraft: "Boeing 737 MAX"
    }
  ];

  const priceData = [
    { date: 'Jan 1', price: 5200 },
    { date: 'Jan 5', price: 4800 },
    { date: 'Jan 10', price: 5500 },
    { date: 'Jan 15', price: 4900 },
    { date: 'Jan 20', price: 4500 },
    { date: 'Jan 25', price: 4700 },
    { date: 'Jan 30', price: 4400 },
  ];

  const predictedData = [
    { date: 'Feb 1', price: 4200 },
    { date: 'Feb 3', price: 4100 },
    { date: 'Feb 5', price: 4300 },
  ];

  return (
    <div className="bg-background">
      <div className="bg-card/30 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <FlightSearchForm onSearch={(params) => console.log('Search:', params)} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="space-y-6 sticky top-24">
              <FilterPanel onFilterChange={(filters) => console.log('Filters:', filters)} />
            </div>
          </aside>

          <main className="lg:col-span-3 space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <AIPredictionPanel
                route="Delhi → Mumbai"
                prediction={{
                  recommendation: "book_now",
                  confidence: 87,
                  bestTimeToBook: "Within next 48 hours",
                  expectedSavings: 850,
                  priceDirection: "down"
                }}
              />
              <PriceTrendChart 
                route="Delhi → Mumbai" 
                data={priceData} 
                predictedData={predictedData}
              />
            </div>

            <SortBar
              resultCount={mockFlights.length}
              activeSort={sortBy}
              onSortChange={setSortBy}
            />

            <div className="space-y-4">
              {mockFlights.map((flight) => (
                <FlightCard key={flight.id} {...flight} />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
