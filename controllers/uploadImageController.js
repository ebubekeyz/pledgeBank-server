const path = require('path');
const { StatusCodes } = require('http-status-codes');

const { BadRequestError } = require('../errors');

const upload = async (req, res) => {
  if (!req.files) {
    throw new BadRequestError('No file uploaded');
  }

  const productImage = req.files.image;

  if (!productImage.mimetype.startsWith('image')) {
    throw new BadRequestError('Please upload image');
  }
  const imagePath = path.join(
    __dirname,
    '../public/uploads/' + `${productImage.name}`
  );

  await productImage.mv(imagePath);

  res
    .status(StatusCodes.OK)
    .json({ image: { src: `/uploads/${productImage.name}` } });
};

module.exports = upload;
