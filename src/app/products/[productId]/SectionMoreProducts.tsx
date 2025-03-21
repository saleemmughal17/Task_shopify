import React from "react";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/content";
import Heading from "@/shared/Heading/Heading";

const SectionMoreProducts = () => {
  return (
    <div>
      <Heading className="mb-0">Featured Products</Heading>

      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {products.slice(0, 3).map((product, index) => (
          <ProductCard
            key={product.slug || index} // ✅ Use slug as key (fallback to index)
            product={{
              id: product.slug || `product-${index}`, // ✅ Generate a fallback `id`
              title: product.productName || "Untitled", // ✅ Ensure `title`
              handle: product.slug || "", // ✅ Use `slug` as `handle`
              currency: "USD", // ✅ Default currency
              image: product.coverImage || "/placeholder.jpg", // ✅ Fallback image
              price: product.price || 0, // ✅ Default price
              description: product.description || "No description available", // ✅ Default description
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SectionMoreProducts;
