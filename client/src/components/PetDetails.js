import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './PetDetails.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const PetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isCustomer } = useAuth();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching pet details for ID:', id);
        const response = await fetch(`${API_BASE_URL}/api/pets/${id}`);

        console.log('Response status:', response.status);

        if (!response.ok) {
          throw new Error(`Failed to fetch pet details: ${response.status}`);
        }

        const data = await response.json();
        console.log('Pet data received:', data);
        setPet(data.data);
      } catch (err) {
        console.error('Error fetching pet details:', err);
        setError('Failed to load pet details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPetDetails();
    } else {
      setError('No pet ID provided');
      setLoading(false);
    }
  }, [id]);

  const handleAdoptClick = () => {
    if (!isAuthenticated()) {
      // Redirect to login if not authenticated
      navigate('/login', { state: { from: `/pets/${id}` } });
      return;
    }
    
    if (!isCustomer()) {
      alert('Only customers can submit adoption requests.');
      return;
    }
    
    // Navigate to adoption form
    navigate(`/adopt/${id}`);
  };

  if (loading) return <div className="loading">Loading pet details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!pet) return <div className="not-found">Pet not found</div>;

  return (
    <div className="pet-details-container">
      <div className="pet-details-card">
        <div className="pet-image">
          <img 
            src={pet.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'} 
            alt={pet.name} 
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
            }}
          />
          <span className={`status-badge ${pet.status.toLowerCase()}`}>{pet.status}</span>
        </div>
        
        <div className="pet-info">
          <h1>{pet.name}</h1>
          <div className="pet-attributes">
            <div className="attribute">
              <span className="label">Species:</span>
              <span className="value">{pet.species}</span>
            </div>
            <div className="attribute">
              <span className="label">Breed:</span>
              <span className="value">{pet.breed}</span>
            </div>
            <div className="attribute">
              <span className="label">Age:</span>
              <span className="value">{pet.age} years</span>
            </div>
            <div className="attribute">
              <span className="label">Gender:</span>
              <span className="value">{pet.gender}</span>
            </div>
            <div className="attribute">
              <span className="label">Size:</span>
              <span className="value">{pet.size}</span>
            </div>
            <div className="attribute">
              <span className="label">Location:</span>
              <span className="value">{pet.location}</span>
            </div>
          </div>
          <div className="pet-description">
            <h3>About {pet.name}</h3>
            <p>{pet.description}</p>
          </div>
          
          <div className="owner-info">
            <h3>Contact Information</h3>
            <p><strong>Owner:</strong> {pet.owner?.username || 'Not available'}</p>
            <p><strong>Email:</strong> {pet.owner?.email || 'Not available'}</p>
          </div>
          
          <div className="action-buttons">
            {pet.status === 'Available' && (
              <button className="adopt-button" onClick={handleAdoptClick}>
                Request to Adopt
              </button>
            )}
            <Link to="/pets" className="back-button">
              Back to Listings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetails;