var bs = require('bonescript');
var cf = require('./config');

var testWrite = function (pin, signal) {
    process.stdout.write(Boolean(signal) ? 'X' : '_');
}

WRITE_FUNC = cf.TEST_MODE ? testWrite : bs.digitalWrite;

// Setup Pins
for (var i=0; i < cf.PIN_LIST.length; i++) {
    if (!cf.TEST_MODE) bs.pinMode(cf.PIN_LIST[i], bs.OUTPUT);
    WRITE_FUNC(cf.PIN_LIST[i], bs.LOW);
}

module.exports.runPattern = function (pattern) {
    // HARDCODE - pattern should be passed/loaded
    pattern = [
        [1,0,0,0,0],
        [0,1,0,0,0],
        [0,0,1,0,0],
        [0,0,0,1,0],
        [0,0,0,0,1]
    ];


    // Run pattern, and turn off valves after completion
    runPatternRecursive(pattern);
    for (var i=0; i < cf.PIN_LIST.length; i++)
        WRITE_FUNC(cf.PIN_LIST[i], bs.LOW);
};

/** -- runPatternRecursive
*   Recursively works its way through a pattern, turning the valves on or off, as
*   specified by the pattern. Each pattern row is activated for the ROW_DURATION
*/
function runPatternRecursive (pattern) {
    // Return if pattern has ended.
    if(pattern.length == 0) return;

    // Check for hardware/software incompatability
    if (cf.PIN_LIST.length > pattern[0].length) throw RangeError("Pattern too wide for available valves.");

    // Set valves
    for (var i = 0; i < pattern[0].length; i++)
         WRITE_FUNC(cf.PIN_LIST[i], Boolean(pattern[0][i]) ? bs.HIGH : bs.LOW);

    // Move to next row and continue after waiting for the ROW_DURATION
    var reduced_pattern = pattern.slice(1);
    if (reduced_pattern.length > 0) setTimeout(runPatternRecursive(reduced_pattern), cf.ROW_DURATION);
}
