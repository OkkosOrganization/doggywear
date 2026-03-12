import { createClient } from '../prismicio';

export default async function sitemap() {
  const client = createClient();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://doggywear.com';

  const products = await client.getAllByType('product');

  const productEntries = products.map((product) => ({
    url: `${baseUrl}/product/${product.uid}`,
    lastModified: new Date(product.last_publication_date),
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/info`,
      lastModified: new Date(),
    },
    ...productEntries,
  ];
}
