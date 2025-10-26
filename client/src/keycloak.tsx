import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "https://keycloak.skailinker.org",
  realm: "syed-arbaz-org-realm",
  clientId: "skailinker-clientId",
});

export default keycloak;