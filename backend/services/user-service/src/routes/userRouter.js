const router = require('express').Router();
const userController = require('../controllers/userController');

router.get('/', userController.getUsers);
router.post('/', userController.createUser);

router.get('/:userId/entries', userController.getUserEntries);

router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

/* ================= Frontend functions =================  */
router.get('/:idUser/averageRating', userController.getAverageRating);
router.post('/:idUser/addRating', userController.addRating);
router.get('/:idUser/notifications', userController.getNotifications);
router.post('/:idUser/newNotification', userController.addNotification);
router.delete('/:idUser/deleteNotification/:idNotification', userController.deleteNotification);
router.put('/:idUser/read/', userController.markAsRead);

// Custom operations for user
router.get('/min-rating/:minRating', userController.getUsersByMinRating);
router.get('/search/:name', userController.getUsersByPartialName);

// oAuth operations
router.post('/login', userController.login);
router.post('/validate-token', userController.validateToken);
router.post('/renew-token', userController.renewToken);

module.exports = router;
