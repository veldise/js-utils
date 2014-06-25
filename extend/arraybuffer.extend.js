//////////////////////////////////////////////////
/**
* @file ArrayBuffer Object 를 확장한다.
* @fileOverview ArrayBuffer.prototype 에 여러 메서드를 추가하는 파일
* @author choiycdev(choiycdev@mobigen.com)
* @since 2012/12/04
*/
//////////////////////////////////////////////////

/** @namespace ArrayBuffer */

/**
*
*/
ArrayBuffer.prototype.readUInt16LE = function (offset) {
    if (!offset) {
        offset = 0;
    }
    var view = new Uint8Array(this);
    return (view[offset+1] << 8) | (view[offset+0] & 0xFF);
};
/**
*
*/
ArrayBuffer.prototype.readUInt16BE = function (offset) {
    if (!offset) {
        offset = 0;
    }
    var view = new Uint8Array(this);
    return (view[offset+0] << 8) | (view[offset+1] & 0xFF);
};
/**
*
*/
ArrayBuffer.prototype.readUInt32LE = function (offset) {
    if (!offset) {
        offset = 0;
    }
    var view = new Uint8Array(this);
    return (view[offset+3] << 24) | (view[offset+2] << 16) | (view[offset+1] << 8) | (view[offset+0] & 0xFF);
};
/**
*
*/
ArrayBuffer.prototype.readUInt32BE = function (offset) {
    if (!offset) {
        offset = 0;
    }
    var view = new Uint8Array(this);
    return (view[offset+0] << 24) | (view[offset+1] << 16) | (view[offset+2] << 8) | (view[offset+3] & 0xFF);
};

/**
*
*/
ArrayBuffer.prototype.writeUInt16LE = function (num, offset) {
    if (!offset) {
        offset = 0;
    }
    var view = new Uint8Array(this);
    view[offset+0] = num & 0xFF;   //num === 0x1234, 0x34
    view[offset+1] = num >> 8;     //num === 0x1234, 0x12
};
/**
*
*/
ArrayBuffer.prototype.writeUInt16BE = function (num, offset) {
    if (!offset) {
        offset = 0;
    }
    var view = new Uint8Array(this);
    view[offset+1] = num & 0xFF;   //num === 0x1234, 0x34
    view[offset+0] = num >> 8;     //num === 0x1234, 0x12
};
/**
*
*/
ArrayBuffer.prototype.writeUInt32LE = function (num, offset) {
    if (!offset) {
        offset = 0;
    }
    var view = new Uint8Array(this);
    view[offset+0] = num & 0xFF;   //num === 0x12345678, 0x78
    view[offset+1] = num >> 8;     //num === 0x12345678, 0x56
    view[offset+2] = num >> 16;    //num === 0x12345678, 0x34
    view[offset+3] = num >> 24;    //num === 0x12345678, 0x12
};
/**
*
*/
ArrayBuffer.prototype.writeUInt32BE = function (num, offset) {
    if (!offset) {
        offset = 0;
    }
    var view = new Uint8Array(this);
    view[offset+3] = num & 0xFF;   //num === 0x12345678, 0x78
    view[offset+2] = num >> 8;     //num === 0x12345678, 0x56
    view[offset+1] = num >> 16;    //num === 0x12345678, 0x34
    view[offset+0] = num >> 24;    //num === 0x12345678, 0x12
};
/**
*
*/
ArrayBuffer.prototype.writeByte = function (str, offset) {
    if (!offset) {
        offset = 0;
    }
    var view = new Uint8Array(this);
    for (var i=0, l=str.length; i<l; i++) {
        view[offset+i] = str.charCodeAt(i);
    }
};
/**
*
*/
ArrayBuffer.prototype.toString = function () {
    return String.fromCharCode.apply(null, new Uint8Array(this));
};
/**
*   @static
*/
ArrayBuffer.join = function (arr) {
    var len = 0;
    var aBytes = [];

    for (var i=0, l=arr.length; i<l; i++) {
        var bytes = new Uint8Array(arr[i]);

        len += bytes.length;
        aBytes.push(bytes);
    }

    var sum = new Uint8Array(len);

    var written = 0;
    for (var i=0, l=aBytes.length; i<l; i++) {
        sum.set(aBytes[i], written);

        written += aBytes[i].length;
    }

    return sum.buffer;
};

// Internet Explorer 10 and iOS < 6 do not have this method.
// https://github.com/ttaubert/node-arraybuffer-slice/blob/master/index.js
if (!ArrayBuffer.prototype.slice) {
  ArrayBuffer.prototype.slice = function (begin, end) {
    begin = (begin|0) || 0;
    var num = this.byteLength;
    end = end === (void 0) ? num : (end|0);

    // Handle negative values.
    if (begin < 0) begin += num;
    if (end < 0) end += num;

    if (num === 0 || begin >= num || begin >= end) {
      return new ArrayBuffer(0);
    }

    var length = Math.min(num - begin, end - begin);
    var target = new ArrayBuffer(length);
    var targetArray = new Uint8Array(target);
    targetArray.set(new Uint8Array(this, begin, length));
    return target;
  };
}
