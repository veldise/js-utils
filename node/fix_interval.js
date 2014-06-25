'use strict';

var oTimers = {};
/*
*   @usage
setFixInterval(function (done) {
    done(); // next work
}, 1000);
*/
var setFixInterval = function (fn, diff, interval, id) {
    if (interval === undefined) {
        interval = diff;
    }
    var id = id || _makeId();

    oTimers[id] = setTimeout(function () {
        var start = new Date().getTime();

        fn(function () {
            // console.log(id);
            if (oTimers[id]) {
                var diff = interval - (new Date().getTime() - start);
                diff = (diff < 0) ? 0 : diff;

                setFixInterval(fn, diff, interval, id);
            }
        });
    }, diff);

    return id;
};

var clearFixInterval = function (id) {
    // console.log(id);
    clearTimeout(oTimers[id]);
    delete oTimers[id];
};

/**
*   현재 시간값으로 임의의 id를 생성한다.
*   @private
*   @return {string} 시간값, 랜덤, 16진수 변환을 이용한 문자열.
*/
function _makeId () {
    var id;
    do {
        id = (Math.round((new Date()).valueOf() * Math.random())).toString(16);
    } while (oTimers[id]);
    return id;
}

////////////////////////////// exports //////////////////////////////

exports.setFixInterval = setFixInterval;
// exports.runFixInterval = runFixInterval;
exports.clearFixInterval = clearFixInterval;
