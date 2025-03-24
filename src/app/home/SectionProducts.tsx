"use client";
import React, { useEffect, useState } from 'react';
import { getProducts } from '@/utils/shopify'; 
import ButtonPrimary from '@/shared/Button/ButtonPrimary';
import Heading from '@/shared/Heading/Heading';

const SectionProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1); 
  const [productsPerPage] = useState(3); 

  useEffect(() => {
    
    const fetchProducts = async () => {
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts); 
    };

    fetchProducts();
  }, []);

  
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  
  const nextPage = () => {
    if (currentPage < Math.ceil(products.length / productsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="container">
      <Heading showDash className="pb-16 text-black">
        Your Heading Text Here
      </Heading>

      <div className="space-y-10">
        <div className="items-center justify-between md:flex">
          <Heading isMain className="mb-0 text-black">
            2025 New Arrivals
          </Heading>
          <ButtonPrimary href="/products" className="bg-black text-white hover:bg-gray-900">
            Shop Now
          </ButtonPrimary>
        </div>

        <div className="grid gap-7 md:grid-cols-3">
          {currentProducts.map((product) => (
            <div key={product.id} className="product-card bg-white shadow-lg p-5 rounded-lg">
              <div className="w-full mb-4">
                <img src={product.image} alt={product.title} className="w-full h-auto object-cover rounded-lg" />
              </div>

              <h2 className="text-lg font-semibold text-black">{product.title}</h2>
              <p className="text-sm text-gray-600 mt-2">{product.description}</p>
              <p className="text-xl font-semibold text-black mt-4">${product.price}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 h-px w-full bg-neutral-300" />

        <div className="flex justify-between mt-8">
          <ButtonPrimary
            onClick={prevPage}
            disabled={currentPage === 1}
            className="bg-black text-white hover:bg-gray-900"
          >
            Previous
          </ButtonPrimary>
          <ButtonPrimary
            onClick={nextPage}
            disabled={currentPage * productsPerPage >= products.length}
            className="bg-black text-white hover:bg-gray-900"
          >
            Next
          </ButtonPrimary>
        </div>
      </div>
    </div>
  );
};

export default SectionProducts;
