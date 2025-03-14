// /pages/api/create-checkout.ts

import { NextApiRequest, NextApiResponse } from 'next';

const SHOPIFY_API_URL = 'https://your-shopify-store.myshopify.com/api/2023-01/graphql.json'; // Replace with your Shopify store URL
const SHOPIFY_API_PASSWORD = 'your-shopify-api-password'; // Your private app's API password

const createCheckout = async (lineItems: Array<{ variantId: string, quantity: number }>) => {
  const query = `
    mutation checkoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          webUrl
        }
        checkoutUserErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      lineItems: lineItems,
    },
  };

  const response = await fetch(SHOPIFY_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_API_PASSWORD, // Storefront access token for authentication
    },
    body: JSON.stringify({ query, variables }),
  });

  const data = await response.json();

  if (data.errors) {
    throw new Error('Error creating checkout: ' + JSON.stringify(data.errors));
  }

  return data.data.checkoutCreate.checkout.webUrl; // The URL to redirect to Shopify checkout page
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const { lineItems } = req.body;

      if (!lineItems || lineItems.length === 0) {
        return res.status(400).json({ error: 'Line items are required.' });
      }

      const checkoutUrl = await createCheckout(lineItems);

      return res.status(200).json({ checkoutUrl });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
