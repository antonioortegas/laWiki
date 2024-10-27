const router = require('express').Router();
// Import the wiki controller, that specifies the functions that will handle the incoming requests
const wikiController = require('../controllers/wikiController');

// accessing "/wiki/" will call the getWiki function from the wiki controller
router.get('/', wikiController.getWiki);
router.post('/', wikiController.createWiki);
router.get('/about', wikiController.getAbout);

module.exports = router;