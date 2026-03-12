import { asText, filter } from '@prismicio/client';
import { createClient } from '../../../prismicio';
import ProductClient from './ProductClient';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BASE_URL, TITLE, TWITTER_HANDLE } from '../../../config/env';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ uid: string }>;
}): Promise<Metadata> {
  //console.log('Generating metadata for product page...');
  const { uid } = await params;
  const client = createClient();
  const product = await client.getByUID('product', uid).catch(() => null);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const title = `${TITLE} - Product - ${asText(product.data.title)}`;
  const description = product.data.description
    ? asText(product.data.description)
    : undefined;
  const hasShareImage = !!product.data.share_image?.url;
  const ogImg = hasShareImage
    ? product.data.share_image.url
    : product.data?.primary_image?.url;
  const ogUrl = `${BASE_URL}/product/${uid}`;
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
              width: product.data.share_image?.dimensions?.width || 1200,
              height: product.data.share_image?.dimensions?.height || 630,
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

  const shippingAndPackagingInfoResponse = await client
    .getSingle('shipping_and_packaging_info')
    .catch(() => null);
  const shippingAndPackagingInfo = shippingAndPackagingInfoResponse?.data;

  return (
    <ProductClient
      product={product}
      relatedProducts={relatedProducts}
      shippingAndPackagingInfo={shippingAndPackagingInfo}
    />
  );
}
