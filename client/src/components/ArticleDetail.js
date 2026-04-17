import React from 'react';
import { useParams, Link } from 'react-router-dom';
import PetImage from './PetImage';
import './ArticleDetail.css';

const ArticleDetail = () => {
  const { id } = useParams();

  // Mock article data (in a real app, this would come from an API)
  const articles = {
    1: {
      id: 1,
      title: "How to Prepare Your Home for a New Pet",
      category: "adoption",
      excerpt: "Essential tips for creating a safe and welcoming environment for your new furry friend.",
      image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=400&fit=crop",
      readTime: "5 min read",
      date: "2024-01-15",
      author: "Dr. Sarah Johnson",
      tags: ["adoption", "preparation", "home", "safety"],
      views: 1247,
      likes: 89,
      content: `
        <h2>Introduction</h2>
        <p>Bringing a new pet into your home is an exciting milestone, but it requires careful preparation to ensure a smooth transition for both you and your new companion. Whether you're adopting a puppy, kitten, or adult pet, proper preparation can make all the difference in creating a happy, healthy environment.</p>

        <h2>Pet-Proofing Your Home</h2>
        <p>Before your new pet arrives, it's crucial to make your home safe and secure. Start by getting down to your pet's level and looking for potential hazards:</p>
        <ul>
          <li><strong>Electrical cords:</strong> Secure or hide electrical cords that pets might chew on</li>
          <li><strong>Toxic plants:</strong> Remove or relocate plants that are toxic to pets</li>
          <li><strong>Small objects:</strong> Pick up small items that could be swallowed</li>
          <li><strong>Cleaning supplies:</strong> Store all cleaning products in secure cabinets</li>
          <li><strong>Trash cans:</strong> Use pet-proof trash cans or keep them in secured areas</li>
        </ul>

        <h2>Essential Supplies</h2>
        <p>Having the right supplies on hand will help your pet feel comfortable and secure:</p>
        <h3>For Dogs:</h3>
        <ul>
          <li>Collar, leash, and ID tags</li>
          <li>Food and water bowls</li>
          <li>High-quality dog food</li>
          <li>Comfortable bed or crate</li>
          <li>Toys for mental stimulation</li>
          <li>Grooming supplies</li>
        </ul>

        <h3>For Cats:</h3>
        <ul>
          <li>Litter box and litter</li>
          <li>Food and water bowls</li>
          <li>High-quality cat food</li>
          <li>Scratching post</li>
          <li>Comfortable sleeping area</li>
          <li>Toys for play and exercise</li>
        </ul>

        <h2>Creating a Comfortable Space</h2>
        <p>Designate a specific area in your home where your pet can feel safe and secure. This space should include:</p>
        <ul>
          <li>A comfortable bed or resting area</li>
          <li>Access to food and water</li>
          <li>Toys and enrichment items</li>
          <li>Easy access to the outdoors (for dogs) or litter box (for cats)</li>
        </ul>

        <h2>Establishing Routines</h2>
        <p>Pets thrive on routine, so establish consistent schedules for:</p>
        <ul>
          <li><strong>Feeding times:</strong> Feed your pet at the same times each day</li>
          <li><strong>Potty breaks:</strong> Take dogs out regularly, especially after meals</li>
          <li><strong>Exercise:</strong> Schedule daily playtime and walks</li>
          <li><strong>Sleep:</strong> Create a consistent bedtime routine</li>
        </ul>

        <h2>First Week Checklist</h2>
        <p>Here's what to focus on during your pet's first week at home:</p>
        <ol>
          <li>Schedule a veterinary checkup within the first few days</li>
          <li>Introduce your pet to family members gradually</li>
          <li>Begin basic training and establish house rules</li>
          <li>Monitor eating, drinking, and bathroom habits</li>
          <li>Provide plenty of love and patience</li>
        </ol>

        <h2>Common Challenges and Solutions</h2>
        <h3>Separation Anxiety</h3>
        <p>Many pets experience anxiety when left alone. Help them adjust by:</p>
        <ul>
          <li>Leaving for short periods and gradually increasing time away</li>
          <li>Providing engaging toys and treats</li>
          <li>Creating a comfortable space for them to wait</li>
        </ul>

        <h3>House Training</h3>
        <p>Accidents are normal during the adjustment period. Be patient and:</p>
        <ul>
          <li>Take dogs out frequently, especially after meals</li>
          <li>Show cats where the litter box is located</li>
          <li>Clean accidents thoroughly to remove odors</li>
          <li>Use positive reinforcement for good behavior</li>
        </ul>

        <h2>Conclusion</h2>
        <p>Preparing your home for a new pet requires time and effort, but the rewards are immeasurable. With proper preparation, patience, and love, you'll create a wonderful home for your new companion. Remember that every pet is unique, so be flexible and adjust your approach based on your pet's individual needs and personality.</p>

        <p>The key to success is consistency, patience, and lots of love. Your new pet will appreciate the effort you put into making their home comfortable and safe.</p>
      `
    },
    2: {
      id: 2,
      title: "Understanding Pet Nutrition: A Complete Guide",
      category: "care",
      excerpt: "Learn about proper nutrition for different types of pets and how to choose the right food.",
      image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&h=400&fit=crop",
      readTime: "8 min read",
      date: "2024-01-12",
      author: "Dr. Michael Chen",
      tags: ["nutrition", "health", "care", "diet"],
      views: 2156,
      likes: 156,
      content: `
        <h2>Introduction</h2>
        <p>Proper nutrition is the foundation of your pet's health and well-being. Understanding what your pet needs and how to provide it can significantly impact their quality of life, energy levels, and longevity.</p>

        <h2>Basic Nutritional Requirements</h2>
        <p>All pets need a balanced diet containing:</p>
        <ul>
          <li><strong>Proteins:</strong> Essential for muscle development and repair</li>
          <li><strong>Fats:</strong> Provide energy and support healthy skin and coat</li>
          <li><strong>Carbohydrates:</strong> Supply energy and fiber</li>
          <li><strong>Vitamins:</strong> Support various bodily functions</li>
          <li><strong>Minerals:</strong> Important for bone health and other processes</li>
          <li><strong>Water:</strong> Critical for all bodily functions</li>
        </ul>

        <h2>Dog Nutrition</h2>
        <p>Dogs are omnivores and can thrive on a variety of diets. Key considerations include:</p>
        <h3>Life Stage Nutrition</h3>
        <ul>
          <li><strong>Puppies:</strong> Need higher protein and fat content for growth</li>
          <li><strong>Adults:</strong> Require balanced nutrition for maintenance</li>
          <li><strong>Seniors:</strong> May need lower calorie, higher fiber diets</li>
        </ul>

        <h3>Breed-Specific Needs</h3>
        <p>Different breeds may have specific nutritional requirements:</p>
        <ul>
          <li>Large breeds may need joint support supplements</li>
          <li>Small breeds often need smaller, more frequent meals</li>
          <li>Working dogs require higher calorie diets</li>
        </ul>

        <h2>Cat Nutrition</h2>
        <p>Cats are obligate carnivores and have unique nutritional needs:</p>
        <h3>Essential Nutrients for Cats</h3>
        <ul>
          <li><strong>Taurine:</strong> Essential amino acid for heart and eye health</li>
          <li><strong>Arachidonic acid:</strong> Important fatty acid</li>
          <li><strong>Vitamin A:</strong> Must be obtained from animal sources</li>
          <li><strong>High protein:</strong> Cats need more protein than dogs</li>
        </ul>

        <h2>Reading Pet Food Labels</h2>
        <p>Understanding pet food labels helps you make informed choices:</p>
        <ul>
          <li><strong>Ingredients list:</strong> Ingredients are listed by weight</li>
          <li><strong>Guaranteed analysis:</strong> Shows minimum protein and fat content</li>
          <li><strong>AAFCO statement:</strong> Indicates if the food meets nutritional standards</li>
          <li><strong>Life stage:</strong> Shows if the food is appropriate for your pet's age</li>
        </ul>

        <h2>Wet vs. Dry Food</h2>
        <p>Both wet and dry food have their advantages:</p>
        <h3>Wet Food Benefits</h3>
        <ul>
          <li>Higher moisture content helps with hydration</li>
          <li>Often more palatable for picky eaters</li>
          <li>Easier to eat for pets with dental issues</li>
        </ul>

        <h3>Dry Food Benefits</h3>
        <ul>
          <li>More convenient and cost-effective</li>
          <li>Helps maintain dental health</li>
          <li>Longer shelf life</li>
        </ul>

        <h2>Special Dietary Considerations</h2>
        <h3>Weight Management</h3>
        <p>Obesity is common in pets and can lead to health problems:</p>
        <ul>
          <li>Measure food portions carefully</li>
          <li>Limit treats and table scraps</li>
          <li>Increase exercise and activity</li>
          <li>Consider weight management formulas</li>
        </ul>

        <h3>Food Allergies and Sensitivities</h3>
        <p>Some pets may have food allergies or sensitivities:</p>
        <ul>
          <li>Common allergens include beef, dairy, and grains</li>
          <li>Hypoallergenic diets may be necessary</li>
          <li>Work with your veterinarian for proper diagnosis</li>
        </ul>

        <h2>Feeding Guidelines</h2>
        <p>General feeding recommendations:</p>
        <ul>
          <li>Follow the feeding guide on the food package</li>
          <li>Adjust portions based on your pet's activity level</li>
          <li>Monitor your pet's weight and body condition</li>
          <li>Provide fresh water at all times</li>
        </ul>

        <h2>Supplements</h2>
        <p>While most pets get adequate nutrition from quality food, some may benefit from supplements:</p>
        <ul>
          <li><strong>Omega-3 fatty acids:</strong> Support skin and coat health</li>
          <li><strong>Glucosamine:</strong> May help with joint health</li>
          <li><strong>Probiotics:</strong> Support digestive health</li>
        </ul>
        <p><strong>Important:</strong> Always consult your veterinarian before adding supplements to your pet's diet.</p>

        <h2>Conclusion</h2>
        <p>Proper nutrition is essential for your pet's health and happiness. By understanding their nutritional needs and making informed choices about their diet, you can help ensure they live a long, healthy life. Remember to consult with your veterinarian for personalized nutrition advice for your specific pet.</p>
      `
    }
  };

  const article = articles[id];

  if (!article) {
    return (
      <div className="article-not-found">
        <h1>Article Not Found</h1>
        <p>The article you're looking for doesn't exist.</p>
        <Link to="/articles" className="back-btn">Back to Articles</Link>
      </div>
    );
  }

  return (
    <div className="article-detail-container">
      <header className="header">
        <nav className="nav">
          <Link to="/" className="logo">🐾 PetAdopt</Link>
          <ul className="nav-links">
            <li><Link to="/pets">Browse Pets</Link></li>
            <li><Link to="/articles">Articles</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/admin">Admin</Link></li>
          </ul>
        </nav>
      </header>

      <div className="article-detail-wrapper">
        <div className="article-header">
          <div className="article-meta-top">
            <span className="category-badge">{article.category}</span>
            <span className="read-time">{article.readTime}</span>
          </div>
          <h1 className="article-title">{article.title}</h1>
          <p className="article-excerpt">{article.excerpt}</p>
          <div className="author-info">
            <span className="author">By {article.author}</span>
            <span className="date">{new Date(article.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
          <div className="article-stats">
            <span>👁️ {article.views} views</span>
            <span>❤️ {article.likes} likes</span>
          </div>
        </div>

        <div className="article-image-container">
          <PetImage 
            src={article.image} 
            alt={article.title}
            className="article-hero-image"
          />
        </div>

        <div className="article-content" dangerouslySetInnerHTML={{ __html: article.content }} />

        <div className="article-footer">
          <div className="article-tags">
            {article.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
          <Link to="/articles" className="back-to-articles">← Back to Articles</Link>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
