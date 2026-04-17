import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const UserDashboard = () => {
  const { token, user } = useAuth();
  const [adoptedPets, setAdoptedPets] = useState([]);
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch adopted pets and adoption requests
        const [adoptedResponse, requestsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/adoptions/my-adoptions`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
          fetch(`${API_BASE_URL}/api/adoptions/my-requests`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
        ]);

        const adoptedData = await adoptedResponse.json();
        const requestsData = await requestsResponse.json();

        if (adoptedResponse.ok) {
          setAdoptedPets(adoptedData.data || []);
        } else {
          setError(adoptedData.message || 'Failed to fetch adopted pets');
        }

        if (requestsResponse.ok) {
          setAdoptionRequests(requestsData.data || []);
        } else {
          setError(requestsData.message || 'Failed to fetch adoption requests');
        }
      } catch (err) {
        setError('Error connecting to server');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [token]);

  return (
    <div className="user-dashboard">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
          Welcome, {user?.username || 'User'}! 🐾
        </h1>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading data...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</div>
        ) : (
          <>
            {/* Adopted Pets Section */}
            <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid #667eea', paddingBottom: '0.5rem' }}>My Adopted Pets</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                {adoptedPets.length > 0 ? (
                  adoptedPets.map(adoption => (
                    <div key={adoption._id} className="pet-card" style={{ 
                      border: '1px solid #eee', 
                      borderRadius: '10px',
                      overflow: 'hidden',
                      transition: 'transform 0.3s ease',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                      <img
                        src={adoption.pet?.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
                        alt={adoption.pet?.name || 'Pet'}
                        style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                        }}
                      />
                      <div style={{ padding: '1rem' }}>
                        <h4 style={{ margin: '0.5rem 0', color: '#2d3748' }}>{adoption.pet?.name || 'Unknown Pet'}</h4>
                        <p style={{ color: '#718096', margin: '0.25rem 0', fontSize: '0.9rem' }}>
                          {adoption.pet?.breed || 'Unknown'} • {adoption.pet?.age || 'Unknown age'}
                        </p>
                        <p style={{ color: '#4a5568', margin: '0.5rem 0', fontSize: '0.9rem' }}>
                          Adopted on: {new Date(adoption.approvalDate || adoption.createdAt).toLocaleDateString()}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                          <span style={{ 
                            padding: '0.25rem 0.5rem', 
                            borderRadius: '9999px', 
                            backgroundColor: '#c6f6d5',
                            color: '#22543d',
                            fontSize: '0.75rem',
                            fontWeight: 'bold'
                          }}>
                            Adopted
                          </span>
                          <Link 
                            to={`/pet/${adoption.pet?._id}`} 
                            style={{
                              color: '#4299e1',
                              textDecoration: 'none',
                              fontWeight: '500',
                              fontSize: '0.9rem',
                              ':hover': {
                                textDecoration: 'underline'
                              }
                            }}
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                    You haven't adopted any pets yet. <Link to="/pets" style={{ color: '#4299e1' }}>Browse available pets</Link> to start your adoption journey!
                  </p>
                )}
              </div>
              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <Link 
                  to="/pets" 
                  className="btn-primary"
                  style={{
                    display: 'inline-block',
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#4f46e5',
                    color: 'white',
                    borderRadius: '0.375rem',
                    textDecoration: 'none',
                    fontWeight: '500',
                    transition: 'background-color 0.2s',
                    ':hover': {
                      backgroundColor: '#4338ca'
                    }
                  }}
                >
                  Browse Available Pets
                </Link>
              </div>
            </div>

            {/* Adoption Requests Section */}
            {adoptionRequests.length > 0 && (
                <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
                  <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid #667eea', paddingBottom: '0.5rem' }}>My Adoption Requests</h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f7fafc', borderBottom: '1px solid #e2e8f0' }}>
                          <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#4a5568', fontWeight: '600', fontSize: '0.875rem' }}>Pet</th>
                          <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#4a5568', fontWeight: '600', fontSize: '0.875rem' }}>Owner</th>
                          <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#4a5568', fontWeight: '600', fontSize: '0.875rem' }}>Status</th>
                          <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#4a5568', fontWeight: '600', fontSize: '0.875rem' }}>Date</th>
                          <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#4a5568', fontWeight: '600', fontSize: '0.875rem' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {adoptionRequests.map(adoption => (
                          <tr key={adoption._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <td style={{ padding: '1rem', display: 'flex', alignItems: 'center' }}>
                              <img 
                                src={adoption.pet?.imageUrl || 'https://via.placeholder.com/50?text=Pet'} 
                                alt={adoption.pet?.name || 'Pet'} 
                                style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover', marginRight: '1rem' }} 
                              />
                              <div>
                                <div style={{ fontWeight: '500' }}>{adoption.pet?.name || 'Pet'}</div>
                                <div style={{ fontSize: '0.8rem', color: '#718096' }}>{adoption.pet?.breed}</div>
                              </div>
                            </td>
                            <td style={{ padding: '1rem', color: '#4a5568', fontSize: '0.875rem' }}>
                              {adoption.petOwner?.username || 'Unknown'}
                            </td>
                            <td style={{ padding: '1rem' }}>
                              <span style={{
                                padding: '0.25rem 0.5rem',
                                borderRadius: '9999px',
                                backgroundColor: adoption.status === 'Approved' ? '#c6f6d5' : 
                                              adoption.status === 'Rejected' ? '#fed7d7' : 
                                              adoption.status === 'Completed' ? '#bee3f8' : '#feebc8',
                                color: adoption.status === 'Approved' ? '#22543d' : 
                                      adoption.status === 'Rejected' ? '#9b2c2c' : 
                                      adoption.status === 'Completed' ? '#2a69ac' : '#9c4221',
                                fontSize: '0.75rem',
                                fontWeight: 'bold'
                              }}>
                                {adoption.status}
                              </span>
                            </td>
                            <td style={{ padding: '1rem', color: '#718096', fontSize: '0.875rem' }}>
                              {new Date(adoption.createdAt).toLocaleDateString()}
                            </td>
                            <td style={{ padding: '1rem' }}>
                              {adoption.pet && (
                                <Link 
                                  to={`/pet/${adoption.pet._id}`} 
                                  style={{
                                    color: '#4299e1',
                                    textDecoration: 'none',
                                    fontWeight: '500',
                                    fontSize: '0.875rem',
                                    marginRight: '1rem'
                                  }}
                                >
                                  View Pet
                                </Link>
                              )}
                              {adoption.ownerNotes && (
                                <span style={{ fontSize: '0.8rem', color: '#718096' }}>
                                  Note: {adoption.ownerNotes}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
          </>
        )}

        {/* Profile Info */}
        <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid #667eea', paddingBottom: '0.5rem' }}>Profile Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <p><strong>Username:</strong> {user?.username || 'N/A'}</p>
              <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
              <p><strong>Role:</strong> {user?.role || 'Customer'}</p>
            </div>
            <div>
              <p><strong>Member Since:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Total Adoption Requests:</strong> {adoptionRequests.length}</p>
              <p><strong>Adopted Pets:</strong> {adoptedPets.length}</p>
            </div>
          </div>
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <Link 
              to="/pets" 
              style={{
                display: 'inline-block',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#28a745',
                color: 'white',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '500',
                marginRight: '1rem'
              }}
            >
              🐾 Find More Pets to Adopt
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;