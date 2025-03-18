"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { MdArrowBack } from "react-icons/md";
import { getProductByHandle } from "@/utils/shopify";
import { useCart } from "@/context/CartContext"; // Import the cart context

// Define the Product type for better type safety
type Product = {
  variantId: string;
  title: string;
  price: number;
  image: string;
  description: string;
};

type Props = {
  params: { productId: string };
};

const SingleProductPage = ({ params }: Props) => {
  const { addToCart } = useCart(); // Use the addToCart function from context
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [checkoutError, setCheckoutError] = useState("");

  // Fetch product details based on productId
  useEffect(() => {
    const fetchProduct = async () => {
      console.log("Fetching product with ID:", params.productId);
      setIsFetching(true);
      try {
        const product = await getProductByHandle(params.productId);
        if (product) {
          console.log("Product fetched successfully:", product);
          setSelectedProduct(product);
        } else {
          console.log("Product not found!");
          setCheckoutError("Product not found.");
        }
      } catch (error) {
        console.log("Error fetching product:", error);
        setCheckoutError("Error fetching product.");
      } finally {
        setIsFetching(false);
        console.log("Product fetch completed.");
      }
    };

    fetchProduct();
  }, [params.productId]);

  // Handle the add to cart process
  const handleAddToCart = () => {
    console.log("Adding product to cart...");

    if (!selectedProduct || !selectedProduct.variantId) {
      console.log("Product variant is unavailable.");
      setCheckoutError("Product variant is unavailable.");
      return;
    }

    const cartItem = {
      id: selectedProduct.variantId,
      title: selectedProduct.title,
      price: selectedProduct.price,
      image: selectedProduct.image,
      slug: params.productId,
      quantity: 1, // Default quantity is 1
    };

    console.log("Cart Item:", cartItem);

    setLoading(true);

    // Retrieve existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");

    // Check if product is already in the cart
    const existingItem = existingCart.find((item: any) => item.id === cartItem.id);
    if (existingItem) {
      existingItem.quantity += 1; // Increase quantity if product exists
    } else {
      existingCart.push(cartItem); // Otherwise, add the new product
    }

    // Save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(existingCart));

    // Add to Cart Context
    addToCart(cartItem);

    // Redirect after a small delay for better UX
    setTimeout(() => {
      console.log("Redirecting to cart...");
      window.location.href = "/cart";
    }, 500);
  };

  if (isFetching) {
    console.log("Loading product...");
    return <div className="text-center text-gray-700 text-xl mt-10">Loading product...</div>;
  }

  if (!selectedProduct) {
    console.log("No product selected.");
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

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={loading}
            className="mt-4 bg-black text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-800 transition-all"
          >
            {loading ? "Adding to Cart..." : "Add to Cart"}
          </button>

          {/* Display Checkout Error if any */}
          {checkoutError && <p className="text-red-500 mt-2">{checkoutError}</p>}
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;
