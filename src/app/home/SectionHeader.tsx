import Image from 'next/image';
import React from 'react';
import { FaPlay } from 'react-icons/fa';

import heroImage from '@/public/final_cleaned_image-removebg-preview.png'; // Updated optimized image
import ButtonSecondary from '@/shared/Button/ButtonSecondary';

const SectionHeader = () => {
  return (
    <header className="container mx-auto flex flex-col-reverse items-center gap-8 rounded-xl bg-white px-6 py-10 text-black md:flex-row md:py-16">
      {/* Left Content */}
      <div className="text-center md:w-1/2 md:text-left">
        <h1 className="text-4xl font-bold md:text-6xl leading-tight">
          Elevate Your Style with <br /> Our Latest Collection
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Discover exclusive fashion trends with premium quality & modern designs.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4 md:justify-start">
          <ButtonSecondary className="bg-black text-white hover:bg-gray-800">Shop Now</ButtonSecondary>
          <button className="flex items-center gap-2 rounded-full border border-black px-5 py-2 text-black transition hover:bg-black hover:text-white">
            <FaPlay />
            Watch Trend
          </button>
        </div>
      </div>

      {/* Right Image */}
      <div className="md:w-1/2">
        <Image
          src={heroImage}
          alt="Fashion Banner"
          width={500} 
          height={600}
          className="rounded-xl object-contain"
          priority
        />
      </div>
    </header>
  );
};

export default SectionHeader;