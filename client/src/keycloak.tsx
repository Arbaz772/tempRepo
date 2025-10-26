import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://keycloak.skailinker.org/auth",
  realm: "syed-arbaz-org-realm",
  clientId: "skailinker-clientId",
});

export default keycloak;
