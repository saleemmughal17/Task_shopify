import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';
import React, { useEffect, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useWindowSize } from 'react-use';

import NextBtn from '@/shared/NextPrev/NextBtn';
import PrevBtn from '@/shared/NextPrev/PrevBtn';

// ✅ Fallback animation variant (if animationVariants.ts is missing)
const variants = (duration = 0.3, delay = 0) => ({
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0, transition: { duration, delay } },
});

export interface MySliderProps<T> {
  className?: string;
  itemPerRow?: number;
  data: T[];
  renderItem?: (item: T, indx: number) => ReactNode;
  arrowBtnClass?: string;
  renderSectionHeading?: ({
    onClickNext,
    onClickPrev,
    showNext,
    showPrev,
  }: {
    onClickPrev: () => void;
    onClickNext: () => void;
    showNext: boolean;
    showPrev: boolean;
  }) => ReactNode;
  hideNextPrev?: boolean;
}

export default function Slider<T>({
  className = '',
  itemPerRow = 5,
  data,
  renderItem = () => <div />,
  arrowBtnClass = 'top-1/2 -translate-y-1/2',
  renderSectionHeading,
  hideNextPrev = false,
}: MySliderProps<T>) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [numberOfItems, setNumberOfItems] = useState(0);

  const windowWidth = useWindowSize().width;

  useEffect(() => {
    if (windowWidth < 320) return setNumberOfItems(1);
    if (windowWidth < 500) return setNumberOfItems(itemPerRow < 3 ? 1 : itemPerRow - 3 || 1);
    if (windowWidth < 1024) return setNumberOfItems(itemPerRow < 3 ? 1.5 : itemPerRow - 2 || 1);
    if (windowWidth < 1280) return setNumberOfItems(itemPerRow - 1);
    setNumberOfItems(itemPerRow);
  }, [itemPerRow, windowWidth]);

  function changeItemId(newVal: number) {
    setDirection(newVal > currentIndex ? 1 : -1);
    setCurrentIndex(newVal);
  }

  const handlers = useSwipeable({
    onSwipedLeft: () => currentIndex < data.length - 1 && changeItemId(currentIndex + 1),
    onSwipedRight: () => currentIndex > 0 && changeItemId(currentIndex - 1),
    trackMouse: true,
  });

  if (!numberOfItems) return <div />;

  return (
    <div className={`nc-Slider ${className}`}>
      {renderSectionHeading &&
        renderSectionHeading({
          onClickPrev: () => changeItemId(currentIndex - 1),
          onClickNext: () => changeItemId(currentIndex + 1),
          showNext: data.length > currentIndex + numberOfItems,
          showPrev: !!currentIndex,
        })}

      <MotionConfig transition={{ x: { type: 'cubic-bezier', easing: [0.25, 1, 0.5, 1] }, opacity: { duration: 0.2 } }}>
        <div className="relative flow-root" {...handlers}>
          <div className="flow-root rounded-xl">
            <motion.ul initial={false} className="relative -mx-2 flex whitespace-nowrap xl:-mx-4 ">
              <AnimatePresence initial={false} custom={direction}>
                {data.map((item, indx) => (
                  <motion.li
                    className="relative inline-block shrink-0 whitespace-normal px-2"
                    custom={direction}
                    initial="hidden"
                    animate="visible"
                    variants={variants(0.2, 0)}
                    key={indx}
                    style={{ width: `calc(1/${numberOfItems} * 100%)` }}
                  >
                    {renderItem(item, indx)}
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          </div>

          {!hideNextPrev && currentIndex > 0 && (
            <PrevBtn onClick={() => changeItemId(currentIndex - 1)} className={`absolute -left-3 z-[1] h-9 w-9 xl:-left-6 xl:h-12 xl:w-12 ${arrowBtnClass}`} />
          )}

          {!hideNextPrev && data.length > currentIndex + numberOfItems && (
            <NextBtn onClick={() => changeItemId(currentIndex + 1)} className={`absolute -right-3 z-[1] h-9 w-9 bg-white xl:-right-6 xl:h-12 xl:w-12 ${arrowBtnClass}`} />
          )}
        </div>
      </MotionConfig>
    </div>
  );
}
