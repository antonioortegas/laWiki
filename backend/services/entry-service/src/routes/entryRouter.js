const router = require('express').Router();
const entryController = require('../controllers/entryController');

router.get('/', entryController.getEntries);
router.post('/', entryController.createEntry);

router.get('/search', entryController.fuzzyFindByText);
router.get('/comments', entryController.getComments);

router.get('/:id', entryController.getEntry);
router.put('/:id', entryController.updateEntry);
router.delete('/:id', entryController.deleteEntry);
router.put('/restore/:id', entryController.restoreEntry);
module.exports = router;