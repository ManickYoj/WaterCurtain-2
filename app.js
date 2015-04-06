// Utility Imports
var express = require('express');
var path = require('path');
var logger = require('morgan');

// Startup
var app = express();

// Config
var PORT = process.env.PORT || 8888;

// Middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Routing Table
var main = require('/routes');
app.get('/', main.index);

// Listen
app.listen(PORT);
console.log("App running on port "+PORT+".");