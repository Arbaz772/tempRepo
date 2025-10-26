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

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [keycloakInitialized, setKeycloakInitialized] = useState(false);

  useEffect(() => {
    keycloak
      .init({ onLoad: "login-required", pkceMethod: "S256" })
      .then((auth) => {
        setAuthenticated(auth);
        setKeycloakInitialized(true);
        if (!auth) {
          keycloak.login();
        }
      })
      .catch(() => {
        setKeycloakInitialized(true);
        setAuthenticated(false);
      });
  }, []);

  if (!keycloakInitialized) {
    return <div>Loading authentication...</div>;
  }

  if (!authenticated) {
    return <div>Redirecting to login...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background flex flex-col">
          <Header />
          <div className="flex-1">
            <Router />
          </div>
          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
