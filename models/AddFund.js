const mongoose = require('mongoose');
const moment = require('moment');

const getRandomTenDigit = () => {
  return Math.floor(Math.random() * 10000000000);
};

let randomTenDigit = getRandomTenDigit();

const AddFundSchema = new mongoose.Schema(
  {
    bank: {
      type: String,
      required: true,
    },
    accountName: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
    },
    sortCode: {
      type: String,
      default: randomTenDigit,
    },

    amount: {
      type: Number,
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

module.exports = mongoose.model('AddFund', AddFundSchema);
