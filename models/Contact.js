const mongoose = require('mongoose');
const moment = require('moment');
const validator = require('validator');

const ContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, 'Please enter email'],
      validate: {
        validator: validator.isEmail,
        message: 'Please provide a valid email',
      },
      unique: true,
    },
    subject: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
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

module.exports = mongoose.model('Contact', ContactSchema);
