import type { StaticImageData } from 'next/image';

// ProductType can handle both static images and external URLs
export type ProductType = {
  id: string;
  title: string;
  handle: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  slug?: string; // Optional if it's not available
  productName?: string; // Optional if it's not available
  coverImage?: StaticImageData | string; // Optional, can be StaticImageData or URL string
};

export type BlogData = {
  sectionOne: {
    title: string;
    paragraph1: string;
    points: string[]; // List of points under section one
    paragraph2: string;
  };
  sectionTwo: {
    title: string;
    description: string;
    midImage: string; // Image URL for section two
  };
  sectionThree: {
    title: string;
    description: string;
  };
  sectionFour: {
    title: string;
    description: string;
    points: string[]; // List of points under section four
  };
  quote: string; // A quote to be included in the blog
  sectionFive: {
    title: string;
    description: string;
  }[]; // Array of section five data
};

export type BlogType = {
  title: string; // Blog title
  brief: string; // Brief description or excerpt of the blog
  date: string; // Date of publication
  coverImage: string; // Image URL for the blog cover
  blogData: BlogData; // Detailed data for the blog
  tag: 'Style' | 'Trend' | 'General' | 'Outfit'; // The tag associated with the blog
  slug: string; // Slug or URL-friendly version of the blog title
};
