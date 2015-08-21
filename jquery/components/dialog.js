/**
*
*/
var openDialog = (function ($) {
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
        };
        var closeDlg = function () {
            $('.mu-dialog-background').addClass('hidden');

            $dlg
                .appendTo($parent)
                .addClass('hidden')
        };
        var isOpened = function () {
            return !$dlg.hasClass('hidden');
        };
        // run
        openDlg();

        $dlg.find('.btn-yes').one('click', function () {
            callback();
            closeDlg();
        });
        $dlg.find('.btn-close').one('click', function () {
            closeDlg();
        });
    };
})($);
