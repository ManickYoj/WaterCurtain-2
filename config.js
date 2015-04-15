module.exports = {
    ROW_DURATION: 1000,
    PIN_LIST: genPinList("P8", 9, 5),
    TEST_MODE: false
};

function genPinList (header, start, number) {
    var pinList = [];

    for (var i = start; i < start + number; i++)
        pinList.push(header + "_" + i.toString());

    return pinList;
}

