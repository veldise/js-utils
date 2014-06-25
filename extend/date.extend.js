//////////////////////////////////////////////////
/**
* @file Date Object 를 확장한다.
* @fileOverview Date.prototype 에 여러 메서드를 추가하는 파일
* @author choiycdev(choiycdev@mobigen.com)
* @since 2012/12/13
*/
//////////////////////////////////////////////////

/** @namespace Date */

/**
*   지정한 날짜만큼 이동한다.
*   @param {number} date 이동할 날짜값(day of month). 음수도 가능.
*   @return {Date} 이동이 끝난 Date instance
*/
Date.prototype.moveDate = function(date) {
  this.setDate( this.getDate() + date );

  return this;
};
/**
*   지정한 week 값만큼 이동한다. (1 week === 7 day of month)
*   @param {number} week 이동할 week값. 음수도 가능.
*   @return {Date} 이동이 끝난 Date instance
*/
Date.prototype.moveWeek = function(week) {
  this.setDate( this.getDate() + week*7 );

  return this;
};
/**
*   지정한 달만큼 이동한다.
*   @param {number} month 이동할 month값. 음수도 가능.
*   @return {Date} 이동이 끝난 Date instance
*/
Date.prototype.moveMonth = function(month) {
  this.setMonth( this.getMonth() + month );

  return this;
};
/**
*   지정한 년도만큼 이동한다.
*   @param {number} year 이동할 year값. 음수도 가능.
*   @return {Date} 이동이 끝난 Date instance
*/
Date.prototype.moveYear = function(year) {
  this.setYear( this.getYear() + year );

  return this;
};
