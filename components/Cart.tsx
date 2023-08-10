import React, { useContext, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { RemoveFromCart } from './icons/RemoveFromCart';
import { AddLineItem } from './icons/AddLineItem';
import { SubtractLineItem } from './icons/SubtractLineItem';
import { CURRENCY } from '../config/env';
import { CartContext } from './CartContext';
import { LoadingIndicator } from './LoadingIndicator';
import { getTranslation } from '../config/translations';

const CartLineItem = (props) => {
  return (
    <div className={'lineItem'}>
      <div className={'image'}>
        <img src={props.lineItem.variant.image.src} alt={'Product image'} />
      </div>

      <div className={'info'}>
        <div className={'top'}>
          {props.lineItem.title}
          {props.lineItem.variant.title.includes('Default') ? null : (
            <>
              &nbsp;-&nbsp;
              <span className={'selectedOptionValue'}>
                {props.lineItem.variant.title}
              </span>
            </>
          )}
        </div>

        <div className={'bottom'}>
          <div className={'quantity'}>
            <button onClick={() => props.subtractQuantity(props.lineItem)}>
              <SubtractLineItem />
            </button>
            <span>{props.lineItem.quantity}</span>
            <button onClick={() => props.addQuantity(props.lineItem)}>
              <AddLineItem />
            </button>
            <button
              className={'removeLineItem'}
              onClick={() => props.removeLineItem(props.lineItem)}
            >
              <RemoveFromCart />
            </button>
          </div>

          <div className={'totalPrice'}>
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
  const {
    checkout,
    removeLineItem,
    open,
    hideCart,
    updating,
    updateLineItemQuantity,
  } = useContext(CartContext);

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

      const next: HTMLDivElement = document.querySelector('#__next');
      const body = document.querySelector('body');

      body.classList.add('noscroll');
      next.classList.add('cartOpen');
      gsap.set(container.current, { autoAlpha: 1, display: 'block' });
      gsap.to(next, { duration: animDuration, x: w_percent });
    };

    if (open) show();
  }, [open]);

  const hide = () => {
    const next: HTMLDivElement = document.querySelector('#__next');
    const body = document.querySelector('body');

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
    <div className={'cart'} ref={container}>
      <div className={'scroller'} ref={scroller}>
        <h2 className={'cartTitle'}>{'Cart'}</h2>
        {checkout && hasItems() ? (
          <>
            <div className={'lineItems'}>
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

            <div className={'summary'}>
              <div className={'sub'}>
                <span className={'subtotal_label'}>{'SUBTOTAL'}</span>
                <span className={'subtotal_value'}>{`${Math.round(
                  checkout.lineItemsSubtotalPrice.amount
                )} €`}</span>
              </div>

              <div className={'shipping'}>
                <span className={'subtotal_label'}>{'SHIPPING'}</span>
                <span className={'subtotal_value'}>
                  {getTranslation('CALCULATED_AT_THE_NEXT_STEP')}
                </span>
              </div>

              <div className={'total'}>
                <span className={'total_label'}>{'TOTAL'}</span>
                <span className={'total_value'}>{`${Math.round(
                  checkout.lineItemsSubtotalPrice.amount
                )} ${CURRENCY}`}</span>
              </div>
            </div>

            <div className={'checkout'}>
              <a
                href={`${checkout.webUrl}&locale=${'en'}`}
                target={'_blank'}
                rel={'noreferrer'}
              >
                <button
                  className={'checkoutBtn primary'}
                  aria-label="Checkout"
                  onClick={checkoutHandler}
                >
                  {'CHECKOUT'}
                </button>
              </a>
            </div>
          </>
        ) : (
          !updating && <p className={'cartEmpty'}>{'CART EMPTY'}</p>
        )}
        <button className={'closeCart'} onClick={hide} aria-label="Close cart">
          <i></i>
          <i></i>
        </button>
      </div>
      {updating ? <LoadingIndicator showBg={true} /> : null}
    </div>
  );
};
export default Cart;
