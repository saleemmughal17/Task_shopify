// Shopify Storefront API endpoint
const SHOPIFY_API_URL = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2023-01/graphql.json`;

// Shopify Storefront Access Token (from .env.local)
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

// Function to fetch all products (multiple products)
export async function getProducts() {
  try {
    // Log the store domain and access token to check if the values are correct
    console.log("Shopify Store Domain:", process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN);
    console.log("Shopify Access Token:", ACCESS_TOKEN);

    // GraphQL query for fetching multiple products
    const query = `
      query {
        products(first: 20) {
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

    // Sending the request to Shopify API
    const response = await fetch(SHOPIFY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": ACCESS_TOKEN!,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error("Error fetching data from Shopify API");
    }

    const data = await response.json();
    console.log("Shopify data:", data); // Log the fetched data for debugging

    // Return formatted data
    return data.data.products.edges.map((edge: any) => ({
      id: edge.node.id,
      title: edge.node.title,
      handle: edge.node.handle,
      description: edge.node.description,
      price: edge.node.priceRange.minVariantPrice.amount,
      currency: edge.node.priceRange.minVariantPrice.currencyCode,
      image: edge?.node.images.edges[0]?.node.originalSrc || 'abc',
    }));

  } catch (error) {
    console.error("Error fetching products:", error);
    throw error; // Rethrow the error to ensure it's handled appropriately
  }
}

//  --------------------



export async function getProductByHandle(handle: string) {
  try {
    const query = `
      query($handle: String!) {
        productByHandle(handle: $handle) {
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
    `;
    const response = await fetch(SHOPIFY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": ACCESS_TOKEN!,
      },
      body: JSON.stringify({
        query,
        variables: { handle },
      }),
    });

    if (!response.ok) {
      throw new Error("Error fetching product from Shopify");
    }

    const data = await response.json();
    console.log("Shopify single product data:", data);

    if (data?.data?.productByHandle) {
      const product = data.data.productByHandle;
      return {
        id: product.id,
        title: product.title,
        handle: product.handle,
        description: product.description,
        price: product.priceRange.minVariantPrice.amount,
        currency: product.priceRange.minVariantPrice.currencyCode,
        image: product.images.edges[0]?.node.originalSrc || 'https://via.placeholder.com/500',  // Fallback image URL
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching product details:", error);
    return null;
  }
}


// Function to fetch a single product by handle (slug)
// export async function getProductByHandle(handle: string) {
//   try {
//     // Log the store domain and access token to check if the values are correct
//     console.log("Shopify Store Domain:", process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN);
//     console.log("Shopify Access Token:", ACCESS_TOKEN);

//     // GraphQL query for fetching a single product by handle
//     const query = `
//       query($handle: String!) {
//         productByHandle(handle: $handle) {
//           id
//           title
//           handle
//           description
//           priceRange {
//             minVariantPrice {
//               amount
//               currencyCode
//             }
//           }
//           images(first: 1) {
//             edges {
//               node {
//                 originalSrc
//                 altText
//               }
//             }
//           }
//         }
//       }
//     `;

//     // Sending the request to Shopify API with the handle variable
//     const response = await fetch(SHOPIFY_API_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "X-Shopify-Storefront-Access-Token": ACCESS_TOKEN!,
//       },
//       body: JSON.stringify({
//         query,
//         variables: { handle }, // Pass the handle as a variable to the query
//       }),
//     });

//     if (!response.ok) {
//       throw new Error("Error fetching data from Shopify API");
//     }

//     const data = await response.json();
//     console.log("Shopify single product data:", data); // Log the fetched data for debugging

//     // Check if product exists and return the product data
//     if (data?.data?.productByHandle) {
//       return {
//         id: data.data.productByHandle.id,
//         title: data.data.productByHandle.title,
//         handle: data.data.productByHandle.handle,
//         description: data.data.productByHandle.description,
//         price: data.data.productByHandle.priceRange.minVariantPrice.amount,
//         currency: data.data.productByHandle.priceRange.minVariantPrice.currencyCode,
//         image: data.data.productByHandle.images.edges[0]?.node.originalSrc || 'nul',
//       };
//     } else {
//       throw new Error("Product not found");
//     }

//   } catch (error) {
//     console.error("Error fetching product details:", error);
//     throw error; // Rethrow the error to ensure it's handled appropriately
//   }
// }



// // Function to fetch a single product by handle (slug)
// export async function getProductByHandle(handle: string) {
//   try {
//     // Log the store domain and access token to check if the values are correct
//     console.log("Shopify Store Domain:", process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN);
//     console.log("Shopify Access Token:", ACCESS_TOKEN);

//     // GraphQL query for fetching a single product by handle
//     const query = `
//       query($handle: String!) {
//         productByHandle(handle: $handle) {
//           id
//           title
//           handle
//           description
//           priceRange {
//             minVariantPrice {
//               amount
//               currencyCode
//             }
//           }
//           images(first: 1) {
//             edges {
//               node {
//                 originalSrc
//                 altText
//               }
//             }
//           }
//         }
//       }
//     `;

//     // Sending the request to Shopify API with the handle variable
//     const response = await fetch(SHOPIFY_API_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "X-Shopify-Storefront-Access-Token": ACCESS_TOKEN!,
//       },
//       body: JSON.stringify({
//         query,
//         variables: { handle }, // Pass the handle as a variable to the query
//       }),
//     });

//     if (!response.ok) {
//       throw new Error("Error fetching data from Shopify API");
//     }

//     const data = await response.json();
//     console.log("Shopify product data:", data); // Log the fetched data for debugging

//     // Check if product exists and return the product data
//     if (data?.data?.productByHandle) {
//       return {
//         id: data.data.productByHandle.id,
//         title: data.data.productByHandle.title,
//         handle: data.data.productByHandle.handle,
//         description: data.data.productByHandle.description,
//         price: data.data.productByHandle.priceRange.minVariantPrice.amount,
//         currency: data.data.productByHandle.priceRange.minVariantPrice.currencyCode,
//         image: data.data.productByHandle.images.edges[0]?.node.originalSrc || 'abc',
//       };
//     } else {
//       throw new Error("Product not found");
//     }

//   } catch (error) {
//     console.error("Error fetching product details:", error);
//     throw error; // Rethrow the error to ensure it's handled appropriately
//   }
// }
