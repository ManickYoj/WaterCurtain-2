var bs = require('bonescript');

// TODO: Move to a config file
// Config
ON_DURATION = 100;
OFF_DURATION = 100;
PIN_LIST = genPinList("P8", 9, 5);

// Setup Pins
for (var i=0; i < pinList.length; i++) {
    bs.pinMode(pinList[i], bs.OUTPUT);
    bs.digitalWrite(pinList[i], bs.LOW);
}

function genPinList (header, start, number) {
    pinList = [];

    for (var i = start; i < start + number; i++)
        pinList.push(header + "_" + i.toString());

    return pinList;
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
}

/** -- runPatternRecursive
*    Recursively works its way through a pattern, turning the valves on for the ON_DURATION
*    for each row, and then off for OFF_DURATION after each row is complete.
*/
function runPatternRecursive (pattern) {
    if (pinList.length > pattern[0].length) throw RangeError("Pattern too large for available valves.");

    for (var i = 0; i < row.length; i++)
         bs.digitalWrite(pinList[i], Boolean(row[i]) ? bs.HIGH : bs.LOW);

    reduced_pattern = pattern.slice(1);
    if (reduced_pattern.length > 0) setTimeout(delayRPR(reduced_pattern), ON_DURATION);
}

function delayRPR (pattern) {
    setPins(PIN_LIST, bs.LOW);
    setTimeout(runPatternRecursive(pattern), OFF_DURATION);
}

function setPins (pinList, value) {
    for (var i = 0; i < pinList.length, i++) bs.digitalWrite(pinList[i], value);
}
/* ----- END runPatternRecursive functions ----- */
