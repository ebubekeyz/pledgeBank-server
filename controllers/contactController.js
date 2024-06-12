const Contact = require('../models/Contact');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthorizedError } = require('../errors');

const createContact = async (req, res) => {
  req.body.user = req.user.userId;
  const contact = await Contact.create(req.body);
  res.status(StatusCodes.CREATED).json({ attributes: contact });
};

const getAllContacts = async (req, res) => {
  let { user, date, status, amount, sort } = req.query;

  const queryObject = {
    user: req.user.userId,
  };

  let result = Contact.find(queryObject);

  if (user) {
    result = Contact.find({ user: req.user.userId, user: { $eq: user } });
  }

  if (status) {
    result = Contact.find({ user: req.user.userId, status: { $eq: status } });
  }
  if (sort === 'latest') {
    result = result.sort('-createdAt');
  }
  if (sort === 'oldest') {
    result = result.sort('createdAt');
  }

  if (sort === 'a-z') {
    result = result.sort('name');
  }
  if (sort === 'z-a') {
    result = result.sort('-name');
  }

  if (amount) {
    result = Contact.find({ user: req.user.userId, amount: { $lte: amount } });
  }

  if (date) {
    result = Contact.find({
      user: req.user.userId,
      date: { $regex: date, $options: 'i' },
    });
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const contact = await result;

  const totalContact = await Contact.countDocuments();
  const numOfPage = Math.ceil(totalContact / limit);

  res.status(StatusCodes.OK).json({
    contact: contact,
    meta: {
      pagination: { page: page, total: totalContact, pageCount: numOfPage },
    },
  });
};

const getContacts = async (req, res) => {
  let { user, date, status, amount, sort } = req.query;

  let result = Contact.find({});

  if (user) {
    result = Contact.find({
      user: { $eq: user },
    });
  }

  if (status) {
    result = Contact.find({
      status: { $eq: status },
    });
  }
  if (sort === 'latest') {
    result = result.sort('-createdAt');
  }
  if (sort === 'oldest') {
    result = result.sort('createdAt');
  }

  if (sort === 'a-z') {
    result = result.sort('name');
  }
  if (sort === 'z-a') {
    result = result.sort('-name');
  }

  if (amount) {
    result = Contact.find({ amount: { $lte: amount } });
  }

  if (date) {
    result = Contact.find({
      date: { $regex: date, $options: 'i' },
    });
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const contact = await result;

  const totalContact = await Contact.countDocuments();
  const numOfPage = Math.ceil(totalContact / limit);

  res.status(StatusCodes.OK).json({
    contact: contact,
    meta: {
      pagination: { page: page, total: totalContact, pageCount: numOfPage },
    },
  });
};

const getSingleContact = async (req, res) => {
  const { id: contactId } = req.params;
  const contact = await Contact.findOne({ _id: contactId });
  if (!contact) {
    throw new BadRequestError(`Contact with id ${contactId} does not exist`);
  }

  res.status(StatusCodes.OK).json({ Contact: Contact });
};

const editSingleContact = async (req, res) => {
  const { id: contactId } = req.params;
  const contact = await Contact.findOneAndUpdate({ _id: contactId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!contact) {
    throw new BadRequestError(`Contact with id ${contactId} does not exist`);
  }
  res.status(StatusCodes.OK).json({ contact: contact });
};

const editUserContact = async (req, res) => {
  const { id: userId } = req.params;
  const contact = await Contact.updateMany({ user: userId }, req.body);

  res.status(StatusCodes.OK).json({ contact: contact });
};

const deleteSingleContact = async (req, res) => {
  const { id: contactId } = req.params;
  const contact = await Contact.findByIdAndDelete({ _id: contactId });
  if (!contact) {
    throw new BadRequestError(`Contact with id ${contactId} does not exist`);
  }
  res.status(StatusCodes.OK).json({ msg: 'Contact Deleted' });
};

const deleteAllContacts = async (req, res) => {
  const contact = await Contact.deleteMany();
  res.status(StatusCodes.OK).json({ msg: 'Contact Deleted' });
};

const deleteUserContact = async (req, res) => {
  const { id: userId } = req.params;
  const contact = await Contact.deleteMany({ user: userId });

  res.status(StatusCodes.OK).json({ msg: 'Contact successfully deleted' });
};

module.exports = {
  getContacts,
  createContact,
  deleteUserContact,
  getAllContacts,
  getSingleContact,
  editSingleContact,
  deleteSingleContact,
  deleteAllContacts,
  editUserContact,
};
