import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const body = await req.json(); // Ensure req.json() is awaited correctly
    const lineItems = body.lineItems;

    if (!lineItems || lineItems.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    if (!storeDomain || !storefrontToken) {
      console.error("Missing Shopify environment variables");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const response = await fetch(
      `https://${storeDomain}/api/2023-01/graphql.json`,
      {
        method: "POST",
        headers: {
          "X-Shopify-Storefront-Access-Token": storefrontToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            mutation CheckoutCreate($lineItems: [CheckoutLineItemInput!]!) {
              checkoutCreate(input: { lineItems: $lineItems }) {
                checkout {
                  webUrl
                }
                userErrors {
                  message
                }
              }
            }
          `,
          variables: { lineItems },
        }),
      }
    );

    const data = await response.json();

    if (data.errors || !data.data?.checkoutCreate?.checkout?.webUrl) {
      console.error("Shopify API Error:", data);
      return NextResponse.json({ error: "Shopify API error" }, { status: 500 });
    }

    return NextResponse.json({ checkoutUrl: data.data.checkoutCreate.checkout.webUrl });
  } catch (error) {
    console.error("Checkout API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
