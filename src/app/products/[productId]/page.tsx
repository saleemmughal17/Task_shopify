"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { MdArrowBack } from "react-icons/md";
import { getProductByHandle, createCheckout } from "@/utils/shopify";

type Props = {
  params: { productId: string };
};

const SingleProductPage = ({ params }: Props) => {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [checkoutError, setCheckoutError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      console.log("Fetching product with handle:", params.productId); // Debug: Check the product ID being fetched
      setIsFetching(true);
      const product = await getProductByHandle(params.productId);
      console.log("Fetched product:", product); // Debug: Log the product fetched from API
      setSelectedProduct(product);
      setIsFetching(false);
    };

    fetchProduct();
  }, [params.productId]);

  const handleCheckout = async () => {
    if (!selectedProduct || !selectedProduct.variantId) {
      setCheckoutError("Product variant is unavailable.");
      console.log("Checkout error: Product variant is unavailable."); // Debug: Log when there's no variant
      return;
    }

    setLoading(true);
    setCheckoutError("");
    console.log("Starting checkout process for variant:", selectedProduct.variantId); // Debug: Log when checkout is initiated

    const checkoutUrl = await createCheckout(selectedProduct.variantId, 1);
    console.log("Checkout URL:", checkoutUrl); // Debug: Log the checkout URL returned

    setLoading(false);

    if (!checkoutUrl) {
      setCheckoutError("Checkout failed. Please try again.");
      console.log("Checkout failed. No URL returned."); // Debug: Log when checkout fails
    } else {
      window.location.href = checkoutUrl;
    }
  };

  if (isFetching) {
    console.log("Fetching product data..."); // Debug: Log when data is being fetched
    return <div className="text-center text-gray-700 text-xl mt-10">Loading product...</div>;
  }

  if (!selectedProduct) {
    console.log("Product not found."); // Debug: Log when the product is not found
    return <div className="text-center text-red-500 text-xl mt-10">Product not found!</div>;
  }

  return (
    <div className="container mx-auto px-4 lg:px-16 py-10">
      {/* Back Button */}
      <Link href="/products" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
        <MdArrowBack className="text-2xl" />
        <span className="text-lg">Back to Products</span>
      </Link>

      {/* Product Details */}
      <div className="mt-8 flex flex-col lg:flex-row gap-10 items-center">
        <div className="w-full lg:w-1/2">
          <img
            src={selectedProduct.image}
            alt={selectedProduct.title}
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        <div className="w-full lg:w-1/2 space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">{selectedProduct.title}</h1>
          <p className="text-xl font-semibold text-gray-700">${selectedProduct.price}</p>
          <p className="text-gray-600">{selectedProduct.description}</p>

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="mt-4 bg-black text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-800 transition-all"
          >
            {loading ? "Processing..." : "Buy Now"}
          </button>

          {/* Display Checkout Error if any */}
          {checkoutError && <p className="text-red-500 mt-2">{checkoutError}</p>}
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;
