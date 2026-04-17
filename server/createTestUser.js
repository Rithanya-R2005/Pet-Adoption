const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function createTestCustomer() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if customer already exists
    const existingCustomer = await User.findOne({ email: 'customer@test.com' });
    
    if (existingCustomer) {
      console.log('Test customer already exists:', existingCustomer.username);
      process.exit(0);
    }

    // Create a test customer user
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const customer = new User({
      username: 'testcustomer',
      email: 'customer@test.com',
      password: hashedPassword,
      role: 'customer'
    });
    
    await customer.save();
    console.log('✅ Test customer created successfully!');
    console.log('   Email: customer@test.com');
    console.log('   Password: password123');
    console.log('   Role: customer');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating test customer:', error);
    process.exit(1);
  }
}

createTestCustomer();
