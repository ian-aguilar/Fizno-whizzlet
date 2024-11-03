import React, { useState, useRef } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";

interface SimpleSliderProps {
  items: React.ReactNode[];
}

const SimpleSlider: React.FC<SimpleSliderProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<AliceCarousel>(null);

  const handleSlideChange = ({ item }: { item: number }) => {
    setCurrentIndex(item);
  };

  const handlePrevClick = () => {
    carouselRef.current?.slidePrev();
  };

  const handleNextClick = () => {
    carouselRef.current?.slideNext();
  };

  return (
    <div>
      <div className="my-4 px-4 gap-3 relative">
        <AliceCarousel
          ref={carouselRef}
          mouseTracking
          items={items}
          responsive={{
            512: { items: 3 },
            1024: { items: 4 },
          }}
          activeIndex={currentIndex}
          onSlideChanged={handleSlideChange}
          disableDotsControls
          infinite={true} // Enable infinite loop
          // autoPlay={true} // Enable autoplay
          autoPlayInterval={1000} // Adjust time interval for slide change
          animationDuration={800} // Smooth transition animation
        />
        <button
          onClick={handlePrevClick}
          className="prev-button absolute top-[45%] left-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
          >
            <rect
              x="39.5"
              y="39.5"
              width="39"
              height="39"
              rx="19.5"
              transform="rotate(-180 39.5 39.5)"
              fill="#306CB5"
            />
            <rect
              x="39.5"
              y="39.5"
              width="39"
              height="39"
              rx="19.5"
              transform="rotate(-180 39.5 39.5)"
              stroke="#306CB5"
            />
            <path
              d="M22.1896 29.7778L13.6067 20.8199C13.3973 20.6031 13.2932 20.3221 13.2932 20.0423C13.2932 19.7624 13.3973 19.4812 13.6067 19.2646L22.1896 10.3068C22.6186 9.8571 23.3305 9.84247 23.7786 10.2731C24.2298 10.7009 24.2445 11.4159 23.8123 11.8627L15.9373 20.0845L23.811 28.222C24.2431 28.6673 24.2284 29.3835 23.7773 29.8115C23.3291 30.2423 22.6161 30.2273 22.1896 29.7778Z"
              fill="white"
            />
          </svg>
        </button>
        <button
          onClick={handleNextClick}
          className="next-button absolute right-0 top-[45%]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
          >
            <rect
              x="0.5"
              y="0.5"
              width="39"
              height="39"
              rx="19.5"
              fill="#306CB5"
            />
            <rect
              x="0.5"
              y="0.5"
              width="39"
              height="39"
              rx="19.5"
              stroke="#306CB5"
            />
            <path
              d="M17.8104 10.2222L26.3933 19.1801C26.6027 19.3969 26.7068 19.6779 26.7068 19.9577C26.7068 20.2376 26.6027 20.5188 26.3933 20.7354L17.8104 29.6932C17.3814 30.1429 16.6695 30.1575 16.2214 29.7269C15.7702 29.2991 15.7555 28.5841 16.1877 28.1373L24.0627 19.9155L16.189 11.778C15.7569 11.3327 15.7716 10.6165 16.2227 10.1885C16.6709 9.75771 17.3839 9.77271 17.8104 10.2222Z"
              fill="white"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SimpleSlider;
