const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Pet = require('../models/Pet');

// ===================== STATIC ROUTES FIRST =====================

// Admin route
router.get('/admin', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this resource' });
    }

    const pets = await Pet.find().populate('owner', 'username email');
    res.json({ success: true, count: pets.length, data: pets });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all pets
router.get('/', async (req, res) => {
  try {
    const { species, gender, size, status, search } = req.query;

    const filter = {};

    filter.status = status || 'Available';

    if (species) filter.species = { $regex: new RegExp(species, 'i') };
    if (gender) filter.gender = gender;
    if (size) filter.size = size;

    if (search) {
      filter.$or = [
        { name: { $regex: new RegExp(search, 'i') } },
        { breed: { $regex: new RegExp(search, 'i') } },
        { description: { $regex: new RegExp(search, 'i') } }
      ];
    }

    const pets = await Pet.find(filter)
      .populate('owner', 'username email role')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: pets.length, data: pets });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Owner pets
router.get('/owner', protect, async (req, res) => {
  try {
    if (req.user.role !== 'petowner') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const pets = await Pet.find({ owner: req.user._id })
      .populate('owner', 'username email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: pets.length, data: pets });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DB status
router.get('/db-status', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'petowner') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const totalPets = await Pet.countDocuments();

    res.json({
      success: true,
      totalPets
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new pet (for pet owners)
router.post('/', protect, async (req, res) => {
  try {
    // Check if user is a pet owner
    if (req.user.role !== 'petowner') {
      return res.status(403).json({ message: 'Only pet owners can add pets' });
    }

    const {
      name,
      species,
      breed,
      age,
      gender,
      size,
      description,
      location,
      imageUrl
    } = req.body;

    // Validate required fields
    if (!name || !species || !breed || !age || !gender || !size || !description || !location || !imageUrl) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create new pet
    const pet = await Pet.create({
      name,
      species,
      breed,
      age,
      gender,
      size,
      description,
      location,
      imageUrl,
      owner: req.user._id,
      status: 'Available'
    });

    // Populate owner information
    await pet.populate('owner', 'username email');

    res.status(201).json({ 
      success: true, 
      message: 'Pet added successfully',
      data: pet 
    });
  } catch (err) {
    console.error('Error creating pet:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

// ===================== DYNAMIC ROUTES LAST =====================

// Get single pet
router.get('/:id', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id)
      .populate('owner', 'username email');

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    res.json({ success: true, data: pet });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update pet
router.put('/:id', protect, async (req, res) => {
  try {
    let pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, data: pet });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete pet
router.delete('/:id', protect, async (req, res) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;