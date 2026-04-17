import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaPaw, FaHome, FaPhone, FaEnvelope, FaMapMarkerAlt, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import './AdoptionForm.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const AdoptionForm = () => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const { token, user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [petDetails, setPetDetails] = useState(null);
  const [formStep, setFormStep] = useState(1);
  const [progress, setProgress] = useState(0);
  
  const [formData, setFormData] = useState({
    // User Details
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Questionnaire
    homeEnvironment: '',
    previousPets: '',
    reasonForAdoption: '',
    preferredPetType: '',
    experienceLevel: '',
    timeAtHome: '',
    otherPets: '',
    children: '',
    yardSize: '',
    landlordApproval: ''
  });

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    // ZIP code validation
    const zipRegex = /^\d{6}$/;
    if (!formData.zipCode || !zipRegex.test(formData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid 6-digit ZIP code';
    }
    
    // Required fields validation
    const requiredFields = ['firstName', 'lastName', 'address', 'city', 'state'];
    requiredFields.forEach(field => {
      if (!formData[field]?.trim()) {
        newErrors[field] = 'This field is required';
      }
    });
    
    // Questionnaire validation
    const questionnaireFields = ['previousPets', 'reasonForAdoption'];
    questionnaireFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'Please select an option';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!isAuthenticated()) {
      toast.error('Please log in to submit an adoption request');
      navigate('/login');
      return;
    }
    
    // Check if user is a customer (not pet owner or admin)
    if (user.role !== 'customer') {
      toast.error('Only customers can submit adoption requests');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('Submitting adoption request for pet:', petId);
      
      const response = await fetch(`${API_BASE_URL}/api/adoptions/${petId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          previousPets: formData.previousPets,
          reasonForAdoption: formData.reasonForAdoption,
          notes: `${formData.reasonForAdoption} - ${formData.previousPets}`
        })
      });
      
      const result = await response.json();
      console.log('Adoption response:', result);
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit adoption request');
      }
      
      setSubmitSuccess(true);
      toast.success('🎉 Adoption request submitted successfully!');
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting adoption request:', error);
      toast.error(error.message || 'Failed to submit adoption request. Please try again.');
      setErrors({ submit: error.message || 'Failed to submit adoption request. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/pets/${petId}`);
        if (!response.ok) throw new Error('Pet not found');
        const data = await response.json();
        setPetDetails(data.data); // Server returns { success: true, data: pet }
      } catch (error) {
        console.error('Error fetching pet details:', error);
        toast.error('Pet not found');
        navigate('/pets');
      }
    };
    
    if (petId) fetchPetDetails();
  }, [petId, navigate]);

  useEffect(() => {
    setProgress((formStep / 3) * 100);
  }, [formStep]);

  const nextStep = () => {
    if (validateCurrentStep()) {
      setFormStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setFormStep(prev => Math.max(prev - 1, 1));
  };

  const validateCurrentStep = () => {
    const stepFields = {
      1: ['firstName', 'lastName', 'email', 'phone'],
      2: ['address', 'city', 'state', 'zipCode'],
      3: ['previousPets', 'reasonForAdoption']
    };

    const currentFields = stepFields[formStep];
    const newErrors = {};
    
    currentFields.forEach(field => {
      if (!formData[field]?.trim()) {
        newErrors[field] = 'This field is required';
      }
    });

    if (formStep === 1) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }

      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }

    if (formStep === 2) {
      const zipRegex = /^\d{6}$/;
      if (!zipRegex.test(formData.zipCode)) {
        newErrors.zipCode = 'Please enter a valid 6-digit ZIP code';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Create a memoized version for checking if current step is valid without setting errors
  const isCurrentStepValid = () => {
    const stepFields = {
      1: ['firstName', 'lastName', 'email', 'phone'],
      2: ['address', 'city', 'state', 'zipCode'],
      3: ['previousPets', 'reasonForAdoption']
    };

    const currentFields = stepFields[formStep];
    
    // Check if all required fields are filled
    const hasAllFields = currentFields.every(field => formData[field]?.trim());
    
    if (!hasAllFields) return false;

    // Additional validation for specific steps
    if (formStep === 1) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) return false;

      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) return false;
    }

    if (formStep === 2) {
      const zipRegex = /^\d{6}$/;
      if (!zipRegex.test(formData.zipCode)) return false;
    }

    return true;
  };

  if (submitSuccess) {
    return (
      <div className="adoption-form-container">
        <div className="success-message">
          <FaPaw className="success-icon" />
          <h2>Application Submitted Successfully!</h2>
          <p>Thank you for your adoption application. We will review your information and contact you within 3-5 business days.</p>
          <div className="success-actions">
            <Link to="/pets" className="btn btn-secondary">Browse More Pets</Link>
            <Link to="/dashboard" className="btn btn-primary">View Application Status</Link>
          </div>
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    switch(formStep) {
      case 1:
        return (
          <div className="form-section">
            <h3 className="section-title">Personal Information</h3>
            <div className="form-row">
              <div className="form-group">
                <div className="input-icon-wrapper">
                  <FaPaw className="input-icon" />
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`form-input ${errors.firstName ? 'error' : ''}`}
                  />
                </div>
                {errors.firstName && <span className="error-text">{errors.firstName}</span>}
              </div>
              <div className="form-group">
                <div className="input-icon-wrapper">
                  <FaPaw className="input-icon" />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`form-input ${errors.lastName ? 'error' : ''}`}
                  />
                </div>
                {errors.lastName && <span className="error-text">{errors.lastName}</span>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <div className="input-icon-wrapper">
                  <FaEnvelope className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-input ${errors.email ? 'error' : ''}`}
                  />
                </div>
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
              <div className="form-group">
                <div className="input-icon-wrapper">
                  <FaPhone className="input-icon" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`form-input ${errors.phone ? 'error' : ''}`}
                  />
                </div>
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="form-section">
            <h3 className="section-title">Address Information</h3>
            <div className="form-group">
              <div className="input-icon-wrapper">
                <FaHome className="input-icon" />
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`form-input ${errors.address ? 'error' : ''}`}
                />
              </div>
              {errors.address && <span className="error-text">{errors.address}</span>}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <div className="input-icon-wrapper">
                  <FaMapMarkerAlt className="input-icon" />
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    className={`form-input ${errors.city ? 'error' : ''}`}
                  />
                </div>
                {errors.city && <span className="error-text">{errors.city}</span>}
              </div>
              <div className="form-group">
                <div className="input-icon-wrapper">
                  <FaMapMarkerAlt className="input-icon" />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                    className={`form-input ${errors.state ? 'error' : ''}`}
                  />
                </div>
                {errors.state && <span className="error-text">{errors.state}</span>}
              </div>
              <div className="form-group">
                <div className="input-icon-wrapper">
                  <FaMapMarkerAlt className="input-icon" />
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="ZIP Code"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className={`form-input ${errors.zipCode ? 'error' : ''}`}
                  />
                </div>
                {errors.zipCode && <span className="error-text">{errors.zipCode}</span>}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="form-section">
            <h3 className="section-title">Adoption Questionnaire</h3>
            
            <div className="form-group">
              <label className="form-label">
                Have you owned pets before?
              </label>
              <select
                name="previousPets"
                value={formData.previousPets}
                onChange={handleChange}
                className={`form-select ${errors.previousPets ? 'error' : ''}`}
              >
                <option value="">Select...</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              {errors.previousPets && <span className="error-text">{errors.previousPets}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                What is your main reason for adoption?
              </label>
              <select
                name="reasonForAdoption"
                value={formData.reasonForAdoption}
                onChange={handleChange}
                className={`form-select ${errors.reasonForAdoption ? 'error' : ''}`}
              >
                <option value="">Select...</option>
                <option value="companionship">Companionship</option>
                <option value="family">Family pet</option>
                <option value="rescue">Rescue/adopt</option>
                <option value="other">Other</option>
              </select>
              {errors.reasonForAdoption && <span className="error-text">{errors.reasonForAdoption}</span>}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="adoption-form-container">
      <div className="form-wrapper">
        {petDetails && (
          <div className="pet-summary">
            <img src={petDetails.imageUrl || 'https://via.placeholder.com/100x100?text=Pet'} alt={petDetails.name} className="pet-thumbnail" />
            <div className="pet-info">
              <h2>Adopting {petDetails.name}</h2>
              <p>{petDetails.breed} • {petDetails.age} • {petDetails.location}</p>
              <p><strong>Status:</strong> {petDetails.status}</p>
            </div>
          </div>
        )}

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          <div className="progress-steps">
            <div className={`step ${formStep >= 1 ? 'active' : ''}`}>Personal Info</div>
            <div className={`step ${formStep >= 2 ? 'active' : ''}`}>Address</div>
            <div className={`step ${formStep >= 3 ? 'active' : ''}`}>Questionnaire</div>
          </div>
        </div>

        <h1 className="form-title">Adoption Application</h1>
        
        {errors.submit && (
          <div className="error-message">
            {errors.submit}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="adoption-form">
          {renderStepContent()}
          
          <div className="form-navigation">
            {formStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="nav-button prev"
              >
                <FaArrowLeft className="button-icon" /> Previous
              </button>
            )}
            
            {formStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="nav-button next"
              >
                Next <FaArrowRight className="button-icon" />
              </button>
            ) : (
              <button
                type="submit"
                className="nav-button submit"
                disabled={!isCurrentStepValid()}
              >
                Submit Application <FaPaw className="button-icon" />
              </button>
            )}
          </div>





        </form>
      </div>
      
      {/* Toast Container for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default AdoptionForm;