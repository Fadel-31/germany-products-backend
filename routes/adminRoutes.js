const router = require('express').Router();
const { register, login } = require('../controllers/adminController');

router.post('/register', register); // One-time only
router.post('/login', login);

module.exports = router;
