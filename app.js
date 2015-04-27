var http = require('http');
var fs = require('fs');
var path = require('path');
var hw = require('./hw-interface');


// WebApp Config
var PORT = process.env.PORT || 8888;
var ROUTES = {
    '/' : index,
    '/main.css' : function (req, res) { loadFile(req, res, './main.css'); },
    '/main.js' : function (req, res) { loadFile(req, res, './main.js'); },
    '/patterns' : function (req, res) { sendPatterns (req, res); }
};

// Define request handler
function index(req, res) {
    if (req.method === 'GET') loadFile(req, res, './index.html');
    else if (req.method === 'POST') {
        var data = '';

        req.addListener('data', function(chunk) { data += chunk; });
        req.addListener('end', function() {
            // Load pattern into queue
            var json_pattern = JSON.parse(data);
            hw.queuePattern(json_pattern);

            // Respond to client
            res.writeHead(200, {'content-type': 'text/plain' });
            res.end();
        });
    }
};

// Utility method for loading and serving an HTML file
function loadFile(req, res, filepath) {
    fs.readFile(filepath, function(error, content) {
        // Send Server Error
        if (error) {
            res.writeHead(500);
            res.end();
        }

        // Send Content
        else {
            // Set content type correctly.
            var ext = path.extname(filepath);
            var type = { 'content-type': 'text/plain' };

            if (ext == '.html') type = { 'content-type': 'text/html' };
            else if (ext == '.css') type = { 'content-type': 'text/css' };
            else if (ext == '.js') type = { 'content-type': 'text/javascript' };

            // Send response
            res.writeHead(200, type);
            res.end(content, 'utf-8');
        }
    });
};

function sendPatterns (req, res) {
    // TODO: Make this work
    res.writeHead();
    res.end()
}


// Listen
var server = http.createServer( function (req, res) {
    try { ROUTES[req.url](req, res); }
    catch (err) {
        console.error('Invalid page request. ERROR: ' + err);
        res.writeHead(404, { 'Content-Type': 'text/html' });
    }
}).listen(PORT);
console.log("Server listening on port " + PORT + ".");
