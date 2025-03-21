const SHOPIFY_API_URL = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2023-01/graphql.json`;
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? "";

if (!ACCESS_TOKEN) {
  console.warn("⚠️ Warning: Shopify Access Token is missing. API calls may fail.");
}

// ✅ **Reusable Product Fields**
const productFields = `
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
`;

// 🔥 **Helper Function to Fetch Data**
async function fetchShopifyData(query: string, type: string) {
  try {
    console.log(`🚀 Fetching Shopify Data: ${type}...`);
    const response = await fetch(SHOPIFY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": ACCESS_TOKEN,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) throw new Error(`❌ API Error: ${response.statusText}`);

    const data = await response.json();
    console.log(`✅ Shopify API Response [${type}]:`, data);

    if (type === "collections") {
      return data?.data?.collections?.edges?.map((edge: { node: any }) => edge.node) ?? [];
    }
    if (type === "collection") {
      return data?.data?.collectionByHandle?.products?.edges?.map(formatProduct) ?? [];
    }
    if (type === "product") {
      return data?.data?.productByHandle ? formatProduct({ node: data.data.productByHandle }) : null;
    }
    return data?.data?.products?.edges?.map(formatProduct) ?? [];

  } catch (error) {
    console.error(`❌ Shopify API Error [${type}]:`, error);
    return type === "product" ? null : [];
  }
}

// ✅ **Define Type for Product Edge**
interface ProductEdge {
  node: {
    id: string;
    title: string;
    handle: string;
    description?: string;
    priceRange?: {
      minVariantPrice?: {
        amount: string;
        currencyCode: string;
      };
    };
    variants?: {
      edges: {
        node: {
          id: string;
        };
      }[];
    };
    images?: {
      edges: {
        node: {
          originalSrc: string;
        };
      }[];
    };
  };
}

// ✅ **Format Product Data**
function formatProduct(edge: ProductEdge) {
  return {
    id: edge.node.id,
    title: edge.node.title,
    handle: edge.node.handle,
    description: edge.node.description ?? "No description available.",
    price: edge.node.priceRange?.minVariantPrice?.amount ?? "0",
    currency: edge.node.priceRange?.minVariantPrice?.currencyCode ?? "USD",
    variantId: edge.node.variants?.edges[0]?.node?.id ?? null,
    image: edge.node.images?.edges[0]?.node?.originalSrc ?? "https://via.placeholder.com/500",
  };
}

// 🛍️ **Get All Products**
export async function getProducts() {
  console.log("📦 Fetching all products...");
  const query = `
    query {
      products(first: 20) {
        edges {
          node {
            ${productFields}
          }
        }
      }
    }
  `;

  return await fetchShopifyData(query, "products");
}

// 🔍 **Get Products by Collection**
export async function getProductsByCollection(collectionHandle: string) {
  console.log(`🔍 Fetching products from collection: ${collectionHandle}`);
  const query = `
    query {
      collectionByHandle(handle: "${collectionHandle}") {
        products(first: 20) {
          edges {
            node {
              ${productFields}
            }
          }
        }
      }
    }
  `;

  return await fetchShopifyData(query, "collection");
}

// 📦 **Get All Collections**
export async function getCollections() {
  console.log("📁 Fetching all collections...");
  const query = `
    query {
      collections(first: 20) {
        edges {
          node {
            id
            title
            handle
          }
        }
      }
    }
  `;

  return await fetchShopifyData(query, "collections");
}

// 🔍 **Get Single Product by Handle**
export async function getProduct(handle: string) {
  console.log(`🛒 Fetching product: ${handle}`);
  
  const query = `
    query {
      productByHandle(handle: "${handle}") {
        ${productFields}
      }
    }
  `;

  return await fetchShopifyData(query, "product");
}
