import React from 'react';
import Client from 'shopify-buy';
import { useState, useEffect } from 'react';
import { SHOPIFY_DOMAIN, SHOPIFY_API_STOREFRONT_TOKEN } from '../config/env';

export const CartContext = React.createContext(null);

export const CartProvider = (props) => {

	const [checkout, setCheckout] = useState<any>(null);
	const [client, setClient] = useState<any>(null);
	const [updating, setUpdating] = useState<boolean>(false);
	const [open, setOpen] = useState<boolean>(false);

	useEffect(() => {
		console.log("Init cart");
		if (!client)
			initClient();
		else if (!checkout)
			createCheckout();
		else
			console.log("");
	}, []);

	useEffect(() => {

		if (client && !checkout) {
			let checkoutId = localStorage.getItem('checkoutId');
			if (checkoutId) {
				const check = async () => {
					try {
						let newCheckout = await client.checkout.fetch(checkoutId);
						if (newCheckout.completedAt !== null) {
							console.log("Checkout already complete, creating new");
							createCheckout();
						}
						else {
							console.log("Using existing checkout");
							setCheckout(newCheckout);
						}
					}
					catch (e) {
						console.log("Could not find existing checkout, create new");
						createCheckout();
					}
				}
				check();
			}
			else {
				createCheckout();
			}
		}
	}, [client]);

	useEffect(() => {
		if (checkout)
			console.log("Checkout:", checkout);
	}, [checkout]);


	const initClient = async () => {

		let client = await Client.buildClient({
			domain: SHOPIFY_DOMAIN,
			storefrontAccessToken: SHOPIFY_API_STOREFRONT_TOKEN
		});

		setClient(client);
	}

	const createCheckout = async () => {
		try {
			let checkout = await client.checkout.create();
			localStorage.setItem('checkoutId', checkout.id);
			setCheckout(checkout);
			console.log("New checkout created", checkout);
		}
		catch (e) {
			console.log(e);
		}
	}

	const addToCart = async (vid) => {

		if (client) {

			setUpdating(true);
			setOpen(true);

			try {
				// Fetch a single product by ID, numeric id must be base64 encoded!
				const variantIdBase64 = btoa("gid://shopify/ProductVariant/" + vid);
				console.log("Add to cart:", vid, variantIdBase64);

				let checkoutId = checkout.id;
				let product = [{
					variantId: variantIdBase64,
					quantity: 1,
				}];

				let newCheckout = await client.checkout.addLineItems(checkoutId, product);

				setCheckout(newCheckout);
				setUpdating(false);
			}
			catch (e) {
				console.log(e);
				setUpdating(false);
			}
		}
	}

	const removeLineItem = async (vid) => {

		if (client) {
			console.log("REMOVE:", vid);

			setUpdating(true);
			let checkoutId = checkout.id;
			let product = [vid];

			try {
				let updatedCheckout = await client.checkout.removeLineItems(checkoutId, product);
				setCheckout(updatedCheckout);
			}
			catch (e) {
				console.log(e);
			}

			setUpdating(false);
		}
	};

	const updateLineItemQuantity = async (vid, quantity) => {

		setUpdating(true);

		let checkoutId = checkout.id;
		//let variantIdBase64 = btoa("gid://shopify/ProductVariant/" + vid);
		let product = [{
			id: vid,
			quantity: quantity,
		}];

		let updatedCheckout = await client.checkout.updateLineItems(checkoutId, product);

		setCheckout(updatedCheckout);
		setUpdating(false);

	};

	const showCart = () => {
		setOpen(true);
	}

	const hideCart = () => {
		setOpen(false);
	}

	return (
		<CartContext.Provider value={{
			client,
			checkout,
			addToCart,
			showCart,
			hideCart,
			removeLineItem,
			open,
			updating,
			updateLineItemQuantity
		}}>
			{props.children}
		</CartContext.Provider>
	);
}