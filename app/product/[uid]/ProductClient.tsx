'use client';

import { useContext, useEffect, useState, ViewTransition } from 'react';
import { PrismicRichText } from '@prismicio/react';
import { CartContext } from '../../../components/CartContext';
import styles from '../../../styles/ProductPage.module.css';
import { useWindowSize } from '../../../hooks/useWindowSize';
import { ClothingPackagingInfo } from '../../../components/ClothingPackagingInfo';
import { PrismicNextImage } from '@prismicio/next';
import { RelatedProducts } from '../../../components/RelatedProducts';
import {
  getProductVariants,
  ProductVariantNode,
} from '../../../config/shopify';
import { LoadingIndicator } from '../../../components/LoadingIndicator';
import { getTranslation } from '../../../config/translations';
import { PrintPackagingInfo } from '../../../components/PrintPackagingInfo';
import {
  ProductDocument,
  ShippingAndPackagingInfoDocumentData,
  Simplify,
} from '../../../prismicio-types';
import { asText, FilledImageFieldImage, isFilled } from '@prismicio/client';
import { EMAIL_ADDRESS, INSTAGRAM_USER_NAME } from '../../../config/env';
import { getSizeChart } from '../../../config/sizeCharts';
import { SizeChart } from '../../../components/SizeChart';

type ProductClientProps = {
  product: ProductDocument<string>;
  relatedProducts: ProductDocument<string>[];
  shippingAndPackagingInfo:
    | Simplify<ShippingAndPackagingInfoDocumentData>
    | undefined;
};

export default function ProductClient({
  product,
  relatedProducts,
  shippingAndPackagingInfo,
}: ProductClientProps) {
  const { width: ww } = useWindowSize();
  const cartContext = useContext(CartContext);
  const [addingToCart, setAddingToCart] = useState<boolean>(false);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [productVariants, setProductVariants] = useState<ProductVariantNode[]>(
    isFilled.integration(product.data.shopify)
      ? (product.data.shopify.variants as any)
      : []
  );

  const addToCart = () => {
    if (selectedVariant && cartContext) {
      setAddingToCart(true);
      cartContext.addToCart(selectedVariant.id).then(() => {
        setAddingToCart(false);
      });
    }
  };

  const handleVariantSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const vars = productVariants.filter((v) => v.id === e.target.value);
    if (vars.length > 0) {
      setSelectedVariant(vars[0]);
    }
  };

  const handleVariantButtonChange = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    const vars = productVariants.filter((v) => v.id === e.currentTarget.value);
    if (vars.length > 0) {
      if (vars[0] === selectedVariant) setSelectedVariant(null);
      else setSelectedVariant(vars[0]);
    }
  };

  const isClothing = product.data?.shopify?.product_type === 'Clothing';
  const isPrint = product.data?.shopify?.product_type === 'Print';

  const images: Simplify<
    FilledImageFieldImage & Record<never, FilledImageFieldImage>
  >[] = [];
  if (isFilled.image(product.data.primary_image)) {
    images.push(product.data.primary_image);
  }

  if (isFilled.image(product.data.secondary_image)) {
    images.push(product.data.secondary_image);
  }

  if (isFilled.group(product.data.gallery)) {
    product.data.gallery.forEach((galleryItem) => {
      if (isFilled.image(galleryItem.image)) {
        images.push(galleryItem.image);
      }
    });
  }

  useEffect(() => {
    if (!isFilled.integration(product.data.shopify)) return;

    const productId = product.data.shopify.id as string;
    if (productId)
      (async () => {
        const res = await getProductVariants(productId, [
          'id',
          'title',
          'price{amount}',
          'availableForSale',
        ]);
        if (res && res.data && res.data.node) {
          const vars = res.data.node.variants.edges.map((e) => e.node);
          setProductVariants(vars);
        }
      })();
  }, [product]);

  return (
    <ViewTransition>
      <div className={styles.container}>
        <div className={styles.productContainer}>
          <ProductImages
            images={images}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
          />
          <ProductInfo
            product={product}
            selectedVariant={selectedVariant}
            productVariants={productVariants}
            variantDisplayMode={'buttons'}
            handleVariantButtonChange={handleVariantButtonChange}
            handleVariantSelectChange={handleVariantSelectChange}
            addToCart={addToCart}
            addingToCart={addingToCart}
          />
        </div>
        <div className={styles.packagingInfo}>
          {isClothing &&
            product.data.show_shipping_and_packaging_info &&
            shippingAndPackagingInfo && (
              <ClothingPackagingInfo data={shippingAndPackagingInfo} />
            )}
          {isPrint && <PrintPackagingInfo />}
        </div>
        <div className={styles.relatedProducts}>
          <RelatedProducts products={relatedProducts} randomOrder />
        </div>
      </div>
    </ViewTransition>
  );
}

type ProductInfoProps = {
  product: ProductDocument<string>;
  selectedVariant: any;
  productVariants: any[];
  handleVariantButtonChange: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleVariantSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  addToCart: () => void;
  addingToCart: boolean;
  variantDisplayMode: 'select' | 'buttons';
};

export const ProductInfo = ({
  product,
  selectedVariant,
  productVariants,
  handleVariantButtonChange,
  handleVariantSelectChange,
  addToCart,
  addingToCart,
  variantDisplayMode,
}: ProductInfoProps) => {
  const productTitle = asText(product.data?.title);
  const sizeChart = getSizeChart(product.data.base_model);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const productPrice = isFilled.integration(product.data.shopify)
    ? parseFloat((product.data.shopify.variants as any)[0].price) + ' €'
    : '';

  return (
    <div className={styles.productInfo}>
      <h1 className={styles.productTitle}>{productTitle}</h1>

      <div className={styles.price}>
        {selectedVariant
          ? parseFloat(selectedVariant.price.amount) + ' €'
          : productPrice}
      </div>

      <div className={styles.productDescription}>
        <PrismicRichText field={product.data.description} />
      </div>

      <div className={styles.addToCartArea}>
        <div className={styles.variants}>
          {variantDisplayMode === 'buttons' && (
            <>
              <span className={styles.variantsLabel}>SIZE:</span>
              <div className={styles.variantButtons}>
                {productVariants.map((v) => (
                  <button
                    key={v.id}
                    value={v.id}
                    onClick={handleVariantButtonChange}
                    className={`${styles.variantButton} ${
                      selectedVariant && selectedVariant.id === v.id
                        ? styles.selectedVariant
                        : ''
                    }`}
                    disabled={!v.availableForSale}
                    title={
                      v.availableForSale
                        ? v.title
                        : getTranslation('OUT_OF_STOCK')
                    }
                  >
                    {v.title}
                  </button>
                ))}
              </div>
              {sizeChart && (
                <button
                  role="button"
                  className={styles.sizeChartButton}
                  onClick={() => setShowSizeChart(true)}
                  type="button"
                >
                  {getTranslation('SIZE_CHART')}
                </button>
              )}
            </>
          )}
          {variantDisplayMode === 'select' && (
            <>
              <label htmlFor="variantSelect" className={styles.variantsLabel}>
                CHOOSE SIZE:
              </label>
              <select
                name="variantSelect"
                id="variantSelect"
                onChange={handleVariantSelectChange}
                className={styles.variantSelect}
                disabled={!productVariants.length}
              >
                {productVariants.map((v) => (
                  <option
                    key={v.id}
                    value={v.id}
                    disabled={!v.availableForSale}
                  >
                    {v.title}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>

        <button
          className={'primary'}
          onClick={addToCart}
          disabled={!selectedVariant || !selectedVariant.availableForSale}
        >
          {addingToCart ? (
            <LoadingIndicator showBg={false} />
          ) : selectedVariant && !selectedVariant.availableForSale ? (
            getTranslation('OUT_OF_STOCK')
          ) : (
            getTranslation('ADD_TO_CART')
          )}
        </button>
      </div>

      {sizeChart && (
        <SizeChart
          sizeChart={sizeChart}
          open={showSizeChart}
          onClose={() => setShowSizeChart(false)}
        />
      )}

      {selectedVariant && selectedVariant.availableForSale === false && (
        <div className={styles.outOfStockInfo}>
          * This size option is currently out of stock. You can send an inquiry
          by{' '}
          <a
            href={`https://ig.me/m/${INSTAGRAM_USER_NAME}`}
            target="_blank"
            rel="noreferrer"
          >
            Instagram Direct Message
          </a>{' '}
          or by{' '}
          <a href={`mailto:${EMAIL_ADDRESS}`} target="_blank" rel="noreferrer">
            email
          </a>
          .
        </div>
      )}
    </div>
  );
};

type ProductImagesProps = {
  images: Simplify<
    FilledImageFieldImage & Record<never, FilledImageFieldImage>
  >[];
  selectedImage: number;
  setSelectedImage: (index: number) => void;
};

export const ProductImages = ({
  images,
  selectedImage,
  setSelectedImage,
}: ProductImagesProps) => {
  return (
    <div className={styles.productImages}>
      <div className={styles.mainImage}>
        {images.length > 0 && (
          <PrismicNextImage
            field={images[selectedImage]}
            fallbackAlt=""
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
            }}
            sizes={'(max-width: 40rem) 90vw, 40vw'}
            priority
          />
        )}
      </div>
      <div className={styles.thumbs}>
        {images.map((img, i: number) => (
          <div
            key={i}
            onClick={() => setSelectedImage(i)}
            className={`${styles.thumb} ${
              selectedImage === i ? styles.activeThumb : ''
            }`}
          >
            <PrismicNextImage
              field={img}
              fallbackAlt=""
              imgixParams={{ w: 80, h: 80, fit: 'crop' }}
              style={{
                objectFit: 'cover',
                width: '100%',
                height: '100%',
              }}
              sizes="10vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
