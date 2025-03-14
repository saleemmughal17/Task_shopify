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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts); // Initially, show all products
      } catch (err: any) {
        setError("Error fetching products from Shopify");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (!products.length) return;

    // Filter products based on price range, handling possible undefined prices
    const updatedProducts = products.filter((product) => {
      const productPrice = product?.price ?? 0; // Ensure productPrice is defined
      return productPrice >= priceRange[0] && productPrice <= priceRange[1];
    });

    setFilteredProducts(updatedProducts);
  }, [priceRange, products]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mb-20">
      <div className="mb-10">
        <SectionProductsHeader />
      </div>
      <div className="relative flex flex-col lg:flex-row" id="body">
        <div className="pr-4 lg:basis-1/3 xl:basis-1/4">
          <SidebarFilters onPriceChange={setPriceRange} />
        </div>
        <div className="mb-10 shrink-0 border-t lg:mx-4 lg:mb-0 lg:border-t-0" />
        <div className="relative flex-1">
          <div className="mb-5 flex items-center justify-between">
            <SortBy />
            <span className="text-sm">{filteredProducts.length} items</span>
          </div>
          <div className="grid flex-1 gap-10 sm:grid-cols-2 xl:grid-cols-2 2xl:gap-12">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((item) => (
                <ProductCard product={item} key={item.id} />
              ))
            ) : (
              <div>No products found in this price range.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
