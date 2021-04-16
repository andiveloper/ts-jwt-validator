# ts-jwt-validator

This module can be used to validate a JWT token using the public key hosted at an OpenID JWKS URI. You can either:

- provide a `jwks_uri` yourself, e.g. `https://sandrino.auth0.com/.well-known/jwks.json`
- or use `JwtValidator.getSignatureKeysEndpoint(openIdConfigURL)`
  with `openIdConfigURL = 'https://sandrino.auth0.com/.well-known/openid-configuration'`

For use with Azure AD an `URL builder` is provided, see example below: `buildAzureOpenIdConfigURL(azureConfig...)`

## Installation

`npm install andiveloper/ts-jwt-validator`

## Sample

```
// optional: for use with Azure AD B2C:
const azureConfig = {
    tenantName: 'mytenant',
    policyName: 'B2C_1_custom_user_policy'
};

// optional: build the Open ID Configuration URL
const azureOpenIdConfigURL = buildAzureOpenIdConfigURL(azureConfig);

// ----------------------------------------------------

// optional: retrieve the signature key endpoint from an Open ID config URL 
// does not have to be an Azure AD B2C URL, can be any URL
// to a valid Open ID config containing a 'jwks_uri', 
// e.g. 'https://sandrino.auth0.com/.well-known/openid-configuration'
const keyEndpoint: string = await JwtValidator.getSignatureKeysEndpoint(azureOpenIdConfigURL);

// ----------------------------------------------------

// the JWT token to validate
const token: string = 'eyJhbGciOiJIUzI1NiI...';

// create a JwtValidator instance with a cache
// for other client options and examples see: https://github.com/auth0/node-jwks-rsa
const jwtValidator: JwtValidator = new JwtValidator({
    cache: true, // Default Value
    cacheMaxEntries: 5, // Default value
    cacheMaxAge: 600000, // Defaults to 10m
    jwksUri: keyEndpoint
});

// validate the token and optionally audience, issuer, nonce, ...
// for other options and examples see: https://github.com/auth0/node-jsonwebtoken
const jwt: JWTToken = await jwtValidator.validate(token, {
    audience: '...',
    issuer: '...',
    nonce: '...',
});

// log some attributes of the validated token:
console.log(jwt.payload.sub);
console.log(jwt.payload.emails);
console.log(jwt.payload.given_name);
console.log(jwt.payload.family_name);
```
