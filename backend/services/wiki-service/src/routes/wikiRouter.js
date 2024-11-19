const router = require('express').Router();
const wikiController = require('../controllers/wikiController');

router.get('/', wikiController.getWikis);
router.post('/', wikiController.createWiki);

router.get('/:id', wikiController.getWiki);
router.put('/:id', wikiController.updateWiki);
router.delete('/:id', wikiController.deleteWiki);

module.exports = router;