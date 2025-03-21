"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import SidebarFilters from "@/components/SideBarFilter";
import SortBy from "@/components/SortBy";
import { getProducts, getProductsByCollection, getCollections } from "@/utils/shopify";
import SectionProductsHeader from "@/app/products/SectionProductsHeader";

const Page = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([100, 500]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

  // 🛍 Fetch Collections on Mount
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        console.log("📁 Fetching collections...");
        const fetchedCollections = await getCollections();
        setCollections(fetchedCollections);
      } catch (err) {
        console.error("❌ Error fetching collections:", err);
        setError("Failed to load collections.");
      }
    };
    fetchCollections();
  }, []);

  // 📦 Fetch Products (All or By Collection)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let fetchedProducts = selectedCollection
          ? await getProductsByCollection(selectedCollection)
          : await getProducts();

        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
      } catch (err) {
        console.error("❌ Shopify Fetch Error:", err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCollection]);

  // 🔍 Apply Price Filter
  useEffect(() => {
    setFilteredProducts(
      products.filter(
        (product) =>
          Number(product.price) >= priceRange[0] &&
          Number(product.price) <= priceRange[1]
      )
    );
  }, [priceRange, products]);

  // 🌀 Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // ❌ Error State
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mb-20">
      {/* 📌 Header Section */}
      <div className="mb-10">
        <SectionProductsHeader
          collections={collections}
          onCategorySelect={setSelectedCollection}
          selectedCategory={selectedCollection}
        />
      </div>

      <div className="relative flex flex-col lg:flex-row" id="body">
        {/* 🛒 Sidebar Filters */}
        <aside className="pr-4 lg:basis-1/3 xl:basis-1/4">
          <SidebarFilters onPriceChange={(range) => setPriceRange([range[0] ?? 100, range[1] ?? 500])} />
        </aside>

        {/* 📌 Separator */}
        <div className="mb-10 shrink-0 border-t lg:mx-4 lg:mb-0 lg:border-t-0" />

        {/* 📦 Product List */}
        <main className="relative flex-1">
          <div className="mb-5 flex items-center justify-between">
            <SortBy />
            <span className="text-sm">{filteredProducts.length} items</span>
          </div>
          <div className="grid flex-1 gap-10 sm:grid-cols-2 xl:grid-cols-2 2xl:gap-12">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((item) =>
                item?.id ? (
                  <ProductCard
                    product={{
                      ...item,
                      image: item.image ?? "https://dummyimage.com/500x500/ddd/000.png&text=No+Image",
                    }}
                    key={item.id}
                  />
                ) : null
              )
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
