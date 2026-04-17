import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './PetOwnerDashboard.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const PetOwnerPetsPage = () => {
  const { token, user } = useAuth();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditPetForm, setShowEditPetForm] = useState(false);
  const [showAddPetForm, setShowAddPetForm] = useState(false);
  const [currentPet, setCurrentPet] = useState(null);
  const [petForm, setPetForm] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    gender: '',
    size: '',
    description: '',
    location: '',
    image: '',
    status: 'Available'
  });

  useEffect(() => {
    console.log(' PetOwnerPetsPage useEffect triggered:', {
      hasToken: !!token,
      user: user?.username,
      userId: user?.id,
      userRole: user?.role
    });
    
    if (token && user && user.role === 'petowner') {
      console.log(' Conditions met, calling fetchPets...');
      fetchPets();
    } else {
      console.log(' Conditions not met:', {
        hasToken: !!token,
        hasUser: !!user,
        userRole: user?.role,
        isPetOwner: user?.role === 'petowner'
      });
      setPets([]);
      setLoading(false);
    }
  }, [token, user]);

  const fetchPets = async (retryCount = 0) => {
    console.log(' PetOwnerPetsPage - fetchPets called:', { 
      hasToken: !!token, 
      user: user?.username, 
      role: user?.role,
      retryCount 
    });
    
    if (!token) {
      console.log(' No token found');
      setLoading(false);
      return;
    }

    if (!user || user.role !== 'petowner') {
      console.log(' User not authorized:', { user: user?.username, role: user?.role });
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      console.log(' Making request to /api/pets/owner...');
      const response = await fetch(`${API_BASE_URL}/api/pets/owner`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log(' Response status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('You do not have permission to view these pets.');
        } else if (response.status === 404) {
          // No pets found is not an error, just return empty array
          setPets([]);
          setLoading(false);
          return;
        } else if (response.status === 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(`Error: ${response.status}`);
        }
      }

      const data = await response.json();
      console.log(' Received data from server:', data);
      console.log(' Pets array:', data.data);
      console.log(' Number of pets:', data.data?.length || 0);
      
      const petsData = data.data || [];
      setPets(petsData);
      
      if (petsData.length > 0) {
        console.log(' Successfully loaded', petsData.length, 'pets');
        petsData.forEach((pet, index) => {
          console.log(`Pet ${index + 1}:`, {
            id: pet._id,
            name: pet.name,
            species: pet.species,
            status: pet.status,
            owner: pet.owner?.username || pet.owner
          });
        });
      } else {
        console.log(' No pets found for this owner');
      }
    } catch (err) {
      console.error('Error fetching pets:', err);
      setError(err.message);
      
      // Retry logic for network errors
      if (retryCount < 3 && err.message.includes('Failed to fetch')) {
        setTimeout(() => fetchPets(retryCount + 1), 1000 * (retryCount + 1));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPetForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setPetForm({
      name: '',
      species: '',
      breed: '',
      age: '',
      gender: '',
      size: '',
      description: '',
      location: '',
      image: '',
      status: 'Available'
    });
    setCurrentPet(null);
  };

  const handleEditPet = (pet) => {
    setCurrentPet(pet);
    setPetForm({
      name: pet.name || '',
      species: pet.species || '',
      breed: pet.breed || '',
      age: pet.age || '',
      gender: pet.gender || '',
      size: pet.size || '',
      description: pet.description || '',
      location: pet.location || '',
      image: pet.imageUrl || '',
      status: pet.status || 'Available'
    });
    setShowEditPetForm(true);
  };

  const handleUpdatePet = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!petForm.name || !petForm.species || !petForm.image) {
      setError('Please fill in all required fields (Name, Species, Image URL)');
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/api/pets/${currentPet._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: petForm.name.trim(),
          species: petForm.species.trim(),
          breed: petForm.breed.trim(),
          age: petForm.age.trim(),
          gender: petForm.gender,
          size: petForm.size,
          description: petForm.description.trim(),
          location: petForm.location.trim(),
          imageUrl: petForm.image.trim(),
          status: petForm.status
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update the pet in local state immediately for instant UI update
        const updatedPet = data.data;
        setPets(prev => prev.map(p => p._id === currentPet._id ? updatedPet : p));
        
        // Close form and reset
        setShowEditPetForm(false);
        resetForm();
        setError('');
        
        // Show success message
        toast.success(`"${updatedPet.name}" has been updated successfully and changes are saved to database!`);
      } else {
        const errorData = await response.json();
        const errorMsg = errorData.message || 'Failed to update pet';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      const errorMsg = 'Failed to update pet. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
      console.error('Error updating pet:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPet = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!petForm.name || !petForm.species || !petForm.breed || !petForm.age || 
        !petForm.gender || !petForm.size || !petForm.description || 
        !petForm.location || !petForm.image) {
      setError('Please fill in all required fields');
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      console.log('Adding new pet to MongoDB Atlas...');
      
      const petData = {
        name: petForm.name.trim(),
        species: petForm.species.trim(),
        breed: petForm.breed.trim(),
        age: petForm.age.trim(),
        gender: petForm.gender,
        size: petForm.size,
        description: petForm.description.trim(),
        location: petForm.location.trim(),
        imageUrl: petForm.image.trim()
      };
      
      const response = await fetch(`${API_BASE_URL}/api/pets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(petData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        const errorMsg = data.message || `Failed to add pet (Status: ${response.status})`;
        throw new Error(errorMsg);
      }
      
      console.log(' Pet added successfully to MongoDB Atlas:', data.data);
      
      // Immediately add the new pet to local state for instant UI update
      const newPet = data.data;
      setPets(prevPets => [newPet, ...prevPets]);
      
      // Close form and reset
      setShowAddPetForm(false);
      resetForm();
      setError('');
      
      // Show success message
      toast.success(`"${petData.name}" has been added to your pets and is now visible to customers!`, {
        position: "top-right",
        autoClose: 5000,
      });
      
    } catch (err) {
      console.error('Error adding pet:', err);
      const errorMsg = err.message || 'Failed to add pet. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePet = async (petId) => {
    // Find the pet name for better user feedback
    const petToDelete = pets.find(pet => pet._id === petId);
    const petName = petToDelete ? petToDelete.name : 'this pet';
    
    if (window.confirm(`Are you sure you want to delete "${petName}"? This action cannot be undone.`)) {
      try {
        setLoading(true);
        console.log('Deleting pet from MongoDB Atlas...');
        
        const response = await fetch(`${API_BASE_URL}/api/pets/${petId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(' Pet deleted successfully from MongoDB Atlas:', data);
        
        // Update the UI by removing the deleted pet immediately for instant feedback
        setPets(prevPets => prevPets.filter(pet => pet._id !== petId));
        
        // Show success message
        toast.success(`"${petName}" has been deleted from your pets and removed from customer listings!`);
        
      } catch (err) {
        console.error('Error deleting pet:', err);
        const errorMsg = err.message.includes('Failed to fetch') 
          ? 'Unable to connect to the server.' 
          : `Failed to delete pet: ${err.message}`;
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="pet-owner-dashboard">
      <ToastContainer position="top-right" autoClose={5000} />
      
      <div className="dashboard-header">
        <h1>My Pets</h1>
        <p>Manage your pet listings - Only pets you add will appear here and be visible to customers</p>
        <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
          <button 
            className="add-pet-button"
            onClick={() => setShowAddPetForm(true)}
            style={{
              background: '#28a745',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Add New Pet
          </button>
          
          <button 
            onClick={() => fetchPets()}
            disabled={loading}
            style={{
              background: '#17a2b8',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            {loading ? ' Loading...' : ' Refresh Pets'}
          </button>
          
          <button 
            onClick={async () => {
              try {
                const response = await fetch(`${API_BASE_URL}/api/pets/debug-all`, {
                  headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                console.log(' Debug Data:', data);
                alert(`Debug: Found ${data.debug.totalPetsInDB} total pets, ${data.debug.userPetsCount} for you. Check console for details.`);
              } catch (err) {
                console.error('Debug error:', err);
              }
            }}
            style={{
              background: '#ffc107',
              color: 'black',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            🔍 Debug Info
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Pet Listings Section */}
      <div className="pet-management-section">
        <h2>Your Pet Listings ({pets.length})</h2>
        {pets.length > 0 && (
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            These are the pets you've added. They are stored in MongoDB Atlas and visible to customers for adoption.
          </p>
        )}
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔄</div>
            <p>Loading your pets from MongoDB Atlas...</p>
          </div>
        ) : pets.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem', 
            background: '#f8f9fa', 
            borderRadius: '15px', 
            border: '2px dashed #dee2e6',
            margin: '2rem 0'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🐾</div>
            <h3 style={{ color: '#495057', marginBottom: '1rem' }}>No pets added yet</h3>
            <p style={{ color: '#6c757d', marginBottom: '2rem' }}>
              Start building your pet listings! Add your first pet to make it available for adoption.
            </p>
            <button 
              onClick={() => setShowAddPetForm(true)}
              style={{
                background: '#28a745',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              🐕 Add Your First Pet
            </button>
          </div>
        ) : (
          <div className="pet-cards">
            {pets.map(pet => (
              <div key={pet._id} className="pet-card">
                <div className="pet-image">
                  <img src={pet.imageUrl} alt={pet.name} />
                  <span className={`pet-status ${pet.status.toLowerCase()}`}>{pet.status}</span>
                </div>
                <div className="pet-details">
                  <h3>{pet.name}</h3>
                  <p><strong>Species:</strong> {pet.species}</p>
                  <p><strong>Breed:</strong> {pet.breed}</p>
                  <p><strong>Age:</strong> {pet.age}</p>
                  <p><strong>Gender:</strong> {pet.gender}</p>
                  <p><strong>Size:</strong> {pet.size}</p>
                  <p><strong>Location:</strong> {pet.location}</p>
                  <p><strong>Description:</strong> {pet.description}</p>
                </div>
                <div className="pet-actions">
                  <button 
                    className="edit-button"
                    onClick={() => handleEditPet(pet)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => handleDeletePet(pet._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Pet Form Modal */}
      {showEditPetForm && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => {setShowEditPetForm(false); resetForm()}}>&times;</span>
            <h2>Edit Pet</h2>
            <form onSubmit={handleUpdatePet}>
              <div className="form-group">
                <label>Name*</label>
                <input 
                  type="text" 
                  name="name" 
                  value={petForm.name} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Species*</label>
                <select 
                  name="species" 
                  value={petForm.species} 
                  onChange={handleInputChange} 
                  required
                >
                  <option value="">Select Species</option>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Bird">Bird</option>
                  <option value="Small Animal">Small Animal</option>
                  <option value="Reptile">Reptile</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Breed*</label>
                <input 
                  type="text" 
                  name="breed" 
                  value={petForm.breed} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Age*</label>
                <input 
                  type="text" 
                  name="age" 
                  value={petForm.age} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Gender*</label>
                <select 
                  name="gender" 
                  value={petForm.gender} 
                  onChange={handleInputChange} 
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Size*</label>
                <select 
                  name="size" 
                  value={petForm.size} 
                  onChange={handleInputChange} 
                  required
                >
                  <option value="">Select Size</option>
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                  <option value="Extra Large">Extra Large</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Description*</label>
                <textarea 
                  name="description" 
                  value={petForm.description} 
                  onChange={handleInputChange} 
                  required
                ></textarea>
              </div>
              
              <div className="form-group">
                <label>Location*</label>
                <input 
                  type="text" 
                  name="location" 
                  value={petForm.location} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Image URL*</label>
                <input 
                  type="text" 
                  name="image" 
                  value={petForm.image} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Status*</label>
                <select 
                  name="status" 
                  value={petForm.status} 
                  onChange={handleInputChange} 
                  required
                >
                  <option value="Available">Available</option>
                  <option value="Adopted">Adopted</option>
                  <option value="Pending">Pending</option>
                  <option value="Not Available">Not Available</option>
                </select>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="submit-button">Update Pet</button>
                <button type="button" className="cancel-button" onClick={() => {setShowEditPetForm(false); resetForm()}}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Pet Form Modal */}
      {showAddPetForm && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => {setShowAddPetForm(false); resetForm()}}>&times;</span>
            <h2>Add New Pet</h2>
            <form onSubmit={handleAddPet}>
              <div className="form-group">
                <label>Name*</label>
                <input 
                  type="text" 
                  name="name" 
                  value={petForm.name} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Species*</label>
                <select 
                  name="species" 
                  value={petForm.species} 
                  onChange={handleInputChange} 
                  required
                >
                  <option value="">Select Species</option>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Bird">Bird</option>
                  <option value="Small Animal">Small Animal</option>
                  <option value="Reptile">Reptile</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Breed*</label>
                <input 
                  type="text" 
                  name="breed" 
                  value={petForm.breed} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Age*</label>
                <input 
                  type="text" 
                  name="age" 
                  value={petForm.age} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Gender*</label>
                <select 
                  name="gender" 
                  value={petForm.gender} 
                  onChange={handleInputChange} 
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Size*</label>
                <select 
                  name="size" 
                  value={petForm.size} 
                  onChange={handleInputChange} 
                  required
                >
                  <option value="">Select Size</option>
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                  <option value="Extra Large">Extra Large</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Description*</label>
                <textarea 
                  name="description" 
                  value={petForm.description} 
                  onChange={handleInputChange} 
                  required
                ></textarea>
              </div>
              
              <div className="form-group">
                <label>Location*</label>
                <input 
                  type="text" 
                  name="location" 
                  value={petForm.location} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Image URL*</label>
                <input 
                  type="text" 
                  name="image" 
                  value={petForm.image} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" className="submit-button">Add Pet</button>
                <button type="button" className="cancel-button" onClick={() => {setShowAddPetForm(false); resetForm()}}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetOwnerPetsPage;