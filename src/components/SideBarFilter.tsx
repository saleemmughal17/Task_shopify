"use client";

import 'rc-slider/assets/index.css';
import { pathOr } from 'ramda';
import Slider from 'rc-slider';
import React, { useState } from 'react';

const PRICE_RANGE = [1, 5000];

const SidebarFilters = ({ onPriceChange }: { onPriceChange: (range: number[]) => void }) => {
  const [rangePrices, setRangePrices] = useState<[number, number]>([100, 500]);

  const handlePriceChange = (_input: number | number[]) => {
    const newRange = _input as [number, number];
    setRangePrices(newRange);
    onPriceChange(newRange); // Send updated price range to parent component
  };

  return (
    <div className="top-28 lg:sticky">
      <div className="divide-y divide-neutral-300">
        <div className="relative flex flex-col space-y-5 py-8 pr-3">
          <div className="space-y-5">
            <span className="font-medium">Price</span>
            <Slider
              range
              min={PRICE_RANGE[0]}
              max={PRICE_RANGE[1]}
              step={1}
              defaultValue={rangePrices}
              allowCross={false}
              onChange={handlePriceChange}
            />
          </div>

          <div className="flex justify-between space-x-5">
            <div>
              <div className="block text-sm font-medium">Min price</div>
              <input
                type="text"
                disabled
                className="block w-32 rounded-full border-neutral-300 bg-transparent pl-4 pr-10 sm:text-sm"
                value={rangePrices[0]}
              />
            </div>
            <div>
              <div className="block text-sm font-medium">Max price</div>
              <input
                type="text"
                disabled
                className="block w-32 rounded-full border-neutral-300 bg-transparent pl-4 pr-10 sm:text-sm"
                value={rangePrices[1]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarFilters;
