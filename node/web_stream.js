'use strict';
/**
*   module dependencies
*/
var util = require('util');

var WebSocketClient = require('websocket').client;
// var WebSocketFrame = require('websocket').frame;

var Duplex = require('stream').Duplex;
/**
*   Class
*/
function WebStream(wsAddress) {
    if (!(this instanceof WebStream)) {
        return new WebStream();
    }
    Duplex.call(this);

    var self = this;
    var wsClient = new WebSocketClient();
    // var frame = new WebFrame();
    // console.log(new WebFrame());
    // console.log(_.keys(wsClient.));
    this.connected = true;

    wsClient.connect(wsAddress);
    wsClient
        .on('connect', function(conn) {
            self._source = conn;
            self._source.__proto__.write = conn.__proto__.send;
            self._source.__proto__.end = conn.__proto__.close;

            conn
                .on('error', function(error) {
                    this.emit('error', error);
                })
                .on('message', function(msg) {
                    if (!msg) {
                        this.emit('close');
                    }
                    var data = {
                        'utf8': msg.utf8Data,
                        'binary': msg.binaryData
                    }[msg.type];
                    self.push(data);
                })
                .on('close', function() {
                    // ...
                });
        })
        .on('connectFailed', function(error) {
            this.emit('error', error);
        });
}
util.inherits(WebStream, Duplex);
module.exports = WebStream;
/**
*   @private
*/
WebStream.prototype._write = function(chunk, encoding, callback) {
    if (this._source) {
        this._source.write(chunk, encoding);
        callback();
    }
};
/**
*   @private
*/
WebStream.prototype._read = function() {
    // ...
};
/**
*
*/
WebStream.prototype.close = function() {
    if (this.connected) {
        this.connected = false;
        this.push(null);
        this._source.close();
    }
};
