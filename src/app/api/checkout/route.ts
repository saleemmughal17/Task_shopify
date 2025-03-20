import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { lineItems } = await req.json();

    if (!lineItems || lineItems.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    const response = await fetch(
      `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2023-01/graphql.json`,
      {
        method: "POST",
        headers: {
          "X-Shopify-Storefront-Access-Token": process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
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

    if (data.errors || !data.data.checkoutCreate.checkout.webUrl) {
      console.error("Shopify API Error:", data);
      return NextResponse.json({ error: "Shopify API error" }, { status: 500 });
    }

    return NextResponse.json({ checkoutUrl: data.data.checkoutCreate.checkout.webUrl });
  } catch (error) {
    console.error("Checkout API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


