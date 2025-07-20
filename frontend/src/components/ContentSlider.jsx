import React, { useState, useEffect } from 'react';

function ContentSlider({ children, autoSlideInterval = 5000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slides = React.Children.toArray(children);

  const goToNext = () => {
    const newIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(goToNext, autoSlideInterval);
    return () => clearInterval(timer);
  }, [goToNext, slides.length, autoSlideInterval]);


  if (slides.length === 0) {
    return <div className="text-center p-4">Oops! No slides to display.</div>;
  }

  return (
    <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-lg shadow-lg bg-base-200">
      
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >

        {slides.map((slide, index) => (
          <div key={index} className="w-full h-full flex-shrink-0 p-4 sm:p-8">
            {slide}
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, slideIndex) => (
          <button
            key={slideIndex}
            onClick={() => setCurrentIndex(slideIndex)}
            className={`btn btn-circle size-2 ${
              currentIndex === slideIndex ? 'btn-primary' : 'btn-secondary'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default ContentSlider;