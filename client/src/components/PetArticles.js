import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PetImage from './PetImage';
import './PetArticles.css';

const PetArticles = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const articles = [
    {
      id: 1,
      title: "How to Prepare Your Home for a New Pet",
      category: "adoption",
      excerpt: "Essential tips for creating a safe and welcoming environment for your new furry friend. Learn about pet-proofing, essential supplies, and creating a comfortable space.",
      image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80",
      readTime: "5 min read",
      date: "2024-01-15",
      author: "Dr. Sarah Johnson",
      tags: ["adoption", "preparation", "home", "safety"],
      views: 1247,
      likes: 89
    },
    {
      id: 2,
      title: "Understanding Pet Nutrition: A Complete Guide",
      category: "care",
      excerpt: "Learn about proper nutrition for different types of pets and how to choose the right food. Discover the importance of balanced diets and feeding schedules.",
      image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80",
      readTime: "8 min read",
      date: "2024-01-12",
      author: "Dr. Michael Chen",
      tags: ["nutrition", "health", "care", "diet"],
      views: 2156,
      likes: 156
    },
    {
      id: 3,
      title: "Training Tips for First-Time Pet Owners",
      category: "training",
      excerpt: "Basic training techniques that will help you build a strong bond with your pet. From basic commands to behavioral training, we cover it all.",
      image: "https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=800&auto=format&fit=crop&q=80",
      readTime: "6 min read",
      date: "2024-01-10",
      author: "Trainer Lisa Rodriguez",
      tags: ["training", "behavior", "bonding", "commands"],
      views: 1893,
      likes: 134
    },
    {
      id: 4,
      title: "The Benefits of Pet Adoption vs. Buying",
      category: "adoption",
      excerpt: "Why adopting a pet from a shelter is often the best choice for both you and the animal. Discover the emotional and practical benefits of adoption.",
      image: "https://images.unsplash.com/photo-1547407139-3c921a66005c?w=800&auto=format&fit=crop&q=80",
      readTime: "4 min read",
      date: "2024-01-08",
      author: "Shelter Director Tom Wilson",
      tags: ["adoption", "shelter", "benefits", "rescue"],
      views: 3421,
      likes: 267
    },
    {
      id: 5,
      title: "Pet Health: Common Issues and Prevention",
      category: "health",
      excerpt: "Learn about common health issues in pets and how to prevent them through proper care. Early detection and prevention strategies for pet owners.",
      image: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=800&auto=format&fit=crop&q=80",
      readTime: "7 min read",
      date: "2024-01-05",
      author: "Dr. Emily Davis",
      tags: ["health", "prevention", "care", "veterinary"],
      views: 2765,
      likes: 198
    },
    {
      id: 6,
      title: "Creating a Pet-Friendly Garden",
      category: "lifestyle",
      excerpt: "Transform your outdoor space into a safe and enjoyable environment for your pets. Learn about pet-safe plants and garden design tips.",
      image: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800&auto=format&fit=crop&q=80",
      readTime: "5 min read",
      date: "2024-01-03",
      author: "Garden Expert Maria Garcia",
      tags: ["lifestyle", "garden", "outdoor", "plants"],
      views: 1456,
      likes: 112
    }
  ];

  const categories = [
    { id: 'all', name: 'All Articles', count: articles.length },
    { id: 'adoption', name: 'Adoption', count: articles.filter(a => a.category === 'adoption').length },
    { id: 'care', name: 'Pet Care', count: articles.filter(a => a.category === 'care').length },
    { id: 'training', name: 'Training', count: articles.filter(a => a.category === 'training').length },
    { id: 'health', name: 'Health', count: articles.filter(a => a.category === 'health').length },
    { id: 'lifestyle', name: 'Lifestyle', count: articles.filter(a => a.category === 'lifestyle').length }
  ];

  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div className="pet-articles-container">


      <div className="articles-wrapper">
        <div className="articles-header">
          <h1>Pet Care Articles</h1>
          <p>Expert advice and tips for pet owners and potential adopters. Stay informed with the latest pet care knowledge.</p>
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Featured Article */}
        <div className="featured-article">
          <div className="featured-content">
            <h2>Featured: How to Prepare Your Home for a New Pet</h2>
            <p>Bringing a new pet into your home is an exciting experience, but it requires careful preparation to ensure a smooth transition for both you and your new companion. This comprehensive guide covers everything from pet-proofing your space to creating a welcoming environment.</p>
            <div className="article-meta">
              <span className="author">By Dr. Sarah Johnson</span>
              <span className="read-time">5 min read</span>
              <span className="date">January 15, 2024</span>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', fontSize: '0.9rem', color: '#95a5a6' }}>
              <span>👁️ {formatNumber(1247)} views</span>
              <span>❤️ {formatNumber(89)} likes</span>
            </div>
            <Link to="/article/1" className="read-more-btn">Read Full Article</Link>
          </div>
          <div className="featured-image">
            <PetImage 
              src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80" 
              alt="Golden Retriever" 
              className="featured-pet-image"
            />
          </div>
        </div>

        {/* Articles Grid */}
        <div className="articles-grid">
          {filteredArticles.slice(1).map(article => (
            <article key={article.id} className="article-card">
              <div className="article-image">
                <PetImage 
                  src={article.image} 
                  alt={article.title}
                  className="article-pet-image"
                />
              </div>
              <div className="article-content">
                <div className="article-category">{article.category}</div>
                <h3 className="article-title">{article.title}</h3>
                <p className="article-excerpt">{article.excerpt}</p>
                <div className="article-meta">
                  <span className="author">By {article.author}</span>
                  <span className="read-time">{article.readTime}</span>
                  <span className="date">{new Date(article.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.85rem', color: '#95a5a6' }}>
                  <span>👁️ {formatNumber(article.views)}</span>
                  <span>❤️ {formatNumber(article.likes)}</span>
                </div>
                <div className="article-tags">
                  {article.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
                <Link to={`/article/${article.id}`} className="read-more-link">
                  Read More
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="newsletter-signup">
          <div className="newsletter-content">
            <h3>Stay Updated with Pet Care Tips</h3>
            <p>Get the latest articles and adoption stories delivered to your inbox. Join thousands of pet lovers who trust our expert advice.</p>
            <div className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email address"
                className="newsletter-input"
              />
              <button className="newsletter-btn">Subscribe</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetArticles;
