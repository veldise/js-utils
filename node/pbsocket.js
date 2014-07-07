'use strict';

var util = require('util'),
    _ = require('underscore'),
    EventEmitter = require('events').EventEmitter;

var LENGTH_BYTE = 4,
    MAX_BYTE_LENGTH = 0xFFFFF,
    endian = 'LE',
    writeMethodName = 'writeUInt' + (LENGTH_BYTE*8) + endian,
    readMethodName = 'readUInt' + (LENGTH_BYTE*8) + endian;

function PBSocket (source, serializer, parser, options) {
    if (!(this instanceof PBSocket)) {
        return new PBSocket(options);
    }

    EventEmitter.call(this, options);

    this._source = source;
    this._parser = parser;
    this._serializer = serializer;

    this._len = 0;
    this._queue = [];

    this.connected = false;

    this.connect = source.connect.bind(source);
    this.write = source.write.bind(source);
    this.end = source.end.bind(source);
    this.destroy = source.destroy.bind(source);
    this.pause = source.pause.bind(source);
    this.resume = source.resume.bind(source);
    this.setTimeout = source.setTimeout.bind(source);
    this.setNoDelay = source.setNoDelay.bind(source);
    this.setKeepAlive = source.setKeepAlive.bind(source);
    this.address = source.address.bind(source);
    this.unref = source.unref.bind(source);
    this.ref = source.ref.bind(source);

    source
        .on('end', this.emit.bind(this, 'end'))
        .on('timeout', this.emit.bind(this, 'timeout'))
        .on('drain', this.emit.bind(this, 'drain'))
        .on('error', this.emit.bind(this, 'error'));
    source
        .on('readable', this._recv.bind(this))
        .on('connect', this._connHandler.bind(this))
        .on('close', this._disconnHandler.bind(this));

    this.bufferSize = source.bufferSize;
    this.remoteAddress = source.remoteAddress;
    this.remotePort = source.remotePort;
    this.localAddress = source.localAddress;
    this.localPort = source.localPort;
    // source.bytesRead
    // source.bytesWritten
}
util.inherits(PBSocket, EventEmitter);
module.exports = PBSocket;

PBSocket.prototype._connHandler = function () {
    this.connected = true;

    // run task
    if (this._queue.length) {
        this.write(this._queue[0].buf);
    }

    this.emit('connect');
};

PBSocket.prototype._disconnHandler = function () {
    this.connected = false;

    _.each(this._queue, function (task) {
        task.delegate('socket is closed.'); // error callback
    });
    this._queue = [];

    this.emit('close');
};

PBSocket.prototype._recv = function () {
    var source = this._source;

    if (!this._len) {
        var lenBuf = source.read(LENGTH_BYTE);

        if (lenBuf) {
            var len = lenBuf[readMethodName](0);

            if (len > 0) {
                this._len = len;
            }
        }
    }

    if (this._len) {
        var rawBuf = source.read(this._len);

        if (rawBuf) {
            this._len = 0;
            this._parse(rawBuf);

            process.nextTick(this._recv.bind(this));
        }
    }
};

PBSocket.prototype._parse = function (chunk) {
    var packet, err, delegate;
    try {
        packet = this._parser.parse(chunk);
    }
    catch (e) {
        err = e;
    }

    // check callback
    if (this._queue.length) {
        delegate = this._queue[0].delegate;
    }

    // check packet
    if (!packet) {
        err = err || 'parse failed.';
    }

    if (err) {
        if (delegate) {
            delegate(err);
        }
        else if (this.listeners('parse_error').length) {
            this.emit('parse_error', err);
        }
        else {
            this.emit('error', err);
        }
        return;
    }

    if (!packet.type) {
        this.emit('packet', packet);
        return;
    }

    if (delegate) {
        delegate(null, packet);

        this._dequeue();
    }
    else {
        this.emit('packet', packet);
    }
};

PBSocket.prototype.send = function (packet, delegate, callback) {
    var buf, err;
    try {
        var pBuf = this._serializer.serialize(packet);
        var dataLen = pBuf.length;

        if (dataLen > MAX_BYTE_LENGTH) {
            var strMaxLen = '0x' + MAX_BYTE_LENGTH.toString(16).toUpperCase();
            throw new Error('data is too big(' + dataLen + ') > ' + strMaxLen);
        }

        var lenBuf = new Buffer(LENGTH_BYTE);
        lenBuf[writeMethodName](dataLen, 0);

        buf = Buffer.concat([ lenBuf, pBuf ], LENGTH_BYTE + dataLen);
    }
    catch (e) {
        err = e;
    }

    if (!buf || !buf.length) {
        err = err || ('serialize fail: ' + JSON.stringify(packet));
    }

    if (err) {
        if (callback) {
            callback(err);
        }
        else if (this.listeners('serialize_error').length) {
            this.emit('serialize_error', err);
        }
        else {
            this.emit('error', err);
        }
        return;
    }

    if (delegate) {
        this._enqueue(buf, delegate);
    }
    else {
        this.write(buf);
    }

    if (callback) {
        callback();
    }
};
/**
*   queue에 전송할 메세지와 메세지를 받은 후 실행할 callback을 추가한다.
*   @param {string|Buffer} buf 전송할 메세지
*   @param {function} delegate 데이터를 받았을 때 수행할 작업. 주로 수신받을 데이터를 처리하는 함수를 지정.
*/
PBSocket.prototype._enqueue = function (buf, delegate) {
    this._queue.push({ buf: buf, delegate: delegate });
    if (this._queue.length === 1) {
        this.write(this._queue[0].buf);
    }
};
/**
*   queue에서 작업을 하나 제거하고 다음 작업을 수행한다.
*/
PBSocket.prototype._dequeue = function () {
    this._queue.shift();
    if (this._queue.length) {
        this.write(this._queue[0].buf);
    }
};
