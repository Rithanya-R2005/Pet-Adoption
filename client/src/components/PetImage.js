import React, { useState } from 'react';

const PetImage = ({ src, alt, className, fallbackSrc = '/images/pets/placeholder.svg', width = '100%', height = 'auto', ...props }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setImageError(true);
  };

  const imageSrc = imageError ? fallbackSrc : src;

  return (
    <div className={`pet-image-container ${className || ''}`} {...props}>
      {isLoading && (
        <div className="image-loading">
          <div className="loading-spinner"></div>
        </div>
      )}
      <img
        src={imageSrc}
        alt={alt}
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={`pet-image ${isLoading ? 'hidden' : ''}`}
        style={{
          display: isLoading ? 'none' : 'block',
          width: width,
          height: height,
          objectFit: 'cover',
          borderRadius: '8px',
          transition: 'transform 0.3s ease'
        }}
      />
    </div>
  );
};

export default PetImage;
