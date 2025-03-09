const express = require('express');
const router = express.Router();
const Auction = require('../models/Auction');
const auth = require('../middleware/auth');

// Get all auctions
router.get('/', async (req, res) => {
  try {
    const auctions = await Auction.find()
      .populate('seller', 'username')
      .populate('highestBidder', 'username')
      .sort({ startTime: -1 });
    res.json(auctions);
  } catch (error) {
    console.error('Error fetching auctions:', error);
    res.status(500).json({ message: 'Error fetching auctions' });
  }
});

// Get single auction
router.get('/:id', async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id)
      .populate('seller', 'username')
      .populate('highestBidder', 'username')
      .populate('bids.bidder', 'username');
    
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }
    
    res.json(auction);
  } catch (error) {
    console.error('Error fetching auction:', error);
    res.status(500).json({ message: 'Error fetching auction' });
  }
});

// Create new auction
router.post('/', auth, async (req, res) => {
  try {
      const { itemName, description, startingBid, endTime } = req.body;

      // Validate endTime
      const validEndTime = new Date(endTime);
      if (isNaN(validEndTime.getTime())) {
          return res.status(400).json({ message: 'Invalid end time provided' });
      }

      const auction = new Auction({
          itemName,
          description,
          startingBid,
          currentBid: startingBid,
          seller: req.user.userId,
          endTime: validEndTime // Use the validated Date object
      });

      await auction.save();
      
      res.status(201).json(auction);
  } catch (error) {
      console.error('Error creating auction:', error);
      res.status(500).json({ message: 'Error creating auction' });
  }
});



// Place bid
router.post('/:id/bid', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    const auction = await Auction.findById(req.params.id);

    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    if (auction.isClosed) {
      return res.status(400).json({ message: 'Auction has ended' });
    }

    if (auction.seller.toString() === req.user.userId) {
      return res.status(400).json({ message: 'Cannot bid on your own auction' });
    }

    if (amount <= auction.currentBid) {
      return res.status(400).json({ message: 'Bid must be higher than current bid' });
    }

    auction.bids.push({
      bidder: req.user.userId,
      amount
    });

    auction.currentBid = amount;
    auction.highestBidder = req.user.userId;

    await auction.save();
    
    // Populate the updated auction with user details
    const updatedAuction = await Auction.findById(auction._id)
      .populate('seller', 'username')
      .populate('highestBidder', 'username')
      .populate('bids.bidder', 'username');

    res.json(updatedAuction);
  } catch (error) {
    console.error('Error placing bid:', error);
    res.status(500).json({ message: 'Error placing bid' });
  }
});

// Get user's auctions
router.get('/user/auctions', auth, async (req, res) => {
  try {
    const auctions = await Auction.find({ seller: req.user.userId })
      .populate('seller', 'username')
      .populate('highestBidder', 'username')
      .sort({ startTime: -1 });
    res.json(auctions);
  } catch (error) {
    console.error('Error fetching user auctions:', error);
    res.status(500).json({ message: 'Error fetching user auctions' });
  }
});

// Get user's bids
router.get('/user/bids', auth, async (req, res) => {
  try {
    const auctions = await Auction.find({
      'bids.bidder': req.user.userId
    })
      .populate('seller', 'username')
      .populate('highestBidder', 'username')
      .sort({ startTime: -1 });
    res.json(auctions);
  } catch (error) {
    console.error('Error fetching user bids:', error);
    res.status(500).json({ message: 'Error fetching user bids' });
  }
});

module.exports = router;
