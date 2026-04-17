import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Submit form to backend
    console.log('Contact form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
  };

  const faqs = [
    {
      question: 'How do I adopt a pet?',
      answer: 'Browse our available pets, find one you like, and fill out an adoption application. We will review your application and contact you within 48 hours.'
    },
    {
      question: 'What is the adoption fee?',
      answer: 'Adoption fees vary by pet and typically range from $50-$300. This includes vaccinations, spaying/neutering, and microchipping.'
    },
    {
      question: 'Can I return a pet if it doesn\'t work out?',
      answer: 'Yes, we have a 30-day return policy. We want to ensure both you and the pet are happy with the adoption.'
    },
    {
      question: 'Do you ship pets?',
      answer: 'No, we do not ship pets. You must be able to pick up your adopted pet in person from our shelter.'
    },
    {
      question: 'What if I have other pets at home?',
      answer: 'We can help you find a pet that will get along with your existing pets. We also offer meet-and-greet sessions to ensure compatibility.'
    }
  ];

  return (
    <div>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Contact Us</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          {/* Contact Form */}
          <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid #667eea', paddingBottom: '0.5rem' }}>Send us a Message</h3>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd', width: '100%' }}
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd', width: '100%' }}
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd', width: '100%' }}
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd', width: '100%', resize: 'vertical' }}
                />
              </div>
              
              <button type="submit" className="btn" style={{ width: '100%' }}>
                Send Message
              </button>
            </form>
          </div>

        </div>

        {/* FAQ Section */}
        <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid #667eea', paddingBottom: '0.5rem' }}>Frequently Asked Questions</h3>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            {faqs.map((faq, index) => (
              <div key={index} style={{ 
                border: '1px solid #eee', 
                borderRadius: '10px', 
                padding: '1rem',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
              }}>
                <h4 style={{ marginBottom: '0.5rem', color: '#667eea' }}>{faq.question}</h4>
                <p style={{ color: '#666', lineHeight: '1.6' }}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Support */}
        <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', marginTop: '2rem', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '1rem' }}>Need Immediate Help?</h3>
          <p style={{ marginBottom: '1rem', color: '#666' }}>
            Our support team is available to chat with you in real-time.
          </p>
          <button className="btn" style={{ background: '#28a745' }}>
            💬 Start Live Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;