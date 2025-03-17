import React from 'react';

import SectionHeader from './SectionHeader';
import SectionSlider from './SectionSlider';
import SectionProducts from './SectionProducts';

const Home = () => {
  return (
    <div>
      <div className="my-7">
        <SectionHeader />
      </div>

      <div className="pt-10">
        <SectionSlider />
      </div>

      <div className="py-24">
        <SectionProducts />
      </div>
    </div>
  );
};

export default Home;
