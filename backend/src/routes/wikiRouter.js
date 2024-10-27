const router = require('express').Router();
const wikiController = require('../controllers/wikiController');

router.get('/', wikiController.getWiki);
router.post('/', wikiController.createWiki);
router.get('/about', wikiController.getAbout);

module.exports = router;