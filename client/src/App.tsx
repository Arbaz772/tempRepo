import React, { useState, useEffect } from "react";
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

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [keycloakInitialized, setKeycloakInitialized] = useState(false);

  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      keycloak
        .init({ onLoad: "check-sso", pkceMethod: "S256", checkLoginIframe: false })
        .then(auth => setAuthenticated(auth))
        .finally(() => setKeycloakInitialized(true));
    }
  }, []);

  const handleUserClick = () => {
    if (!authenticated) {
      keycloak.login();
    }
  };

  if (!keycloakInitialized) {
    return <div>Loading authentication...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background flex flex-col" onClick={handleUserClick}>
          {authenticated ? (
            <>
              <Header />
              <div className="flex-1">
                <Router />
              </div>
              <Footer />
            </>
          ) : (
            <div>Please click anywhere to login or sign up</div>
          )}
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
