import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="header">
      <nav className="nav">
        <Link to="/" className="logo">🐾 PetAdopt</Link>
        <ul className="nav-links">
          {/* Only show Browse Pets for non-authenticated users and regular users, not for pet owners */}
          {(!isAuthenticated() || (user?.role !== 'petowner' && user?.role !== 'admin')) && (
            <li><Link to="/pets" className={location.pathname === '/pets' ? 'active' : ''}>Browse Pets</Link></li>
          )}
          {/* Hide Articles, Events, and Contact for Pet Owners and Admins */}
          {user?.role !== 'petowner' && user?.role !== 'admin' && (
            <>
              <li><Link to="/articles" className={location.pathname === '/articles' ? 'active' : ''}>Articles</Link></li>
              <li><Link to="/events" className={location.pathname === '/events' ? 'active' : ''}>Events</Link></li>
              <li><Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact</Link></li>
            </>
          )}
          
          {isAuthenticated() ? (
            <>
              {user?.role === 'admin' ? (
                <li><Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>Admin Dashboard</Link></li>
              ) : user?.role === 'petowner' ? (
                <li><Link to="/petowner" className={location.pathname === '/petowner' ? 'active' : ''}>Dashboard</Link></li>
              ) : (
                <li><Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>My Dashboard</Link></li>
              )}
              <li className="user-menu">
                <span className="user-name">Welcome, {user?.username || 'User'}</span>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </li>
            </>
          ) : (
            <li><Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>Login</Link></li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navigation;
