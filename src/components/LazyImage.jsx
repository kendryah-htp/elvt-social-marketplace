import React, { useState, useRef, useEffect } from 'react';

export default function LazyImage({ src, alt, className, style, width, height }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageRef, setImageRef] = useState(null);

  useEffect(() => {
    let observer;
    const currentRef = imageRef;

    if (imageRef) {
      observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setImageSrc(src);
              if (observer && currentRef) {
                observer.unobserve(currentRef);
              }
            }
          });
        },
        { rootMargin: '50px' }
      );
      observer.observe(imageRef);
    }

    return () => {
      if (observer && currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [imageRef, src]);

  return (
    <img
      ref={setImageRef}
      src={imageSrc || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3C/svg%3E'}
      alt={alt}
      className={className}
      style={style}
      width={width}
      height={height}
      loading="lazy"
    />
  );
}