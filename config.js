module.exports = {
    ON_DURATION: 100,
    OFF_DURATION: 100,
    PIN_LIST: genPinList("P8", 9, 5)
};

function genPinList (header, start, number) {
    var pinList = [];

    for (var i = start; i < start + number; i++)
        pinList.push(header + "_" + i.toString());

    return pinList;
}
