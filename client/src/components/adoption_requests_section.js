// Replace the current Adoption Requests section with this code:

{/* Adoption Requests */}
<div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
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
                {request.firstName && request.lastName && (
                  <div style={{ fontSize: '0.8rem', color: '#718096' }}>
                    {request.firstName} {request.lastName}
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
</div>
