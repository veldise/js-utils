/**
*
*/
var openDialog = (function ($) {
    /**
    *
    */
    function getCenterPos (el) {
        var $document = $(document);
        var $window = $(window);

        var centerXPos = $document.scrollLeft() + $window.width() / 2;
        var centerYPos = $document.scrollTop() + $window.height() / 5 * 2;
        var elWidth = el.outerWidth();
        var elHeight = el.outerHeight();

        return {
            x: centerXPos - elWidth / 2,
            y: centerYPos - elHeight / 2
        };
    }
    function setMovable (element, options) {
        // default options
        var moveOption = {
            scroll: false,
            containment: 'window',
            // handle은 head
            handle: element.find('.mu-dialog-head')
        };

        if (options && $.type(options) === 'object') {
            moveOption = _.defaults(options, moveOption);
        }

        // draggable 대상은 dialog
        element.draggable(moveOption);
    }
    /**
    *
    */
    return function openDialog (selector, callback) {
        var $dlg = $(selector);

        if (!$dlg.length) {
            console.error('not found element:', selector);
            return;
        }

        setMovable($dlg);

        var $parent = $dlg.parent();
        var $background = $('.mu-dialog-background');
        /**
        *   open/close
        */
        var openDlg = function () {
            var pos = getCenterPos($dlg);

            $dlg
                .appendTo('body')
                .removeClass('hidden')
                .offset({
                    left: pos.x,
                    top: pos.y
                });
                // .position({ // jquery ui
                //     of: 'body',
                //     my: 'center center',
                //     at: 'center center',
                //     collision: 'fit flip'
                // });

            $background.removeClass('hidden');

            // yes/no/close button listener
            $dlg.find('.btn-yes').on('click', function () {
                callback(closeDlg);
            });
            $dlg.find('.btn-close').one('click', function () {
                closeDlg();
            });
        };
        var closeDlg = function () {
            $dlg
                .appendTo($parent)
                .addClass('hidden');

            if (!$('body').children('.mu-dialog').length) {
                $background.addClass('hidden');
            }

            // clean listener
            $dlg.find('.btn-yes').off('click');
            $dlg.find('.btn-close').off('click');
        };
        var isOpened = function () {
            return !$dlg.hasClass('hidden');
        };
        /**
        *   run
        */
        openDlg();
    };
})($);
