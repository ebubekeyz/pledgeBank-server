const mongoose = require('mongoose');
const moment = require('moment');

const WithdrawSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
    },
    accountName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['processing', 'sent', 'expired'],
      default: 'processing',
    },
    date: {
      type: String,
      default: moment().format('YYYY-DD-MM'),
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Withdraw', WithdrawSchema);
