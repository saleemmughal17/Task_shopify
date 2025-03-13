import Link from 'next/link';
import { pathOr } from 'ramda';
import React from 'react';
import { MdArrowBack } from 'react-icons/md';

import { getProductByHandle } from '@/utils/shopify'; // Assuming you're fetching data from Shopify
import ButtonCircle3 from '@/shared/Button/ButtonCircle3';

import SectionMoreProducts from './SectionMoreProducts';
import SectionProductHeader from './SectionProductHeader';

type Props = {
  params: { productId: string };  // Dynamic parameter for the product ID (handle)
};

const getProductData = async (handle: string) => {
  return getProductByHandle(handle);  
};

const SingleProductPage = async ({ params }: Props) => {
  const selectedProduct = await getProductData(params.productId);  // Fetch product by handle

  // Check if the product is found
  if (!selectedProduct) {
    return <div>Product not found!</div>;  // Display an error if the product is not found
  }

  // Extract image URL
  const imageUrl = selectedProduct.image;

  return (
    <div className="container">
      <Link href="/products" className="mb-10">
        <ButtonCircle3 size="w-10 h-10" className="border border-neutral-300">
          <MdArrowBack className="text-2xl" />
        </ButtonCircle3>
      </Link>

      <div className="mb-20">
        {/* Display product image */}
        <img
          src={imageUrl}
          alt={`Image of ${selectedProduct.title}`}
          className="w-full h-auto mb-8"  // Add some styling for the image
        />

        <SectionProductHeader
          shots={pathOr([], ['shots'], selectedProduct)} // Default empty array if shots not found
          productName={pathOr('', ['title'], selectedProduct)} // Default empty string if title not found
          price={pathOr(0, ['price'], selectedProduct)} // Default 0 if price not found
          reviews={pathOr(0, ['reviews'], selectedProduct)} // Default 0 if reviews not found
          description={pathOr('', ['description'], selectedProduct)} // Default empty string if description not found
        />
      </div>

      {/* Section for more products, you can adjust this if you have relevant data */}
      <div className="mb-28">
        <SectionMoreProducts />
      </div>
    </div>
  );
};

export default SingleProductPage;
