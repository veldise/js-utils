/**
*
*/
$(function () {
    // Store a reference to the original val method.
    var originValMethod = $.fn.val;
    // Define overriding method.
    $.fn.val = function(value){
        var $element = $(this);
        // Execute the original method.
        if (!$element.hasClass('mu-selectbox')) {
            return originValMethod.apply(this, arguments);
        }

        var text = '';
        // Log the fact that we are calling our override.
        // getter
        if (!arguments.length) {
            text = $element.find('.mu-value').text();

            $element.find('li').each(function () {
                var $li = $(this);
                if (text === $li.text()) {
                    value = $li.attr('value');
                }
            });
            return value;
        }
        // setter
        else {
            value = value + ''; // convert string

            $element.find('li').each(function () {
                var $li = $(this);
                if (value === $li.attr('value')) {
                    text = $li.text();
                }
            });

            if (text) {
                $element.find('.mu-value').text(text);
            }
            // TODO: trigger를 호출해도 이벤트가 동작하지 않는다.
            // $element.trigger('selectionChange', value, text);
            return $element;
        }
    };
    // Store a reference to the original text method.
    var originTextMethod = $.fn.text;
    // Define overriding method.
    $.fn.text = function(text){
        var $element = $(this);
        // Execute the original method.
        if (!$element.hasClass('mu-selectbox')) {
            return originTextMethod.apply(this, arguments);
        }

        // Log the fact that we are calling our override.
        // getter
        if (!arguments.length) {
            return $element.find('.mu-value').text();
        }
        // setter
        else {
            var value = '';

            $element.find('li').each(function () {
                var $li = $(this);
                if (text === $li.text()) {
                    value = $li.attr('value');
                }
            });

            $element.find('.mu-value').text(text);
            // TODO: trigger를 호출해도 이벤트가 동작하지 않는다.
            // $element.trigger('selectionChange', value, text);
            return $element;
        }
    };
});
/**
*
*/
var createSelectbox = (function ($) {
    /**
    *
    */
    return function createSelectbox(selector) {
        var $box = $(selector);

        if (!$box.length) {
            console.error('not found element:', selector);
            return;
        }
        /**
        *   open/close
        */
        var openBox = function () {
            // close all selectbox
            $('.mu-selectbox').removeClass('on');

            $box.addClass('on');

            $box.find('.mu-list').width($box.width() - 2);
        };
        var closeBox = function () {
            $box.removeClass('on');
        };
        var isOpened = function () {
            return $box.hasClass('on');
        };
        /**
        *   events
        */
        var oneDocsClick = function () {
            closeBox();
            clearListeners();
        };
        var oneListClick = function (e) {
            // document click event 전달 방지
            e.stopPropagation();

            var value = $(e.target).attr('value');
            var text = $(e.target).text();

            // set view text
            $box.children('.mu-value').text(text);
            // trigger custom event
            // TODO: jquery trigger는 하나의 값만 전달할 수 있다.
            $box.trigger('selectionChange', value/*, text*/);

            closeBox();
            clearListeners();
        };
        var clearListeners = function () {
            $box.children('.mu-list').off('click', oneListClick);
            $(document).off('click', oneDocsClick);
        };
        var boxClickListener = function (e) {
            e.stopPropagation();

            if (isOpened()) {
                closeBox();
                clearListeners();
            }
            else {
                openBox();

                $(document).one('click', oneDocsClick);
                $box.children('.mu-list').one('click', oneListClick);
            }
        };
        $box.on('click', boxClickListener);

        return $box;
    };
})($);

var setSelectboxItems = (function () {
    /**
    *
    */
    return function setSelectboxOptions(selector, items) {
        var $box = $(selector);

        if (!$box.length) {
            console.error('not found element:', selector);
            return;
        }

        var arrItems = [];
        $(items).each(function (i, item) {
            var strLi = '';
            if ($.type(item) === 'object') {
                var value = ($.type(item.value) === 'number') ? (item.value + '') : item.value;
                var text = ($.type(item.text) === 'number') ? (item.text + '') : item.text;

                strLi = '<li value="' + (value || '') + '">' + (text || '') + '</li>';
            }
            else {
                strLi = '<li value="' + item + '">' + item + '</li>';
            }
            arrItems.push(strLi);
        });

        $box.children('.mu-list').html(arrItems.join(''));
        // $box.children('.mu-value').text(items[0].text || items[0]);

        return $box;
    };
})($);
