const router = require('express').Router();
const userController = require('../controllers/userController');

router.get('/', userController.getUsers);
router.post('/', userController.createUser);
router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

// Custom operations for user
router.get('/min-rating/:minRating', userController.getUsersByMinRating);
router.get('/search/:name', userController.getUsersByPartialName);

module.exports = router;