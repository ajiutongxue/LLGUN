import {Component, OnInit, AfterViewInit} from '@angular/core';

@Component({
    selector: 'app-story-board',
    templateUrl: './story-board.component.html',
    styleUrls: ['./story-board.component.less']
})


export class StoryBoardComponent implements AfterViewInit {

    d = [
        {id: 1, no: '01', date: '2019-12-1', reactType: 'button', statusLocal: '制作', status: 'doing', delay: true, prj: '淘气蓝猫3000问', task: '蓝猫胡子模型', during: '12小时' },
        {id: 2, no: '02', date: '2019-12-2', reactType: 'drag', statusLocal: '审核', status: 'check', delay: true, prj: '淘气蓝猫3000问', task: '蓝猫胡子模型', during: '12小时' },
        {id: 3, no: '03', date: '2019-12-3', reactType: 'drag', statusLocal: '返修', status: 'repair', delay: false, prj: '淘气蓝猫3000问', task: '蓝猫胡子模型', during: '12小时' },
        {id: 4, no: '04', date: '2019-12-4', reactType: 'drag', statusLocal: '制作', status: 'doing', delay: false, prj: '淘气蓝猫3000问', task: '蓝猫胡子模型', during: '12小时' },
        {id: 5, no: '05', date: '2019-12-5', reactType: 'drag', statusLocal: '审核', status: 'check', delay: false, prj: '淘气蓝猫3000问', task: '蓝猫胡子模型', during: '12小时' },
    ];


    constructor() {
    }


    ngAfterViewInit () {
        const $domDragContainer = $('.story-list');
        let ranges = $.map($domDragContainer.find('.story-item--drag-type'), box => ({ id: box.id, t: $(box).offset().top, $box: $(box) }));
        let o_row = null;   // 移动的行号
        let t_row = null;   // 移动到的位置
        const d = this.d;

        $domDragContainer.on('mousedown', '.story-item--drag-type', function (e) {
            o_row = e.target.id || e.target.parentNode.id;
            const o_index = d.findIndex( r => r.id === parseInt(o_row, 10));
            const $item = $(this);
            const insertDiv = document.createElement('div');
            const ph = document.createElement('div');   // ph = placeholder
            document.body.appendChild(ph);
            $(ph).css({
                'width': '200px',
                'height': '30px',
                'position': 'fixed',
                'border': '1px dashed #fff',
                'border-radius': '4px',
                'display': 'none',
                'z-index': 999,
            });
            $(insertDiv).css({
                background: '#0082ff',
                width: '100%',
                height: '2px',
                top: 0,
                left: 0,
                marginTop: '-5px',
                'border-radius': '2px',
                'box-shadow': '0 0 2px #0082ff',
                'z-index': 998,
            });

            $(window).on('mousemove.dragItem', function (e) {
                if (!$item.hasClass('dragging')) {
                    $item.addClass('dragging');
                    ranges = $.map(
                        $domDragContainer.find('.story-item--drag-type'),
                        box => ({id: box.id, t: $(box).offset().top, $box: $(box)})
                    );
                }
                ranges.forEach( (r, i) => {

                    if (e.pageY > r.t) {
                        if (ranges[i + 1] && e.pageY < ranges[i + 1].t) {
                            $(insertDiv).remove();
                            $(insertDiv).css('position', 'absolute');
                            r.$box.append(insertDiv);
                            return false;
                        }
                        if ( i === ranges.length - 1) {
                            if (e.pageY > r.t + r.$box.height()) {
                                $(insertDiv).remove();
                                $(insertDiv).css('position', 'static');
                                $domDragContainer.append(insertDiv);
                                return false;
                            } else {
                                $(insertDiv).remove();
                                $(insertDiv).css('position', 'absolute');
                                r.$box.append(insertDiv);
                                return false;
                            }
                        }
                    } else if ( e.pageY < r.t && i === 0 ) {
                        $(insertDiv).remove();
                        $(insertDiv).css('position', 'absolute');
                        r.$box.append(insertDiv);
                        return false;
                    }
                } );

                $(ph).css({
                    display: 'block',
                    left: e.pageX,
                    top: e.pageY - 15,
                });

            });
            $(window).on('mouseup.dragItem', function () {
                $(window).off('.dragItem');
                $(ph).remove();

                if ($item.hasClass('dragging')) {
                    t_row = $(insertDiv)[0].parentNode.id;
                    if (!t_row) {
                        t_row = d[d.length - 1].id;
                    }

                    $(insertDiv).remove();
                    $item.removeClass('dragging');
                    const t_index = d.findIndex(r => r.id === parseInt(t_row, 10));
                    if (o_index === t_index) return;
                    d.splice(t_index, 0, d.splice(o_index, 1)[0]);
                }

            });
        });
    }

}
