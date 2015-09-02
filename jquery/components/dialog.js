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
        var centerYPos = $document.scrollTop() + $window.height() / 2;
        var elWidth = el.outerWidth();
        var elHeight = el.outerHeight();

        return {
            x: centerXPos - elWidth / 2,
            y: centerYPos - elHeight / 2
        };
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

        var $parent = $dlg.parent();
        /**
        *   open/close
        */
        var openDlg = function () {
            $('.mu-dialog-background').removeClass('hidden');

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

            // yes/no/close button listener
            $dlg.find('.btn-yes').on('click', function () {
                callback(closeDlg);
            });
            $dlg.find('.btn-close').one('click', function () {
                closeDlg();
            });
        };
        var closeDlg = function () {
            $('.mu-dialog-background').addClass('hidden');

            $dlg
                .appendTo($parent)
                .addClass('hidden');

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
