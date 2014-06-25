'use strict';

/**
*    timeout class
*/
function MTimeout () {
    this._nTime = 0;
    this._fnHandler = null;

    this._currTimer = null;
}
module.exports = MTimeout;

MTimeout.prototype.setTime = function (ms) {
    this._nTime = ms || this._nTime;
};

MTimeout.prototype.setHandler = function (handler) {
    this._fnHandler = handler || this._fnHandler;
};

MTimeout.prototype.start = function () {
    if (!this._currTimer && this._nTime && this._fnHandler) {
        this._currTimer = setTimeout(this._fnHandler, this._nTime);

        return true;
    }
    return false;
};

MTimeout.prototype.stop = function () {
    if (this._currTimer) {
        clearTimeout(this._currTimer);
        this._currTimer = null;

        return true;
    }
    return false;
};

MTimeout.prototype.reset = function () {
    if (this.stop()) {
        return this.start();
    }
};
