# Pet Adoption Platform Images

This folder contains all the images used in the Pet Adoption Platform application.

## Structure

- `pet-images.js` - Contains all pet image URLs organized by species and breed
- `README.md` - This documentation file

## Image Sources

All images are sourced from [Unsplash](https://unsplash.com/), which provides high-quality, free-to-use images. The images are categorized by:

### Dogs
- Golden Retriever
- Labrador
- German Shepherd
- Husky

### Cats
- Persian
- Siamese
- Maine Coon

### Rabbits
- Holland Lop
- Netherland Dwarf

### Birds
- Parakeet
- Cockatiel

## Usage

The images are organized in the `pet-images.js` file with the following structure:

```javascript
export const petImages = {
  dogs: {
    goldenRetriever: {
      main: 'main-image-url',
      gallery: ['gallery-image-1', 'gallery-image-2']
    }
  }
}
```

## Helper Functions

- `getRandomPetImage(species, breed)` - Returns the main image for a specific pet type
- `getPetGallery(species, breed)` - Returns an array of gallery images for a specific pet type

## Image URLs

All images are external URLs from Unsplash, ensuring:
- High quality images
- Fast loading times
- No local storage required
- Free to use

## Adding New Images

To add new pet images:

1. Find a suitable image on Unsplash
2. Add the image URL to the appropriate category in `pet-images.js`
3. Update the helper functions if needed
4. Test the image loading in the application

## Image Optimization

The Unsplash URLs include optimization parameters:
- `auto=format` - Automatic format selection
- `fit=crop` - Cropped to fit dimensions
- `w=870&q=80` - Width and quality parameters

This ensures optimal loading performance across different devices and screen sizes. 