'use client';

import 'rc-slider/assets/index.css';

import { pathOr } from 'ramda';
import Slider from 'rc-slider';
import React, { useState } from 'react';

import Checkbox from '@/shared/Checkbox/Checkbox';
import Radio from '@/shared/Radio/Radio';

// DEMO DATA
const sizes = [
  { name: 'XS' },
  { name: 'S' },
  { name: 'M' },
  { name: 'L' },
  { name: 'XL' },
  { name: '2XL' },
];

const sortOrderRadios = [
  { name: 'In stock', id: 'In-stock' },
  { name: 'Out of stock', id: 'out-of-stock' },
];

const colors = [
  { color: 'bg-blue-500', ringColor: 'focus:ring-blue-300' },
  { color: 'bg-red-500', ringColor: 'focus:ring-red-300' },
  { color: 'bg-yellow-500', ringColor: 'focus:ring-yellow-300' },
  { color: 'bg-pink-500', ringColor: 'focus:ring-pink-300' },
  { color: 'bg-orange-500', ringColor: 'focus:ring-orange-300' },
  { color: 'bg-green-500', ringColor: 'focus:ring-green-300' },
  { color: 'bg-black', ringColor: 'focus:ring-black/20' },
  { color: 'bg-slate-500', ringColor: 'focus:ring-slate-300' },
  { color: 'bg-yellow-500', ringColor: 'focus:ring-yellow-300' },
  { color: 'bg-pink-500', ringColor: 'focus:ring-pink-300' },
  { color: 'bg-orange-500', ringColor: 'focus:ring-orange-300' },
  { color: 'bg-green-500', ringColor: 'focus:ring-green-300' },
];

const PRICE_RANGE = [1, 500];
//
const SidebarFilters = () => {
  const [rangePrices, setRangePrices] = useState([100, 500]);
  const renderSizes = () => {
    return (
      <div className="relative flex flex-col space-y-4 pb-8">
        <h3 className="mb-2.5 font-medium">Sizes</h3>
        <div className="grid gap-4">
          {sizes.map((item) => (
            <div key={item.name} className="">
              <Checkbox
                name={item.name}
                label={item.name}
                sizeClassName="w-5 h-5"
                labelClassName="text-sm font-normal"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderColors = () => {
    return (
      <div className="relative flex flex-col space-y-4 pb-8">
        <h3 className="mb-2.5 font-medium">Colors</h3>
        <div className="grid grid-cols-6 gap-2">
          {colors.map((color) => (
            <button
              type="button"
              key={color.color}
              className={`${color.color} h-5 w-full rounded-md ring ring-transparent ${color.ringColor}`}
            />
          ))}
        </div>
      </div>
    );
  };

  // OK
  const renderTabsPriceRage = () => {
    return (
      <div className="relative flex flex-col space-y-5 py-8 pr-3">
        <div className="space-y-5">
          <span className="font-medium">Price</span>
          <Slider
            range
            min={PRICE_RANGE[0]}
            max={PRICE_RANGE[1]}
            step={1}
            defaultValue={[
              pathOr(0, [0], rangePrices),
              pathOr(0, [1], rangePrices),
            ]}
            allowCross={false}
            onChange={(_input: number | number[]) =>
              setRangePrices(_input as number[])
            }
          />
        </div>

        <div className="flex justify-between space-x-5">
          <div>
            <div className="block text-sm font-medium">Min price</div>
            <div className="relative mt-1 rounded-md">
              <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-neutral-500 sm:text-sm">
                $
              </span>
              <input
                type="text"
                name="minPrice"
                disabled
                id="minPrice"
                className="block w-32 rounded-full border-neutral-300 bg-transparent pl-4 pr-10 sm:text-sm"
                value={rangePrices[0]}
              />
            </div>
          </div>
          <div>
            <div className="block text-sm font-medium">Max price</div>
            <div className="relative mt-1 rounded-md">
              <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-neutral-500 sm:text-sm">
                $
              </span>
              <input
                type="text"
                disabled
                name="maxPrice"
                id="maxPrice"
                className="block w-32 rounded-full border-neutral-300 bg-transparent pl-4 pr-10 sm:text-sm"
                value={rangePrices[1]}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // OK
  const renderTabsOrder = () => {
    return (
      <div className="relative flex flex-col space-y-4 py-8">
        <h3 className="mb-2.5 font-medium">Availability</h3>
        <div className="grid gap-4">
          {sortOrderRadios.map((item) => (
            <Radio
              id={item.id}
              key={item.id}
              name="radioNameSort"
              label={item.name}
              sizeClassName="w-5 h-5"
              className="!text-sm"
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="top-28 lg:sticky">
      <div className="divide-y divide-neutral-300">
        {renderTabsPriceRage()}
        {renderColors()}
        {renderSizes()}
        {renderTabsOrder()}
      </div>
    </div>
  );
};

export default SidebarFilters;
