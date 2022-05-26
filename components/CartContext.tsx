import React from 'react';
import Client from 'shopify-buy';
import { useState, useEffect } from 'react';
import { SHOPIFY_DOMAIN, SHOPIFY_API_STOREFRONT_TOKEN } from '../config/env';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const CartContext = React.createContext(null);

export const CartProvider = (props) => {
  const [checkout, setCheckout] = useLocalStorage('checkout', null);
  const [client, setClient] = useState<any>(null);
  const [checked, setChecked] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const initClient = async () => {
    try {
      const client = await Client.buildClient({
        domain: SHOPIFY_DOMAIN,
        storefrontAccessToken: SHOPIFY_API_STOREFRONT_TOKEN,
      });
      setClient(client);
      console.log('Shopify client init');
    } catch (e) {
      console.log(e);
    }
  };

  const createCheckout = async () => {
    try {
      const checkout = await client.checkout.create();
      setCheckout(checkout);
      setChecked(true);
      console.log('New checkout created', checkout);
    } catch (e) {
      console.log(e);
    }
  };

  const addToCart = async (vid) => {
    if (client) {
      setUpdating(true);
      setOpen(true);

      try {
        console.log('Add to cart:', vid);

        const checkoutId = checkout.id;
        const product = [
          {
            variantId: vid,
            quantity: 1,
          },
        ];

        const newCheckout = await client.checkout.addLineItems(
          checkoutId,
          product
        );

        setCheckout(newCheckout);
        setUpdating(false);
      } catch (e) {
        console.log(e);
        setUpdating(false);
      }
    }
  };

  const removeLineItem = async (vid) => {
    if (client) {
      console.log('REMOVE:', vid);

      setUpdating(true);
      const checkoutId = checkout.id;
      const product = [vid];

      try {
        const updatedCheckout = await client.checkout.removeLineItems(
          checkoutId,
          product
        );
        setCheckout(updatedCheckout);
      } catch (e) {
        console.log(e);
      }

      setUpdating(false);
    }
  };

  const updateLineItemQuantity = async (vid, quantity) => {
    setUpdating(true);

    const checkoutId = checkout.id;
    //let variantIdBase64 = btoa("gid://shopify/ProductVariant/" + vid);
    const product = [
      {
        id: vid,
        quantity: quantity,
      },
    ];

    const updatedCheckout = await client.checkout.updateLineItems(
      checkoutId,
      product
    );

    setCheckout(updatedCheckout);
    setUpdating(false);
  };

  const showCart = () => {
    setOpen(true);
  };

  const hideCart = () => {
    setOpen(false);
  };

  useEffect(() => {
    const check = async () => {
      console.log('Double checking', checkout);
      try {
        const newCheckout = await client.checkout.fetch(checkout.id);
        console.log(newCheckout);
        if (newCheckout.completedAt !== null) {
          console.log('Checkout already complete, creating new');
          createCheckout();
        } else {
          console.log('Using existing checkout');
          setChecked(true);
        }
      } catch (e) {
        console.log('Could not find existing checkout, create new', e);
        createCheckout();
      }
    };

    if (!client) initClient();
    else {
      if (!checkout) createCheckout();
      else {
        if (!checked) check();
      }
    }
  }, [client, checkout, checked]);

  return (
    <CartContext.Provider
      value={{
        client,
        checkout,
        addToCart,
        showCart,
        hideCart,
        removeLineItem,
        open,
        updating,
        updateLineItemQuantity,
      }}
    >
      {props.children}
    </CartContext.Provider>
  );
};
