const router = require('express').Router();
const entryController = require('../controllers/entryController');

router.get('/', entryController.getEntries);
router.post('/', entryController.createEntry);
router.get('/:id', entryController.getEntry);
router.put('/:id', entryController.updateEntry);
router.delete('/:id', entryController.deleteEntry);

// Es importante la ruta porque son consultas get y se puede liar pensando que recibe un id
router.get('/editor/:id', entryController.filterByEditor);
router.get('/sorted/asc', entryController.filterByAscDate);
router.get('/sorted/desc', entryController.filterByDescDate);
router.get('/search/titleOrDescription', entryController.filterByTitleOrContent)
router.get('/search/tags', entryController.filterByTags)

module.exports = router;