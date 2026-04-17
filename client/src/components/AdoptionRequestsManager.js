import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const AdoptionRequestsManager = () => {
  const { token } = useAuth();
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const fetchAdoptionRequests = async () => {
    try {
      setLoading(true);
      console.log('Fetching adoption requests...');
      const response = await fetch(`${API_BASE_URL}/api/adoptions/owner-requests`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Adoption requests data:', data);
        setAdoptionRequests(data.data || []);
      } else {
        console.error('Failed to fetch adoption requests');
        toast.error('Failed to fetch adoption requests');
      }
    } catch (err) {
      console.error('Error fetching adoption requests:', err);
      toast.error('Error fetching adoption requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAdoptionAction = async (adoptionId, action, ownerNotes = '') => {
    try {
      console.log(`${action} adoption request:`, adoptionId);
      const response = await fetch(`${API_BASE_URL}/api/adoptions/${adoptionId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: action,
          ownerNotes: ownerNotes
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || `Adoption request ${action.toLowerCase()} successfully!`);
        
        // Refresh adoption requests
        await fetchAdoptionRequests();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || `Failed to ${action.toLowerCase()} adoption request`);
      }
    } catch (err) {
      console.error(`Error ${action.toLowerCase()} adoption request:`, err);
      toast.error(`Failed to ${action.toLowerCase()} adoption request`);
    }
  };

  const viewApplicationDetails = (request) => {
    setSelectedRequest(request);
    setShowDetails(true);
  };

  useEffect(() => {
    if (token) {
      fetchAdoptionRequests();
    }
  }, [token]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        Loading adoption requests...
      </div>
    );
  }

  return (
    <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: 0, borderBottom: '2px solid #667eea', paddingBottom: '0.5rem' }}>
          Adoption Requests ({adoptionRequests.length})
        </h3>
        <button 
          onClick={fetchAdoptionRequests}
          style={{
            background: '#17a2b8',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Refresh
        </button>
      </div>

      {adoptionRequests.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#6c757d' }}>
          No adoption requests yet. When customers submit adoption applications for your pets, they will appear here.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f7fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#4a5568', fontWeight: '600', fontSize: '0.875rem' }}>Pet</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#4a5568', fontWeight: '600', fontSize: '0.875rem' }}>Applicant</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#4a5568', fontWeight: '600', fontSize: '0.875rem' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#4a5568', fontWeight: '600', fontSize: '0.875rem' }}>Date</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#4a5568', fontWeight: '600', fontSize: '0.875rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {adoptionRequests.map(request => (
                <tr key={request._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '1rem', display: 'flex', alignItems: 'center' }}>
                    <img 
                      src={request.pet?.imageUrl || 'https://via.placeholder.com/50?text=Pet'} 
                      alt={request.pet?.name || 'Pet'} 
                      style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover', marginRight: '1rem' }} 
                    />
                    <div>
                      <div style={{ fontWeight: '500' }}>{request.pet?.name || 'Pet'}</div>
                      <div style={{ fontSize: '0.8rem', color: '#718096' }}>{request.pet?.breed}</div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: '500' }}>{request.user?.username || 'Unknown'}</div>
                    <div style={{ fontSize: '0.8rem', color: '#718096' }}>{request.user?.email}</div>
                    {request.applicationData && (
                      <div style={{ fontSize: '0.8rem', color: '#718096' }}>
                        {request.applicationData.firstName} {request.applicationData.lastName}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '9999px',
                      backgroundColor: request.status === 'Approved' ? '#c6f6d5' : 
                                    request.status === 'Rejected' ? '#fed7d7' : 
                                    request.status === 'Completed' ? '#bee3f8' : '#feebc8',
                      color: request.status === 'Approved' ? '#22543d' : 
                            request.status === 'Rejected' ? '#9b2c2c' : 
                            request.status === 'Completed' ? '#2a69ac' : '#9c4221',
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}>
                      {request.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: '#718096', fontSize: '0.875rem' }}>
                    {new Date(request.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => viewApplicationDetails(request)}
                        style={{
                          background: '#007bff',
                          color: 'white',
                          border: 'none',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        View Details
                      </button>
                      {request.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleAdoptionAction(request._id, 'Approved')}
                            style={{
                              background: '#28a745',
                              color: 'white',
                              border: 'none',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.8rem'
                            }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAdoptionAction(request._id, 'Rejected')}
                            style={{
                              background: '#dc3545',
                              color: 'white',
                              border: 'none',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.8rem'
                            }}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Application Details Modal */}
      {showDetails && selectedRequest && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '15px',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflow: 'auto',
            width: '90%'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3>Adoption Application Details</h3>
              <button
                onClick={() => setShowDetails(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>

            {selectedRequest.applicationData && (
              <div>
                <h4>Personal Information</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <strong>Name:</strong> {selectedRequest.applicationData.firstName} {selectedRequest.applicationData.lastName}
                  </div>
                  <div>
                    <strong>Email:</strong> {selectedRequest.applicationData.email}
                  </div>
                  <div>
                    <strong>Phone:</strong> {selectedRequest.applicationData.phone}
                  </div>
                  <div>
                    <strong>Address:</strong> {selectedRequest.applicationData.address}
                  </div>
                  <div>
                    <strong>City:</strong> {selectedRequest.applicationData.city}
                  </div>
                  <div>
                    <strong>State:</strong> {selectedRequest.applicationData.state}
                  </div>
                </div>

                <h4>Home Environment</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <strong>Home Type:</strong> {selectedRequest.applicationData.homeEnvironment}
                  </div>
                  <div>
                    <strong>Time at Home:</strong> {selectedRequest.applicationData.timeAtHome}
                  </div>
                  <div>
                    <strong>Previous Pets:</strong> {selectedRequest.applicationData.previousPets}
                  </div>
                  <div>
                    <strong>Other Pets:</strong> {selectedRequest.applicationData.otherPets}
                  </div>
                  <div>
                    <strong>Children:</strong> {selectedRequest.applicationData.children}
                  </div>
                  <div>
                    <strong>Landlord Approval:</strong> {selectedRequest.applicationData.landlordApproval}
                  </div>
                </div>

                <h4>Adoption Reason</h4>
                <p>{selectedRequest.applicationData.reasonForAdoption}</p>

                {selectedRequest.notes && (
                  <>
                    <h4>Additional Notes</h4>
                    <p>{selectedRequest.notes}</p>
                  </>
                )}

                {selectedRequest.ownerNotes && (
                  <>
                    <h4>Your Notes</h4>
                    <p>{selectedRequest.ownerNotes}</p>
                  </>
                )}
              </div>
            )}

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              {selectedRequest.status === 'Pending' && (
                <>
                  <button
                    onClick={() => {
                      handleAdoptionAction(selectedRequest._id, 'Approved');
                      setShowDetails(false);
                    }}
                    style={{
                      background: '#28a745',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    Approve Application
                  </button>
                  <button
                    onClick={() => {
                      handleAdoptionAction(selectedRequest._id, 'Rejected');
                      setShowDetails(false);
                    }}
                    style={{
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    Reject Application
                  </button>
                </>
              )}
              <button
                onClick={() => setShowDetails(false)}
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdoptionRequestsManager;
