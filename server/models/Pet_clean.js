const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  species: {
    type: String,
    required: [true, 'Please add a species'],
    trim: true,
    maxlength: [50, 'Species cannot be more than 50 characters']
  },
  breed: {
    type: String,
    required: [true, 'Please add a breed'],
    trim: true,
    maxlength: [50, 'Breed cannot be more than 50 characters']
  },
  age: {
    type: String,
    required: [true, 'Please add an age'],
    trim: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: [true, 'Please specify gender']
  },
  size: {
    type: String,
    enum: ['Small', 'Medium', 'Large'],
    required: [true, 'Please specify size']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
    trim: true
  },
  imageUrl: {
    type: String,
    required: [true, 'Please add an image URL']
  },
  status: {
    type: String,
    enum: ['Available', 'Pending', 'Adopted'],
    default: 'Available'
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for better query performance
petSchema.index({ owner: 1, status: 1 });

module.exports = mongoose.model('Pet', petSchema);
