import React from "react";
import { Route, Redirect } from "wouter";
import keycloak from "./keycloak";

interface ProtectedRouteProps {
  path: string;
  component: React.ComponentType<any>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, ...rest }) => {
  // wouter's Route props forwarding is limited, so use hook or manual check
  if (!keycloak.authenticated) {
    keycloak.login();
    return null; // or a loading state
  }

  return <Route {...rest} component={Component} />;
};

export default ProtectedRoute;
