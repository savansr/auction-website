import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PostAuction() {
    const [itemName, setItemName] = useState('');
    const [description, setDescription] = useState('');
    const [startingBid, setStartingBid] = useState('');
    const [closingTime, setClosingTime] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/signin');
        }
    }, [navigate]);

    const handlePostAuction = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('You must be signed in to post an auction.');
            navigate('/signin');
            return;
        }
        if (!itemName || !description || !startingBid || !closingTime) {
            setError('Please fill in all fields');
            return;
        }

        // Convert closingTime to a valid Date object
        const closingDate = new Date(closingTime);
        if (isNaN(closingDate.getTime())) {
            setError('Invalid closing time format. Please enter a valid date.');
            return;
        }

        setIsLoading(true);
        setError('');
        
        try {
            await axios.post(
                'http://localhost:5001/auctions',
                {
                    itemName,
                    description,
                    startingBid: parseFloat(startingBid),
                    endTime: closingDate.toISOString() // Send as ISO string
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            // Show success message
            const successToast = document.createElement('div');
            successToast.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            successToast.innerHTML = `<div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header">
                    <strong class="me-auto">Success</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    Auction posted successfully!
                </div>
            </div>`;
            document.body.appendChild(successToast);
            
            // Redirect to dashboard or auctions page
            navigate('/dashboard');

        } catch (error) {
            console.error('Error posting auction:', error);
            setError('Failed to post auction. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handlePostAuction}>
            <h2>Create a New Auction</h2>
            
            {error && <div className="alert alert-danger">{error}</div>}
            
            <div className="mb-3">
                <label htmlFor="itemName" className="form-label">Item Name</label>
                <input type="text" id="itemName" value={itemName} onChange={(e) => setItemName(e.target.value)} required />
            </div>

            <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>

            <div className="mb-3">
                <label htmlFor="startingBid" className="form-label">Starting Bid</label>
                <input type="number" id="startingBid" value={startingBid} onChange={(e) => setStartingBid(e.target.value)} required />
            </div>

            <div className="mb-3">
                <label htmlFor="closingTime" className="form-label">Closing Time</label>
                <input type="datetime-local" id="closingTime" value={closingTime} onChange={(e) => setClosingTime(e.target.value)} required />
            </div>

            <button type="submit" className={`btn btn-primary ${isLoading ? 'disabled' : ''}`}>
                {isLoading ? 'Posting...' : 'Post Auction'}
            </button>
        </form>
    );
}

export default PostAuction;
