var http = require('http');
var fs = require('fs');
var hw = require('./hw-interface');

// WebApp Config
var PORT = process.env.PORT || 3000;
var ROUTES = {
    '/' : index
}

// Define request handler
function index(req, res) {
    if (req.method === 'GET') loadHTML(req, res, './index.html');
    else if (req.method === 'POST') {
        var data = '';

        req.addListener('data', function(chunk) { data += chunk; });
        req.addListener('end', function() {
            hw.runPattern(JSON.parse(data).pattern);
            res.writeHead(200, {'content-type': 'text/plain' });
            res.end()
        });
    }
}

// Utility method for loading and serving an HTML file
function loadHTML(req, res, filepath) {
    fs.readFile(filepath, function(error, content) {
        // Send Server Error
        if (error) {
            res.writeHead(500);
            res.end();
        }

        // Send Content
        else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
        }
    });
}


function pattern (req, res) {
    var patternJson = JSON.parse(data);
    console.log(pattern)
}


// Listen
var server = http.createServer( function (req, res) {
    try { ROUTES[req.url](req, res); }
    catch (err) {
        console.error('Invalid page request. ERROR: ' + err);
        res.writeHead(404, { 'Content-Type': 'text/html' });
    }
}).listen(PORT);
