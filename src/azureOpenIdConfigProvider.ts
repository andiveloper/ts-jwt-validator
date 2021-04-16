export type AzureOpenIdConfigURLOptions = {
    tenantName: string;
    policyName: string;
    version?: string | 'v2.0';
    discoveryEndpoint?: string | '.well-known/openid-configuration';
};

export function buildAzureOpenIdConfigURL(options: AzureOpenIdConfigURLOptions): string {
    options.version = options.version ? options.version : 'v2.0';
    options.discoveryEndpoint = options.discoveryEndpoint ? options.discoveryEndpoint : '.well-known/openid-configuration';
    return `https://${options.tenantName}.b2clogin.com/${options.tenantName}.onmicrosoft.com/${options.policyName}/${options.version}/${options.discoveryEndpoint}`;
}