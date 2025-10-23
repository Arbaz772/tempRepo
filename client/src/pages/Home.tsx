import { useState } from "react";
import { useLocation } from "wouter";
import Hero from "@/components/Hero";
import FlightSearchForm from "@/components/FlightSearchForm";
import FeatureCard from "@/components/FeatureCard";
import { Brain, TrendingDown, Bell, Shield, Clock, Globe } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();

  const handleSearch = (params: any) => {
    console.log("Search params:", params);
    setLocation("/flights");
  };

  return (
    <div>
      <Hero>
        <FlightSearchForm onSearch={handleSearch} />
      </Hero>

      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none" />
        
        <div className="text-center mb-12 relative">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4 bg-gradient-to-r from-foreground via-foreground to-primary/80 bg-clip-text text-transparent" data-testid="text-features-title">
            Why Choose SkaiLinker?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Powered by advanced AI to help you find the best flight deals across India
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          <FeatureCard
            icon={Brain}
            title="AI Price Predictions"
            description="Advanced algorithms predict price trends to help you book at the perfect time."
          />
          <FeatureCard
            icon={TrendingDown}
            title="Multi-Source Comparison"
            description="Compare flights from all major airlines and booking platforms in one place."
          />
          <FeatureCard
            icon={Bell}
            title="Price Alerts"
            description="Get notified when prices drop for your favorite routes and destinations."
          />
          <FeatureCard
            icon={Shield}
            title="Secure Booking"
            description="Book with confidence through our secure payment gateway and trusted partners."
          />
          <FeatureCard
            icon={Clock}
            title="24/7 Support"
            description="Our customer support team is always ready to help you with your travel needs."
          />
          <FeatureCard
            icon={Globe}
            title="Pan-India Coverage"
            description="Search and compare flights across all major Indian cities and airports."
          />
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-card/50 via-primary/5 to-card/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
        
        <div className="max-w-7xl mx-auto text-center relative">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent" data-testid="text-cta-title">
            Ready to Find Your Perfect Flight?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of travelers who save money with AI-powered flight search
          </p>
        </div>
      </section>
    </div>
  );
}
