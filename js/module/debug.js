const DEBUG = true;
export default function notify(str, typestr) {
    var typeColors = {
        "draw": {
            "c": "#fff",
            "b": "#00dc72"
        },
        "request": {
            "c": "#fff",
            "b": "#8300dc"
        },
        "function": {
            "c": "#fff",
            "b": "#b1034b"
        },
        "system": {
            "c": "#fff",
            "b": "#496df0"
        }
    };
    if (DEBUG == true) {
        if (typeColors[typestr] != undefined) {
            console.log('%c ' + typestr + " %c  " + str, 'background:' + typeColors[typestr]["b"] + '; color:' + typeColors[typestr]["c"] + ";", "");
        }
        else {
            console.log(str);
        }
    }
}
