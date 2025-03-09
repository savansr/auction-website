import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  width: 100%;
  padding: 0 2rem;
  
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const DashboardActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
  }
`;

const ButtonGroup = styled.div`
  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    width: 100%;
  }
`;

const AuctionGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AuctionCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  transition: transform 0.3s ease;
  height: 100%;

  &:hover {
    transform: translateY(-5px);
  }
`;

const AuctionStatus = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
`;

const AuctionInfo = styled.div`
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const NoItems = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
`;

function Dashboard() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      nav('/signin');
      return;
    }

    const fetchItems = async () => {
      try {
        const res = await axios.get('http://localhost:5001/auctions');
        setItems(res.data);
      } catch (error) {
        setError('Error fetching auctions. Please try again later.');
        console.error('Error fetching auctions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, [nav]);

  const filteredItems = items.filter(item => {
    if (filter === 'active') return !item.isClosed;
    if (filter === 'closed') return item.isClosed;
    return true;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <DashboardContainer>
      <DashboardHeader>
        <h2>
          <i className="fas fa-gavel me-2"></i>
          Auction Dashboard
        </h2>
        <DashboardActions>
          <ButtonGroup className="btn-group me-3">
            <button 
              className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`btn ${filter === 'active' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button 
              className={`btn ${filter === 'closed' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilter('closed')}
            >
              Closed
            </button>
          </ButtonGroup>
          <Link to="/post-auction" className="btn btn-success">
            <i className="fas fa-plus-circle me-2"></i>
            Post New Auction
          </Link>
        </DashboardActions>
      </DashboardHeader>

      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <AuctionGrid>
          {filteredItems.length === 0 ? (
            <NoItems>
              <i className="fas fa-box-open fa-3x mb-3"></i>
              <h3>No auctions found</h3>
              <p className="text-muted">
                {filter !== 'all' 
                  ? `No ${filter} auctions available` 
                  : 'Start by creating your first auction!'}
              </p>
              <Link to="/post-auction" className="btn btn-primary">
                <i className="fas fa-plus-circle me-2"></i>
                Create Auction
              </Link>
            </NoItems>
          ) : (
            filteredItems.map((item) => (
              <AuctionCard key={item._id}>
                <AuctionStatus>
                  {item.isClosed ? (
                    <span className="badge bg-danger">
                      <i className="fas fa-lock me-1"></i>
                      Closed
                    </span>
                  ) : (
                    <span className="badge bg-success">
                      <i className="fas fa-clock me-1"></i>
                      Active
                    </span>
                  )}
                </AuctionStatus>
                <h3>{item.itemName}</h3>
                <AuctionInfo>
                  <div>
                    <i className="fas fa-tag me-2"></i>
                    Current Bid: {formatPrice(item.currentBid)}
                  </div>
                  <div>
                    <i className="fas fa-user me-2"></i>
                    Highest Bidder: {item.highestBidder?.username || 'No bids yet'}
                  </div>
                </AuctionInfo>
                <Link to={`/auction/${item._id}`} className="btn btn-outline-primary w-100">
                  <i className="fas fa-eye me-2"></i>
                  View Details
                </Link>
              </AuctionCard>
            ))
          )}
        </AuctionGrid>
      )}
    </DashboardContainer>
  );
}

export default Dashboard;