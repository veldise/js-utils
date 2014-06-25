'use strict';

var alarm = {
	every: function (time, callback) {
		var nearTimer = function () {
			callback();

			this._timer = setInterval(callback, 24*60*60*1000); // 1 day
		};

		this._timer = setTimeout(nearTimer, this._calcDiffTime(time));
	},

	at: function (time, callback) {
		this._timer = setTimeout(callback, this._calcDiffTime(time));
	},

	_timer: null,

	_calcDiffTime: function (str) {
		var sp = str.split(':');
		var hour = sp[0],
			minute = sp[1];

		var now = new Date();
		var dTime = new Date();

		dTime.setHours(hour);
		dTime.setMinutes(minute);
		dTime.setSeconds(0);
		dTime.setMilliseconds(0);

		var diff = (+dTime) - (+now);

		if (diff <= 0) {
			diff += 86400000;
		}

		return diff;
	}
};

module.exports = alarm;
