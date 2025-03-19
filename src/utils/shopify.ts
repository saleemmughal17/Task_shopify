const SHOPIFY_API_URL = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? "your-shop-name.myshopify.com"}/api/2023-01/graphql.json`;
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? "";

if (!ACCESS_TOKEN) {
  console.warn("⚠️ Warning: Shopify Access Token is missing. API calls may fail.");
}

// 🛍️ Fetch all products (with optional category filtering)
export async function getProducts(category?: string) {
  try {
    console.log("Fetching products from Shopify...", category);

    const query = `
      query {
        products(first: 20, query: "${category ?? ''}") {
          edges {
            node {
              id
              title
              handle
              description
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 1) {
                edges {
                  node {
                    originalSrc
                    altText
                  }
                }
              }
            }
          }
        }
      }
    `;

    const response = await fetch(SHOPIFY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": ACCESS_TOKEN,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) throw new Error("Failed to fetch products from Shopify.");

    const data = await response.json();

    return data.data.products.edges.map((edge: any) => ({
      id: edge.node.id,
      title: edge.node.title,
      handle: edge.node.handle,
      description: edge.node.description,
      price: edge.node.priceRange.minVariantPrice.amount,
      currency: edge.node.priceRange.minVariantPrice.currencyCode,
      image: edge.node.images.edges[0]?.node.originalSrc ?? "https://via.placeholder.com/500",
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// 🔍 Fetch single product by handle
export async function getProductByHandle(handle: string) {
  try {
    const query = `
      query($handle: String!) {
        productByHandle(handle: $handle) {
          id
          title
          handle
          description
          variants(first: 10) {
            edges {
              node {
                id
                title
                priceV2 {
                  amount
                  currencyCode
                }
              }
            }
          }
          images(first: 1) {
            edges {
              node {
                originalSrc
                altText
              }
            }
          }
        }
      }
    `;

    const response = await fetch(SHOPIFY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables: { handle } }),
    });

    if (!response.ok) throw new Error("Failed to fetch product details.");

    const data = await response.json();

    if (!data?.data?.productByHandle) return null;

    const product = data.data.productByHandle;
    const variant = product.variants.edges[0]?.node; // First variant

    return {
      id: product.id,
      title: product.title,
      handle: product.handle,
      description: product.description,
      variantId: variant?.id ?? null,
      price: variant?.priceV2.amount ?? "0",
      currency: variant?.priceV2.currencyCode ?? "USD",
      image: product.images.edges[0]?.node.originalSrc ?? "https://via.placeholder.com/500",
    };
  } catch (error) {
    console.error("Error fetching product details:", error);
    return null;
  }
}

// 🛒 Create Checkout & Return Checkout URL
export const createCheckout = async (variantId: string, quantity: number) => {
  try {
    if (!variantId || quantity <= 0) {
      throw new Error("Invalid variant ID or quantity.");
    }

    console.log("🛍️ Creating a new Shopify cart...");

    // 🛒 Step 1: Create a new cart
    const createCartResponse = await fetch(SHOPIFY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query: `
          mutation {
            cartCreate {
              cart {
                id
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
      }),
    });

    const createCartData = await createCartResponse.json();

    if (createCartData.errors) {
      console.error("❌ Shopify Cart Creation Error:", createCartData.errors);
      throw new Error("Error creating cart: " + JSON.stringify(createCartData.errors));
    }

    const cartId = createCartData?.data?.cartCreate?.cart?.id;
    if (!cartId) {
      throw new Error("Cart ID is missing in the response.");
    }

    console.log("✅ Cart Created with ID:", cartId);

    if (!variantId.startsWith("gid://shopify/ProductVariant/")) {
      variantId = `gid://shopify/ProductVariant/${variantId}`;
    }

    console.log("🛒 Adding Product to Cart:", variantId);

    const addItemResponse = await fetch(SHOPIFY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query: `
          mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
            cartLinesAdd(cartId: $cartId, lines: $lines) {
              cart {
                id
                checkoutUrl
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
        variables: {
          cartId,
          lines: [{ merchandiseId: variantId, quantity }],
        },
      }),
    });

    const addItemData = await addItemResponse.json();

    if (addItemData.errors) {
      console.error("❌ Shopify Cart Line Add Error:", addItemData.errors);
      throw new Error("Error adding product to cart: " + JSON.stringify(addItemData.errors));
    }

    const checkoutUrl = addItemData?.data?.cartLinesAdd?.cart?.checkoutUrl;
    if (!checkoutUrl) {
      throw new Error("Checkout URL missing from response.");
    }

    console.log("✅ Checkout URL:", checkoutUrl);
    return checkoutUrl;
  } catch (error) {
    console.error("❌ Error creating checkout:", error);
    return null;
  }
};
