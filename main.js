//CONFIG
ROWS = 20;
COLS = 60;
pattern = [];

function reload() {
    var pattern_control = document.querySelector("#pattern-control");
    pattern_control.innerHTML = "";

    for (var r = 0; r < ROWS; r++) (function(r) {
        pattern[r] = [];
        var row_elem = document.createElement('div');
        row_elem.className = 'pattern-row';
        pattern_control.appendChild(row_elem);

        for (var c = 0; c < COLS; c++) (function(c) {
            pattern[r][c] = false;

            var col_elem = document.createElement('div');
            col_elem.className = 'pattern-box';
            col_elem.onclick = function (event) { updatePattern(event, r, c) };
            col_elem.setAttribute('data-set', false);
            row_elem.appendChild(col_elem);
        })(c);
    })(r);
}

function updatePattern(event, row, col) {
    pattern[row][col] = !Boolean(pattern[row][col]);
    event.target.setAttribute("data-set", Boolean(pattern[row][col]));
}

function sendPattern() {
    var xmlhttp;

    // IE7+, Firefox, Chrome, Opera, Safari
    if (window.XMLHttpRequest) xmlhttp=new XMLHttpRequest();

    // IE6, IE5
    else xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");

    xmlhttp.open("POST", '/', true);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify(pattern));
}
