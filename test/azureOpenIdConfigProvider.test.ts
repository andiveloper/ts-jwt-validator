import { buildAzureOpenIdConfigURL } from '../src/azureOpenIdConfigProvider';

describe('azureOpenIdConfigProvider', () => {
    it('builds the Azure AD B2C Open ID config URL correctly', async () => {
        // given

        // Optional: your Azure AD B2C configuration
        const azureConfig =
            {
                tenantName: 'mytenant',
                policyName: 'B2C_1_custom_user_policy'
            };

        // build the Open ID Configuration URL
        const azureOpenIdConfigURL = buildAzureOpenIdConfigURL(azureConfig);

        //then
        expect(azureOpenIdConfigURL).toEqual('https://mytenant.b2clogin.com/mytenant.onmicrosoft.com/B2C_1_custom_user_policy/v2.0/.well-known/openid-configuration');
    });
});