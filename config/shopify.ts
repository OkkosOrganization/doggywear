const Client = require('shopify-buy');

export const client = Client.buildClient({
    storefrontAccessToken: process.env.SHOPIFY_API_STOREFRONT_TOKEN,
    domain: process.env.SHOPIFY_DOMAIN
});