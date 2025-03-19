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
  const { image, productName, price, handle, product_type, description } = product as ProductType & { product_type?: string };

  // Validate image URL, and provide a fallback if missing
  const imageUrl = image || 'https://via.placeholder.com/500'; // Fallback image URL

  // Ensure price is a valid number, fallback to 0 if undefined or invalid
  const formattedPrice = price && !isNaN(price) ? price : 0;

  // Format the price to two decimal places
  const formattedPriceString = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(formattedPrice);

  return (
    <div className={`relative rounded-xl p-4 shadow-md ${className}`}>
      <div className="relative h-[300px] overflow-hidden rounded-xl">
        <img
          src={imageUrl}
          alt={`Product image of ${productName}`}
          className="h-full w-full object-cover object-top"
        />
        <Link href={`/products/${handle}`} className="absolute inset-0 h-full w-full" />
      </div>
      <div className="mt-4 space-y-2">
        {/* Product Title */}
        <Link href={`/products/${handle}`} className="text-xl font-semibold text-gray-900">
          {productName}
        </Link>

        {/* Product Category */}
        {product_type ? (
          <p className="text-sm text-gray-500">Category: {product_type}</p>
        ) : (
          <p className="text-sm text-gray-500">Category: Unknown</p>
        )}

        {/* Product Description */}
        {description && (
          <p className="text-sm text-gray-700 line-clamp-2">{description}</p>
        )}

        {/* Product Price */}
        <p className="text-lg font-medium text-primary">{formattedPriceString}</p>
      </div>
    </div>
  );
};

export default ProductCard;
