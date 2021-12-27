import React, { useEffect, useState } from 'react';
import Prismic from 'prismic-javascript';
import { RichText } from 'prismic-reactjs';
import { apiEndPoint} from '../../config/prismic';
import { CartContext } from '../../components/CartContext';
import styles from "../../sass/ProductPage.module.scss";
import { SRLWrapper } from "simple-react-lightbox";
import Head from 'next/head';
import Image from 'next/image';
import {getCurrentLocale} from '../../config/locales';
import { BASE_URL,TITLE,TWITTER_HANDLE } from '../../config/env';

export async function getStaticPaths({req,locales}) {

  let products = false;

  try {
    const prismicApi = await Prismic.getApi(apiEndPoint, { req: req });
    products = await prismicApi.query(
      Prismic.Predicates.at('document.type', 'product'),
      {
        lang:'*'
      }
    );
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

  let product = false;

  try {
    let uid = context.params.uid;
    let prismicApi = await Prismic.getApi(apiEndPoint, {req: context.req });

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

  let pid = props?.product?.data?.shopify?.id;
  let vid = props?.product?.data?.shopify?.variants[0]?.id;
  let price = props?.product?.data?.shopify?.variants[0]?.price;
  let tags = props?.product?.tags || [];

  let variants = props?.product?.data?.shopify?.variants;

  useEffect(() => {

    let getProduct = async () => {

      try {
        let variantIdBase64 = btoa("gid://shopify/Product/" + pid); //NOTE: THIS FETCHES PRODUCT NOT PRODUCTVARIANT  
        let product = await client.product.fetch(variantIdBase64);
        let isAvailable = product.availableForSale;
        console.log(product);
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

    let title = `${TITLE} - Product - ${props.product.data.title[0].text}`;
    let description = props.product.data.description.length ? props.product.data.description[0].text : "";
    //let fbAppId = process.env.FB_APP_ID;
    let ogUrl = `${BASE_URL}/product/${props.product.uid}`;
    let ogImg = props.product.data.primary_image;
    let twitterHandle = `${TWITTER_HANDLE}`;

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
          <div className={styles.productImages}>
            <SRLWrapper options={options}>


              <div className={`${styles.imageBg}`} key={`productImage`}>
                <img src={props.product.data.primary_image.url} data-attribute={"SRL"} />
              </div>


              {
                props.product.data.secondary_image.url
                  ?
                  <div className={styles.productGallery}>
                    <img src={props.product.data.secondary_image.url} data-attribute={"SRL"} />
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

        <div className={styles.packageInfo}>
          <h2>Packaging</h2>
          <p>All clothing items are wrapped in protective paper, carefully packed in hand-printed cardboard boxes and then shipped out to our customers.</p>
          <div className={styles.packageImages}>
            <div className={styles.packageImage}>
              <Image
                src={'/box4.jpg'}
                width={600}
                height={732}
                layout='responsive'
              />
            </div>
            <div className={styles.packageImage}>
            <Image
              src={'/box2.jpg'}
              width={600}
              height={732}
              layout='responsive'
            />
          </div>
          <div className={styles.packageImage}>
            <Image
              src={'/box1.jpg'}
              width={600}
              height={732}
              layout='responsive'
            />
          </div>
        </div>
        </div>
      </div>
    </section >
  );
}

export default ProductPage;