/**
*
*/
var Paging = (function ($) {
    /**
    *   @class
    */
    function Paging (selector) {
        this.selector = selector;
        this.el = $(selector);

        if (!this.el.length) {
            console.error('not found element:', selector);
        }

        this._totalCount = 0; // 전체 행 갯수
        this._totalPageCount = 0; // 전체 페이지 갯수
        this._pagePerView = 10; // 화면당 표시되는 전체 페이지 갯수
        this._currentPageNumber = 1; // 현재 페이지 번호
        this._rowsPerPage = 50; // 페이지당 표시되는 리스트 행 개수
        this._startRow = 0; // 페이지의 첫번째 행 번호
        this._endRow = 0; // 페이지의 마지막 행 번호
    }

    //========================= static =========================//

    Paging.create = function (selector) {
        return (new Paging(selector));
    };

    //========================= getter/setter =========================//

    Paging.prototype.totalCount = function(_totalCount) {
        if (!arguments.length) {
            return this._totalCount;
        }
        this._totalCount = _totalCount;
        return this;
    };
    Paging.prototype.rowsPerPage = function(_rowsPerPage) {
        if (!arguments.length) {
            return this._rowsPerPage;
        }
        this._rowsPerPage = _rowsPerPage;
        return this;
    };
    Paging.prototype.info = function(_info) {
        if (!arguments.length) {
            return {
                totalCount: this._totalCount,
                totalPageCount: this._totalPageCount,
                pagePerView: this._pagePerView,
                currentPageNumber: this._currentPageNumber,
                rowsPerPage: this._rowsPerPage,
                startRow: this._startRow,
                endRow: this._endRow
            };
        }
        this._totalCount = (_info.totalCount || this._totalCount);
        this._totalPageCount = (_info.totalPageCount || this._totalPageCount);
        this._pagePerView = (_info.pagePerView || this._pagePerView);
        this._currentPageNumber = (_info.currentPageNumber || this._currentPageNumber);
        this._rowsPerPage = (_info.rowsPerPage || this._rowsPerPage);
        this._startRow = (_info.startRow || this._startRow);
        this._endRow = (_info.endRow || this._endRow);

        return this;
    };

    //========================= events =========================//

    Paging.prototype.on = function(eventName, listener) {
        if (eventName === 'move') {
            // jquery custom event
            this.el.on('paging_move', listener);
        }
    };

    //========================= drawing =========================//

    Paging.prototype.make = function() {
        if (!this._totalCount) {
            this.el.html('');
            return;
        }

        var arrBtns = [];

        // make first, prev button
        arrBtns.push('<button type="button" class="mu-btn mu-first"><span></span></button>');
        arrBtns.push('<button type="button" class="mu-btn mu-prev"><span></span></button>');

        var division_1 = parseInt(this._totalCount / this._rowsPerPage);
        var division_2 = parseInt(this._totalCount % this._rowsPerPage);

        this._totalPageCount = division_1;
        if (division_2 > 0) {
            this._totalPageCount = this._totalPageCount + 1;
        }

        // out range (page)
        if (this._currentPageNumber > this._totalPageCount) {
            this._currentPageNumber = this._totalPageCount;
        }

        var pageRange_1 = parseInt(this._currentPageNumber / this._pagePerView);
        var pageRange_2 = parseInt(this._currentPageNumber % this._pagePerView);
        var pageRange = 0;

        if (pageRange_2 === 0) {
            pageRange = (pageRange_1 - 1) * 10;
        } else {
            pageRange = pageRange_1 * 10;
        }

        // make page number button
        arrBtns.push('<ul>');

        var cnt = 0;
        for (var i = 1, l = this._totalPageCount; i <= l; i++) {
            var pageNum = (i + pageRange);
            arrBtns.push('<li><a href="javascript:;">' + pageNum + '</a></li>');

            if (pageNum === this._totalPageCount) {
                break;
            }
            if (++cnt === this._pagePerView) {
                break;
            }
        }

        arrBtns.push('</ul>');

        // make next, last button
        arrBtns.push('<button type="button" class="mu-btn mu-next"><span></span></button>');
        arrBtns.push('<button type="button" class="mu-btn mu-last"><span></span></button>');

        // set template
        this.el.html(arrBtns.join(''));

        // reset disabled & active
        this._resetStyle();

        // call click listener
        var _this = this;
        var el = this.el;

        el.find('button.mu-first').click(function () {
            _this.move(1);
        });
        el.find('button.mu-prev').click(function () {
            _this.move(_this._currentPageNumber - 1);
        });
        el.find('button.mu-next').click(function () {
            _this.move(_this._currentPageNumber + 1);
        });
        el.find('button.mu-last').click(function () {
            _this.move(_this._totalPageCount);
        });
        el.find('li').click(function () {
            var $li = $(this);
            if ($li.hasClass('active')) {
                return;
            }
            _this.move($li.text() * 1);
        });

        return this;
    };

    Paging.prototype._resetStyle = function() {
        var el = this.el;
        var pageNum = this._currentPageNumber;

        // button disabled
        if (pageNum === 1) {
            el.find('button.mu-first,button.mu-prev').attr('disabled', true);
        }
        else {
            el.find('button.mu-first,button.mu-prev').removeAttr('disabled');
        }

        if (pageNum === this._totalPageCount) {
            el.find('button.mu-last,button.mu-next').attr('disabled', true);
        }
        else {
            el.find('button.mu-last,button.mu-next').removeAttr('disabled');
        }

        // reset class 'active'
        el.find('li').each(function () {
            var $li = $(this);

            if (($li.text() * 1) === pageNum) {
                $li.addClass('active');
            }
            else {
                $li.removeClass('active');
            }
        });
    };

    Paging.prototype.reset = function(rowPerPage) {
        this._totalCount = 0;
        this._totalPageCount = 0;
        this._pagePerView = 10;
        this._currentPageNumber = 1;
        this._rowsPerPage = (rowPerPage || 50);
        this._startRow = 0;
        this._endRow = 0;

        return this;
    };

    //========================= ... =========================//

    Paging.prototype.move = function(pageNum) {
        if (pageNum > this._totalPageCount) {
            pageNum = this._totalPageCount;
        }
        if (pageNum < 1) {
            pageNum = 1;
        }

        // set
        this._currentPageNumber = pageNum;

        var el = this.el;

        // out range, remake paging
        if (pageNum < (el.find('li:first').text() * 1) || pageNum > (el.find('li:last').text() * 1)) {
            this.make();
        }

        this._resetStyle();

        // trigger move event
        this.el.trigger('paging_move', pageNum);
    };

    return Paging;
})($);
