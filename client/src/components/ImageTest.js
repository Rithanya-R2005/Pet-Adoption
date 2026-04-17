import React from 'react';
import PetImage from './PetImage';
import './ImageTest.css';

const ImageTest = () => {
  const testImages = [
    'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1547407139-3c921a66005c?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop'
  ];

  return (
    <div className="image-test-container">
      <h1>Pet Image Test</h1>
      <p>Testing the PetImage component with all available pet images:</p>
      
      <div className="image-grid">
        {testImages.map((imageSrc, index) => (
          <div key={index} className="image-test-item">
            <h3>Image {index + 1}</h3>
            <PetImage 
              src={imageSrc}
              alt={`Test pet image ${index + 1}`}
              className="test-pet-image"
            />
            <p>Source: {imageSrc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageTest;
