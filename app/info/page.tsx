import { createClient } from '../../prismicio';
import InfoComponent from './InfoClient';
import { Metadata } from 'next';
import { BASE_URL, TITLE, TWITTER_HANDLE } from '../../config/env';
import { asText } from '@prismicio/client';

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const about = await client.getSingle('infopage').catch(() => null);

  if (!about) {
    return {
      title: 'Info',
    };
  }

  const title = `${TITLE} - Info`;
  const description = asText(about.data?.content);
  const ogUrl = `${BASE_URL}/info`;
  const ogImg = about.data?.meta_image?.url || undefined;
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
              width: about.data.meta_image?.dimensions?.width || 1200,
              height: about.data.meta_image?.dimensions?.height || 630,
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

export default async function InfoPage() {
  const client = createClient();
  const about = await client.getSingle('infopage').catch(() => null);

  return <InfoComponent about={about} />;
}
