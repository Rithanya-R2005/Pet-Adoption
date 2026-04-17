const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Pet = require('../models/Pet');
const Adoption = require('../models/Adoption');
const User = require('../models/User');

router.use(protect);

// ================= STATIC ROUTES FIRST =================

// Get user's adoption requests
router.get('/my-requests', async (req, res) => {
  try {
    const adoptions = await Adoption.find({ user: req.user.id })
      .populate('pet', 'name breed species imageUrl location status')
      .populate('petOwner', 'username email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: adoptions });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get adopted pets
router.get('/my-adoptions', async (req, res) => {
  try {
    const adoptions = await Adoption.find({
      user: req.user.id,
      status: { $in: ['Approved', 'Completed'] }
    }).populate('pet');

    res.json({ success: true, data: adoptions });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Owner requests
router.get('/owner-requests', async (req, res) => {
  try {
    const adoptions = await Adoption.find({ petOwner: req.user.id })
      .populate('pet')
      .populate('user');

    res.json({ success: true, data: adoptions });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get requests for a pet
router.get('/pet/:petId', async (req, res) => {
  try {
    const adoptions = await Adoption.find({ pet: req.params.petId })
      .populate('user');

    res.json({ success: true, data: adoptions });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ================= DYNAMIC ROUTES LAST =================

// Adopt a pet
router.post('/:petId', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.petId);

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Check if pet is available
    if (pet.status !== 'Available') {
      return res.status(400).json({ message: 'This pet is not available for adoption' });
    }

    // Check if user already applied for this pet
    const existingAdoption = await Adoption.findOne({
      pet: pet._id,
      user: req.user.id
    });

    if (existingAdoption) {
      return res.status(400).json({ message: 'You have already submitted an adoption request for this pet' });
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      previousPets,
      reasonForAdoption,
      notes
    } = req.body;

    const adoption = await Adoption.create({
      pet: pet._id,
      user: req.user.id,
      petOwner: pet.owner,
      adopterUsername: req.user.username,
      adopterFullName: `${firstName} ${lastName}`,
      status: 'Pending',
      applicationData: {
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        state,
        zipCode,
        previousPets,
        reasonForAdoption
      },
      notes: notes || ''
    });

    // Update pet status to pending
    await Pet.findByIdAndUpdate(pet._id, { status: 'Pending' });

    res.status(201).json({ success: true, data: adoption });
  } catch (err) {
    console.error('Adoption error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

// Update adoption status
router.put('/:id/status', async (req, res) => {
  try {
    const adoption = await Adoption.findById(req.params.id);

    if (!adoption) {
      return res.status(404).json({ message: 'Not found' });
    }

    adoption.status = req.body.status;
    await adoption.save();

    res.json({ success: true, data: adoption });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single adoption
router.get('/:id', async (req, res) => {
  try {
    const adoption = await Adoption.findById(req.params.id);

    if (!adoption) {
      return res.status(404).json({ message: 'Not found' });
    }

    res.json({ success: true, data: adoption });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;