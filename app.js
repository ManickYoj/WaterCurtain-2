// Utility Imports
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')

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
var hw = require('./hw-interface');
hw.runPattern();

// Listen
app.listen(PORT);
console.log("App running on port "+PORT+".");
