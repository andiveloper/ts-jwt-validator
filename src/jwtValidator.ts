import axios from 'axios';
import { JwksClient, Options } from 'jwks-rsa';
import { decode, verify, VerifyOptions } from 'jsonwebtoken';

type OpenIdConfiguration = {
    jwks_uri: string;
    [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
};

export type JWTToken = {
    header: JWTTokenHeader;
    payload: JWTTokenPayload;
    signature: string;
};

export type JWTTokenHeader = {
    alg: string;
    kid: string;
    typ: string;
};

export type JWTTokenPayload = {
    exp?: number;
    nbf?: number;
    ver?: string;
    iss?: string;
    sub?: string;
    aud?: string | string[];
    nonce?: string;
    iat?: number;
    auth_time?: number;
    idp_access_token?: string;
    idp?: string;
    given_name?: string;
    family_name?: string;
    oid?: string;
    emails?: string[];
    tfp?: string;
    at_hash?: string;
    [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
};

export type TokenVerifyOptions = VerifyOptions;
export type JWKSClientOptions = Options;

export class JwtValidator {
    private readonly client: JwksClient;

    constructor(jwksClientOptions: JWKSClientOptions) {
        this.client = new JwksClient(jwksClientOptions);
    }

    public async validate(jwtToken: string, tokenVerifyOptions?: TokenVerifyOptions): Promise<JWTToken> {
        const token: JWTToken = this.decode(jwtToken);
        const key: string = await this.getSignatureKeyFromURL(token.header.kid);
        verify(jwtToken, key, tokenVerifyOptions, function (err, decoded) {
            if (err) {
                throw new Error(`${err.name} - ${err.message}`);
            }
        });
        return token;
    }

    decode(jwtToken: string): JWTToken {
        return decode(jwtToken, { complete: true }) as JWTToken;
    }

    static async getSignatureKeysEndpoint(openIdConfigUrl: string): Promise<string> {
        const response = await axios.get<OpenIdConfiguration>(openIdConfigUrl);
        if (response.status != 200) {
            throw new Error(`Received HTTP status ${response.status} at GET ${openIdConfigUrl}`);
        }
        if (!response.data.jwks_uri) {
            throw new Error(`No JWKS URI found in configuration at: ${openIdConfigUrl}.`);
        }
        return response.data.jwks_uri;
    }

    protected async getSignatureKeyFromURL(kid: string): Promise<string> {
        const key = await this.client.getSigningKey(kid);
        return key.getPublicKey();
    }
}