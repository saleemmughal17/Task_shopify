"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import SidebarFilters from "@/components/SideBarFilter";
import SortBy from "@/components/SortBy";
import { getProducts } from "@/utils/shopify";
import SectionProductsHeader from "./SectionProductsHeader";

const Page = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([100, 500]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch products when the page loads OR when category changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null); // Reset error state
      try {
        console.log("Fetching products from Shopify...", selectedCategory);
        const fetchedProducts = await getProducts(selectedCategory ?? undefined);
        console.log("Fetched products:", fetchedProducts);

        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
      } catch (err: any) {
        setError("Error fetching products from Shopify");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
        console.log("Fetching products complete.");
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  // Apply Filtering Logic
  useEffect(() => {
    if (!products.length) return;

    const updatedProducts = products.filter(
      (product) => Number(product.price) >= priceRange[0] && Number(product.price) <= priceRange[1]
    );

    setFilteredProducts(updatedProducts);
    console.log("Filtered Products:", updatedProducts);
  }, [priceRange, products]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mb-20">
      {/* Section Header with Category Selector */}
      <div className="mb-10">
        <SectionProductsHeader onCategorySelect={setSelectedCategory} />
      </div>

      <div className="relative flex flex-col lg:flex-row" id="body">
        {/* Sidebar Filters */}
        <aside className="pr-4 lg:basis-1/3 xl:basis-1/4">
          <SidebarFilters onPriceChange={(range: number[]) => setPriceRange([range[0] ?? 100, range[1] ?? 500])} />
        </aside>

        <div className="mb-10 shrink-0 border-t lg:mx-4 lg:mb-0 lg:border-t-0" />

        {/* Main Product List */}
        <main className="relative flex-1">
          <div className="mb-5 flex items-center justify-between">
            <SortBy />
            <span className="text-sm">{filteredProducts.length} items</span>
          </div>
          <div className="grid flex-1 gap-10 sm:grid-cols-2 xl:grid-cols-2 2xl:gap-12">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((item) => <ProductCard product={item} key={item.id} />)
            ) : (
              <div className="text-gray-500">No products found.</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;
