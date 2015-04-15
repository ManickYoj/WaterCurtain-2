var http = require('http');

// Config
var PORT = process.env.PORT || 8888;


// Routing Table
var hw = require('./hw-interface');


// Define request handler
var requestHandler = function (req, res) {
    console.log(hw.cf());
    res.end("test");
};


// Listen
var server = http.createServer(requestHandler);
server.listen(PORT);
