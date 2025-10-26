import Keycloak from "keycloak-js";


const keycloak = new Keycloak({
    url: 'https://keycloak.skailinker.org/auth',
    realm: 'syed-arbaz-org-realm', // Use your exact realm ID/name
    clientId: 'skailinker-clientId',
    // NO secret or credentials property here
});

keycloak.init({
    onLoad: 'login-required', // or 'check-sso'
    pkceMethod: 'S256', // Crucial for PKCE security
});