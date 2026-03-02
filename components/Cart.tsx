import React, { useContext, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { RemoveFromCart } from './icons/RemoveFromCart';
import { AddLineItem } from './icons/AddLineItem';
import { SubtractLineItem } from './icons/SubtractLineItem';
import { CURRENCY } from '../config/env';
import { CartContext } from './CartContext';
import { LoadingIndicator } from './LoadingIndicator';
import { getTranslation } from '../config/translations';
import styles from './Cart.module.css';
import Image from 'next/image';

const CartLineItem = (props) => {
  return (
    <div className={styles.lineItem}>
      <div className={styles.image}>
        <Image
          src={props.lineItem.variant.image.src}
          alt={'Product image'}
          width={80}
          height={111}
          quality={80}
        />
      </div>

      <div className={styles.info}>
        <div className={styles.top}>
          <h4 className={styles.lineItemTitle}>{props.lineItem.title}</h4>
          <button
            className={styles.removeLineItem}
            onClick={() => props.removeLineItem(props.lineItem)}
          >
            <RemoveFromCart />
          </button>
        </div>
        <div className={styles.size}>
          {props.lineItem.variant.title.includes('Default') ? null : (
            <>
              <span className={styles.selectedOptionValue}>
                {props.lineItem.variant.title}
              </span>
            </>
          )}
        </div>

        <div className={styles.bottom}>
          <div className={styles.quantity}>
            <button onClick={() => props.subtractQuantity(props.lineItem)}>
              <SubtractLineItem />
            </button>
            <span>{props.lineItem.quantity}</span>
            <button onClick={() => props.addQuantity(props.lineItem)}>
              <AddLineItem />
            </button>
          </div>

          <div className={styles.totalPrice}>
            {parseFloat(props.lineItem.variant.price.amount) *
              parseInt(props.lineItem.quantity) +
              ' €'}
          </div>
        </div>
      </div>
    </div>
  );
};

type CartProps = {
  ww: number;
};
const Cart = ({ ww }: CartProps) => {
  const cartContext = useContext(CartContext) as any;
  if (!cartContext) return null;
  const {
    checkout,
    removeLineItem,
    open,
    hideCart,
    updating,
    updateLineItemQuantity,
  } = cartContext;

  const [, setUserInCheckout] = useState<boolean>(false);
  const container = useRef(null);
  const scroller = useRef(null);
  const animDuration = 0.4;

  useEffect(() => {
    window.addEventListener('blur', windowBlurHandler);
    window.addEventListener('focus', windowFocusHandler);
    return () => {
      window.removeEventListener('blur', windowBlurHandler);
      window.removeEventListener('focus', windowFocusHandler);
    };
  }, []);

  useEffect(() => {
    const show = () => {
      //MOBILE
      let w_percent = '-100%';

      //DESKTOP
      if (ww >= 768) w_percent = '-40%';

      const next = document.querySelector('#app-container') as HTMLDivElement;
      const body = document.querySelector('body');

      if (!next || !body) return;

      body.classList.add('noscroll');
      next.classList.add('cartOpen');
      gsap.set(container.current, { autoAlpha: 1, display: 'block' });
      gsap.to(next, { duration: animDuration, x: w_percent });
    };

    if (open) show();
  }, [open]);

  const hide = () => {
    const next = document.querySelector('#app-container') as HTMLDivElement;
    const body = document.querySelector('body');

    if (!next || !body) return;

    gsap.to(next, {
      duration: animDuration / 2,
      x: '0%',
      onComplete: () => {
        body.classList.remove('noscroll');
        next.classList.remove('cartOpen');
        next.style.removeProperty('transform');
        hideCart();
      },
    });
  };

  const addQuantity = (lineItem) => {
    let q = lineItem.quantity;
    q++;
    updateLineItemQuantity(lineItem.id, q);
  };

  const subtractQuantity = (lineItem) => {
    let q = lineItem.quantity;
    if (q > -1) {
      q--;
      updateLineItemQuantity(lineItem.id, q);
    }
  };

  const removeItem = (lineItem) => {
    removeLineItem(lineItem.id);
  };

  const checkoutHandler = () => {
    //console.log("User is proceeding to checkout in a new window");
    setUserInCheckout(true);
  };

  const hasItems = () => {
    return checkout.lineItems.length;
  };

  const windowBlurHandler = (e) => {
    console.log('Window blur');
  };

  const windowFocusHandler = (e) => {
    console.log('Window focus');
    setUserInCheckout(false);
  };

  return (
    <div className={styles.cart} ref={container}>
      <div className={styles.scroller} ref={scroller}>
        <h2 className={styles.cartTitle}>{'Cart'}</h2>
        {checkout && hasItems() ? (
          <>
            <div className={styles.lineItems}>
              {checkout.lineItems.map((i, index) => {
                return (
                  <CartLineItem
                    key={i.id}
                    lineItem={i}
                    addQuantity={addQuantity}
                    subtractQuantity={subtractQuantity}
                    removeLineItem={removeItem}
                  />
                );
              })}
            </div>

            <div className={styles.summary}>
              <div className={styles.sub}>
                <span className={styles.subtotal_label}>{'SUBTOTAL'}</span>
                <span className={styles.subtotal_value}>{`${Math.round(
                  checkout.lineItemsSubtotalPrice.amount
                )} €`}</span>
              </div>

              <div className={styles.shipping}>
                <span className={styles.subtotal_label}>{'SHIPPING'}</span>
                <span className={styles.subtotal_value}>
                  {getTranslation('CALCULATED_AT_THE_NEXT_STEP')}
                </span>
              </div>

              <div className={styles.total}>
                <span className={styles.total_label}>{'TOTAL'}</span>
                <span className={styles.total_value}>{`${Math.round(
                  checkout.lineItemsSubtotalPrice.amount
                )} ${CURRENCY}`}</span>
              </div>
            </div>

            <div className={styles.checkout}>
              <a
                href={`${checkout.webUrl}&locale=${'en'}`}
                target={'_blank'}
                rel={'noreferrer'}
              >
                <button
                  className={`${styles.checkoutBtn} primary`}
                  aria-label="Checkout"
                  onClick={checkoutHandler}
                >
                  {'CHECKOUT'}
                </button>
              </a>
            </div>
          </>
        ) : (
          !updating && <p className={styles.cartEmpty}>{'CART EMPTY'}</p>
        )}
        <button
          className={styles.closeCart}
          onClick={hide}
          aria-label="Close cart"
        >
          <i></i>
          <i></i>
        </button>
      </div>
      {updating ? <LoadingIndicator showBg={true} /> : null}
    </div>
  );
};
export default Cart;
