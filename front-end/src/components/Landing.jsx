import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const LandingContainer = styled.div`
  padding: 2rem 0;
`;

const HeroSection = styled.div`
  text-align: center;
  padding: 4rem 0;
  background: linear-gradient(135deg, rgba(30, 60, 114, 0.1) 0%, rgba(42, 82, 152, 0.1) 100%);
  border-radius: 15px;
  margin-bottom: 4rem;

  h1 {
    color: #1e3c72;
    font-weight: 600;
  }

  .lead {
    max-width: 600px;
    margin: 0 auto;
    color: #666;
  }
`;

const CTAButtons = styled.div`
  margin-top: 2rem;
`;

const FeaturesSection = styled.div`
  padding: 2rem 0;
`;

const FeatureCard = styled.div`
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 100%;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  i {
    color: #1e3c72;
  }

  h3 {
    margin: 1rem 0;
    color: #1e3c72;
    font-size: 1.5rem;
  }

  p {
    color: #666;
    margin-bottom: 0;
  }
`;

function Landing() {
  const isAuthenticated = localStorage.getItem('authToken') !== null;
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate('/dashboard');
  };

  return (
    <LandingContainer>
      <HeroSection>
        <h1 className="display-4 mb-4">Welcome to Auction App</h1>
        <p className="lead mb-4">
          Discover unique items and participate in exciting auctions from the comfort of your home.
        </p>
        <CTAButtons>
          {isAuthenticated ? (
            <button onClick={handleExploreClick} className="btn btn-primary btn-lg">
              <i className="fas fa-compass me-2"></i>Explore Auctions
            </button>
          ) : (
            <>
              <Link to="/signup" className="btn btn-primary btn-lg me-3">
                <i className="fas fa-user-plus me-2"></i>Get Started
              </Link>
              <Link to="/signin" className="btn btn-outline-primary btn-lg">
                <i className="fas fa-sign-in-alt me-2"></i>Sign In
              </Link>
            </>
          )}
        </CTAButtons>
      </HeroSection>

      <FeaturesSection>
        <div className="row g-4">
          <div className="col-md-4">
            <FeatureCard>
              <i className="fas fa-gavel fa-2x mb-3"></i>
              <h3>Bid on Items</h3>
              <p>Participate in live auctions and bid on your favorite items.</p>
            </FeatureCard>
          </div>
          <div className="col-md-4">
            <FeatureCard>
              <i className="fas fa-store fa-2x mb-3"></i>
              <h3>Sell Items</h3>
              <p>Create your own auctions and sell items to the highest bidder.</p>
            </FeatureCard>
          </div>
          <div className="col-md-4">
            <FeatureCard>
              <i className="fas fa-shield-alt fa-2x mb-3"></i>
              <h3>Secure Trading</h3>
              <p>Safe and secure platform for all your auction needs.</p>
            </FeatureCard>
          </div>
        </div>
      </FeaturesSection>
    </LandingContainer>
  );
}

export default Landing;