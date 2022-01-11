import React, { useEffect, useState } from 'react';
import Prismic from 'prismic-javascript';
import { RichText } from 'prismic-reactjs';
import { apiEndPoint} from '../../config/prismic';
import { CartContext } from '../../components/CartContext';
import styles from "../../styles/ProductPage.module.scss";
import { SRLWrapper } from "simple-react-lightbox";
import Head from 'next/head';
import {getCurrentLocale} from '../../config/locales';
import { BASE_URL,TITLE,TWITTER_HANDLE } from '../../config/env';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { ProductPackagingInfo } from '../../components/ProductPackagingInfo';

type ProductResults = {
  lang:string;
  data:unknown[];
  uid:string;
};
type ProductsResponse = {
  results?:ProductResults[];
} | null;

export async function getStaticPaths({req,locales}) {

  let products:ProductsResponse = null;

  try {
    const prismicApi = await Prismic.getApi(apiEndPoint, { req: req });
    products = await prismicApi.query(
      Prismic.Predicates.at('document.type', 'product'),
      {
        lang:'*'
      }
    ) as ProductsResponse;
  }
  catch (e) {
    console.log(e);
  }

  const paths = [];
  products.results.forEach((b) => {
    locales.forEach((i) => {
      if(b.lang === getCurrentLocale(i).prismicLocale)
        paths.push({
          params: {
            uid: String(b.uid) 
          },
          locale:i
        });
    });
  });

  return {
    paths: paths,
    fallback: false
  };
}

export const getStaticProps = async (context) => {

  let product:unknown = null;

  try {
    const uid = context.params.uid;
    const prismicApi = await Prismic.getApi(apiEndPoint, {req: context.req });

    product = await prismicApi.getByUID('product', uid);
  }
  catch (e) {
    console.log(e);
  }

  return {
    props:
    {
      product: product
    },
    revalidate: 1
  };
}

const ProductPage = (props) => {

  const [dark] = useLocalStorage('darkMode', false);
  const { addToCart, client } = React.useContext(CartContext);
  const [available, setAvailable] = useState(false);
  const [chosenVariant, setChosenVariant] = useState("");

  const options = {
    settings: {
      overlayColor: "#fff",
      autoplaySpeed: 0,
      disableKeyboardControls: true,
      transitionSpeed: 200,
      lightboxTransitionSpeed: 0.2
    },
    buttons: {
      backgroundColor: "#fff",
      iconColor: "#fff",
      showDownloadButton: false,
      showFullscreenButton: false,
      showThumbnailsButton: false
    },
    caption: {
      captionColor: "#fff",
      captionFontFamily: "Roboto, sans-serif",
      captionFontWeight: "300"
    }
  };

  const pid = props?.product?.data?.shopify?.id;
  const vid = props?.product?.data?.shopify?.variants[0]?.id;
  const price = props?.product?.data?.shopify?.variants[0]?.price;
  const variants = props?.product?.data?.shopify?.variants;

  useEffect(() => {

    const getProduct = async () => {

      try {
        const variantIdBase64 = btoa("gid://shopify/Product/" + pid); //NOTE: THIS FETCHES PRODUCT NOT PRODUCTVARIANT  
        const product = await client.product.fetch(variantIdBase64);
        const isAvailable = product.availableForSale;
        setAvailable(isAvailable);

      }
      catch (e) {
        console.log(e);
      }
    }

    if (client)
      getProduct();

  }, [client]);

  useEffect(() => {

    if (!chosenVariant && variants)
      setChosenVariant(variants[0]?.id)

  }, [chosenVariant]);

  const variantChange = (e) => {
    setChosenVariant(e.target.value);
  }

  const renderHead = () => {

    const title = `${TITLE} - Product - ${props.product.data.title[0].text}`;
    const description = props.product.data.description.length ? props.product.data.description[0].text : "";
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
        <meta property="og:image:width" content={ogImg.dimensions.width} />
        <meta property="og:image:height" content={ogImg.dimensions.height} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={twitterHandle} />
        <meta name="twitter:creator" content={twitterHandle} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImg} />
      </Head>
    );
  }

  return (

    <section className={styles.container}>

      {renderHead()}

      <div className={styles.wrapper}>
        <div className={styles.productInfo}>
          <div className={`${styles.productImages}`}>
            <SRLWrapper options={options}>

              <div className={`${styles.imageBg} imageBg`} key={`productImage`}>
                <img src={props.product.data.primary_image.url} data-attribute={'SRL'} alt={'Product image'} />
              </div>

              {
                props.product.data.secondary_image.url
                  ?
                  <div className={styles.productGallery}>
                    <img src={props.product.data.secondary_image.url} data-attribute={'SRL'} alt={'Product image'} />
                  </div>
                  :
                  null
              }
            </SRLWrapper>
          </div>

        </div>

        <div className={styles.productDescription}>
          <h1>{props.product.data.title[0].text}</h1>
          <div>
            {RichText.render(props.product.data.description)}
          </div>
          <div className={styles.price}>{parseFloat(price).toFixed(0)}€</div>

          {
            variants
              ?
              <div className={styles.variants}>
                <span className={styles.variantsLabel}>CHOOSE {props.product.data.shopify.options[0].name}:</span>
                <select onChange={variantChange} value={chosenVariant}>
                  {
                    variants.map((v, vindex) => {
                      return (
                        <option value={v.id} key={`variant_${vindex}`}>{v.title}</option>
                      )
                    })
                  }
                </select>
              </div>
              :
              null
          }

          <button onClick={(e) => available ? addToCart(chosenVariant) : null} disabled={!available}>Add to cart</button>
        </div>

        <ProductPackagingInfo />

      </div>
    </section >
  );
}

export default ProductPage;