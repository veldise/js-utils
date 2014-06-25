'use strict';
/**
 *
 */
var util = require('util');
var Readable = require('stream').Readable;
/**
*
*/
function ReadLine(source, options) {
    if (!(this instanceof ReadLine)) {
        return new ReadLine(source, options);
    }
    Readable.call(this, options);

    this._source = source;

    var _this = this;
    source.on('end', function() {
        _this.push(null);
    });
    source.on('readable', function() {
        _this.read(0);
    });

    this._rawLine = [];
    this.header = null;
}
util.inherits(ReadLine, Readable);
module.exports = ReadLine;

ReadLine.prototype._read = function(n) {
    var lineReg = /\r?\n/;

    var chunk = this._source.read();
    if (chunk === null) {
        return this.push('');
    }

    if (!lineReg.test(chunk)) {
        this._rawLine.push(chunk);
        this.push('');
    }
    else {
        var str = this._rawLine.join('') + chunk.toString();
        var lines = str.split(lineReg);
        this._rawLine = [ lines.pop() ]; // last

        for (var i=0, l=lines.length; i<l; i++) {
            this.emit('line', lines[i]);
        }
    }
};
