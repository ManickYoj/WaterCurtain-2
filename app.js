var http = require('http');
var fs = require('fs');
var path = require('path');

var util = require('./util');
var config = require('./config');
var hw = require('./hw-interface');

// WebApp Config
var PORT = process.env.PORT || 8888;

// Define API routes
var ROUTES = {
    '/' : index,
    '/patterns' : patterns,
    '/main.css' : function (req, res) { util.loadFile(req, res, './main.css'); },
    '/main.js' : function (req, res) { util.loadFile(req, res, './main.js'); }
};


// ----- Index Page Handler ----- //
function index(req, res) {
    // Send index page
    if (req.method === 'GET') util.loadFile(req, res, './index.html');

    // Run a pattern on the hardware, and add it to the database
    else if (req.method === 'POST') util.recieveJSON(req, res, function (pattern) {
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
    try { ROUTES[req.url](req, res); }
    catch (err) {
        console.error('Invalid page request. ERROR: ' + err);
        res.writeHead(404, { 'Content-Type': 'text/html' });
    }
}).listen(PORT);
console.log("Server listening on port " + PORT + ".");
