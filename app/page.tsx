import { createClient } from '../prismicio';
import { Metadata } from 'next';
import FrontpageClient from './FrontpageClient';
import { BASE_URL, TITLE, TWITTER_HANDLE } from '../config/env';

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const frontpage = await client.getSingle('front-page').catch(() => null);

  if (!frontpage) {
    return {
      title: TITLE,
    };
  }

  const title = `${TITLE} - Home`;
  const description = frontpage.data?.description?.[0]?.text;
  const ogUrl = `${BASE_URL}`;
  const ogImg = `${frontpage.data.share_image.url}`;
  const twitterHandle = TWITTER_HANDLE;

  return {
    title: title,
    description: description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: ogUrl,
      images: [
        {
          url: ogImg,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: twitterHandle,
      creator: twitterHandle,
      title,
      description,
      images: [ogImg],
    },
  };
}

export default async function Page() {
  const client = createClient();

  const products = await client.getByType('product', {
    pageSize: 99,
  });

  const illustrations = await client.getByType('illustration', {
    pageSize: 99,
    fetchLinks: ['video'],
  });

  const frontpage = await client.getSingle('front-page');

  return (
    <FrontpageClient
      products={products}
      illustrations={illustrations}
      frontpage={frontpage}
    />
  );
}
