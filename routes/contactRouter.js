const express = require('express');
const router = express.Router();

const auth = require('../middleware/authentication');
const authPermission = require('../middleware/authPermission');

const {
  createContact,
  getSingleContact,
  deleteSingleContact,
  deleteAllContacts,
  getAllContacts,
  deleteUserContact,
  editSingleContact,
  getContacts,
  editUserContact,
} = require('../controllers/contactController');

router
  .route('/')
  .get(auth, getAllContacts)
  .post(auth, createContact)
  .delete(auth, authPermission('admin', 'owner'), deleteAllContacts);

router.route('/allContact').get(getContacts);

router
  .route('/:id')
  .get(getSingleContact)
  .delete(auth, authPermission('admin', 'owner'), deleteSingleContact)
  .patch(auth, editSingleContact);

router.route('/:id/deleteUserContact').delete(auth, deleteUserContact);
router.route('/:id/editUserContact').patch(auth, editUserContact);

module.exports = router;
