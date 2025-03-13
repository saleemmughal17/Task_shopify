"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import SidebarFilters from "@/components/SideBarFilter";
import SortBy from "@/components/SortBy";
import { getProducts } from "@/utils/shopify"; // Import your function to fetch products

import SectionProductsHeader from "./SectionProductsHeader";

const Page = () => {
  const [products, setProducts] = useState<any[]>([]); // State to hold products
  const [loading, setLoading] = useState<boolean>(true); // State to handle loading state
  const [error, setError] = useState<string | null>(null); // State to handle errors

  // Fetch products when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getProducts(); // Call the getProducts function
        console.log(fetchedProducts); // Log the fetched products to check the structure
        setProducts(fetchedProducts); // Set the products in state
      } catch (err: any) {
        setError("Error fetching products from Shopify"); // Set error if API call fails
      } finally {
        setLoading(false); // Set loading to false when done
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading text while fetching products
  }

  if (error) {
    return <div>{error}</div>; // Show error message if something goes wrong
  }

  return (
    <div className="container mb-20">
      <div className="mb-10">
        <SectionProductsHeader />
      </div>
      <div className="relative flex flex-col lg:flex-row" id="body">
        <div className="pr-4 lg:basis-1/3 xl:basis-1/4">
          <SidebarFilters />
        </div>
        <div className="mb-10 shrink-0 border-t lg:mx-4 lg:mb-0 lg:border-t-0" />
        <div className="relative flex-1">
          <div className="mb-5 flex items-center justify-between">
            <SortBy />
            <span className="text-sm">{products.length} items</span>
          </div>
          <div className="grid flex-1 gap-10 sm:grid-cols-2 xl:grid-cols-2 2xl:gap-12">
            {products.length > 0 ? (
              products.map((item) => (
                <ProductCard
                  product={item}
                  key={item.id} // Ensure the product id is passed as key for each card
                />
              ))
            ) : (
              <div>No products found.</div> // Display this if no products are found
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
