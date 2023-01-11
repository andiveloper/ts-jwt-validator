import { JWTToken, JwtValidator } from '../src';

describe('JwtValidator', () => {
    it('retrieves the jwks_uri correctly', async () => {
        // given
        const openIdConfigURL = 'https://sandrino.auth0.com/.well-known/openid-configuration';

        // when
        const signatureKeysEndpoint = await JwtValidator.getSignatureKeysEndpoint(openIdConfigURL);

        //then
        expect(signatureKeysEndpoint).toEqual('https://sandrino.auth0.com/.well-known/jwks.json');
    });

    it('decode works as expected', async () => {
        // given
        const jwtValidator = new JwtValidator({
            cache: true, // Default Value
            cacheMaxEntries: 5, // Default value
            cacheMaxAge: 600000, // Defaults to 10m
            jwksUri: 'https://sandrino.auth0.com/.well-known/jwks.json'
        });

        const encodedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
        const decodedToken = {
            header: {
                alg: 'HS256',
                typ: 'JWT'
            }, payload: {
                'sub': '1234567890',
                'name': 'John Doe',
                'iat': 1516239022
            },
            signature: 'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        };

        // when
        const jwtToken: JWTToken = jwtValidator.decode(encodedToken);

        // then
        expect(jwtToken).toEqual(decodedToken);
    });
});