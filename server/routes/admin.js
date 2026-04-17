const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth');
const { adminAuth, adminOrOwnerAuth } = require('../middleware/adminAuth');

const User = require('../models/User');
const Pet = require('../models/Pet');
const Adoption = require('../models/Adoption');

// Apply protect middleware to all routes
router.use(protect);

// ====================== USERS ======================

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      role,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const query = {};

    if (role && ['customer', 'petowner', 'admin'].includes(role)) {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const sort = {
      [sortBy]: sortOrder === 'desc' ? -1 : 1
    };

    const users = await User.find(query)
      .select('-password')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// ====================== PETS ======================

// Get pets (admin + owner)
router.get('/pets', adminOrOwnerAuth, async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      species,
      breed,
      status,
      location,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const query = {};

    // Pet owner sees only own pets
    if (req.user.role === 'petowner') {
      query.owner = req.user.id;
    }

    if (species) query.species = species;
    if (breed) query.breed = { $regex: breed, $options: 'i' };
    if (status) query.status = status;
    if (location) query.location = { $regex: location, $options: 'i' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { breed: { $regex: search, $options: 'i' } }
      ];
    }

    const sort = {
      [sortBy]: sortOrder === 'desc' ? -1 : 1
    };

    const pets = await Pet.find(query)
      .populate('owner', 'username email')
      .populate('adoptedBy', 'username email')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Pet.countDocuments(query);

    res.json({
      success: true,
      data: pets,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// ====================== ADOPTIONS ======================

// Get all adoptions
router.get('/adoptions', adminAuth, async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const query = {};

    if (status) {
      query.status = status;
    }

    const sort = {
      [sortBy]: sortOrder === 'desc' ? -1 : 1
    };

    const adoptions = await Adoption.find(query)
      .populate('pet', 'name species')
      .populate('user', 'username email')
      .populate('petOwner', 'username email')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Adoption.countDocuments(query);

    res.json({
      success: true,
      data: adoptions,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// ====================== DASHBOARD ======================

router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const [
      totalUsers,
      totalPets,
      totalAdoptions,
      pendingAdoptions
    ] = await Promise.all([
      User.countDocuments(),
      Pet.countDocuments(),
      Adoption.countDocuments(),
      Adoption.countDocuments({ status: 'Pending' })
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalPets,
        totalAdoptions,
        pendingAdoptions
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;