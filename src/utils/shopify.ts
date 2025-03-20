const SHOPIFY_API_URL = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? "your-shop-name.myshopify.com"}/api/2023-01/graphql.json`;
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? "";

if (!ACCESS_TOKEN) {
  console.warn("⚠️ Warning: Shopify Access Token is missing. API calls may fail.");
}

// 🛍️ Fetch all products (with optional category filtering)
export async function getProducts(category?: string) {
  try {
    console.log("Fetching products from Shopify... Category:", category);

    const categoryFilter = category ? `, query: "tag:${category}"` : ""; // ✅ Fix for optional category filtering

    const query = `
      query {
        products(first: 20 ${categoryFilter}) {
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
              variants(first: 1) {
                edges {
                  node {
                    id
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

    if (!response.ok) throw new Error(`Failed to fetch products. Status: ${response.status}`);

    const data = await response.json();

    if (!data?.data?.products) throw new Error("Invalid response structure from Shopify API.");

    return data.data.products.edges.map((edge: any) => {
      const variantId = edge.node.variants.edges[0]?.node.id ?? null; // ✅ Ensure variantId exists
      return {
        id: edge.node.id,
        title: edge.node.title,
        handle: edge.node.handle,
        description: edge.node.description ?? "",
        price: edge.node.priceRange?.minVariantPrice?.amount ?? "0",
        currency: edge.node.priceRange?.minVariantPrice?.currencyCode ?? "USD",
        variantId: variantId,
        image: edge.node.images.edges[0]?.node.originalSrc ?? "https://via.placeholder.com/500",
      };
    });
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return [];
  }
}

// 🔍 Fetch single product by handle
export async function getProductByHandle(handle: string) {
  try {
    console.log(`Fetching product details for: ${handle}`);

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

    if (!response.ok) throw new Error(`Failed to fetch product details. Status: ${response.status}`);

    const data = await response.json();

    if (!data?.data?.productByHandle) {
      console.warn("⚠️ No product found for handle:", handle);
      return null;
    }

    const product = data.data.productByHandle;
    const variant = product.variants.edges[0]?.node ?? null; // ✅ Ensure variant exists

    return {
      id: product.id,
      title: product.title,
      handle: product.handle,
      description: product.description ?? "",
      variantId: variant?.id ?? null,
      price: variant?.priceV2?.amount ?? "0",
      currency: variant?.priceV2?.currencyCode ?? "USD",
      image: product.images.edges[0]?.node.originalSrc ?? "https://via.placeholder.com/500",
    };
  } catch (error) {
    console.error("❌ Error fetching product details:", error);
    return null;
  }
}
