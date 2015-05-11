var of = require('onoff');
var cf = require('./config');
var NanoTimer = require('nanotimer');

var logLine = function (row, offset) {
    for (var i = 0; i < row.length; i++) process.stdout.write(Boolean(row[i]) ? 'X' : '_');

    // Newline
    console.log();
}

var outputLine = function (row, offset) {
    offset = offset || 0;
    for (var i = offset; i < row.length + offset; i++)
        GPIOs[i].write(Boolean(row[i]) ? 1 : 0);
}

var closeAll = function () {
    WRITE_FUNC(new Array(cf.PIN_LIST.length));
}

/** -- queuePattern
*   Adds a pattern to the pattern_queue and, if no pattern is currently being run,
*   kicks off a new runPatterns thread.
*/

var queuePattern = function(pattern) {
    if( Object.prototype.toString.call( pattern ) === '[object Array]' ) {

        // Flip pattern
        if (cf.FLIP_PATTERN) pattern.reverse();

        pattern_queue.push(pattern);
        if (pattern_queue.length === 1) runPattern(pattern_queue[0]);
    }  else console.error("Invalid pattern submission: " + pattern)
}

/** -- runPattern
*   Recursively works its way through a pattern, turning the valves on or off, as
*   specified by the pattern. Each pattern row is activated for the ROW_DURATION
*/
var runPattern = function(pattern) {
    // Check for hardware/software incompatability
    if (cf.PIN_LIST.length < pattern[0].length)
        return console.error("Pattern too wide for available valves.");
    // Set valves
    WRITE_FUNC(pattern[0]);

    // Move to next row and continue after waiting for the ROW_DURATION
    var reduced_pattern = pattern.slice(1);
    if (reduced_pattern.length > 0)
        nt.setTimeout(function () { runPattern(reduced_pattern); }, +cf.ROW_DURATION + 'm');

    // Turn off valves after completion
    else {
        setTimeout(function () {
            closeAll();

            // Load in the next pattern
            pattern_queue.shift();
            if (pattern_queue.length !== 0) runPattern(pattern_queue[0]);
        }, cf.ROW_DURATION);
    }
}

/* ----- RUNNING CODE ----- */
// Set up test mode or output mode based on config
WRITE_FUNC = cf.TEST_MODE ? logLine : outputLine;
nt = new NanoTimer();

GPIOs = [];

// Setup Pins
if (!cf.TEST_MODE) for (var i=0; i < cf.PIN_LIST.length; i++) GPIOs.push(of.Gpio(cf.PIN_LIST[i], 'out'));

pattern_queue = [];
module.exports.queuePattern = queuePattern;
