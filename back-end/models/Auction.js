const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  startingBid: {
    type: Number,
    required: true,
    min: 0
  },
  currentBid: {
    type: Number,
    default: function() {
      return this.startingBid;
    }
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  highestBidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'ended'],
    default: 'active'
  },
  bids: [{
    bidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    amount: Number,
    time: {
      type: Date,
      default: Date.now
    }
  }]
});

// Virtual property to check if auction is closed
auctionSchema.virtual('isClosed').get(function() {
  return this.endTime <= new Date() || this.status === 'ended';
});

// Ensure virtuals are included in JSON output
auctionSchema.set('toJSON', { virtuals: true });
auctionSchema.set('toObject', { virtuals: true });

const Auction = mongoose.model('Auction', auctionSchema);

module.exports = Auction;
