import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "https://keycloak.skailinker.org/auth",
  realm: "syed-arbaz-org-realm",
  clientId: "skailinker-clientId",
});

keycloak.init({
  onLoad: "login-required",
  pkceMethod: "S256",
  checkLoginIframe: false, 
});

export default keycloak;
