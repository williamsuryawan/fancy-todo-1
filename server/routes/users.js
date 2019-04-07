const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const {Authentication} = require('../middlewares/authentication.js')
/* GET users listing. */

router.get('/', UserController.findUser)
router.post('/register', UserController.register);
router.post('/login', UserController.login);

// router.use(Authentication)
// router.get('/:id', UserController.getUserDetail)

module.exports = router;