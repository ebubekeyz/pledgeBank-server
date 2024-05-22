const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthorizedError } = require('../errors');

const registerUser = async (req, res) => {
  const {
    email,
    lastName,
    firstName,
    country,
    phone,
    accountOwnership,
    typeOfAccount,
    identity,
    occupation,
    address,
    maritalStatus,
    dob,
    password,
  } = req.body;

  let role;
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const isSecondAccount = (await User.countDocuments({})) === 1;

  if (isFirstAccount) {
    role = 'admin';
  } else if (isSecondAccount) {
    role = 'owner';
  } else {
    role = 'user';
  }
  const user = await User.create({
    role,
    email,
    lastName,
    firstName,
    country,
    phone,
    accountOwnership,
    typeOfAccount,
    identity,
    occupation,
    address,
    maritalStatus,
    dob,
    password,
  });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: user, token: token });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    throw new BadRequestError('Please provide an email');
  }
  if (!password) {
    throw new BadRequestError('Please provide a password');
  }
  const user = await User.findOne({ email });
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthorizedError('Password did not match');
  }

  const token = user.createJWT();

  res.status(StatusCodes.OK).json({ user: user, token: token });
};
const getAllUsers = async (req, res) => {
  let { sort, name, email, ref, date, balance } = req.query;

  let result = User.find({});

  if (name) {
    result = User.find({ name: { $regex: name, $options: 'i' } });
  }

  if (ref) {
    result = User.find({ ref: { $eq: ref } });
  }
  if (balance) {
    result = User.find({ balance: { $eq: balance } });
  }
  if (date) {
    result = Order.find(queryObject, {
      date: { $regex: date, $options: 'i' },
    });
  }

  if (email) {
    result = User.find({
      email: { $regex: email, $options: 'i' },
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

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const users = await result;

  const totalUsers = await User.countDocuments();
  const numOfPage = Math.ceil(totalUsers / limit);

  res.status(StatusCodes.OK).json({
    users: users,
    meta: {
      pagination: { page: page, total: totalUsers, pageCount: numOfPage },
    },
  });
};

const getSingleUser = async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new BadRequestError(`User with id ${userId} does not exist`);
  }

  res.status(StatusCodes.OK).json({ user: user });
};

const editSingleUser = async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findOneAndUpdate({ _id: userId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new BadRequestError(`User with id ${userId} does not exist`);
  }
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: user, token: token });
};

const deleteSingleUser = async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findByIdAndDelete({ _id: userId });
  if (!user) {
    throw new BadRequestError(`User with id ${userId} does not exist`);
  }
  res.status(StatusCodes.OK).json({ msg: 'User Deleted' });
};

const deleteAllUsers = async (req, res) => {
  const user = await User.deleteMany();
  res.status(StatusCodes.OK).json({ msg: 'Users Deleted' });
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new BadRequestError('Please provide both values');
  }

  const user = await User.findOne({ _id: req.user.userId });
  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new UnauthorizedError('Password did not match existing user');
  }

  user.password = newPassword;

  await user.save();

  const token = user.createJWT();

  res.status(StatusCodes.OK).json({ user: user, token: token });
};

module.exports = {
  showCurrentUser,
  registerUser,
  loginUser,
  getAllUsers,
  getSingleUser,
  editSingleUser,
  deleteSingleUser,
  deleteAllUsers,
  updateUserPassword,
};
