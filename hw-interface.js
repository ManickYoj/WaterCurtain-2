var bs = require('bonescript');
var cf = require('./config');

// TODO: Move to a config file
// Config
module.exports.cf = function () {
    return cf;
};

// Setup Pins
for (var i=0; i < cf.PIN_LIST.length; i++) {
    bs.pinMode(cf.PIN_LIST[i], bs.OUTPUT);
    bs.digitalWrite(cf.PIN_LIST[i], bs.LOW);
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


    // Run pattern
    runPatternRecursive(pattern);
};

/** -- runPatternRecursive
*    Recursively works its way through a pattern, turning the valves on for the ON_DURATION
*    for each row, and then off for OFF_DURATION after each row is complete.
*/
function runPatternRecursive (pattern) {
    if(pattern.length == 0) return;
    if (cf.PIN_LIST.length > pattern[0].length) throw RangeError("Pattern too large for available valves.");

    for (var i = 0; i < pattern[0].length; i++)
         bs.digitalWrite(cf.PIN_LIST[i], Boolean(pattern[0][i]) ? bs.HIGH : bs.LOW);

    var reduced_pattern = pattern.slice(1);
    if (reduced_pattern.length > 0) setTimeout(delayRPR(reduced_pattern), cf.ON_DURATION);
}

function delayRPR (pattern) {
    setPins(cf.PIN_LIST, bs.LOW);
    setTimeout(runPatternRecursive(pattern), cf.OFF_DURATION);
}

function setPins (PIN_LIST, value) {
    for (var i = 0; i < cf.PIN_LIST.length; i++) bs.digitalWrite(cf.PIN_LIST[i], value);
}
/* ----- END runPatternRecursive functions ----- */
var bs = require('bonescript');
