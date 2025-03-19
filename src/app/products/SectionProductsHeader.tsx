import Image from 'next/image';
import React from 'react';

import { productsCollection } from '@/data/content';
import hero from '@/images/productsHero.jpg';
import ButtonSecondary from '@/shared/Button/ButtonSecondary';
import Heading from '@/shared/Heading/Heading';

const categories = ['Shirts', 'Jackets', 'Pants', 'Shoes'];

interface SectionProductsHeaderProps {
  onCategorySelect: (category: string) => void; // Type added ✅
}

const SectionProductsHeader: React.FC<SectionProductsHeaderProps> = ({ onCategorySelect }) => {
  return (
    <div className="space-y-10">
      {/* Hero Image */}
      <div className="h-[220px] w-full overflow-hidden rounded-2xl">
        <Image src={hero} alt="hero products" className="h-full w-full object-cover object-center" />
      </div>

      {/* Heading */}
      <Heading desc={productsCollection.description} isMain>
        {productsCollection.heading}
      </Heading>

      {/* Category Buttons */}
      <div className="hiddenScrollbar grid grid-cols-2 gap-5 overflow-y-hidden md:grid-cols-6">
        {categories.map((category) => (
          <ButtonSecondary
            className="w-full"
            key={category}
            onClick={() => {
              console.log('Category Selected:', category); // Debugging line
              onCategorySelect(category);
            }}
          >
            {category}
          </ButtonSecondary>
        ))}
      </div>
    </div>
  );
};

export default SectionProductsHeader;
