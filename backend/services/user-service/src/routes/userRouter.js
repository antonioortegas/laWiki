const router = require('express').Router();
const userController = require('../controllers/userController');

router.get('/', userController.getUsers);
router.post('/', userController.createUser);

router.get('/:userId/entries', userController.getUserEntries);

router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

/* ================= Frontend functions =================  */
router.get('/:idUser/averageRating', userController.getAverageRating);
router.get('/:idUser/notifications', userController.getNotifications);
router.post('/:idUser/newNotification', userController.addNotification);
router.post('/:idUser/read/', userController.markasRead);
router.post('/:idUser/addRating', userController.addRating);

module.exports = router;
