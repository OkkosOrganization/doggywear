import type { Metadata } from 'next';
import ClientLayout from './ClientLayout';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

import './globals.css';

// Prismic preview
import { PrismicPreview } from '@prismicio/next';
import { repositoryName } from '../prismicio';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: 'Doggy Wear',
  description: 'Doggy Wear website',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body>
        <Analytics />
        <ClientLayout>{children}</ClientLayout>
        <PrismicPreview repositoryName={repositoryName} />
      </body>
    </html>
  );
}
