const express = require('express');
const router = express.Router();

const auth = require('../middleware/authentication');
const authPermission = require('../middleware/authPermission');

const {
  registerUser,
  loginUser,
  getAllUsers,
  getSingleUser,
  editSingleUser,
  deleteSingleUser,
  deleteAllUsers,
  showCurrentUser,
  updateUserPassword,
  passwordReset,
  emailPassword,
} = require('../controllers/authController');

router
  .route('/')
  .get(getAllUsers)
  .delete(auth, authPermission('admin', 'owner'), deleteAllUsers);
router.route('/local/register').post(registerUser);
router.route('/local').post(loginUser);
router.route('/showMe').get(auth, showCurrentUser);
router.route('/updatePassword').patch(auth, updateUserPassword);
router.route('/emailPassword').post(emailPassword);
router
  .route('/:id')
  .patch(auth, editSingleUser)
  .delete(auth, authPermission('admin', 'owner'), deleteSingleUser)
  .get(auth, getSingleUser);

router.route('/:id/passwordReset').patch(passwordReset);

module.exports = router;
