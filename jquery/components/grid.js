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

        if (this.el.is('table')) {
            if (!this.el.children('thead').length) {
                this.el.append('<thead></thead>');
            }
            if (!this.el.children('tbody').length) {
                this.el.append('<tbody></tbody>');
            }
        }
        else {
            if (this.el.find('table').length < 2) {
                console.error('need two table elements:', selector);
                return;
            }

            // NOTE: 무조건 첫번째 table을 head로 인식
            this.elHead = this.el.find('table').eq(0);
            this.elBody = this.el.find('table').eq(1);

            if (!this.elHead.children('thead').length) {
                this.elHead.append('<thead></thead>');
            }
            if (!this.elBody.children('tbody').length) {
                this.elBody.append('<tbody></tbody>');
            }
        }

        // selector를 가지고 고유키를 생성
        // TODO: 현재는 id selector 기준으로, class selector인 경우 key가 중복될 수 있다.
        this.key = selector.replace(/(\#|\.)/, '').trim().split(/\s+/)[0];

        this._checkbox = true; // 첫번째 열에 checkbox 구성할지 여부
        this._sorting = true; // thead 클릭으로 데이터를 정렬할지 여부
        this._cols = []; // thead 구성을 위한 배열
        this._rows = []; // tbody 구성을 위한 데이터
        this._maps = []; // property match 정보 배열
        this._mapId = null;

        this.paging = null;
        this.$selectbox = null;

        this._iterCellTemplate = {};
        this._orderByMap = ''; // 현재 정렬 기준 map
        this._predicate = ''; // 정렬 방향('asc' || 'desc')
        this._listenerSort = null;

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
    Grid.prototype.sorting = function(_sorting) {
        if (!arguments.length) {
            return this._sorting;
        }
        this._sorting = _sorting;
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
        // 페이지가 변경되었을 때
        if (eventName === 'move') {
            if (this.paging) {
                this.paging.on(eventName, listener);
            }
        }
        // rowPerPage selectbox값이 변경되었을 때
        else if (eventName === 'changePerPage') {
            if (this.$selectbox) {
                this.$selectbox('selectionChange', listener);
            }
        }
        // thead th를 클릭을 통한 정렬 동작을 사용자가 제어하려고 할 때
        else if (eventName === 'sort') {
            this._listenerSort = listener;
        }
    };

    //========================= drawing =========================//

    Grid.prototype._setNoResultText = function () {
        var colLen = this._maps.length + ((this._checkbox) ? 1 : 0);
        var template = '<tr><td colspan="' + colLen + '" align="center">조회 결과가 없습니다.</td></tr>';

        if (this.el.is('table')) {
            this.el.children('tbody').html(template);
        }
        else {
            this.elBody.children('tbody').html(template);
        }
    };

    Grid.prototype._makeHeadTemplate = function() {
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

        return arrHead.join('');
    };
    Grid.prototype._makeBodyTemplate = function() {
        var key = this.key;
        var maps = this._maps;
        var mapId = this._mapId;
        var rows = this._rows;
        var isCheckbox = this._checkbox;

        var pagingInfo = (this.paging) ? this.paging.info() : {};
        var currPageNum = pagingInfo.currentPageNumber || 1;
        var rowsPerPage = pagingInfo.rowsPerPage || 0;

        var arrBody = [];

        if (!rows || !rows.length) {
            this._setNoResultText();
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
            if (mapId && (row[mapId] !== undefined && row[mapId] !== null)) {
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
                else {
                    arrRow.push('<td></td>');
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

        // save
        this._viewRows = rows;

        return arrBody.join('');
    };

    Grid.prototype._listenCheckboxEvents = function () {
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
    };
    Grid.prototype._listenThead = function () {
        var _this = this;
        var el = this.el;

        el.find('thead > tr > th,td').click(function () {
            var $th = $(this);
            var $ths = $th.parent().children('th,td');

            var elIndex = $ths.index($th);
            var index = (_this._checkbox) ? (elIndex - 1) : elIndex;
            if (index < 0) {
                return;
            }

            var col = _this._cols[index];
            var map = _this._maps[index];
            var predicate = _this._predicate;

            if (_this._orderByMap !== map) {
                predicate = 'asc';
            }
            else {
                // toggle
                predicate = (predicate === 'asc') ? 'desc' : 'asc';
            }
            _this._orderByMap = map;
            _this._predicate = predicate;

            // run sort
            if (_this._listenerSort) {
                _this._listenerSort(index, col, map, predicate);
            }
            else {
                var reverse = (_this._predicate === 'desc') ? -1 : 1;

                _this._rows.sort(function (a, b) {
                    if (a[map] === b[map]) {
                        return 0;
                    }
                    return reverse * ((a[map] > b[map]) ? 1 : -1);
                });
                _this.make();
            }

            // change css class
            // NOTE: make()를 수행하게 되면 기존 element가 전부 날아가므로 다시 find 수행
            el
                .find('thead > tr > th,td')
                .removeClass('up')
                .removeClass('down');
            el
                .find('thead > tr')
                .find('th:eq(' + elIndex + '),td:eq(' + elIndex + ')')
                .addClass((predicate === 'asc') ? 'up' : 'down');
        });
    };

    Grid.prototype.make = function() {
        if (this.paging) {
            this.paging.make();
        }

        var $thead, $tbody;

        if (this.el.is('table')) {
            $thead = this.el.children('thead');
            $tbody = this.el.children('tbody');
        }
        else {
            $thead = this.elHead.children('thead');
            $tbody = this.elBody.children('tbody');
        }

        $thead.html(this._makeHeadTemplate());
        $tbody.html(this._makeBodyTemplate());

        var iters = this._iterCellTemplate;
        for (var index in iters) {
            if (iters.hasOwnProperty(index)) {
                var iter = iters[index];
                index = index * 1; // parse int
                var colIndex = (this._checkbox) ? ((index) + 1) : index;

                $tbody
                    .find('tr')
                    .find('td:eq(' + colIndex + ')')
                    .each(iter);
            }
        }

        // checkbox events
        var isCheckbox = this._checkbox;
        if (isCheckbox) {
            this._listenCheckboxEvents();
        }
        // sort(thead click) events
        var isSorting = this._sorting;
        if (isSorting) {
            this._listenThead();
        }

        return this;
    };
    Grid.prototype.eachCell = function(colIndex, iter) {
        this._iterCellTemplate[colIndex] = iter;

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
        paging.on('move', function (/*e, pageNum*/) {
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
        // NOTE: checked는 view rows 에서만 구해도 된다.
        var rows = this._viewRows;
        var ids = this.getCheckedId();
        var rst = [];

        for (var i = 0, l = rows.length; i < l; i++) {
            var row = rows[i];
            // NOTE: id는 element 속성값이므로 반드시 string 이지만,
            // row[mapId]은 number일 경우가 있다.
            if (_include(ids, (row[mapId] + ''))) {
                rst.push(row);
            }
        }

        return rst;
    };
    Grid.prototype.getUncheckedRows = function() {
        var mapId = this._mapId;
        var rows = this._rows;
        var ids = this.getCheckedId();
        var rst = [];

        for (var i = 0, l = rows.length; i < l; i++) {
            var row = rows[i];
            // NOTE: id는 element 속성값이므로 반드시 string 이지만,
            // row[mapId]은 number일 경우가 있다.
            if (!_include(ids, (row[mapId] + ''))) {
                rst.push(row);
            }
        }

        return rst;
    };
    /**
    *   utility
    */
    function _include (arr, item) {
        for (var i = arr.length - 1; i >= 0; i--) {
            if (arr[i] === item) {
                return true;
            }
        }
        return false;
    }

    return Grid;
})($, Paging, createSelectbox);
