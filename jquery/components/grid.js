/**
*
*/
var Grid = (function ($, Paging, createSelectbox) {
    /**
    *   @class
    */
    function Grid (selector, pagingSelector, selectboxSelector) {
        this.selector = selector; // jquery selector (ex) '#tbl_test')
        this.el = $(selector); // jquery element

        if (!this.el.length) {
            console.error('not found element:', selector);
        }

        if (!this.el.children('thead').length) {
            this.el.append('<thead></thead>');
        }
        if (!this.el.children('tbody').length) {
            this.el.append('<tbody></tbody>');
        }

        // selector를 가지고 고유키를 생성
        // TODO: 현재는 id selector 기준으로, class selector인 경우 key가 중복될 수 있다.
        this.key = selector.replace(/(\#|\.)/, '').trim().split(/\s+/)[0];

        this._checkbox = true; // 첫번째 열에 checkbox 구성할지 여부
        this._cols = []; // thead 구성을 위한 배열
        this._rows = []; // tbody 구성을 위한 데이터
        this._maps = []; // property match 정보 배열
        this._mapId = null;

        this.paging = null;
        this.$selectbox = null;

        // paging, selectbox 연동
        if (pagingSelector) {
            this.connPaging(new Paging(pagingSelector));
        }
        if (selectboxSelector) {
            this.connSelectbox(createSelectbox(selectboxSelector));
        }
    }

    //========================= static =========================//

    Grid.create = function (selector) {
        return (new Grid(selector));
    };

    //========================= getter/setter =========================//

    Grid.prototype.checkbox = function(_checkbox) {
        if (!arguments.length) {
            return this._checkbox;
        }
        this._checkbox = _checkbox;
        return this;
    };
    Grid.prototype.cols = function(_cols) {
        if (!arguments.length) {
            return this._cols;
        }
        this._cols = _cols;
        return this;
    };
    Grid.prototype.rows = function(_rows) {
        if (!arguments.length) {
            return this._rows;
        }
        this._rows = _rows;
        return this;
    };
    Grid.prototype.maps = function(_maps) {
        if (!arguments.length) {
            return this._maps;
        }
        this._maps = _maps;
        return this;
    };
    Grid.prototype.mapId = function(_mapId) {
        if (!arguments.length) {
            return this._mapId;
        }
        this._mapId = _mapId;
        return this;
    };

    //========================= paging getter/setter =========================//

    Grid.prototype.totalCount = function(_totalCount) {
        if (!arguments.length) {
            if (this.paging) {
                return this.paging.totalCount();
            }
            return this._rows.length;
        }
        if (this.paging) {
            this.paging.totalCount(_totalCount);
        }
        return this;
    };
    Grid.prototype.rowsPerPage = function(_rowsPerPage) {
        if (!arguments.length) {
            if (this.paging) {
                return this.paging.rowsPerPage();
            }
            return this._rows.length;
        }
        if (this.paging) {
            this.paging.rowsPerPage(_rowsPerPage);
        }
        return this;
    };
    Grid.prototype.pagingInfo = function(_info) {
        if (!arguments.length) {
            if (this.paging) {
                return this.paging.info();
            }
            return {};
        }
        if (this.paging) {
            this.paging.info(_info);
        }
        return this;
    };

    //========================= events =========================//

    Grid.prototype.on = function(eventName, listener) {
        // 페이지가 변경되었을 때 이벤트
        if (eventName === 'move') {
            if (this.paging) {
                this.paging.on(eventName, listener);
            }
        }
        // selectbox로 rowPerPage 값이 변경되었을 때 이벤트
        else if (eventName === 'changePerPage') {
            if (this.$selectbox) {
                this.$selectbox('selectionChange', listener);
            }
        }
    };

    //========================= drawing =========================//

    Grid.prototype._makeHead = function() {
        var key = this.key;
        var cols = this._cols;
        var isCheckbox = this._checkbox;
        var arrHead = [];

        if (!cols.length) {
            return;
        }

        arrHead.push('<tr>');
        if (isCheckbox) {
            arrHead.push([
                '<th>',
                    '<div class="mu-checkbox">',
                        '<input type="checkbox" id="' + key + '_ckb_tbl_all">',
                        '<label for="' + key + '_ckb_tbl_all"></label>',
                    '</div>',
                '</th>'
            ].join(''));
        }
        $(cols).each(function (ci, col) {
            arrHead.push('<th>' + col + '</th>');
        });
        arrHead.push('</tr>');

        this.el.children('thead').html(arrHead.join(''));
    };
    Grid.prototype._makeBody = function() {
        var key = this.key;
        var maps = this._maps;
        var mapId = this._mapId;
        var rows = this._rows;
        var isCheckbox = this._checkbox;

        var pagingInfo = (this.paging) ? this.paging.info() : {};
        var currPageNum = pagingInfo.currentPageNumber || 1;
        var rowsPerPage = pagingInfo.rowsPerPage || 0;

        var arrBody = [];

        if (!rows.length) {
            var colLen = maps.length + ((isCheckbox) ? 1 : 0);
            this.el.children('tbody').html('<tr><td colspan="' + colLen + '" align="center">조회 결과가 없습니다.</td></tr>');
            return;
        }

        if (rowsPerPage) {
            rows = rows.slice((currPageNum - 1) * rowsPerPage, currPageNum * rowsPerPage);
        }
        // console.log('rowsPerPage:', rowsPerPage);
        // console.log('currPageNum:', currPageNum);
        // console.log('length:', rows.length);

        $(rows).each(function (ri, row) {
            var arrRow = [];

            // sql update/delete 등을 위한 id 설정
            if (mapId && row[mapId]) {
                arrRow.push('<tr data-id="' + row[mapId] + '">');
            } else {
                arrRow.push('<tr>');
            }

            if (isCheckbox) {
                arrRow.push([
                    '<td>',
                        '<div class="mu-checkbox">',
                            '<input type="checkbox" id="' + key + '_ckb_tbl' + ri + '">',
                            '<label for="' + key + '_ckb_tbl' + ri + '"></label>',
                        '</div>',
                    '</td>'
                ].join(''));
            }
            $(maps).each(function (mi, map) {
                if ($.type(map) === 'string') {
                    var value = ($.type(row[map]) === 'number') ? (row[map] + '') : row[map];
                    arrRow.push('<td>' + (value || '') + '</td>');
                }
                else if (map.type === 'no') {
                    var no = (ri + ((pagingInfo.currentPageNumber - 1) * pagingInfo.rowsPerPage) + 1);
                    arrRow.push('<td>' + no + '</td>');
                }
                // else if (map.type === 'mod') {
                //     arrRow.push([
                //         '<td>',
                //             '<button type="button" class="mu-btn mu-btn-xs btn-mod">수정</button>',
                //         '</td>'
                //     ].join(''));
                // }
                // else if (map.type === 'del') {
                //     arrRow.push([
                //         '<td>',
                //             '<button type="button" class="mu-btn mu-btn-xs btn-del">삭제</button>',
                //         '</td>'
                //     ].join(''));
                // }
                // else if (map.type.indexOf('mod') !== -1 && map.type.indexOf('del') !== -1) {
                //     arrRow.push([
                //         '<td>',
                //             '<button type="button" class="mu-btn mu-btn-xs btn-mod">수정</button>',
                //             '<button type="button" class="mu-btn mu-btn-xs btn-del">삭제</button>',
                //         '</td>'
                //     ].join(''));
                // }
            });
            arrRow.push('</tr>');

            arrBody.push(arrRow.join(''));
        });

        this.el.children('tbody').html(arrBody.join(''));

        // save
        this._viewRows = rows;
    };

    Grid.prototype.make = function() {
        var isCheckbox = this._checkbox;

        this._makeHead();
        this._makeBody();

        // checkbox events
        if (isCheckbox) {
            var el = this.el;
            // 테이블 헤더에 있는 checkbox 클릭시
            el.find(':checkbox:first').click(function () {
                // 클릭한 체크박스가 체크상태인지 체크해제상태인지 판단
                if ($(this).is(':checked')) {
                    el.find(':checkbox').prop('checked', 'checked');
                } else {
                    el.find(':checkbox').removeAttr('checked');
                }

                // 모든 체크박스에 change 이벤트 발생시키기
                $(':checkbox', el).trigger('change');
            });
            // 헤더에 있는 체크박스외 다른 체크박스 클릭시
            el.find(':checkbox:not(:first)').click(function () {
                var allCnt = el.find(':checkbox:not(:first)').length;
                var checkedCnt =el.find(':checkbox:not(:first)').filter(':checked').length;

                // 전체 체크박스 갯수와 현재 체크된 체크박스 갯수를 비교해서 헤더에 있는 체크박스 체크할지 말지 판단
                if (allCnt === checkedCnt) {
                    el.find(':checkbox:first').prop('checked', 'checked');
                } else {
                    el.find(':checkbox:first').removeAttr('checked');
                }
            });
        }

        if (this.paging) {
            this.paging.make();
        }

        return this;
    };
    // Grid.prototype.reset = function() {
    //     // body...
    // };
    // Grid.prototype.search = function() {
    //     // body...
    // };

    //========================= etc =========================//

    Grid.prototype.connPaging = function(paging) {
        var _this = this;

        // 페이지가 변경되었을 때 이벤트
        paging.on('move', function (e, pageNum) {
            _this.make();
        });

        this.paging = paging;

        return this;
    };
    Grid.prototype.connSelectbox = function($selectbox) {
        var _this = this;

        // selectbox 값이 변경되었을 때 이벤트
        $selectbox.on('selectionChange', function (e, value) {
            _this
                .rowsPerPage(parseInt(value))
                .make();
        });

        this.$selectbox = $selectbox;
    };

    Grid.prototype.getCheckedTr = function() {
        // NOTE: not first로 thead checkbox 제외
        // TODO: parents()를 사용하면 tr이 역순으로 선택된다. 이유 불명
        return this.el.find(':checkbox:not(:first):checked').closest('tr');
    };
    Grid.prototype.getCheckedId = function() {
        var $checkedTr = this.getCheckedTr();

        return $checkedTr.map(function () {
            return $(this).attr('data-id');
        }).get();
    };
    Grid.prototype.getCheckedRows = function() {
        var mapId = this._mapId;
        var rows = this._viewRows;
        var ids = this.getCheckedId();
        var rst = [];

        for (var i = ids.length - 1; i >= 0; i--) {
            var id = ids[i];
            for (var j = rows.length - 1; j >= 0; j--) {
                var row = rows[j];
                // NOTE: ids[i]는 element 속성값이므로 반드시 string 이지만,
                // row[mapId]은 number일 경우가 있다.
                if (ids[i] === (row[mapId] + '')) {
                    rst.push(row);
                    break;
                }
            }
        }
        return rst;
    };

    return Grid;
})($, Paging, createSelectbox);
