const express = require('express');
const router = express.Router();

const auth = require('../middleware/authentication');
const authPermission = require('../middleware/authPermission');

const {
  createAddFund,
  getSingleAddFund,
  deleteSingleAddFund,
  deleteAllAddFunds,
  getAllAddFunds,
  deleteUserAddFund,
  editSingleAddFund,
  getAddFunds,
  editUserAddFund,
} = require('../controllers/addFundController');

router
  .route('/')
  .get(auth, getAllAddFunds)
  .post(auth, createAddFund)
  .delete(auth, authPermission('admin', 'owner'), deleteAllAddFunds);

router.route('/allAddFund').get(getAddFunds);

router
  .route('/:id')
  .get(getSingleAddFund)
  .delete(auth, authPermission('admin', 'owner'), deleteSingleAddFund)
  .patch(auth, editSingleAddFund);

router.route('/:id/deleteUserAddFund').delete(auth, deleteUserAddFund);
router.route('/:id/editUserAddFund').patch(auth, editUserAddFund);

module.exports = router;
