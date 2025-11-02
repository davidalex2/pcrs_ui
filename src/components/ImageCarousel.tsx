import React, { useState } from 'react';

interface ImageCarouselProps {
  images: string[];
  alt?: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, alt }) => {
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-400">No image</div>
      </div>
    );
  }

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  return (
    <div className="relative">
      <img src={images[index]} alt={alt || `image-${index}`} className="w-full h-48 object-cover rounded-lg" />
      {images.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-1">
            ‹
          </button>
          <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-1">
            ›
          </button>
          <div className="mt-2 flex gap-2 overflow-auto">
            {images.map((src, i) => (
              <img
                key={i}
                src={src}
                onClick={() => setIndex(i)}
                className={`w-12 h-12 object-cover rounded cursor-pointer ${i === index ? 'ring-2 ring-primary-500' : ''}`}
                alt={`thumb-${i}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageCarousel;
