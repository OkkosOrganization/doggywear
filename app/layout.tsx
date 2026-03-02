import type { Metadata } from 'next';
import ClientLayout from './ClientLayout';
import './globals.css';

// Prismic preview
import { PrismicPreview } from '@prismicio/next';
import { repositoryName } from '../prismicio';

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
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
        <PrismicPreview repositoryName={repositoryName} />
      </body>
    </html>
  );
}
