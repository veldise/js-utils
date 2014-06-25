//////////////////////////////////////////////////
/**
* @file Array Object 를 확장한다.
* @fileOverview Array.prototype 에 여러 메서드를 추가하는 파일
* @author choiycdev(choiycdev@mobigen.com)
* @since 2012/12/04
*/
//////////////////////////////////////////////////

/** @namespace Array */

/**
* Array 에 담긴 String을 모두 trim() 한다.
* @returns {array} Array의 원소들을 각각 trim()한 결과
* @example var list = (['\tabcde', '\r12345 \n']).trim(); // ['abcde', '12345']
*/
Array.prototype.trim = function() {
  for (var i=0, l=this.length; i<l; i++) {
    var item = this[i];
    this[i] = (item.trim) ? item.trim() : item;
  }
  return this;
};
/**
* Array 에 담긴 String을 모두 split() 한다.
* @returns {array} Array의 원소들을 각각 split()한 결과
* @example var list = (['abc;de', '12345; ']).split(';'); // [ ['abc', 'de'], ['12345', ' '] ]
*/
Array.prototype.split = function(ch, num) {
  for (var i=0, l=this.length; i<l; i++) {
    var item = this[i];
    this[i] = (item.split) ? item.split(ch, num) : item;
  }
  return this;
};
/**
* 첫번째 원소를 반환합니다.
* @returns {unknown} 첫번째 원소
* @example var el = ([ 3, 'b', 'cdef']).first(); // 3
*/
Array.prototype.first = function() {
  return this[0];
};
/**
* 마지막 원소를 반환합니다.
* @returns {unknown} 마지막 원소
* @example var el = ([ 3, 'b', 'cdef']).first(); // 'cdef'
*/
Array.prototype.last = function() {
  return this[this.length-1];
};
/**
* 해당 위치의 원소를 삭제합니다.
* @param {number} index 삭제할 원소의 index 값
* @example var list = ([ 3, 'b', 'cdef']).remove(1); // [ 3, 'cdef']
*/
Array.prototype.remove = function(index) {
  this.splice(index, 1);

  return this;
};
/**
* 2차원 배열일때, row에 해당하는 배열을 slice 한다.
* @param {number} index 삭제할 원소의 index 값
* @example var list = ([ [ 3, 'b' ], [ 4, 'a' ], [ 1, 'e' ] ]).innerSlice(1); // [ [ 'b' ], [ 'a' ], [ 'e' ] ]
*/
Array.prototype.innerSlice = function (i, j) {
  for (var i=0, l=this.length; i<l; i++) {
    this[i] = this[i].slice(i, j);
  }
  return this;
};
/**
* sort() 함수를 숫자 정렬을 가능하게 변경
* @param {boolean} isNumber 배열의 원소들이 숫자인지 아닌지 여부
* @return {Array} 정렬된 Array instance
*/
Array.prototype.sortEx = function( isNumber ) {
  if ( !isNumber ) { return this.sort(); }

  // asc sorting
  return this.sort(function (left, right) {
    var l = left*1
      , r = right*1;
    if (l < r) return -1;
    if (l > r) return 1;
    return 0;
  });
};

Array.prototype.selection = function( aIndex ) {
  var arr = [];
  for (var i=0, l=aIndex.length; i<l; i++) {
    var idx = aIndex[i];
    arr.push( this[idx] );
  }
  return arr;
};
