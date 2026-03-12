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
  //   const ogUrl = `${BASE_URL}/info`;
  //   const ogImg = about.data.share_image?.url || ''; // Adjust as needed
  const twitterHandle = TWITTER_HANDLE;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      //   url: ogUrl,
      //   images: [
      //     {
      //       url: ogImg,
      //       width: 1200,
      //       height: 630,
      //     },
      //   ],
    },
    twitter: {
      card: 'summary_large_image',
      site: twitterHandle,
      creator: twitterHandle,
      title,
      description,
      //   images: [ogImg],
    },
  };
}

export default async function InfoPage() {
  const client = createClient();
  const about = await client.getSingle('infopage').catch(() => null);

  return <InfoComponent about={about} />;
}
