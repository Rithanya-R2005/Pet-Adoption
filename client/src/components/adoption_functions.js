// Add these functions to your PetOwnerDashboard.js file before the useEffect

const fetchAdoptionRequests = async () => {
  try {
    console.log('Fetching adoption requests...');
    const response = await fetch('http://localhost:5000/api/adoptions/owner-requests', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Adoption requests data:', data);
      setAdoptionRequests(data.data || []);
      
      // Update pending requests count in statistics
      const pendingCount = (data.data || []).filter(req => req.status === 'Pending').length;
      setStatistics(prev => ({ ...prev, pendingRequests: pendingCount }));
    } else {
      console.error('Failed to fetch adoption requests');
    }
  } catch (err) {
    console.error('Error fetching adoption requests:', err);
  }
};

const handleAdoptionAction = async (adoptionId, action, ownerNotes = '') => {
  try {
    console.log(`${action} adoption request:`, adoptionId);
    const response = await fetch(`http://localhost:5000/api/adoptions/${adoptionId}/status`, {
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
      
      // Refresh both adoption requests and pets data
      await Promise.all([fetchAdoptionRequests(), fetchPets()]);
    } else {
      const errorData = await response.json();
      toast.error(errorData.message || `Failed to ${action.toLowerCase()} adoption request`);
    }
  } catch (err) {
    console.error(`Error ${action.toLowerCase()} adoption request:`, err);
    toast.error(`Failed to ${action.toLowerCase()} adoption request`);
  }
};
