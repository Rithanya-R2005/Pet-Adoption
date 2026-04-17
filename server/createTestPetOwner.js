const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function createTestPetOwner() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if pet owner already exists
    const existingPetOwner = await User.findOne({ email: 'petowner@test.com' });
    
    if (existingPetOwner) {
      console.log('Test pet owner already exists:', existingPetOwner.username);
      process.exit(0);
    }

    // Create a test pet owner user
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const petOwner = new User({
      username: 'testpetowner',
      email: 'petowner@test.com',
      password: hashedPassword,
      role: 'petowner'
    });
    
    await petOwner.save();
    console.log('Test pet owner created successfully!');
    console.log('   Email: petowner@test.com');
    console.log('   Password: password123');
    console.log('   Role: petowner');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating test pet owner:', error);
    process.exit(1);
  }
}

createTestPetOwner();
