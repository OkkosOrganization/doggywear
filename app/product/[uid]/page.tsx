import { asText, filter } from '@prismicio/client';
import { createClient } from '../../../prismicio';
import ProductClient from './ProductClient';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TITLE } from '../../../config/env';

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

  const title = `${TITLE} -  Product - ${asText(product.data.title)}`;
  const description = product.data.description
    ? asText(product.data.description)
    : undefined;
  const hasShareImage = !!product.data.share_image?.url;
  const ogImg = hasShareImage
    ? product.data.share_image.url
    : product.data?.primary_image?.url;

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

  return <ProductClient product={product} relatedProducts={relatedProducts} />;
}
