import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthGuard from "@/components/AuthGuard";
import Home from "@/pages/Home";
import Flights from "@/pages/Flights";
import Predictions from "@/pages/Predictions";
import Deals from "@/pages/Deals";
import About from "@/pages/About";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import NotFound from "@/pages/not-found";

// IMPORTANT: Replace with your actual Google Client ID
// Get it from: https://console.cloud.google.com/apis/credentials
// Should look like: 123456789012-xxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
const GOOGLE_CLIENT_ID = '598503571962-1pkj41acqql4csulutspvt4g4ffbcggp.apps.googleusercontent.com';

// For development, you can also check if running locally
// const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_CLIENT_ID';

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/flights" component={Flights} />
      <Route path="/predictions" component={Predictions} />
      <Route path="/deals" component={Deals} />
      <Route path="/about" component={About} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthGuard>
            <div className="min-h-screen bg-background flex flex-col">
              <Header />
              <div className="flex-1">
                <Router />
              </div>
              <Footer />
            </div>
          </AuthGuard>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;