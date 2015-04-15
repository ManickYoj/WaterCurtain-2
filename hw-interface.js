var bs = require('bonescript');
var cf = require('./config');

var logLine = function (row, offset) {
    for (var i = 0; i < row.length; i++) process.stdout.write(Boolean(row[i]) ? 'X' : '_');

    // Newline
    console.log();
}

var outputLine = function (row, offset) {
    for (var i = offset; i < row.length + offset; i++)
        bs.digitalWrite(cf.PIN_LIST[i], Boolean(row[i]) ? bs.HIGH : bs.LOW);
}

var closeAll = function () {
    WRITE_FUNC(new Array(cf.PIN_LIST.length));
}

/** -- runPattern
*   Recursively works its way through a pattern, turning the valves on or off, as
*   specified by the pattern. Each pattern row is activated for the ROW_DURATION
*/
var runPattern = function(pattern) {
    // Check for hardware/software incompatability
    if (cf.PIN_LIST.length > pattern[0].length) throw RangeError("Pattern too wide for available valves.");

    // Set valves
    WRITE_FUNC(pattern[0]);

    // Move to next row and continue after waiting for the ROW_DURATION
    var reduced_pattern = pattern.slice(1);
    if (reduced_pattern.length > 0)
        setTimeout(function () { runPattern(reduced_pattern); }, cf.ROW_DURATION);

    // Turn off valves after completion
    else setTimeout(function () { closeAll(); }, cf.ROW_DURATION);
}

/* ----- RUNNING CODE ----- */
// Set up test mode or output mode based on config
WRITE_FUNC = cf.TEST_MODE ? logLine : outputLine;

// Setup Pins
if (!cf.TEST_MODE) for (var i=0; i < cf.PIN_LIST.length; i++) bs.pinMode(cf.PIN_LIST[i], bs.OUTPUT);

module.exports.runPattern = runPattern;
