module.exports = {
    ROW_DURATION: 100,
    PIN_LIST: genPinList("P8", 9, 10),
    TEST_MODE: true
};

function genPinList (header, start, number) {
    var pinList = [];

    for (var i = start; i < start + number; i++)
        pinList.push(header + "_" + i.toString());

    return pinList;
}

