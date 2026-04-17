import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { petImages } from '../images';
import LiveChat from './LiveChat';
import './HomePage.css';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [showChat, setShowChat] = useState(false);

  const featuredPets = [
    {
      id: 1,
      name: 'Luna',
      breed: 'Golden Retriever',
      age: '2 years',
      location: 'Chennai',
      image:
        'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=800&q=80',
      description:
        'Gentle, playful, and amazing with families. Luna loves long walks and belly rubs.'
    },
    {
      id: 2,
      name: 'Milo',
      breed: 'Tabby Cat',
      age: '1 year',
      location: 'Bangalore',
      image:
        'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80',
      description:
        'Curious and cuddly, Milo enjoys sunny window naps and quiet evenings on the couch.'
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Search:', { searchQuery, location, breed, age });
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero" aria-label="Welcome hero">
        <div className="hero-content">
          <h1>Find Your New Best Friend</h1>
          <p>Give a loving home to pets in need. Browse thousands of adoptable pets and find your perfect companion.</p>
          <div className="hero-actions">
            <Link to="/pets" className="btn">Browse Pets</Link>
            <Link to="/contact" className="btn btn-secondary">Learn More</Link>
          </div>
        </div>
      </section>

      {/* Featured Pets Preview */}
      <section className="featured-section">
        <h2 className="section-title">Featured Friends Waiting for You</h2>
        <div className="pets-grid">
          {featuredPets.map((pet) => (
            <div key={pet.id} className="pet-card">
              <img src={pet.image} alt={pet.name} className="pet-image" />
              <div className="pet-info">
                <h3 className="pet-name">{pet.name}</h3>
                <p className="pet-details">
                  {pet.age}  • {pet.breed} • {pet.location}
                </p>
                <p className="pet-description">{pet.description}</p>
                <Link to="/pets" className="btn" style={{ padding: '0.75rem 1.5rem' }}>
                  View More Pets
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="featured-actions" style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link to="/pets" className="btn" style={{ padding: '0.85rem 2rem' }}>
            Visit Pets
          </Link>
        </div>
      </section>

      <section style={{ padding: '3rem 0', background: '#f9fafb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Why Adopt with PetAdopt?</h2>
          <p style={{ maxWidth: '700px', margin: '0 auto', color: '#555' }}>
            We work with trusted shelters and volunteers to connect loving families with pets in need of a home.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.06)' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>Verified Pets</h3>
              <p style={{ margin: 0, color: '#666' }}>All pets are health-checked and vaccinated by licensed vets.</p>
            </div>
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.06)' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>Guided Adoption</h3>
              <p style={{ margin: 0, color: '#666' }}>Our team guides you through every step of the adoption process.</p>
            </div>
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.06)' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>Post-Adoption Support</h3>
              <p style={{ margin: 0, color: '#666' }}>Get tips and support to help your new friend settle in.</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '3rem 0', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', color: 'white' }}>
          <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '0.5rem' }}>Join Our Growing Community</h2>
          <p style={{ maxWidth: '650px', margin: '0 auto', textAlign: 'center', opacity: 0.9 }}>
            Every adoption creates a new story of friendship. See how PetAdopt is making a difference for pets and families.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginTop: '2.5rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.12)', padding: '1.5rem', borderRadius: '14px', backdropFilter: 'blur(6px)', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>500+</h3>
              <p style={{ margin: 0, opacity: 0.95 }}>pets connected with loving homes</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.12)', padding: '1.5rem', borderRadius: '14px', backdropFilter: 'blur(6px)', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>150+</h3>
              <p style={{ margin: 0, opacity: 0.95 }}>partner shelters and rescue groups</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.12)', padding: '1.5rem', borderRadius: '14px', backdropFilter: 'blur(6px)' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>"Best decision we ever made"</h3>
              <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>
                "Our adopted dog Luna has brought so much joy into our home. PetAdopt made the entire process simple and
                stress-free. We can&apos;t imagine life without her now!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <h3>🐾 PetAdopt</h3>
          <p>Connecting loving homes with pets in need since 2024</p>
          <p>&copy; 2024 PetAdopt. All rights reserved.</p>
        </div>
      </footer>

      {/* Live Chat Widget */}
      <div className="chat-widget">
        <button 
          className="chat-toggle"
          onClick={() => setShowChat(!showChat)}
        >
          💬 Live Chat
        </button>
        {showChat && <LiveChat onClose={() => setShowChat(false)} />}
      </div>
    </div>
  );
};

export default HomePage;