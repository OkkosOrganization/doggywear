import { createClient } from '../prismicio';
import { asText } from '@prismicio/client';
import { Metadata } from 'next';
import FrontpageClient from './FrontpageClient';
import { BASE_URL, TITLE, TWITTER_HANDLE } from '../config/env';
import { ViewTransition } from 'react';

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const frontpage = await client.getSingle('frontpage').catch(() => null);

  if (!frontpage) {
    return {
      title: TITLE,
    };
  }

  const title = `${TITLE} - Home`;
  const description = frontpage.data?.description
    ? asText(frontpage.data.description)
    : undefined;
  const ogUrl = `${BASE_URL}`;
  const ogImg = frontpage.data?.meta_image?.url || undefined;
  const twitterHandle = TWITTER_HANDLE;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: ogUrl,
      images: ogImg
        ? [
            {
              url: ogImg,
              width: frontpage.data?.meta_image?.dimensions?.width || 1200,
              height: frontpage.data?.meta_image?.dimensions?.height || 630,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      site: twitterHandle,
      creator: twitterHandle,
      title,
      description,
      images: ogImg ? [ogImg] : undefined,
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

  const frontpage = await client.getSingle('frontpage');

  return (
    <ViewTransition>
      <FrontpageClient
        products={products}
        illustrations={illustrations}
        frontpage={frontpage}
      />
    </ViewTransition>
  );
}
