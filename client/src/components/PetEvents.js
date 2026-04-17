import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PetImage from './PetImage';
import './PetEvents.css';

const PetEvents = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrationForm, setRegistrationForm] = useState({
    name: '',
    email: '',
    phone: '',
    attendees: 1
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Format price in Indian Rupees
  const formatPrice = (price) => {
    if (price === 'Free') return 'Free';
    // Convert dollar to INR (assuming 1 USD = 83 INR)
    const usdAmount = parseFloat(price.replace(/[^0-9.-]+/g, ''));
    const inrAmount = Math.round(usdAmount * 83);
    return `₹${inrAmount.toLocaleString('en-IN')}`;
  };

  // Function to check if event is within the next month
  const isEventWithinMonth = (eventDate) => {
    const today = new Date();
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(today.getMonth() + 1);
    
    const eventDateObj = new Date(eventDate);
    return eventDateObj >= today && eventDateObj <= oneMonthFromNow;
  };

  // Function to generate upcoming dates
  const getUpcomingDate = (daysFromNow) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split('T')[0];
  };

  const handleViewDetails = (eventId) => {
    const event = events.find(e => e.id === eventId);
    setSelectedEvent(event);
    setShowDetailsModal(true);
  };

  const handleRegister = (eventId) => {
    const event = events.find(e => e.id === eventId);
    setSelectedEvent(event);
    setShowRegisterModal(true);
  };

  const handleCloseModals = () => {
    setShowDetailsModal(false);
    setShowRegisterModal(false);
    // Reset form when closing
    setRegistrationForm({
      name: '',
      email: '',
      phone: '',
      attendees: 1
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setRegistrationForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegistrationSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!registrationForm.name || !registrationForm.email || !registrationForm.phone) {
      alert('Please fill in all required fields.');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registrationForm.email)) {
      alert('Please enter a valid email address.');
      return;
    }
    
    // Success message
    alert(`Registration successful for ${selectedEvent.title}! 
    
Registration Details:
- Name: ${registrationForm.name}
- Email: ${registrationForm.email}
- Phone: ${registrationForm.phone}
- Attendees: ${registrationForm.attendees}

You will receive a confirmation email shortly.`);
    
    handleCloseModals();
  };

  const events = [
    {
      id: 1,
      title: "Pet Adoption Day",
      type: "adoption",
      date: getUpcomingDate(5),
      time: "10:00 AM - 4:00 PM",
      location: "Central Park",
      description: "Join us for a special adoption event featuring dogs, cats, and other pets looking for their forever homes.",
      image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop",
      organizer: "PetAdopt Foundation",
      capacity: 50,
      registered: 35,
      price: "Free",
      tags: ["adoption", "dogs", "cats"]
    },
    {
      id: 2,
      title: "Pet Training Workshop",
      type: "workshop",
      date: getUpcomingDate(10),
      time: "2:00 PM - 5:00 PM",
      location: "Community Center",
      description: "Learn essential training techniques from professional dog trainers. Bring your pet for hands-on practice.",
      image: "https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=400&h=300&fit=crop",
      organizer: "Professional Pet Trainers",
      capacity: 20,
      registered: 18,
      price: "₹2,075",
      tags: ["training", "workshop", "dogs"]
    },
    {
      id: 3,
      title: "Pet Health Seminar",
      type: "seminar",
      date: getUpcomingDate(15),
      time: "6:00 PM - 8:00 PM",
      location: "Veterinary Clinic",
      description: "Expert veterinarians will discuss common health issues, nutrition, and preventive care for pets.",
      image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop",
      organizer: "City Veterinary Association",
      capacity: 40,
      registered: 25,
      price: "₹1,245",
      tags: ["health", "seminar", "veterinary"]
    },
    {
      id: 4,
      title: "Pet Photography Session",
      type: "activity",
      date: getUpcomingDate(20),
      time: "11:00 AM - 3:00 PM",
      location: "Botanical Gardens",
      description: "Professional pet photographers will capture beautiful moments with your furry friends.",
      image: "https://images.unsplash.com/photo-1547407139-3c921a66005c?w=400&h=300&fit=crop",
      organizer: "Pet Photography Studio",
      capacity: 30,
      registered: 22,
      price: "₹2,490",
      tags: ["photography", "activity", "fun"]
    },
    {
      id: 5,
      title: "Pet Grooming Workshop",
      type: "workshop",
      date: getUpcomingDate(25),
      time: "1:00 PM - 4:00 PM",
      location: "Pet Grooming Salon",
      description: "Learn proper grooming techniques and tips for maintaining your pet's coat and hygiene.",
      image: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=400&h=300&fit=crop",
      organizer: "Grooming Experts",
      capacity: 15,
      registered: 12,
      price: "₹1,660",
      tags: ["grooming", "workshop", "care"]
    },
    {
      id: 6,
      title: "Pet Social Meetup",
      type: "social",
      date: getUpcomingDate(28),
      time: "3:00 PM - 6:00 PM",
      location: "Dog Park",
      description: "A fun social gathering for pets and their owners. Great opportunity for socialization.",
      image: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400&h=300&fit=crop",
      organizer: "Pet Social Club",
      capacity: 60,
      registered: 45,
      price: "Free",
      tags: ["social", "meetup", "fun"]
    }
  ];

  const filters = [
    { id: 'all', name: 'All Events' },
    { id: 'adoption', name: 'Adoption Events' },
    { id: 'workshop', name: 'Workshops' },
    { id: 'seminar', name: 'Seminars' },
    { id: 'activity', name: 'Activities' },
    { id: 'social', name: 'Social Events' }
  ];

  // Filter events by type and within next month
  const filteredEvents = events
    .filter(event => isEventWithinMonth(event.date))
    .filter(event => selectedFilter === 'all' || event.type === selectedFilter);


  const getRegistrationStatus = (registered, capacity) => {
    const percentage = (registered / capacity) * 100;
    if (percentage >= 90) return { status: 'Almost Full', color: '#ff6b6b' };
    if (percentage >= 70) return { status: 'Limited Spots', color: '#ffa726' };
    return { status: 'Open', color: '#66bb6a' };
  };

  return (
    <div className="pet-events-container">
      {/* Details Modal */}
      {showDetailsModal && selectedEvent && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModals}>×</button>
            <h2>{selectedEvent.title}</h2>
            <img 
              src={selectedEvent.image} 
              alt={selectedEvent.title} 
              style={{ width: '100%', borderRadius: '10px', marginBottom: '1rem' }} 
            />
            <p><strong>Date:</strong> {formatDate(selectedEvent.date)}</p>
            <p><strong>Time:</strong> {selectedEvent.time}</p>
            <p><strong>Location:</strong> {selectedEvent.location}</p>
            <p><strong>Organizer:</strong> {selectedEvent.organizer}</p>
            <p><strong>Price:</strong> {formatPrice(selectedEvent.price)}</p>
            <p><strong>Capacity:</strong> {selectedEvent.registered}/{selectedEvent.capacity}</p>
            <p>{selectedEvent.description}</p>
            <div className="event-tags" style={{ marginTop: '1rem' }}>
              {selectedEvent.tags.map(tag => (
                <span key={tag} className="event-tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {showRegisterModal && selectedEvent && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModals}>×</button>
            <h2>Register for {selectedEvent.title}</h2>
            <p>Please fill out the form below to register for this event.</p>
            
            <form onSubmit={handleRegistrationSubmit} style={{ marginTop: '1rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Name *</label>
                <input 
                  type="text" 
                  name="name"
                  value={registrationForm.name}
                  onChange={handleFormChange}
                  placeholder="Enter your full name"
                  required 
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email *</label>
                <input 
                  type="email" 
                  name="email"
                  value={registrationForm.email}
                  onChange={handleFormChange}
                  placeholder="Enter your email address"
                  required 
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Phone *</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={registrationForm.phone}
                  onChange={handleFormChange}
                  placeholder="Enter your phone number"
                  required 
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Number of Attendees</label>
                <input 
                  type="number" 
                  name="attendees"
                  min="1" 
                  max="5" 
                  value={registrationForm.attendees}
                  onChange={handleFormChange}
                  required 
                />
              </div>
              
              <button 
                type="submit" 
                className="btn"
              >
                Complete Registration
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="events-wrapper">
        <div className="events-header">
          <h1>Pet Events & Activities</h1>
          <p>Join our community events, workshops, and adoption days</p>
          <div style={{ 
            background: '#e3f2fd', 
            padding: '1rem', 
            borderRadius: '8px', 
            marginTop: '1rem',
            border: '1px solid #2196f3'
          }}>
            <p style={{ margin: 0, color: '#1565c0', fontWeight: '500' }}>
              📅 Showing events scheduled within the next month from today ({new Date().toLocaleDateString()})
            </p>
          </div>
        </div>

        {/* Event Filters */}
        <div className="event-filters">
          {filters.map(filter => (
            <button
              key={filter.id}
              className={`filter-btn ${selectedFilter === filter.id ? 'active' : ''}`}
              onClick={() => setSelectedFilter(filter.id)}
            >
              {filter.name}
            </button>
          ))}
        </div>

        {/* Featured Event */}
        <div className="featured-event">
          <div className="featured-event-content">
            <div className="event-badge">Featured Event</div>
            <h2>Pet Adoption Day - Central Park</h2>
            <p className="event-description">
              Join us for our biggest adoption event of the year! Meet dozens of adorable pets looking for their forever homes. 
              Professional staff will be on hand to help you find the perfect match.
            </p>
            <div className="event-details">
              <div className="detail-item">
                <span className="detail-label">📅 Date:</span>
                <span className="detail-value">{formatDate(getUpcomingDate(5))}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">⏰ Time:</span>
                <span className="detail-value">10:00 AM - 4:00 PM</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">📍 Location:</span>
                <span className="detail-value">Central Park</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">💰 Price:</span>
                <span className="detail-value">Free</span>
              </div>
            </div>
            <div className="event-actions">
              <button 
                className="register-btn"
                onClick={() => handleRegister(1)}
              >
                Register Now
              </button>
              <button className="share-btn">Share Event</button>
            </div>
          </div>
          <div className="featured-event-image">
            <PetImage 
              src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop" 
              alt="Adoption Event" 
              className="featured-event-pet-image"
            />
          </div>
        </div>

        {/* Events Grid */}
        <div className="events-grid">
          {filteredEvents.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              background: '#f8f9fa',
              borderRadius: '15px',
              border: '2px dashed #dee2e6',
              gridColumn: '1 / -1'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
              <h3 style={{ color: '#6c757d', marginBottom: '1rem' }}>No Events Within Next Month</h3>
              <p style={{ color: '#6c757d' }}>
                There are currently no {selectedFilter === 'all' ? '' : selectedFilter + ' '}events scheduled within the next month.
                <br />Check back soon for upcoming events!
              </p>
            </div>
          ) : (
            filteredEvents.slice(1).map(event => {
            const registrationStatus = getRegistrationStatus(event.registered, event.capacity);
            
            return (
              <div key={event.id} className="event-card">
                <div className="event-image">
                  <PetImage 
                    src={event.image} 
                    alt={event.title}
                    className="event-pet-image"
                  />
                  </div>
                  <div className="event-content">
                    <div className="event-type">{event.type}</div>
                    <h3 className="event-title">{event.title}</h3>
                    <p className="event-description">{event.description}</p>
                    
                    <div className="event-info">
                      <div className="info-item">
                        <span className="info-label">📅</span>
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">⏰</span>
                        <span>{event.time}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">📍</span>
                        <span>{event.location}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">👥</span>
                        <span>{event.registered}/{event.capacity}</span>
                      </div>
                    </div>

                    <div className="event-status">
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: registrationStatus.color }}
                      >
                        {registrationStatus.status}
                      </span>
                    </div>

                    <div className="event-tags">
                      {event.tags.map(tag => (
                        <span key={tag} className="event-tag">{tag}</span>
                      ))}
                    </div>

                    <div className="event-actions">
                      <button 
                        className="event-register-btn" 
                        onClick={() => handleRegister(event.id)}
                      >
                        Register
                      </button>
                      <button 
                        className="event-details-btn"
                        onClick={() => handleViewDetails(event.id)}
                      >
                        Details
                      </button>
                    </div>
                  </div>
              </div>
            );
          })
          )}
        </div>

        {/* Event Calendar */}
        <div className="event-calendar">
          <h3>Upcoming Events Calendar (Next Month)</h3>
          <div className="calendar-grid">
            {events.filter(event => isEventWithinMonth(event.date)).slice(0, 6).map(event => (
              <div key={event.id} className="calendar-item">
                <div className="calendar-date">
                  <span className="date-day">{new Date(event.date).getDate()}</span>
                  <span className="date-month">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                </div>
                <div className="calendar-content">
                  <h4>{event.title}</h4>
                  <p>{event.time}</p>
                  <span className="calendar-type">{event.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetEvents;
