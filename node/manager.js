'use strict';

//////////////////////////////////////////////////
/**
*   @file Manager 및 sub class 를 정의하는 파일
*   @fileOverview Manager
*   @author choiycdev(choiycdev@mobigen.com)
*   @since 2013/04/09
*/
//////////////////////////////////////////////////

var util = require('util'),
    _ = require('underscore');

var EventEmitter = require('events').EventEmitter;
/**
*   같은 형태의 자료구조 혹은 객체를 관리하는 클래스
*   @class 객체 관리 클래스
*   @constructor
*   @requires module:util
*   @requires module:underscore
*   @requires ../lib/array.extend
*   @augments EventEmitter
*/
function Manager () {
    EventEmitter.call(this);

    this.dataset = {};
}
util.inherits(Manager, EventEmitter);
module.exports = Manager;
/**
*   instance를 Manager에 등록한다. id값이 없으면 임의값으로 생성한다.
*   @param {instance} instance Manager에 등록할 어떠한 instance.
*/
Manager.prototype.register = function (instance) {
    if (!instance.id) {
        instance.id = _makeId();
    }

    var id = instance.id;

    // uniq option
    if (this.get(id)) {
        // throw?
        // console.error('Manager.register(): same id is exists(' + id + ').');
        return false;
    }

    this.dataset[id] = instance;
    return true;
};
/**
*   id값으로 Manager에 등록된 instance를 반환는다.
*   @param {string} id 찾으려는 instance의 id값
*   @return {instance} id값을 통해 찾은 instance. 찾지 못하면 null이 반환될 것이다.
*/
Manager.prototype.get = function (id) {
    return this.dataset[id];
};
/**
*    저장중인 모든 instance를 Array로 반환한다.
*    @return {array} manager가 보유중인 instance를 배열
*/
Manager.prototype.getAll = function () {
    return _.values(this.dataset);
};
/**
*    저장중인 instance의 id 목록을 반환한다.
*    @return {array} manager가 보유중인 id 배열
*/
Manager.prototype.getIDList = function () {
    return _.keys(this.dataset);
};
/**
*   instance를 Manager에서 삭제한다. 이후 delete 이벤트를 발생시킨다.
*   @param {string|instance} target 삭제하려는 instance의 id값 혹은 instance
*/
Manager.prototype.delete = function (target) {
    var id, instance;
    // id
    if ( _.isString(target) ) {
        id = target;
        instance = this.dataset[id];
    }
    // instance
    else {
        id = target.id;
        instance = target;
    }

    delete this.dataset[id];

    this.emit('delete', instance, id);
};
/**
*   모든 instance를 Manager에서 삭제한다.
*   @param {boolean} slient delete 이벤트 발생여부.
true 값으로 지정하면 이벤트를 발생시키지 않는다.
*/
Manager.prototype.deleteAll = function (slient) {
    if (slient) {
        delete this.dataset;

        this.dataset = {};
    }
    else {
        var self = this;

        this.each(function (instance) {
            self.delete(instance);
        });
    }
};
/**
*   모든 instance를 Manager에서 삭제한다.
*/
Manager.prototype.destroy = function () {
    this.deleteAll();
};
/**
*   모든 instance에 대해 수행할 작업을 지정한다.
*   @param {function} callback 수행할 작업 함수.
*/
Manager.prototype.each = function (callback) {
    _.each(this.dataset, callback);
};
/**
*   모든 instance에 대해 수행할 작업을 지정하고 새로운 collection을 만든다. 이는 underscore의 map()과 같다.
*   @param {function} callback 수행할 작업 함수.
*   @return {array} callback 함수 내부에서 return 된 값들로 이루어진 배열.
*/
Manager.prototype.map = function (callback) {
    return _.map(this.dataset, callback);
};
/**
*
*/
Manager.prototype.find = function (iterator) {
    return _.find(this.dataset, iterator);
};
/**
*
*/
Manager.prototype.select = function (iterator) {
    return _.select(this.dataset, iterator);
};
/**
*
*/
Manager.prototype.where = function (properties) {
    return _.where(this.dataset, properties);
};
/**
*
*/
Manager.prototype.findWhere = function (properties) {
    return _.findWhere(this.dataset, properties);
};
/**
*   현재 시간값으로 임의의 id를 생성한다.
*   @private
*   @return {string} 시간값, 랜덤, 16진수 변환을 이용한 문자열.
*/
function _makeId () {
    return (Math.round( (new Date()).valueOf() * Math.random() )).toString(16);
}
