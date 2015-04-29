var fs = require('fs');
var path = require('path');

// Recieves a JSON object and passes it to a callback
function recieveJSON(req, res, callback) {
    var data = '';

    req.addListener('data', function(chunk) { data += chunk; });
    req.addListener('end', function() {
        callback(JSON.parse(data));

        // Respond to client
        res.writeHead(200, {'content-type': 'text/plain' });
        res.end();
    });
}


// Loads and serves a file given a filepath
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

module.exports = {
    'loadFile': loadFile,
    'recieveJSON': recieveJSON
}
