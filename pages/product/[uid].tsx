import React, { useEffect, useState } from 'react';
import Prismic from 'prismic-javascript';
import { RichText } from 'prismic-reactjs';
import { apiEndPoint } from '../../config/prismic';
import { CartContext } from '../../components/CartContext';
import styles from '../../styles/ProductPage.module.scss';
import { SRLWrapper } from 'simple-react-lightbox';
import Head from 'next/head';
import { getCurrentLocale } from '../../config/locales';
import { BASE_URL, TITLE, TWITTER_HANDLE } from '../../config/env';
import { ClothingPackagingInfo } from '../../components/ClothingPackagingInfo';
import { TickIcon } from '../../components/icons/TickIcon';
import Image from 'next/image';
import { RelatedProducts } from '../../components/RelatedProducts';
import { getProductVariants } from '../../config/shopify';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { getTranslation } from '../../config/translations';
import { Locale } from '../../types';
import { PrintPackagingInfo } from '../../components/PrintPackagingInfo';

type ProductResults = {
  lang: string;
  data: unknown[];
  uid: string;
};
type ProductsResponse = {
  results?: ProductResults[];
} | null;

export async function getStaticPaths({ req, locales }) {
  let products: ProductsResponse = null;

  try {
    const prismicApi = await Prismic.getApi(apiEndPoint, { req: req });
    products = (await prismicApi.query(
      Prismic.Predicates.at('document.type', 'product'),
      {
        pageSize: 999,
        lang: '*',
      }
    )) as ProductsResponse;
  } catch (e) {
    console.log(e);
  }

  const paths = [];
  products.results.forEach((b) => {
    locales.forEach((i) => {
      if (b.lang === getCurrentLocale(i).prismicLocale)
        paths.push({
          params: {
            uid: String(b.uid),
          },
          locale: i,
        });
    });
  });

  return {
    paths: paths,
    fallback: false,
  };
}

export const getStaticProps = async (context) => {
  let product: unknown = null;
  let relatedProducts: unknown = null;
  const currLocale = getCurrentLocale(context.lang);

  try {
    const uid = context.params.uid;
    const prismicApi = await Prismic.getApi(apiEndPoint, { req: context.req });

    product = await prismicApi.getByUID('product', uid);

    //FETCH ALL PRODUCTS FOR THE RELATED PRODUCTS COMPONENT
    relatedProducts = (await prismicApi.query(
      Prismic.Predicates.at('document.type', 'product'),
      {
        pageSize: 999,
        lang: '*',
      }
    )) as ProductsResponse;
  } catch (e) {
    console.log(e);
  }

  return {
    props: {
      product: product,
      relatedProducts: relatedProducts,
      currLocale: currLocale,
    },
    revalidate: 1,
  };
};

type ProductPageProps = {
  ww: number;
  isTouchDevice: boolean;
  product: any;
  relatedProducts: any;
  currLocale: Locale;
};

const ProductPage = (props: ProductPageProps): JSX.Element => {
  const pid = props?.product?.data?.shopify?.id;
  const price = props?.product?.data?.shopify?.variants[0]?.price;
  const tags: string[] = props.product.tags;
  const isPoster = tags.includes('poster');

  const { addToCart, client } = React.useContext(CartContext);
  const [variants, setVariants] = useState<any[]>([]);
  const [chosenVariant, setChosenVariant] = useState(null);

  const options = {
    settings: {
      overlayColor: '#fff',
      autoplaySpeed: 0,
      transitionSpeed: 200,
      lightboxTransitionSpeed: 0.2,
      disableKeyboardControls: true,
      disablePanzoom: false,
      disableWheelControls: false,
    },
    buttons: {
      backgroundColor: '#fff',
      iconColor: '#fff',
      showDownloadButton: false,
      showFullscreenButton: false,
      showThumbnailsButton: false,
    },
    caption: {
      captionColor: '#fff',
      captionFontFamily: 'Arial, Helvetica, sans-serif',
      captionFontWeight: '300',
    },
    progressBar: {
      showProgressBar: false,
    },
    thumbnails: {
      showThumbnails: false,
    },
  };

  useEffect(() => {
    const getProduct = async () => {
      try {
        const json = await getProductVariants(pid, [
          'title',
          'id',
          'availableForSale',
        ]);
        //console.log(json.data);
        setVariants(json.data.node.variants.edges);
        setChosenVariant(json.data.node.variants.edges[0]);
      } catch (e) {
        console.log(e);
        setVariants(props?.product?.data?.shopify?.variants);
        setChosenVariant(props?.product?.data?.shopify?.variants[0]);
      }
    };

    if (client) getProduct();
  }, [client, pid]);

  const variantChange = (e) => {
    const newVariant = variants.filter((v) => v.node.id === e.target.value);
    setChosenVariant(newVariant[0]);
  };

  const renderHead = () => {
    const title = `${TITLE} - Product - ${props.product.data.title[0].text}`;
    const description = props.product.data.description.length
      ? props.product.data.description[0].text
      : '';
    //let fbAppId = process.env.FB_APP_ID;
    const ogUrl = `${BASE_URL}/product/${props.product.uid}`;
    const ogImg = props.product.data.primary_image;
    const twitterHandle = `${TWITTER_HANDLE}`;

    return (
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={ogUrl} />
        <meta property="og:image" content={ogImg.url} />
        <meta property="og:image:width" content={ogImg?.dimensions?.width} />
        <meta property="og:image:height" content={ogImg?.dimensions?.height} />

        <meta name="twitter:card" content="summary_large_image" />

        {twitterHandle && (
          <>
            <meta name="twitter:site" content={twitterHandle} />
            <meta name="twitter:creator" content={twitterHandle} />
          </>
        )}
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImg.url} />
      </Head>
    );
  };

  return (
    <section className={styles.container}>
      {renderHead()}
      <div className={styles.productContainer}>
        <div className={`${styles.productImages}`}>
          <SRLWrapper options={options}>
            <div className={`${styles.imageBg} imageBg`}>
              <div className={`${isPoster ? 'poster' : ''}`}>
                <Image
                  src={props.product.data.primary_image.url}
                  width={props.product.data.primary_image.dimensions.width}
                  height={props.product.data.primary_image.dimensions.height}
                  layout="responsive"
                  alt={'Primary product image'}
                  // @ts-expect-error: no allowed prop, but this makes the lightbox work
                  srl_gallery_image="true"
                  priority={true}
                  sizes={'(max-width: 640px) 100vw, 50vw'}
                />
              </div>
            </div>
            <div className={styles.productGallery}>
              {props.product.data.gallery.map((i, index) => {
                return (
                  <div
                    className={styles.galleryImageBg}
                    key={`galleryImage_${index}`}
                  >
                    {i.image.url && (
                      <Image
                        src={i.image.url}
                        width={i.image.dimensions.width}
                        height={i.image.dimensions.height}
                        layout="responsive"
                        alt={'Product gallery image'}
                        // @ts-expect-error: no allowed prop, but this makes the lightbox work
                        srl_gallery_image="true"
                        sizes={'(max-width: 640px) 100vw, 50vw'}
                        priority={false}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </SRLWrapper>
        </div>

        <div className={styles.productDescription}>
          <h1 className={styles.productTitle}>
            {props.product.data.title[0].text}
          </h1>
          <div>{RichText.render(props.product.data.description)}</div>
          <div className={styles.price}>
            {price && parseFloat(price).toFixed(0) + '€'}
          </div>

          <div className={styles.variantsContainer}>
            {!variants || !chosenVariant ? (
              <LoadingIndicator showBg={false} />
            ) : (
              <div className={styles.variants}>
                {variants.length > 1 && (
                  <div className={styles.top}>
                    <span className={styles.variantsLabel}>
                      CHOOSE&nbsp;{props.product.data.shopify.options[0].name}:
                    </span>
                    <div className={styles.selectContainer}>
                      <select
                        onChange={variantChange}
                        value={chosenVariant?.node?.id}
                      >
                        {variants.map((v, vindex) => {
                          return (
                            <option
                              value={v.node.id}
                              key={`variant_${v.node.id}`}
                            >
                              {v.node.title}
                            </option>
                          );
                        })}
                      </select>
                      <TickIcon />
                    </div>
                  </div>
                )}

                <div className={styles.bottom}>
                  <button
                    data-cy={'addToCartBtn'}
                    onClick={() =>
                      chosenVariant.node.availableForSale
                        ? addToCart(chosenVariant.node.id)
                        : null
                    }
                    disabled={!chosenVariant.node.availableForSale}
                  >
                    {chosenVariant.node.availableForSale
                      ? getTranslation('ADD_TO_CART', props.currLocale.locale)
                      : getTranslation('OUT_OF_STOCK', props.currLocale.locale)}
                  </button>
                </div>
                <div className={styles.shippingDisclaimer}>
                  <p>
                  * Please allow up to 2-4 weeks processing time before shipping as we do
                  not have a big stock and sometimes we need to reprint items.
                  </p>                  
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {!isPoster ? <ClothingPackagingInfo /> : <PrintPackagingInfo />}

      <RelatedProducts
        products={props?.relatedProducts?.results}
        exclude={props?.product?.uid}
        isMobile={props.isTouchDevice}
        filterByTag={props.product.tags.length ? props.product.tags[0] : ''}
        randomOrder
      />
    </section>
  );
};

export default ProductPage;
