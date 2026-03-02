import { filter } from '@prismicio/client';
import { createClient } from '../../../prismicio';
import ProductClient from './ProductClient';
import { Metadata } from 'next';
import { getCurrentLocale } from '../../../config/locales';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ uid: string }>;
}): Promise<Metadata> {
  const { uid } = await params;
  const client = createClient();
  const product = await client.getByUID('product', uid).catch(() => null);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const title = product.data.title[0]?.text || 'Product';
  const description = product.data.description?.[0]?.text;
  const ogImg =
    product.data.share_image?.url || product.data.images?.[0]?.image?.url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ogImg ? [{ url: ogImg }] : [],
    },
  };
}

export async function generateStaticParams() {
  const client = createClient();
  const products = await client.getAllByType('product');

  return products.map((product) => ({
    uid: product.uid,
  }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ uid: string }>;
}) {
  const { uid } = await params;
  const client = createClient();
  const product = await client.getByUID('product', uid).catch(() => null);

  if (!product) {
    notFound();
  }

  const relatedProductsResponse = await client.getByType('product', {
    pageSize: 10,
    filters: [filter.not('my.product.uid', uid)],
  });

  const relatedProducts = relatedProductsResponse.results;

  // Mocking locale for now as app directory handles i18n differently
  // In a real app we'd get lang from params if using [lang] folder
  const currLocale = getCurrentLocale('en');

  return <ProductClient product={product} relatedProducts={relatedProducts} />;
}
