const router = require('express').Router();
const versionController = require('../controllers/versionController');

router.get('/', versionController.getVersions);
router.post('/', versionController.createVersion);
router.get('/:id', versionController.getVersionById);
router.put('/:id', versionController.updateVersion);
router.delete('/:id', versionController.deleteVersion);

module.exports = router;
