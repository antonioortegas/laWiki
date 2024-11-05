const router = require('express').Router();
const versionController = require('../controllers/versionController');

router.post('/', versionController.createVersion);      // Create a new version
router.get('/', versionController.getAllVersions);      // Get all versions
router.get('/:id', versionController.getVersion);       // Get a specific version by id
router.put('/:id', versionController.updateVersion);    // Update a specific version by id
router.delete('/:id', versionController.deleteVersion); // Delete a specific version by id

module.exports = router;