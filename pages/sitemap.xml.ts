import { GetServerSideProps } from 'next';
import { ENV } from '../config/env';
import { getCurrentLocale, Locales } from '../config/locales';
import { apiEndPoint, Prismic } from '../config/prismic';

type SiteMapEntry = {
  loc: string;
  lastmod?: string | undefined;
  priority: number;
  changefreq: string;
};

const buildSiteMapXml = (data: SiteMapEntry[]): string => {
  const content = data
    .map((i, index) => {
      return `
      <url>
        <loc>${i.loc}</loc>
        ${i.lastmod ? `<lastmod>${i.lastmod}</lastmod>` : ''}
        <changefreq>${i.changefreq}</changefreq>
        <priority>${i.priority}</priority>
      </url>    
    `;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n${content}</urlset>`;
  return xml;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const PrismicClient = await Prismic.client(apiEndPoint);
  const data: SiteMapEntry[] = [];

  //ADD HOMEPAGE FOR EACH LOCALE
  Locales.forEach((i, index) => {
    const obj: SiteMapEntry = {
      loc: i.url,
      priority: 1,
      changefreq: 'monthly',
    };
    data.push(obj);
  });

  //ADD INFO-PAGE FOR EACH LOCALE
  Locales.forEach((i, index) => {
    const obj: SiteMapEntry = {
      loc: `${i.url}/info`,
      priority: 0.8,
      changefreq: 'monthly',
    };
    data.push(obj);
  });

  //ADD PRODUCT PAGES FOR EACH LOCALE
  const products = await PrismicClient.query(
    Prismic.Predicates.at('document.type', 'product'),
    {
      lang: '*',
    }
  );
  products.results.forEach((b) => {
    Locales.forEach((i) => {
      if (b.lang === getCurrentLocale(i.locale).prismicLocale)
        data.push({
          loc: `${i.url}/product/${b.uid}`,
          priority: 0.7,
          changefreq: 'monthly',
        });
    });
  });

  //TRANSFORM DATA INTO XML STRING
  const sitemapContent = buildSiteMapXml(data);

  if (ENV === 'production') {
    //Set Cache Control in vercel
    //https://vercel.com/docs/edge-network/caching#stale-while-revalidate
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate');
  }

  //SERVE AS XML
  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemapContent);
  res.end();

  //EMPTY
  return {
    props: {},
  };
};

const SitemapXML: React.FC = () => {
  return null;
};
export default SitemapXML;
