//CONFIG
ROWS = 20;
COLS = 49;
pattern = [];
mouseDown = false;

function reload(reset) {
    var pattern_control = document.querySelector("#pattern-control");
    pattern_control.innerHTML = "";
    document.onmousedown = function(){mouseDown = true};
    document.onmouseup = function(){mouseDown = false};

    for (var r = 0; r < ROWS; r++) (function(r) {
        if (reset) pattern[r] = [];
        var row_elem = document.createElement('div');
        row_elem.className = 'pattern-row';
        pattern_control.appendChild(row_elem);

        for (var c = 0; c < COLS; c++) (function(c) {
            if (reset) pattern[r][c] = false;

            var col_elem = document.createElement('div');
            col_elem.className = 'pattern-box';
            col_elem.onmouseover = function (event) { updatePattern(event, r, c) };
            col_elem.setAttribute('data-set', pattern[r][c]);
            row_elem.appendChild(col_elem);
        })(c);
    })(r);
}

// Debug utility for printing the current pattern to the console in human readable format
function printPattern () {
    var row_str = ''
    for (var r = 0; r < ROWS; r++) (function(r) {
        for (var c = 0; c < COLS; c++) (function(c) {
            row_str += pattern[r][c] ? '1' : '0';
        })(c);
        row_str += '\n';
    })(r);

    console.log(row_str);
}

function updatePattern(event, row, col) {
    if (mouseDown){
        pattern[row][col] = !Boolean(pattern[row][col]);
        event.target.setAttribute("data-set", Boolean(pattern[row][col]));
    }
}

// Sends the current pattern to the server
function sendPattern() {
    ajax("POST", "/", {name: 'Default', pattern: pattern});
}

function ajax(method, route, content) {
    var xmlhttp;

    // IE7+, Firefox, Chrome, Opera, Safari
    if (window.XMLHttpRequest) xmlhttp=new XMLHttpRequest();

    // IE6, IE5
    else xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");

    xmlhttp.open(method, route, true);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify(content));
}

// ----- Here be Angular ----- //
// Create module
var app = angular.module("WaterCurtain", [])

// Define controllers
function patternSaveCtrl($scope, $http) {
    // Define Click Functions
    $scope.loadPattern = function (data) {
        pattern = data;
        reload(false);
    }

    $scope.fetchPatterns = function () {
        $http.get('/patterns')
            .success(function(data){ $scope.patterns = data; })
            .error(function(data, status) { console.error("Server error retrieving patterns. Status " + status + ".")});
    }

    $scope.save = function () {
        var name = $scope.name;
        if (name === undefined || name === '') name = 'Default';
        ajax('POST', '/patterns', {name: name, pattern: pattern})
        $scope.fetchPatterns();
    }

    // Load patterns from server
    $scope.fetchPatterns();
}

// Load Controllers
app.controller("PatternSaveCtrl", ['$scope', '$http', patternSaveCtrl])
