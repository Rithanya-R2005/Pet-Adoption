const mongoose = require('mongoose');

const adoptionSchema = new mongoose.Schema({
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  adopterUsername: {
    type: String,
    required: true
  },
  adopterFullName: {
    type: String,
    required: true
  },
  petOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Completed'],
    default: 'Pending'
  },
  applicationData: {
    // Personal Information
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },

    // Questionnaire (simplified)
    previousPets: { type: String, required: true },
    reasonForAdoption: { type: String, required: true }
  },
  adoptionDate: {
    type: Date,
    default: Date.now
  },
  approvalDate: {
    type: Date
  },
  completionDate: {
    type: Date
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  },
  ownerNotes: {
    type: String,
    maxlength: [500, 'Owner notes cannot be more than 500 characters']
  }
}, {
  timestamps: true
});

// Prevent duplicate adoption requests
adoptionSchema.index({ pet: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Adoption', adoptionSchema);
