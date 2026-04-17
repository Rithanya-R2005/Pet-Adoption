# Pet Images Directory

This directory contains pet images for the PetAdopt platform.

## Image Structure

All images are currently SVG files with .jpg extensions for compatibility. The images are designed to be lightweight and scalable.

## Image Files

### Dogs
- `golden-retriever.jpg` - Golden Retriever dog
- `golden-retriever-1.jpg` - Golden Retriever gallery image 1
- `golden-retriever-2.jpg` - Golden Retriever gallery image 2
- `labrador.jpg` - Labrador dog
- `labrador-1.jpg` - Labrador gallery image
- `german-shepherd.jpg` - German Shepherd dog
- `husky.jpg` - Husky dog

### Cats
- `persian-cat.jpg` - Persian cat
- `siamese-cat.jpg` - Siamese cat
- `maine-coon.jpg` - Maine Coon cat

### Rabbits
- `holland-lop.jpg` - Holland Lop rabbit
- `netherland-dwarf.jpg` - Netherland Dwarf rabbit

### Birds
- `parakeet.jpg` - Parakeet bird
- `cockatiel.jpg` - Cockatiel bird

### Utilities
- `placeholder.svg` - Placeholder image for missing pet images

## Usage

These images are used throughout the application:
- Pet listings
- Adoption forms
- User dashboards
- Admin panels
- Articles and events

## Image Component

The application uses a `PetImage` component that handles:
- Loading states
- Error fallbacks
- Responsive sizing
- Proper aspect ratios

## Adding New Images

To add new pet images:
1. Create an SVG file with the pet design
2. Save it with a descriptive name
3. Update the `pet-images.js` file to include the new image path
4. Test the image display in the application

## Image Optimization

For production, consider:
- Converting SVG files to optimized PNG/JPG formats
- Implementing lazy loading
- Using WebP format for better compression
- Adding proper alt text for accessibility
