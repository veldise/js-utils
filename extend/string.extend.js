//////////////////////////////////////////////////
/**
* String Object 를 확장한다.
* @fileOverview String.prototype 에 여러 메서드를 추가하는 파일
* @author choiycdev(choiycdev@mobigen.com)
* @since 2012/12/04
*/
//////////////////////////////////////////////////

/** @namespace String */

/**
* split() 메서드의 확장판
* @param {string|regExp} delimiter split에 사용할 문자|문자열|정규식
* @param {number} number split할 횟수
* @returns {array} 지정된 delimiter로 split 한 뒤, 남은 string을 끝에 덧붙인 결과
* @example var list = ('abcde;12345;xx;yyy').splitEx(';', 2); // ['abcde', '12345', 'xx;yyy']
*/
String.prototype.splitEx = function(delimiter, num) {
  var list = this.split(delimiter)
    , af_str = list.slice(num).join(delimiter);

  list = list.slice(0, num);
  list.push(af_str);
  return list;
}
/**
* split() 메서드의 확장판2
* @param {string|regExp} delimiter split에 사용할 문자|문자열|정규식
* @param {number} number split할 횟수
* @returns {array} 지정된 delimiter로 split 할때 delimiter도 포함한 결과
* @example var list = ('abcde;12345;xx;yyy').splitPlus(';', 2); // ['abcde;', '12345']
*/
String.prototype.splitPlus = function(delimiter, num) {
  var list = this.split(delimiter, num);
  for (var i=0, l=list.length-1; i<l; i++) {
    list[i] += delimiter;
  }
  return list;
}
/**
* 입력한 두 개 문자 사이의 문자열을 얻습니다.
* @param {char} front
* @param {char} rear
* @returns {string} front와 rear 문자 사이의 문자열 (front, rear 포함)
* @example var str = ('abc(de;12345;xx;x)x').sliceCharWithout('(', ')'); // '(de;12345;xx;x)'
*/
String.prototype.sliceChar = function(front, rear) {
  var nFront = this.indexOf(front)
    , nRear = this.lastIndexOf(rear);

  if (nFront === -1 || nRear === -1) {
    return this.toString();
  }

  return this.slice(nFront, nRear+1);
}
/**
* 입력한 두 개 문자 사이의 문자열을 얻습니다. (입력 문자는 제외)
* @param {char} front
* @param {char} rear
* @returns {string} front와 rear 문자 사이의 문자열
* @example var str = ('abc(de;12345;xx;x)x').sliceCharWithout('(', ')'); // 'de;12345;xx;x'
*/
String.prototype.sliceCharWithout = function(front, rear) {
  var nFront = this.indexOf(front)
    , nRear = this.lastIndexOf(rear);

  if (nFront === -1 || nRear === -1) {
    return this.toString();
  }

  return this.slice(nFront+1, nRear);
}
/**
* indexOf를 n번 수행합니다.
* @param {char} ch
* @param {number} num
* @returns {number} ch 가 num 번째 위치하는 index 값
* @example var rst = ('abc(de;12345;xx;x)x').findIndex('x', 2); // 14
*/
String.prototype.findIndex = function(ch, num) {
  if (num === undefined || num === 0) {
    return this.indexOf(ch);
  }

  var arr = this.split('')
    , indexes = [];

  for (var i=0, l=arr.length; i<l; i++) {
    if (ch === arr[i]) {
      indexes.push(i);
    }
  }
  return indexes[num] || -1;
};
/**
* 첫번째 문자를 반환합니다.
* @returns {char} 첫번째 문자
* @example var rst = ('abcdef').first(); // 'a'
*/
String.prototype.first = function() {
  return this[0];
};
/**
* 마지막 문자를 반환합니다.
* @returns {char} 마지막 문자
* @example var rst = ('abcdef').last(); // 'f'
*/
String.prototype.last = function() {
  return this[this.length-1];
};
/**
* 가장 첫번째 문자를 toUpperCase() 합니다.
* @returns {string} 첫번째 문자만 toUpperCase() 한 결과
* @example var rst = ('example').capitalize(); // 'Example'
*/
String.prototype.capitalize = function() {
    return this.replace(/\b([a-z])/g, function($1){
        return $1.toUpperCase();
    });
};
/**
* 숫자로 이루어진 문자열을 특정 시간 포맷으로 반환합니다.
* @returns {string} 시간 포맷으로 변환된 문자열
* @example var rst = ('20121102052722').timeFormat(); // '2012/11/02 05:27:22'
*/
String.prototype.timeFormat = function () {
  var re = /(.{4})(.{2})(.{2})(.{2})(.{2})(.{2})/;
  return this.toString().replace(re, '$1/$2/$3 $4:$5:$6');
};
/**
* 해당 문자 혹은 문자열이 존재하는지를 판정합니다.
* @param {string} str 존재하는지 판정할 문자 혹은 문자열
* @returns {boolean} 문자 혹은 문자열 존재 여부
* @example var rst = ('template').exists('pd'); // false
*/
String.prototype.exists = function(str) {
  return (this.indexOf(str) >= 0);
};

/**
* 해당 문자열을 boolean값으로 변환한다.
* @returns {boolean} 문자열이 'true' or '1' 이면 true, 그 외에는 false
* @example var rst = ('true').toBoolean(); // true
*/
String.prototype.toBoolean = function() {
  return (/^(true|1)$/i).test(this);
};

// IE trim Error
String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g,"");
}
String.prototype.ltrim = function() {
    return this.replace(/^\s+/,"");
}
String.prototype.rtrim = function() {
    return this.replace(/\s+$/,"");
}
