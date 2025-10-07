import { Sparkles } from "lucide-react";
import airportHero from "@assets/generated_images/Airport_terminal_hero_background_9e80665b.png";

interface HeroProps {
  children?: React.ReactNode;
}

export default function Hero({ children }: HeroProps) {
  return (
    <div className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${airportHero})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-primary font-medium">AI-Powered Flight Search</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white mb-4" data-testid="text-hero-title">
            Find Your Perfect Flight
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto" data-testid="text-hero-subtitle">
            Compare prices across all airlines. Get AI predictions for the best booking time.
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}
