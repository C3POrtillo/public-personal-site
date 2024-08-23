/* eslint-disable tailwindcss/no-custom-classname */
import { useDrag } from '@use-gesture/react';
import { useState } from 'react';

import type { FC, ReactNode } from 'react';

import { joinStrings } from '@/utils/utils';

interface CarouselProps {
  className?: string;
  width?: string;
  slides: ReactNode[];
}

const Carousel: FC<CarouselProps> = ({ className, width = 'max-w-[90vw]', slides }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const bind = useDrag(
    state => {
      if (state.last) {
        if (state.direction[0] > 0) {
          prevSlide();
        } else if (state.direction[0] < 0) {
          nextSlide();
        }
      }
    },
    {
      axis: 'x',
    },
  );

  const controls = (
    <div className="flex flex-row justify-center gap-4">
      <button onClick={prevSlide} className="carousel-button left-2 shadow-md shadow-black">
        <i className="fa fa-chevron-left" />
      </button>
      <button onClick={nextSlide} className="carousel-button right-2 shadow-md shadow-black">
        <i className="fa fa-chevron-right" />
      </button>
    </div>
  );

  return (
    <div
      className={joinStrings([
        'relative mx-auto flex flex-col gap-2 rounded-lg border-2 border-black bg-neutral-800 p-4 text-3xl shadow-md shadow-black',
        className,
        width,
      ])}
    >
      {controls}
      <div className="flex overflow-x-hidden pb-2" {...bind()}>
        {slides.map((slide, index) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            className={[
              'carousel-slide inline-flex w-full shrink-0 justify-center px-12',
              index === currentIndex ? 'translate-x-0' : 'translate-x-full',
            ].join(' ')}
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {slide}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
