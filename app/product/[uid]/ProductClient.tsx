'use client';

import { useContext, useEffect, useState } from 'react';
import { PrismicRichText } from '@prismicio/react';
import { CartContext } from '../../../components/CartContext';
import styles from '../../../styles/ProductPage.module.css';
import { useWindowSize } from '../../../hooks/useWindowSize';
import { ClothingPackagingInfo } from '../../../components/ClothingPackagingInfo';
import Image from 'next/image';
import { RelatedProducts } from '../../../components/RelatedProducts';
import { getProductVariants } from '../../../config/shopify';
import { LoadingIndicator } from '../../../components/LoadingIndicator';
import { getTranslation } from '../../../config/translations';
import { PrintPackagingInfo } from '../../../components/PrintPackagingInfo';

export default function ProductClient({ product, relatedProducts }) {
  const { width: ww } = useWindowSize();
  const cartContext = useContext(CartContext);
  const [addingToCart, setAddingToCart] = useState<boolean>(false);
  const [addedtoCart, setAddedToCart] = useState<boolean>(false);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [productVariants, setProductVariants] = useState<any[]>([]);

  const addToCart = () => {
    if (selectedVariant && cartContext) {
      setAddingToCart(true);
      cartContext.addToCart(selectedVariant.id).then(() => {
        setAddingToCart(false);
        setAddedToCart(true);
        setTimeout(() => {
          setAddedToCart(false);
        }, 3000);
      });
    }
  };

  const handleVariantChange = (e) => {
    const vars = productVariants.filter((v) => v.id === e.target.value);
    if (vars.length > 0) {
      setSelectedVariant(vars[0]);
    }
  };

  const isClothing = product.data.shopify.product_type === 'Clothing';
  const isPrint = product.data.type === 'Print';
  const productTitle = product.data.title[0]?.text;

  const images: any[] = [];
  if (product.data.primary_image?.url) {
    images.push({ image: product.data.primary_image });
  }
  if (product.data.secondary_image?.url) {
    images.push({ image: product.data.secondary_image });
  }
  if (product.data.gallery) {
    images.push(...product.data.gallery);
  }
  // Fallback to old images if no new structure found
  if (images.length === 0 && product.data.images) {
    images.push(...product.data.images);
  }

  useEffect(() => {
    console.log('FETCH PRODUCT', product);
    const productId = product?.data?.shopify?.id;
    if (productId) {
      getProductVariants(productId, [
        'id',
        'title',
        'price{amount}',
        'availableForSale',
      ]).then((res) => {
        console.log('SHOPIFY:', res);
        if (res && res.data && res.data.node) {
          const vars = res.data.node.variants.edges.map((e) => e.node);
          setProductVariants(vars);
          if (vars.length > 0) {
            setSelectedVariant(vars[0]);
          }
        }
      });
    }
  }, [product]);

  return (
    <div className={styles.container}>
      <div className={styles.productContainer}>
        <div className={styles.productImages}>
          <div className={styles.mainImage}>
            {images.length > 0 && (
              <Image
                src={images[selectedImage].image.url}
                alt={images[selectedImage].image.alt || 'Product Image'}
                width={1200}
                height={1600}
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                }}
                priority
              />
            )}
          </div>
          <div className={styles.thumbs}>
            {images.map((img: any, i: number) => (
              <div
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`${styles.thumb} ${
                  selectedImage === i ? styles.activeThumb : ''
                }`}
              >
                <Image
                  src={img.image.url}
                  alt={img.image.alt || ''}
                  width={200}
                  height={200}
                  style={{
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%',
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.productInfo}>
          <h1 className={styles.productTitle}>{productTitle}</h1>

          <div className={styles.price}>
            {selectedVariant
              ? parseFloat(selectedVariant.price.amount) + ' €'
              : ''}
          </div>

          <div className={styles.description}>
            <PrismicRichText field={product.data.description} />
          </div>

          <div className={styles.addToCartArea}>
            {productVariants.length > 1 && (
              <div className={styles.variants}>
                <select
                  onChange={handleVariantChange}
                  className={styles.variantSelect}
                >
                  {productVariants.map((v) => (
                    <option
                      key={v.id}
                      value={v.id}
                      disabled={v.availableForSale}
                    >
                      {v.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              className={`${styles.addToCartBtn} primary`}
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
        </div>

        {isClothing && <ClothingPackagingInfo />}
        {isPrint && <PrintPackagingInfo />}
      </div>

      {relatedProducts && relatedProducts.length > 0 && (
        <RelatedProducts
          products={relatedProducts}
          isMobile={ww < 640}
          randomOrder
        />
      )}
    </div>
  );
}
