
const SHOPIFY_API_URL = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2023-01/graphql.json`;
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

// Function to fetch all products
export async function getProducts() {
  try {
    console.log("Shopify Store Domain:", process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN);
    console.log("Shopify Access Token:", ACCESS_TOKEN);

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

    const response = await fetch(SHOPIFY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": ACCESS_TOKEN,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) throw new Error("Error fetching data from Shopify API");

    const data = await response.json();
    console.log("Shopify data:", data);

    return data.data.products.edges.map((edge) => ({
      id: edge.node.id,
      title: edge.node.title,
      handle: edge.node.handle,
      description: edge.node.description,
      price: edge.node.priceRange.minVariantPrice.amount,
      currency: edge.node.priceRange.minVariantPrice.currencyCode,
      image: edge.node.images.edges[0]?.node.originalSrc || 'https://via.placeholder.com/500',
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}




 // Function to fetch a single product by handle (including variants)
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

    if (!response.ok) throw new Error("Error fetching product from Shopify");

    const data = await response.json();
    console.log("Shopify single product data:", data);

    if (data?.data?.productByHandle) {
      const product = data.data.productByHandle;
      // Assuming you want the first variant (if there are multiple)
      const variant = product.variants.edges[0]?.node;
      return {
        id: product.id,
        title: product.title,
        handle: product.handle,
        description: product.description,
        variantId: variant?.id,  // Use the variant id for checkout
        price: variant?.priceV2.amount,
        currency: variant?.priceV2.currencyCode,
        image: product.images.edges[0]?.node.originalSrc || 'https://via.placeholder.com/500',
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching product details:", error);
    return null;
  }
}


// Function to create a checkout session


export const createCheckout = async (variantId: string, quantity: number) => {
  try {
    // Create the cart
    const response = await fetch(SHOPIFY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || "",
      },
      body: JSON.stringify({
        query: `
          mutation CartCreate {
            cartCreate {
              cart {
                id
              }
            }
          }
        `,
      }),
    });

    const data = await response.json();

    // Check for errors in the response
    if (data.errors) {
      console.error("Shopify API errors:", data.errors);
      throw new Error("Error creating cart: " + JSON.stringify(data.errors));
    }

    const cartId = data.data.cartCreate.cart.id;

    // Add the product to the cart
    const addItemResponse = await fetch(SHOPIFY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || "",
      },
      body: JSON.stringify({
        query: `
          mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
            cartLinesAdd(cartId: $cartId, lines: $lines) {
              cart {
                id
                checkoutUrl
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

    // Check for errors after adding items to the cart
    if (addItemData.errors) {
      console.error("Error adding product to cart:", addItemData.errors);
      throw new Error("Error adding product to cart.");
    }

    // Safely check for checkoutUrl before using it
    const checkoutUrl = addItemData.data.cartLinesAdd.cart.checkoutUrl;

    if (!checkoutUrl) {
      console.error("Checkout URL is missing from the response.");
      throw new Error("Checkout URL is missing.");
    }

    return checkoutUrl;
  } catch (error) {
    console.error("Error creating checkout:", error);
    return null;
  }
};




 // Function to create a cart and add the product to it
// export const createCheckout = async (variantId: string, quantity: number) => {
//   try {
//     const response = await fetch(SHOPIFY_API_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "X-Shopify-Storefront-Access-Token": process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || "",
//       },
//       body: JSON.stringify({
//         query: `
//           mutation CartCreate {
//             cartCreate {
//               cart {
//                 id
//                 lines(first: 1) {
//                   edges {
//                     node {
//                       id
//                       quantity
//                     }
//                   }
//                 }
//                 checkoutUrl
//               }
//             }
//           }
//         `,
//       }),
//     });

//     // Check if response is valid JSON
//     const contentType = response.headers.get("content-type");
//     if (!contentType || !contentType.includes("application/json")) {
//       throw new Error("Invalid response from Shopify API (not JSON)");
//     }

//     const data = await response.json();

//     if (data.errors) {
//       console.error("Shopify API errors:", data.errors);
//       throw new Error("Shopify API error: " + JSON.stringify(data.errors));
//     }

//     const cartId = data.data.cartCreate.cart.id;

//     // Add the product to the cart
//     const addItemResponse = await fetch(SHOPIFY_API_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "X-Shopify-Storefront-Access-Token": process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || "",
//       },
//       body: JSON.stringify({
//         query: `
//           mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
//             cartLinesAdd(cartId: $cartId, lines: $lines) {
//               cart {
//                 id
//                 checkoutUrl
//               }
//             }
//           }
//         `,
//         variables: {
//           cartId,
//           lines: [{ merchandiseId: variantId, quantity }],
//         },
//       }),
//     });

//     const addItemData = await addItemResponse.json();

//     if (addItemData.errors) {
//       console.error("Error adding product to cart:", addItemData.errors);
//       throw new Error("Error adding product to cart.");
//     }

//     const checkoutUrl = addItemData.data.cartLinesAdd.cart.checkoutUrl;
//     return checkoutUrl;
//   } catch (error) {
//     console.error("Error creating checkout:", error);
//     return null;
//   }
// };

  
// Function to create a checkout session
// export const createCheckout = async (variantId: string, quantity: number) => {
//   try {
//     const response = await fetch(SHOPIFY_API_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "X-Shopify-Storefront-Access-Token": process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || "",
//       },
//       body: JSON.stringify({
//         query: `
//           mutation CheckoutCreate($input: CheckoutCreateInput!) {
//             checkoutCreate(input: $input) {
//               checkout {
//                 webUrl
//               }
//               userErrors {
//                 field
//                 message
//               }
//             }
//           }
//         `,
//         variables: {
//           input: {
//             lineItems: [{ variantId, quantity }],
//           },
//         },
//       }),
//     });

//     // Check if response is valid JSON
//     const contentType = response.headers.get("content-type");
//     if (!contentType || !contentType.includes("application/json")) {
//       throw new Error("Invalid response from Shopify API (not JSON)");
//     }

//     const data = await response.json();

//     if (data.errors) {
//       console.error("Shopify API errors:", data.errors);
//       throw new Error("Shopify API error: " + JSON.stringify(data.errors));
//     }

//     if (data.data?.checkoutCreate?.userErrors.length) {
//       console.error("Shopify checkout errors:", data.data.checkoutCreate.userErrors);
//       throw new Error("Checkout error: " + data.data.checkoutCreate.userErrors[0].message);
//     }

//     return data.data?.checkoutCreate?.checkout?.webUrl || null;
//   } catch (error) {
//     console.error("Error creating checkout:", error);
//     return null;
//   }
// };





// export const createCheckout = async (productId: string, quantity: number) => {
//   try {
//     const response = await fetch(SHOPIFY_API_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "X-Shopify-Storefront-Access-Token": process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || "",
//       },
//       body: JSON.stringify({
//         query: `
//           mutation CheckoutCreate($input: CheckoutCreateInput!) {
//             checkoutCreate(input: $input) {
//               checkout {
//                 webUrl
//               }
//               userErrors {
//                 field
//                 message
//               }
//             }
//           }
//         `,
//         variables: {
//           input: {
//             lineItems: [{ variantId: productId, quantity }],
//           },
//         },
//       }),
//     });

//     // Check if response is valid JSON
//     const contentType = response.headers.get("content-type");
//     if (!contentType || !contentType.includes("application/json")) {
//       throw new Error("Invalid response from Shopify API (not JSON)");
//     }

//     const data = await response.json();

//     if (data.errors) {
//       console.error("Shopify API errors:", data.errors);
//       throw new Error("Shopify API error: " + JSON.stringify(data.errors));
//     }

//     if (data.data?.checkoutCreate?.userErrors.length) {
//       console.error("Shopify checkout errors:", data.data.checkoutCreate.userErrors);
//       throw new Error("Checkout error: " + data.data.checkoutCreate.userErrors[0].message);
//     }

//     return data.data?.checkoutCreate?.checkout?.webUrl || null;
//   } catch (error) {
//     console.error("Error creating checkout:", error);
//     return null;
//   }
// };
