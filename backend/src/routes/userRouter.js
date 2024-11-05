const router = require('express').Router();
const userController = require('../controllers/userController');

// CRUD operations for user
router.post('/', userController.createUser);
router.get('/', userController.getUser);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

// Custom operations for user
router.get('/min-rating/:minRating', userController.getUsersByMinRating);
router.get('/search/:name', userController.getUsersByPartialName);

module.exports = router;