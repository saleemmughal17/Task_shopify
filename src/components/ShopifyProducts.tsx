"use client";
import { useEffect, useState } from "react";
import { getProducts } from "../utils/shopify";

export default function ShopifyProducts() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const data = await getProducts();
      setProducts(data);
    }
    fetchProducts();
  }, []);

  return (
    <div className="py-24 bg-white">
      <h2 className="text-3xl font-bold text-center mb-6">Shopify Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded-lg shadow">
            <img
              src={product.images[0]?.url}
              alt={product.images[0]?.altText}
              className="w-full h-48 object-cover rounded-md"
            />
            <h3 className="text-lg font-bold mt-2">{product.title}</h3>
            <p className="text-gray-500">{product.description}</p>
            <p className="text-blue-600 font-semibold mt-2">${product.priceRange.minVariantPrice.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
