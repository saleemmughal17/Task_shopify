import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';

import type { ProductType } from '@/data/types';
import Variant from '@/shared/Variant/Variant';

interface ProductCardProps {
  product: ProductType;
  className?: string;
}

const ProductCard: FC<ProductCardProps> = ({ product, className }) => {
  const { image, productName, price, handle } = product;

  // Validate image URL, and provide a fallback if missing
  const imageUrl = image || 'https://via.placeholder.com/500'; // Fallback image URL

  // Ensure price is a valid number, fallback to 0 if undefined or invalid
  const formattedPrice = price && !isNaN(price) ? price : 0;

  // Format the price to two decimal places (you can adjust the currency formatting if needed)
  const formattedPriceString = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(formattedPrice);

  return (
    <div className={`relative rounded-xl ${className}`}>
      <div className="relative h-[430px] overflow-hidden rounded-xl">
        <img
          src={imageUrl} // Use the validated image URL
          alt={`Product image of ${productName}`} // More descriptive alt text for accessibility
          className="h-full w-full object-cover object-top"
        />
        <Link
          href={`/products/${handle}`}
          className="absolute inset-0 h-full w-full"
        />
      </div>
      <div className="mt-5 space-y-1">
        <div className="flex items-center justify-between">
          {/* Display product title */}
          <Link href={`/products/${handle}`} className="text-2xl font-medium">
            {productName}
          </Link>
        </div>
        {/* Display product price */}
        <p className="text-2xl font-medium text-secondary">{formattedPriceString}</p>
      </div>
    </div>
  );
};

export default ProductCard;
