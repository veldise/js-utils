JavaScript coding convention
============================
JavaScript의 코딩 스타일 및 작성 규칙에 대해 기술하는 문서입니다.  
언어 특성상 반드시 지켜야할 항목과 단순히 코딩 스타일을 권장하는 항목이 섞여있습니다.  
또한, Node.js와 Browser-side 마다 예외가 발생할 수 있습니다.  

이 문서는 [Felixge - Node.js Style Guide](https://github.com/felixge/node-style-guide)를 기준으로 작성되었습니다.  
최종 수정일: 2015-02-25  

## Table of contents
(★): 반드시 준수해야 할 규칙, (☆): 경우에 따라 예외를 허용, (　): 권장하는 규칙

* **[Readability](#readability)**
  * [4 Spaces for indention](#4-spaces-for-indention) ★
  * [Last comma](#last-comma) ★
  * [Use single quotes](#use-single-quotes) ☆
  * [File encoding](#file-encoding) ★
  * [Newlines](#newlines) ★
  * [No trailing whitespace](#no-trailing-whitespace) ★
  * [80 characters per line](#80-characters-per-line) ☆
  * [Use lowerCamelCase for variables, properties and function names](#use-lowercamelcase-for-variables,-properties-and-function-names) ★
  * [Use UpperCamelCase for class names](#use-uppercamelcase-for-class-names) ★
  * [Use UPPER_CASE for Constants](#use-upper_case-for-constants) ★
  * [Build the function name](#build-the-function-name) ★
  * [Build the event name](#build-the-event-name)
  * [Opening braces go on the same line](#opening-braces-go-on-the-same-line) ★
  * [if and for statement do not write a single line](#if-and-for-statement-do-not-write-a-single-line) ★
  * [Declaring associative variables](#Declaring-associative-variables) ☆
  * [Fall through case in switch statement](#fall-through-case-in-switch-statement)
  * [Object / Array creation](#object-/-array-creation) ☆
  * [Use multi-line ternary operator](#use-multi-line-ternary-operator) ☆
  * [Use descriptive conditions](#use-descriptive-conditions)
  * [Method chaining](#method-chaining)
  * [Sort require statement](#sort-require-statement)
  * [Comment front whitespace](#comment-front-whitespace)
  * [Write small functions](#write-small-functions)
  * [indention for HTML string](#indention-for-html-string) ☆
  * [Class declaration](#class-declaration) ☆
* **[Prevent bug](#prevent-bug)**
  * [Use Semicolons](#use-semicolons) ★
  * [Use the === operator](#use-the-===-operator) ★
  * [Do not extend built-in prototypes](#do-not-extend-built-in-prototypes) ★
  * [Use strict mode](#use-strict-mode) ★
  * [Object.freeze, Object.preventExtensions, Object.seal, with, eval](#object.freeze,-object.preventextensions,-object.seal,-with,-eval) ★
  * [Use hasOwnProperty method](#use-hasownproperty-method) ★
  * [Do not declare function in block scope](#do-not-declare-function-in-block-scope) ★
  * [Don't use 'arguments' as argument name](#don't-use-'arguments'-as-argument-name) ★
* **[Performance](#performance)**
  * [Initalize variables](#initalize-variables)
  * [Use for, cache array length](#use-for,-cache-array-length)
  * [switch vs object dict](#switch-vs-object-dict)
  * [String plus oper vs Array join](#string-plus-oper-vs-array-join)
* **[ETC](#etc)**
  * [Comment annotation](#comment-annotation)
* **[Supplement](#supplement)**
  * [JSHint Linting Preferences](#jshint-linting-preferences)

## Readability
### 4 Spaces for indention
indent(들여쓰기)는 반드시 **4 spaces**(4칸 띄어쓰기)로 합니다.

### Last comma
콤마(```,```) 문자는 뒤에 작성하는 것을 원칙으로 합니다.  

그리고 말미의 불필요한 쉼표는 작성하지 않습니다.  
구버전의 IE에서 문제를 일으키거나, ES3의 일부에서 배열 길이가 달라질 수 있습니다.  

(참고: [Airbnb JavaScript 스타일 가이드 - Commas(번역)](https://github.com/tipjs/javascript-style-guide#commas-%EC%9B%90%EB%AC%B8))

Right:
```js
var foo = 1,
    bar = 2,
    baz = 3;

var obj = {
    good: 'code',
    'is generally': 'pretty'
};

var arr = ['one', 'two', 'three'];
```
Wrong:
```js
var foo = 1
  , bar = 2
  , baz = 3;

var obj = {
    good: 'code'
  , 'is generally': 'pretty'
};

var arr = [
    'one',
    'two',
    'three',
];
```

### Use single quotes
쌍따옴표(```"```)를 쓰지 말고 홑따옴표(```'```)를 사용합니다. (HTML은 쌍따옴표)

Right:
```js
var foo = 'bar';
var anchor = '<a href="/' + foo + '.html">' + foo + '</a>'; // correct
```
Wrong:
```js
var foo = "bar";
var anchor = "<a href=\"/" + foo + ".html\">" + foo + "</a>"; // incorrect
```

### File encoding
소스 코드 파일(.js)의 인코딩은 **UTF-8**으로 통일합니다.

### Newlines
반드시 **UNIX-style**의 newlines (```\n```)를 사용합니다.  
Browser-side는 크게 문제가 되지 않지만, Node.js에서는 문제가 될 수 있습니다.  
※ Windows 등에서 에디터를 사용할 경우, 해당 옵션을 설정하도록 합니다.  

### No trailing whitespace
코드 한 줄의 끝에 불필요한 공백이 들어가지 않도록 합니다.  
이는 불필요한 diff 발생을 막기 위함입니다.  

### 80 characters per line
한 줄에 들어가는 글자는 80자를 넘지 않도록 합니다.  
이는 terminal에서 코드를 읽을 때 가독성을 해치기 때문입니다.  

단, 다른 조건을 위배하면서(가독성을 더 떨어트리면서)까지 지킬 필요는 없습니다.  


### Use lowerCamelCase for variables, properties and function names
변수와 프로퍼티, 함수는 lowerCamelCase를 사용합니다.  

※ 예외로, private 표시를 위해 첫 글자에 underscore(```_```)문자를 넣는 것은 허용합니다.  

### Use UpperCamelCase for class names
클래스명은 UpperCamelCase를 사용합니다.

```js
ConstructorNamesLikeThis;
```

### Use UPPER_CASE for Constants
상수는 대문자와 underscore(```_```)의 조합으로만 선언합니다.  
```const```는 ECMA 표준이 아니므로 사용하지 않도록 합니다.  

```js
SYMBOLIC_CONSTANTS_LIKE_THIS;
```

### Build the function name
함수명의 첫단어는 반드시 동사를 사용합니다.  
함수 하나에는 하나의 기능만 명시합니다.  

Right:
```js
function loadData () {
    // body...
}
function doSomethings () {
    // body...
}
```
Wrong:
```js
function dataLoad () {
    // body...
}
function doThisAndDoSomething () {
    // body...
}
```

### Build the event name
이벤트명은 가능한 간결하게 작성합니다.  
기본적으로 string이므로 ```-```, ```_``` 문자 사용을 지양하고 공백을 활용합니다.  

커스텀 이벤트는 다양한 용도로 사용될 수 있기 때문에 작성은 자유지만,  
용도에 맞추어 다음과 같이 작성하는 것을 권장합니다.  

**1) 상태의 변경을 알릴 때**  
첫 단어를 변경과 관련된 단어의 과거형으로 작성합니다.  

```js
events.emit('changed continer status', statusCode);
```

**2) 동작을 지시할 때**  
첫 단어를 해당 동작과 관련된 단어로 작성합니다.  

```js
events.emit('reload pages');
```

**3) 데이터를 전달하고자 할 때**  
해당 변수명을 그대로 사용하거나,  
데이터를 표현하는 단어 조합을 lowerCamalCase로 작성합니다.  

```js
events.emit('requestCounts', reqCounts);
```


### Opening braces go on the same line
여는 중괄호(```{}```)는 기존 구문과 같은 줄에서 열도록 합니다.

Right:
```js
if (true) {
    console.log('winning');
}
```
Wrong 1:
```js
if (true)
{
    console.log('winning');
}
```

### if and for statement do not write a single line
조건문과 반복문은 한 줄로 작성하지 않도록 합니다.  
또한, 중괄호(```{}```)를 생략 가능하더라도 생략하지 않습니다.  

Right:
```js
if (condition) {
    doSomething();
}

while (condition) {
    iterating++;
}

for (var i = 0; i < 100; i++) {
    someIterativeFn();
}
```
Wrong:
```js
if (condition) doSomething();

while (condition) iterating++;

for (var i = 0; i < 100; i++) someIterativeFn();
```

### Declaring associative variables
연관성이 있는 변수들은 ```var``` 하나로 같이 선언합니다.

Right:
```js
var options = this.options,
    slider = this.slider,
    elm = this.elm;

var tick = elm.find('.tick'),
    tickCount = options.tick.count,
    tickHeight = 10,
    tickWidth = 2;

var sliderWidth = slider.width(),
    sliderHeight = slider.height(),
    sliderPosition = slider.position(),
    sliderMargin = {
        left: parseInt(slider.css('margin-left')),
        top: parseInt(slider.css('margin-top'))
    };
```
Wrong:
```js
var options = this.options;
var slider = this.slider;
var elm = this.elm;

var tick = elm.find('.tick');
var tickCount = options.tick.count;
var sliderWidth = slider.width();
var sliderHeight = slider.height();
var sliderPosition = slider.position();
var sliderMargin = {};
sliderMargin.left = parseInt(slider.css('margin-left'));
sliderMargin.top = parseInt(slider.css('margin-top'));
var tickHeight = 10;
var tickWidth = 2;
```

### Fall through case in switch statement
```switch``` 구문을 사용할 때 ```break```를 생략한다면,  
주석으로 fall through를 명시하도록 합니다.  

```js
switch (otype) {
    case 'system':
        data = dataset[otype];
        break;
    case 'proc':
        // fall through
    case 'dir':
        var target = packet.target;
        data = dataset[otype][target];
        break;
}
```

### Object / Array creation
객체와 배열 생성문은 가능한 짧게 작성합니다.  
객체 선언시 키 이름은 인터프리터가 에러를 뱉어낼 때만 따옴표를 사용합니다.  
(공백 혹은 dash(```-```) 문자 포함 시)  

Right:
```js
var a = ['hello', 'world'];
var b = {
    good: 'code',
    'is generally': 'pretty',
};
```
Wrong:
```js
var a = [
    'hello', 'world'
];
var b = {"good": 'code'
        , is generally: 'pretty'
        };
```

### Use multi-line ternary operator
삼항연산자는 중첩해서 사용하지 않도록 합니다.  
**조건문은 반드시 소괄호(```()```)로 감싸줍니다.**  
값에 해당하는 부분도 내용이 복잡할 경우에는 소괄호로 감싸줍니다.  

Right:
```js
var foo = (i < 0) ? 0 : i;
var bar = (foo > 100) ? 100 : foo;
```
Wrong:
```js
var bar = (i < 0) ? 0 : (i > 100) ? 100 : i;
```

내용이 길어질 경우에는 다음과 같이 작성합니다.

Right:
```js
var foo = (a === b)
    ? (a * 1 - 5)
    : (b * 12);
```
Wrong:
```js
var foo = (a === b) ? a * 1 - 5 : b * 12;
```

### Use descriptive conditions
만약 조건문이 중요하거나 복잡하다면,  
그 조건문을 설명하는 변수에 할당한 후 그 변수를 조건문에 사용하는 것이 좋습니다.  

Right:
```js
var isAuthorized = (user.isAdmin() || user.isModerator());
if (isAuthorized) {
    console.log('winning');
}
```
Wrong:
```js
if (user.isAdmin() || user.isModerator()) {
    console.log('losing');
}
```

## Method chaining
체인 메서드를 사용할 경우, 메서드는 그 다음 줄부터 작성합니다.  
이렇게 하면 메서드 호출 순서를 재정렬하기 쉬워집니다.  

Right:
```js
User
    .findOne({ name: 'foo' })
    .populate('bar')
    .exec(function(err, user) {
        return true;
    });
```
Wrong:
```js
User
.findOne({ name: 'foo' })
.populate('bar')
.exec(function(err, user) {
    return true;
});

User.findOne({ name: 'foo' })
    .populate('bar')
    .exec(function(err, user) {
        return true;
    });

User.findOne({ name: 'foo' }).populate('bar')
.exec(function(err, user) {
    return true;
});

User.findOne({ name: 'foo' }).populate('bar')
    .exec(function(err, user) {
        return true;
    });
```

### Sort require statement
require 등을 사용할 때에는 그 종류에 맞게 정렬하여 작성합니다.

Right (Node.js):
```js
// node.js native module
var fs = require('fs');
var path = require('path');

// npm module
var request = require('request');

// user module
var routes = require('./routes');
```
Right (require.js):
```js
define([
    // framework or util
    'jquery', 'angular', 'underscore',

    // user module
    './app.js', './controller/main.js',

    // no return scripts
    'jquery-ui', 'angular-route'
],
function ($, angular, _, app, MainCtrl) {
    // do something...
});
```

### Comment front whitespace
주석은 주석문자 이후 공백을 하나 이상 두고 작성하도록 합니다.

Right:
```js
// this is right comment.

/**
*    this is right multi comment.
*/
```
Wrong:
```js
//this is wrong comment.

/**
*this is wrong multi comment.
*/
```

### Write small functions
함수의 길이는 짧을 수록 좋습니다.  
함수는 (80x24 크기를 가지는 ISO/ANSI 스크린에서) 하나 혹은 두 페이지 내에 표시될 수 있어야 합니다.  
가능한 **함수 하나를 20~40줄 이내에서 작성**하도록 합니다.  

로직이 길어질 경우에는 여러 개의 함수로 쪼개도록 합니다.  
함수를 나누면 불필요한 코드 리딩을 줄일 수도 있습니다.  

(참고: [리눅스 커널 코딩 스타일 - 6. 함수](https://wiki.kldp.org/wiki.php/LinuxKernelCodingStyle#s-6))

### indention for HTML string
HTML 문자열을 코드 내에 작성할 때에는 Array와 함께,  
그리고 tag에 맞게 들여쓰기를 해주는 것이 좋습니다.  

```js
var template = [
    '<form class="navbar-form">'
        '<div class="form-group">',
            '<label for="_input_user">User: </label>',
            '<input type="text", id="_input_user"/>',
        '</div>',
        '<div class="form-group">',
            '<label for="_input_pass">Pass: </label>',
            '<input type="text", id="_input_pass"/>',
        '</div>',
    '</div>'
].join('');

var style = [
    'z-index:20000001',
    'position:absolute',
    'top:' + (this.conf.top || '50%'),
    'left:' + (this.conf.left || '50%')
].join(';');
```

### Class declaration
클래스를 선언할 때에는 prototype 체인을 사용합니다.

Right:
```js
// constructor
function MyClass (options) {
    // inherit constructor
    SuperClass.call(this, options);

    // member variables
    this._name = options.name;
    // ...
}
// inherit methods
MyClass.prototype = Object.create(SuperClass.prototype);

// public
MyClass.prototype.getName = function () {
    return this._name;
};
// private
MyClass.prototype._connOther = function (name, rank) {
    // ...
};
// static
MyClass.createId = function () {
    // ...
    return id;
};
```


## Prevent bug

### Use Semicolons
반드시 문장의 끝에는 세미콜론(```;```)을 넣도록 합니다.  
JavaScript는 세미콜론을 생략 가능하지만, 이것은 언어 설계 오류입니다.  

(참고: [JavaScript Garden - 자동으로 삽입되는 쎄미콜론](http://bonsaiden.github.io/JavaScript-Garden/ko/#core.semicolon))

### Use the === operator
반드시 삼중 등호 연산자(```===```)만을 사용합니다.  
**이중 등호 연산자(```==```)는 절대 사용하지 말아야 합니다.**  

(참고: [JavaScript Garden - 객체 비교하기](http://bonsaiden.github.io/JavaScript-Garden/ko/#types.equality))  

또한, 조건문에는 ```=``` 연산자는 사용하지 않습니다.  

### Do not extend built-in prototypes
모든 객체의 prototype은 확장하지 않습니다.  
특히 기본 객체(native object: Array, Object, String, ...)는 절대 확장해서는 안됩니다.  

Right:
```js
var a = [];
if (!a.length) {
    console.log('winning');
}
```
Wrong:
```js
Array.prototype.empty = function() {
    return !this.length;
}

var a = [];
if (a.empty()) {
    console.log('losing');
}
```

### Use strict mode
파일 혹은 function 맨 첫번째 줄에 ```'use strict';```를 기술하여  
반드시 strict mode를 사용하도록 합니다.  

(참고: [Outsider's Dev Story - ECMAScript 5의 Strict Mode](http://blog.outsider.ne.kr/823))  

### Object.freeze, Object.preventExtensions, Object.seal, with, eval
위 5가지는 사용하지 않도록 합니다.

### Use hasOwnProperty method
for-in을 사용할 시에는 hasOwnProperty와 함께 사용해야 합니다.

Right:
```js
for (var k in obj) {
    if (obj.hasOwnProperty(k)) {
        // do something...
    }
}
```
Wrong:
```js
for (k in obj) {
    // do something...
}
```

### Do not declare function in block scope
(```if``` 및 ```while``` 등) 블록 내에서 함수를 선언해서는 안됩니다.  
브라우저는 허용하지만 (마치 'bad news bears'처럼) 모두 다른 방식으로 해석됩니다.  

(참고: [Airbnb JavaScript 스타일 가이드 - Functions(번역)](https://github.com/tipjs/javascript-style-guide#functions-%EC%9B%90%EB%AC%B8))  

Right:
```js
var test;
if (currentUser) {
    test = function test() {
        console.log('Yup.');
    };
}
```
Wrong:
```js
if (currentUser) {
    function test() {
        console.log('Nope.');
    }
}
```

### Don't use 'arguments' as argument name
매개 변수(parameter) 이름을 arguments로 명명해서는 안됩니다.  
이것은 함수 범위로 전달 될 ```arguments``` 객체의 참조를 덮어 쓸 것입니다.  

Right:
```js
function yup(name, options, args) {
    // ...stuff...
}
```
Wrong:
```js
function nope(name, options, arguments) {
    // ...stuff...
}
```


## Performance
## Initalize variables
타입별 기본 초기값 할당은 리터럴 구문을 사용합니다.

Right:
```js
var str = '';
var num = 0; // or -1
var bool = false; // or true
var arr = [];
var obj = {};
```
Wrong:
```js
var str = new String('');
var num = new Number(0);
var bool = new Boolean(false);
var arr = new Array(0);
var obj = new Object();
```

### Use for, cache array length
for 문을 사용하여 배열을 순회할 때에는  
새로운 변수를 선언하여 배열의 length 값을 캐시하도록 합니다.  

```js
var list = [1, 2, 3, 4, 5, ...... 100000000];
for(var i = 0, l = list.length; i < l; i++) {
    var item = list[i];
    // do something...
}
```

굳이 배열의 첫 번째부터 순회할 필요가 없다면 다음과 같이 합니다.
```js
var list = [1, 2, 3, 4, 5, ...... 100000000];
for (var i = list.length - 1; i >= 0; i--) {
    var item = list[i];
    // do something...
};
```

### switch vs object dict

switch 사용을 지양하고, 단순 값 할당에는 객체 사전을 대신 사용하도록 합니다.


Right:
```js
function getSecond(str) {
    return {
        day: 86400,
        hour: 3600,
        minute: 60
    }[str];
}
getSecond('day'); // => 86400
```

Wrong:
```js
function getSecond(str) {
    var second;

    switch(str) {
        case 'day':
            second = 86400;
            break;
        case 'hour':
            second = 3600;
            break;
        case 'minute':
            second = 60;
            break;
    }

    return second;
}

getSecond('day'); // => 86400
```

### String plus oper vs Array join
3개 이상의 문자열을 결합할 때에는 산술 연산자 대신 Array의 join()을 사용하도록 합니다.

Right:
```js
var str = ['I ', 'like ', 'javascirpt'].join('');

var str = ['I', 'like', 'javascirpt'].join(' ');
```
Wrong:
```js
var str = 'I ' + 'like ' + 'javascirpt';
```


## ETC
### Comment annotation
특별한 의미를 가진 주석을 달 때에는 의미를 명확하게 알 수 있도록 annotation을 기입하도록 합니다.

* TODO: 나중에 추가해야하는 빠져있는 기능을 명시
* FIXME: 반드시 고쳐야 하는 잘못된 코드를 명시
* OPTIMIZE: 비효율적인 코드이거나 나중에 보틀넥이 될 가능성이 있는 곳에 명시
* HACK: 의문점이 생길 수 있거나 기발한 방법으로 해결한 부분을 명시
* REVIEW: 구현에 확인을 위해 리뷰가 필요할 경우
* WARN: 주의를 가져야 한다는 의미. 잘못하면 버그를 유발할 수 있는 부분에 대한 표시.
* NOTE: 코드에 대한 참고용 주석을 달 때



## Supplement
### JSHint Linting Preferences
JSHint를 사용할 경우 다음과 같이 옵션을 설정하는 것을 권장합니다.
```js
{
  // Details: https://github.com/victorporof/Sublime-JSHint#using-your-own-jshintrc-options
  // Example: https://github.com/jshint/jshint/blob/master/examples/.jshintrc
  // Documentation: http://www.jshint.com/docs/
  "node": true,     // node.js environment
  "jquery": true,   //
  "quotmark": "single",
  // "camelcase": true,
  "forin": true,    // use for-in, check "if (obj.hasOwnProperty(key) {}"
  "freeze": true,   // Array, String, Date prototype freeze
  "indent": 4,      // indent: space 4
  "maxlen": 80,     // max char length about line
  "curly": true,
  "eqeqeq": true,   // ==, != [x] / ===, !== [o]
  // "latedef": true,
  "newcap": true,   // new animal() [x] / new Anamal() [o]
  "noarg": true,    // deprecated arguments.caller, arguments.callee
  "sub": true,      // .key [o] / ['key'] [o]
  "validthis": true, // Possible strict violation

  // defaults
  "browser": true,
  "esnext": true,
  "globals": {
    "requirejs": true,
    "define": true,
    "alert": true
  },
  "globalstrict": true,
  // "quotmark": true,
  // "smarttabs": true,
  "trailing": true,
  "undef": true,
  "unused": true
}
```
