const router = require('express').Router();
const entryController = require('../controllers/entryController');

router.get('/', entryController.getEntries);
router.post('/', entryController.createEntry);
router.get('/:id', entryController.getEntry);
router.put('/:id', entryController.updateEntry);
router.delete('/:id', entryController.deleteEntry);

module.exports = router;