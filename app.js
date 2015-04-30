// Node imports
var http = require('http');
var fs = require('fs');
var path = require('path');

// Import server scripts
var util = require('./server_scripts/util');
var config = require('./server_scripts/config');
var hw = require('./server_scripts/hw-interface');

// WebApp Config
var PORT = process.env.PORT || 8888;


// Define API routes
var ROUTES = {
    '/' : index,
    '/patterns' : patterns,
};


// ----- Index Page Handler ----- //
function index(req, res) {
    // Handles serving the index.html file when user does not enter a filepath
    if (req.method == 'GET') util.serveFile(req, res, './public/index.html');

    // Run a pattern on the hardware, and add it to the database
    if (req.method === 'POST') util.recieveJSON(req, res, function (pattern) {
        hw.queuePattern(pattern.pattern);
        addPattern(pattern);
    });
};



// ----- Save/Load Patterns ----- //
// Our beautiful pattern database.
var saved_patterns = [];

// The route handler for the pattern API
function patterns (req, res) {
    // Send patterns as JSON to front-end
    if (req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json'});
        res.end(JSON.stringify(saved_patterns))
    }

    // Save JSON encoded patterns in an object
    else if (req.method === 'POST') util.recieveJSON(req, res, addPattern);
}

// Utility for adding a pattern to the database, and shifting out old patterns
function addPattern (pattern) {
    saved_patterns.unshift(pattern);
    if (saved_patterns.length >= config.STORED_PATTERNS) saved_patterns.pop();
}


// ----- Listen ----- //
var server = http.createServer( function (req, res) {
    util.public(req, res, function(public_err) {
        if (public_err) {
            try { ROUTES[req.url](req, res); }
            catch (route_err) {
                console.error("The request for " + req.url + " could not be handled.")
                console.error(public_err);
                console.error("Routing failed due to an error: " + route_err);

                res.writeHead(404, { 'Content-Type': 'text/html' });
            }
        }
    });
}).listen(PORT);
console.log("Server listening on port " + PORT + ".");
