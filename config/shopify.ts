import Client from 'shopify-buy';
import { SHOPIFY_API_STOREFRONT_TOKEN, SHOPIFY_DOMAIN } from './env';

export const client = Client.buildClient({
  storefrontAccessToken: SHOPIFY_API_STOREFRONT_TOKEN,
  domain: SHOPIFY_DOMAIN,
});

export const getProductVariants = async (pid: string, fields: string[]) => {
  const query = `{
        node(id: "gid://shopify/Product/${pid}") {
          id
          ... on Product {
            title
            variants(first:10){edges{node{${fields.join(',')}}}}
          }
        }
      }`;
  const res = await fetch(
    ` https://${SHOPIFY_DOMAIN}/api/2022-01/graphql.json`,
    {
      method: 'post',
      headers: {
        'Content-Type': 'application/graphql',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_API_STOREFRONT_TOKEN,
      },
      body: query,
    }
  );
  const json = await res.json();
  return json;
};
