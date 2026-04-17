const mongoose = require('mongoose');
const Pet = require('./models/Pet');
const User = require('./models/User');
require('dotenv').config();

const samplePets = [
  {
    name: 'Buddy',
    species: 'Dog',
    breed: 'Golden Retriever',
    age: '2 years',
    gender: 'Male',
    size: 'Large',
    description: 'Friendly and energetic golden retriever who loves to play fetch and go for long walks.',
    location: 'New York, NY',
    imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop',
    status: 'Available'
  },
  {
    name: 'Luna',
    species: 'Cat',
    breed: 'Persian',
    age: '1 year',
    gender: 'Female',
    size: 'Small',
    description: 'Beautiful Persian cat with a calm personality. Loves to cuddle and purr.',
    location: 'Los Angeles, CA',
    imageUrl: 'https://images.unsplash.com/photo-1514888286970-58a00ba66130?w=400&h=300&fit=crop',
    status: 'Available'
  },
  {
    name: 'Max',
    species: 'Dog',
    breed: 'Labrador',
    age: '3 years',
    gender: 'Male',
    size: 'Large',
    description: 'Playful Labrador who gets along well with children and other pets.',
    location: 'Chicago, IL',
    imageUrl: 'https://images.unsplash.com/photo-1583337434160-6175b1f5d5b2?w=400&h=300&fit=crop',
    status: 'Available'
  },
  {
    name: 'Whiskers',
    species: 'Cat',
    breed: 'Siamese',
    age: '6 months',
    gender: 'Male',
    size: 'Small',
    description: 'Curious Siamese kitten who loves to explore and play with toys.',
    location: 'Houston, TX',
    imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=300&fit=crop',
    status: 'Available'
  },
  {
    name: 'Charlie',
    species: 'Dog',
    breed: 'Beagle',
    age: '4 years',
    gender: 'Male',
    size: 'Medium',
    description: 'Gentle Beagle with a great temperament. Perfect for families.',
    location: 'Phoenix, AZ',
    imageUrl: 'https://images.unsplash.com/photo-1598133810757-3c888b8c9b0d?w=400&h=300&fit=crop',
    status: 'Available'
  }
];

async function addSamplePets() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find or create a pet owner user
    let petOwner = await User.findOne({ role: 'petowner' });
    
    if (!petOwner) {
      // Create a pet owner if none exists
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      petOwner = new User({
        username: 'petowner1',
        email: 'petowner@example.com',
        password: hashedPassword,
        role: 'petowner'
      });
      
      await petOwner.save();
      console.log('Created pet owner user');
    }

    // Add sample pets
    for (const petData of samplePets) {
      petData.owner = petOwner._id;
      const pet = new Pet(petData);
      await pet.save();
      console.log(`Added pet: ${pet.name}`);
    }

    console.log('Sample pets added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding sample pets:', error);
    process.exit(1);
  }
}

addSamplePets();
