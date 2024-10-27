/*
The controller is responsible for handling the incoming requests
each function here is associated with a route, so for example
getWiki will be called when the user accesses the /wiki path
*/

const getWiki = async (req, res) => {
    res.send('Hello World from the wiki controller!');
}

const getAbout = async (req, res) => {
    res.send('Hello World from the wiki/about controller!');
}

module.exports = {
    getWiki,
    getAbout
}