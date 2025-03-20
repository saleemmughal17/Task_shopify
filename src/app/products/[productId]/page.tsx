"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MdArrowBack } from "react-icons/md";
import { getProductByHandle } from "@/utils/shopify";
import { useCart } from "@/context/CartContext";

type Product = {
  title: string;
  price: number;
  image: string;
  description: string;
  variantId: string;
};

type Props = {
  params: { productId: string };
};

const SingleProductPage = ({ params }: Props) => {
  const router = useRouter();
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [checkoutError, setCheckoutError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      setIsFetching(true);
      setCheckoutError("");
      try {
        const product = await getProductByHandle(params.productId);

        if (product && product.variantId) {
          setSelectedProduct({
            title: product.title,
            price: product.price,
            image: product.image,
            description: product.description,
            variantId: product.variantId, // ✅ Correctly set variantId
          });
        } else {
          setCheckoutError("Product variant is unavailable.");
        }
      } catch (error) {
        setCheckoutError("Error fetching product.");
      } finally {
        setIsFetching(false);
      }
    };

    fetchProduct();
  }, [params.productId]);

  const handleAddToCart = () => {
    if (!selectedProduct || !selectedProduct.variantId) {
      setCheckoutError("Product variant is unavailable.");
      return;
    }

    const cartItem = {
      variantId: selectedProduct.variantId, // ✅ Correct key name
      title: selectedProduct.title,
      price: selectedProduct.price,
      image: selectedProduct.image,
      slug: params.productId,
      quantity: 1,
    };

    setLoading(true);

    try {
      addToCart(cartItem);
      router.push("/cart"); // Redirect to cart page
    } catch (error) {
      setCheckoutError("Error adding to cart.");
    } finally {
      setLoading(false);
    }
  };

  if (isFetching) {
    return <div className="text-center text-gray-700 text-xl mt-10">Loading product...</div>;
  }

  if (!selectedProduct) {
    return <div className="text-center text-red-500 text-xl mt-10">{checkoutError || "Product not found!"}</div>;
  }

  return (
    <div className="container mx-auto px-4 lg:px-16 py-10">
      <Link href="/products" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
        <MdArrowBack className="text-2xl" />
        <span className="text-lg">Back to Products</span>
      </Link>

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

          <button
            onClick={handleAddToCart}
            disabled={loading}
            className="mt-4 bg-black text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-800 transition-all"
          >
            {loading ? "Adding to Cart..." : "Add to Cart"}
          </button>

          {checkoutError && <p className="text-red-500 mt-2">{checkoutError}</p>}
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;
