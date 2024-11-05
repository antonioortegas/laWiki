const router = require('express').Router();
const wikiController = require('../controllers/wikiController');

router.get('/:id', wikiController.getWikiById);
router.get('/delete/:id', wikiController.deleteWiki);
router.post('/update/:id', wikiController.updateWiki);

module.exports = router;