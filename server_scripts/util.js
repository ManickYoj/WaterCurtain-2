var fs = require('fs');
var path = require('path');


/**
    recieveJSON
    -----------

    Parses an incoming json request body to a javascript object.
    Runs the callback argument with the recieved object as a parameter.
*/
function recieveJSON(req, res, callback) {
    var data = '';

    req.addListener('data', function(chunk) { data += chunk; });
    req.addListener('end', function() {

        try {
            callback(JSON.parse(data));
        } catch (e) {
            callback(data);
        }

        // Respond to client
        res.writeHead(200, {'content-type': 'text/plain' });
        res.end();
    });
}


/**
    public
    ------

    Attempts to find the requested file in the public directory.
    Returns an error if file is not found, or request is invalid.
*/
function public (req, res, next) {
    var pub_path = path.join('./public', req.url);

    // Returns an error if the request method is not a GET
    if (req.method !== 'GET') next(new Error ("Cannot access public file '" + pub_path + "' via non-GET request."));


    // Returns the file, if it exists, or an error otherwise
    fs.exists(pub_path, function (exists) {
        serveFile(req, res, pub_path, function (err) {
            if (err) next(new Error("Requested file '" + req.url + "' does not exist in public folder."));
            else next(null);
        });
    });
}

// A mapping of extension types to the MIME types associated with them
var MIME_MAP = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.otf': 'font/opentype',
    '.ico': 'image/x-icon'
}


/**
    serveFile
    --------

    Serves the file at the passed in filepath.
*/
function serveFile(req, res, filepath, next) {
    fs.readFile(filepath, function(error, content) {
        if (error) next(error);

        // Send Content
        else {
            // Set MIME type correctly.
            var ext = path.extname(filepath);
            if (ext in MIME_MAP) type = MIME_MAP[ext];
            else type = 'text/plain';

            // Send response
            res.writeHead(200, {'content-type': type});
            res.end(content, 'utf-8');
            return null;
        }
    });

};


// Export the functions contained in this module for external use
module.exports = {
    'public' : public,
    'serveFile': serveFile,
    'recieveJSON': recieveJSON
}
