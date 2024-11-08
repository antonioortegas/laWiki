const router = require('express').Router();
const wikiController = require('../controllers/wikiController');

router.get('/', wikiController.getWikis);
router.post('/', wikiController.createWiki);
router.get('/:id', wikiController.getWiki);
router.put('/:id', wikiController.updateWiki);
router.delete('/:id', wikiController.deleteWiki);

router.get('/search/', wikiController.searchWikiTitle);
router.get('/filter/', wikiController.searchWikiTag);
router.get('/user_search/', wikiController.searchUserWiki);
router.get('/entry_search/', wikiController.searchEntryWiki);

module.exports = router;