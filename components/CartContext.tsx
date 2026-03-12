import React from 'react';
import Client from 'shopify-buy';
import { useState, useEffect } from 'react';
import { SHOPIFY_DOMAIN, SHOPIFY_API_STOREFRONT_TOKEN } from '../config/env';
import { useLocalStorage } from '../hooks/useLocalStorage';

type ShopifyMoney = {
  amount: string;
};

type ShopifyVariantImage = {
  src: string;
};

type ShopifyVariant = {
  id: string;
  title: string;
  image: ShopifyVariantImage;
  price: ShopifyMoney;
};

export type CheckoutLineItem = {
  id: string;
  quantity: number;
  title: string;
  variant: ShopifyVariant;
};

export type Checkout = {
  id: string;
  webUrl: string;
  completedAt: string | null;
  lineItems: CheckoutLineItem[];
  lineItemsSubtotalPrice: ShopifyMoney;
};

type AddLineItemInput = {
  variantId: string;
  quantity: number;
};

type UpdateLineItemInput = {
  id: string;
  quantity: number;
};

type ShopifyClient = {
  checkout: {
    create: () => Promise<Checkout>;
    fetch: (checkoutId: string) => Promise<Checkout>;
    addLineItems: (
      checkoutId: string,
      lineItems: AddLineItemInput[]
    ) => Promise<Checkout>;
    removeLineItems: (
      checkoutId: string,
      lineItemIds: string[]
    ) => Promise<Checkout>;
    updateLineItems: (
      checkoutId: string,
      lineItems: UpdateLineItemInput[]
    ) => Promise<Checkout>;
  };
};

export type CartContextValue = {
  client: ShopifyClient | null;
  checkout: Checkout | null;
  addToCart: (variantId: string) => Promise<void>;
  showCart: () => void;
  hideCart: () => void;
  removeLineItem: (lineItemId: string) => Promise<void>;
  open: boolean;
  updating: boolean;
  updateLineItemQuantity: (
    lineItemId: string,
    quantity: number
  ) => Promise<void>;
};

export const CartContext = React.createContext<CartContextValue | null>(null);

export const useCartContext = (): CartContextValue => {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within CartProvider');
  }
  return context;
};

type CartProviderProps = {
  children: React.ReactNode;
};

export const CartProvider = (props: CartProviderProps) => {
  const [checkout, setCheckout] = useLocalStorage<Checkout | null>(
    'checkout',
    null
  );
  const [client, setClient] = useState<ShopifyClient | null>(null);
  const [checked, setChecked] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const initClient = async () => {
    try {
      const client = Client.buildClient({
        domain: SHOPIFY_DOMAIN,
        storefrontAccessToken: SHOPIFY_API_STOREFRONT_TOKEN,
      }) as ShopifyClient;
      setClient(client);
      console.log('Shopify client init');
    } catch (e) {
      console.log(e);
    }
  };

  const createCheckout = async () => {
    if (!client) return;
    try {
      const checkout = await client.checkout.create();
      setCheckout(checkout);
      setChecked(true);
      //console.log('New checkout created', checkout);
    } catch (e) {
      console.log(e);
    }
  };

  const addToCart = async (vid: string): Promise<void> => {
    if (client) {
      setUpdating(true);
      setOpen(true);

      try {
        //console.log('Add to cart:', vid);

        if (!checkout) {
          setUpdating(false);
          return;
        }

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

  const removeLineItem = async (vid: string): Promise<void> => {
    if (client) {
      //console.log('REMOVE:', vid);

      setUpdating(true);

      if (!checkout) {
        setUpdating(false);
        return;
      }

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

  const updateLineItemQuantity = async (
    vid: string,
    quantity: number
  ): Promise<void> => {
    setUpdating(true);

    if (!client || !checkout) {
      setUpdating(false);
      return;
    }

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
    if (!client) {
      initClient();
    }
  }, [client]);

  useEffect(() => {
    if (client && !checkout) {
      createCheckout();
    }
  }, [client, checkout]);

  useEffect(() => {
    const check = async () => {
      if (!client || !checkout) return;
      try {
        const newCheckout = await client.checkout.fetch(checkout.id);
        if (newCheckout.completedAt !== null) {
          createCheckout();
        } else {
          setChecked(true);
        }
      } catch (e) {
        createCheckout();
      }
    };

    if (client && checkout && !checked) {
      check();
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
