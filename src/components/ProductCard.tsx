import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';

import type { ProductType } from '@/data/types';

interface ProductCardProps {
  product: ProductType;
  className?: string;
}

const ProductCard: FC<ProductCardProps> = ({ product, className }) => {
  const { image, productName, price, handle, product_type, description } = product as ProductType & { product_type?: string };

  // Validate image URL, and provide a fallback if missing
  const imageUrl = image || 'https://via.placeholder.com/500';

  // Ensure price is a valid number, fallback to 0 if undefined or invalid
  const formattedPrice = price && !isNaN(price) ? price : 0;

  // Format the price to two decimal places
  const formattedPriceString = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(formattedPrice);

  return (
    <div className={`relative rounded-xl p-4 shadow-md ${className}`}>
      {/* ✅ Wrap the entire image inside Link */}
      <Link href={`/products/${handle}`} passHref>
        <div className="relative h-[300px] overflow-hidden rounded-xl cursor-pointer">
          <img
            src={imageUrl}
            alt={`Product image of ${productName}`}
            className="h-full w-full object-cover object-top"
          />
        </div>
      </Link>

      <div className="mt-4 space-y-2">
        {/* ✅ Wrap the product name inside Link */}
        <Link href={`/products/${handle}`} passHref>
          <h2 className="text-xl font-semibold text-gray-900 hover:underline cursor-pointer">
            {productName}
          </h2>
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
