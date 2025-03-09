import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Dashboard from './components/Dashboard';
import AuctionItem from './components/AuctionItem';
import PostAuction from './components/PostAuction';
import Landing from './components/Landing';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="app">
        <header>
          <div className="header-content">
            <h1>
              <i className="fas fa-gavel"></i> Auction App
            </h1>
            <nav>
              <Link to="/" className="nav-link">
                <i className="fas fa-home"></i> Home
              </Link>
              {!isAuthenticated ? (
                <>
                  <Link to="/signup" className="nav-link">
                    <i className="fas fa-user-plus"></i> Signup
                  </Link>
                  <Link to="/signin" className="nav-link">
                    <i className="fas fa-sign-in-alt"></i> Signin
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className="nav-link">
                    <i className="fas fa-tachometer-alt"></i> Dashboard
                  </Link>
                  <Link to="/post-auction" className="nav-link">
                    <i className="fas fa-plus-circle"></i> Post Auction
                  </Link>
                  <button onClick={handleLogout} className="nav-link logout-button">
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </button>
                </>
              )}
            </nav>
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/auction/:id" element={<AuctionItem />} />
            <Route path="/post-auction" element={<PostAuction />} />
          </Routes>
        </main>

        <footer>
          <div className="footer-content">
            <p>&copy; 2024 Auction App. All rights reserved.</p>
            <p>The best place to buy and sell items through auctions!</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
