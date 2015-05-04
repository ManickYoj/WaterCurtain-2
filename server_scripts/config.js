// Mixed GPIO and HDMI
var GPIO = ['P8_7', 'P8_8', 'P8_9', 'P8_10', 'P8_11', 'P8_12', 'P8_13', 'P8_14', 'P8_15', 'P8_16',
            'P8_17', 'P8_18', 'P8_19', 'P8_26', 'P8_27', 'P8_28', 'P8_29', 'P8_30', 'P8_31', 'P8_32',
            'P8_43', 'P8_44', 'P8_45', 'P8_46', 'P9_11', 'P9_12', 'P9_13', 'P9_14', 'P9_15', 'P9_16',
            'P8_33', 'P8_34', 'P8_35', 'P8_36', 'P8_37', 'P8_38', 'P8_39', 'P8_40', 'P8_41', 'P8_42',
            'P9_21', 'P9_22', 'P9_23', 'P9_24', 'P9_26', 'P9_27', 'P9_30', 'P9_41', 'P9_42']


// Only available if using an SD card, rather than loading from onboard memory
var eMMC = ['P8_3', 'P8_4', 'P8_5', 'P8_6', 'P8_20', 'P8_21', 'P8_22', 'P8_23', 'P8_24', 'P8_25']

var PIN_LIST = GPIO;

module.exports = {
    ROW_DURATION: 100,      // Number of milliseconds that each row represents
    PIN_LIST: PIN_LIST,     // Set of pins to make available for use
    STORED_PATTERNS: 50,    // Number of submitted patterns to store in memory
    FLIP_PATTERN: true,     // Flip the pattern vertically on the server
    TEST_MODE: false        // Enable/disable software only 'test-mode'
};
