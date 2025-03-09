import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Card = styled.div`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Details = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 10px;
`;

const Description = styled.div`
  margin-bottom: 2rem;
`;

const BidSection = styled.div`
  border-top: 1px solid #dee2e6;
  padding-top: 2rem;
`;

function AuctionItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [bid, setBid] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/signin');
      return;
    }

    const fetchItem = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/auctions/${id}`);
        setItem(res.data);
      } catch (error) {
        setError('Error fetching auction item. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [id, navigate]);

  useEffect(() => {
    if (!item || !item.endTime) return;

    const updateTimeLeft = () => {
      const now = new Date().getTime();
      const closing = new Date(item.endTime).getTime();
      const difference = closing - now;

      if (difference <= 0) {
        setTimeLeft('Auction Closed');
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimeLeft();
    const timer = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [item]);

  const handleBid = async () => {
    if (!bid || isNaN(bid) || parseFloat(bid) <= 0) {
      setMessage('Please enter a valid bid amount');
      return;
    }

    if (parseFloat(bid) <= item.currentBid) {
      setMessage('Bid must be higher than the current bid');
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/signin');
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:5001/auctions/${id}/bid`,
        { amount: parseFloat(bid) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setItem(res.data);
      setMessage('Bid placed successfully!');
      setBid('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error placing bid. Please try again.');
    }
  };

  if (isLoading) return <Container><p>Loading...</p></Container>;
  if (error) return <Container><p>{error}</p></Container>;
  if (!item) return <Container><p>Auction item not found.</p></Container>;

  return (
    <Container>
      <Card>
        <Header>
          <h2>{item.itemName}</h2>
          <span>{item.isClosed ? 'Closed' : 'Active'}</span>
        </Header>
        <Details>
          <p><strong>Current Bid:</strong> ${item.currentBid}</p>
          <p><strong>Highest Bidder:</strong> {item.highestBidder?.username || 'No bids yet'}</p>
          <p><strong>Time Left:</strong> {timeLeft}</p>
        </Details>
        <Description>
          <h3>Description</h3>
          <p>{item.description}</p>
        </Description>
        {!item.isClosed && (
          <BidSection>
            <h3>Place Your Bid</h3>
            <input
              type="number"
              value={bid}
              onChange={(e) => setBid(e.target.value)}
              min={item.currentBid + 0.01}
              step="0.01"
            />
            <button onClick={handleBid}>Place Bid</button>
            {message && <p>{message}</p>}
          </BidSection>
        )}
      </Card>
    </Container>
  );
}

export default AuctionItem;
