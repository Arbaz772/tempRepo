// App.tsx

import React, { useState, useEffect, useRef } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import Flights from "@/pages/Flights";
import Predictions from "@/pages/Predictions";
import Deals from "@/pages/Deals";
import About from "@/pages/About";
import NotFound from "@/pages/not-found";
import keycloak from "./keycloak"; 
import ProtectedRoute from "./ProtectedRoute";

// --- Router Component (No changes needed) ---
function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={Home} />
      <ProtectedRoute path="/flights" component={Flights} />
      <ProtectedRoute path="/predictions" component={Predictions} />
      <ProtectedRoute path="/deals" component={Deals} />
      <ProtectedRoute path="/about" component={About} />
      <Route component={NotFound} />
    </Switch>
  );
}

// --- App Component (Main Logic) ---
function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [keycloakInitialized, setKeycloakInitialized] = useState(false);
  const initialized = useRef(false);
  const clickHandlerAttached = useRef(false);

  useEffect(() => {
    // 1. Initialize Keycloak on component mount
    if (!initialized.current) {
      initialized.current = true;
      keycloak
        // Use 'check-sso' to silently check for an existing session without redirecting
        .init({ 
            onLoad: "check-sso", 
            pkceMethod: "S256", 
            checkLoginIframe: false 
        })
        .then(auth => setAuthenticated(auth))
        .finally(() => setKeycloakInitialized(true));
    }

    // 2. Click Handler Function (Triggers actual login on first interaction)
    const handleFirstClick = (event: MouseEvent | TouchEvent) => {
      // Only fire if Keycloak is ready AND the user is NOT authenticated
      if (keycloakInitialized && !authenticated) {
        
        // CRITICAL: Stop the event from acting on the page (e.g., following a link or button press)
        event.preventDefault();
        event.stopPropagation();

        console.log("First interaction detected. Redirecting to Keycloak login.");
        
        // Trigger the redirect to Keycloak login page
        keycloak.login();

        // Remove the listener immediately to allow future interactions to work normally
        document.body.removeEventListener('click', handleFirstClick, { capture: true });
        document.body.removeEventListener('touchstart', handleFirstClick, { capture: true });
        clickHandlerAttached.current = false;
      } 
      // If user is authenticated, remove the listener so normal clicks proceed
      else if (keycloakInitialized && authenticated && clickHandlerAttached.current) {
         document.body.removeEventListener('click', handleFirstClick, { capture: true });
         document.body.removeEventListener('touchstart', handleFirstClick, { capture: true });
         clickHandlerAttached.current = false;
      }
    };

    // 3. Attach the Global Listener (Only if ready and unauthenticated)
    if (keycloakInitialized && !authenticated && !clickHandlerAttached.current) {
      // Attach to 'click' and 'touchstart' in the CAPTURE phase (true)
      document.body.addEventListener('click', handleFirstClick, { capture: true });
      document.body.addEventListener('touchstart', handleFirstClick, { capture: true });
      clickHandlerAttached.current = true;
    }
    
    // 4. Cleanup function
    return () => {
        if (clickHandlerAttached.current) {
            document.body.removeEventListener('click', handleFirstClick, { capture: true });
            document.body.removeEventListener('touchstart', handleFirstClick, { capture: true });
        }
    };
  }, [authenticated, keycloakInitialized]); // Dependencies to re-evaluate listener state


  if (!keycloakInitialized) {
    return <div>Loading authentication...</div>;
  }

  // --- Render Logic ---
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* IMPORTANT: Removed the inline onClick, as the logic is now globally controlled. */}
        <div className="min-h-screen bg-background flex flex-col">
          {authenticated ? (
            <>
              <Header />
              <div className="flex-1">
                <Router />
              </div>
              <Footer />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xl font-semibold">
              {/* This message is visible until the first click/tap is performed */}
              Please click anywhere to login or sign up
            </div>
          )}
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;