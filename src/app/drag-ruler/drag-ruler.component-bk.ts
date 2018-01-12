import {Component, OnInit} from '@angular/core';

// todo: list
// html中当前状态标识；
// 数组中保存每个格子在播放列表中的序列信息；
// 标识通过当前播放视频序列与数组的值比对，确定放在哪个位置；
// 播放显示出来格子的最后一个的时候，画布内容重绘，整体左移动动画，最后一个到第一个

@Component({
    selector: 'app-drag-ruler',
    templateUrl: './drag-ruler.component.html',
    styleUrls: ['./drag-ruler.component.less']
})
export class DragRulerComponent implements OnInit {
    tmpCurrentPlay = 10;


    // scroll bar
    scrollBar = {
        $el: null,
        left: 0,
        right: 0,
        parentWidth: 0,
        $resizeBarLeft: null,
        $resizeBarRight: null,
        meta: {
            boundaryLeft: 0,    // 对应的，右边bar的左边界线就 + 15
            boundaryRight: 0
        },
    };
    isScrollActive = false;
    // 中间播放格子列表部分
    $container = null;
    cvs = null;
    ctx = null;
    rowHeight = 30;
    listTitleWidth = 180;
    allRect = [];

    cellWidth = 20;
    minCellWidth = 10;

    // 游标到left
    vernierLeft = 180;

    playlist = [
        {
            type: 1,
            duration: 2600,
        }, {
            type: 1,
            duration: 1260,
        }, {
            type: 3,
            duration: 600,
        }, {
            type: 2,
            duration: 588,
        }, {
            type: 2,
            duration: 3888,
        }, {
            type: 1,
            duration: 1564,
        }, {
            type: 5,
            duration: 500,
        }, {
            type: 5,
            duration: 3566,
        }, {
            type: 5,
            duration: 7086,
        }, {
            type: 1,
            duration: 13426,
        }, {
            type: 2,
            duration: 21236,
        }, {
            type: 2,
            duration: 2326,
        }, {
            type: 1,
            duration: 556,
        }, {
            type: 1,
            duration: 2600,
        }, {
            type: 1,
            duration: 1260,
        }, {
            type: 3,
            duration: 600,
        }, {
            type: 2,
            duration: 588,
        }, {
            type: 2,
            duration: 3888,
        }, {
            type: 1,
            duration: 1564,
        }, {
            type: 5,
            duration: 500,
        }, {
            type: 5,
            duration: 3566,
        }, {
            type: 5,
            duration: 7086,
        }, {
            type: 1,
            duration: 13426,
        }, {
            type: 2,
            duration: 21236,
        }, {
            type: 2,
            duration: 2326,
        }, {
            type: 1,
            duration: 556,
        }, {
            type: 1,
            duration: 2600,
        }, {
            type: 1,
            duration: 1260,
        }, {
            type: 3,
            duration: 600,
        }, {
            type: 2,
            duration: 588,
        }, {
            type: 2,
            duration: 3888,
        }, {
            type: 1,
            duration: 1564,
        }, {
            type: 5,
            duration: 500,
        }, {
            type: 5,
            duration: 3566,
        }, {
            type: 5,
            duration: 7086,
        }, {
            type: 1,
            duration: 13426,
        }, {
            type: 2,
            duration: 21236,
        }, {
            type: 2,
            duration: 2326,
        }, {
            type: 1,
            duration: 556,
        }, {
            type: 1,
            duration: 2600,
        }, {
            type: 1,
            duration: 1260,
        }, {
            type: 3,
            duration: 600,
        }, {
            type: 2,
            duration: 588,
        }, {
            type: 2,
            duration: 3888,
        }, {
            type: 1,
            duration: 1564,
        }, {
            type: 5,
            duration: 500,
        }, {
            type: 5,
            duration: 3566,
        }, {
            type: 5,
            duration: 7086,
        }, {
            type: 1,
            duration: 13426,
        }, {
            type: 2,
            duration: 21236,
        }, {
            type: 2,
            duration: 2326,
        }, {
            type: 1,
            duration: 556,
        }, {
            type: 1,
            duration: 2600,
        }, {
            type: 1,
            duration: 1260,
        }, {
            type: 3,
            duration: 600,
        }, {
            type: 2,
            duration: 588,
        }, {
            type: 2,
            duration: 3888,
        }, {
            type: 1,
            duration: 1564,
        }, {
            type: 5,
            duration: 500,
        }, {
            type: 5,
            duration: 3566,
        }, {
            type: 5,
            duration: 7086,
        }, {
            type: 1,
            duration: 13426,
        }, {
            type: 2,
            duration: 21236,
        }, {
            type: 2,
            duration: 2326,
        }, {
            type: 1,
            duration: 556,
        }, {
            type: 1,
            duration: 2600,
        }, {
            type: 1,
            duration: 1260,
        }, {
            type: 3,
            duration: 600,
        }, {
            type: 2,
            duration: 588,
        }, {
            type: 2,
            duration: 3888,
        }, {
            type: 1,
            duration: 1564,
        }, {
            type: 5,
            duration: 500,
        }, {
            type: 5,
            duration: 3566,
        }, {
            type: 5,
            duration: 7086,
        }, {
            type: 1,
            duration: 13426,
        }, {
            type: 2,
            duration: 21236,
        }, {
            type: 2,
            duration: 2326,
        }, {
            type: 1,
            duration: 556,
        }, {
            type: 1,
            duration: 2600,
        }, {
            type: 1,
            duration: 1260,
        }, {
            type: 3,
            duration: 600,
        }, {
            type: 2,
            duration: 588,
        }, {
            type: 2,
            duration: 3888,
        }, {
            type: 1,
            duration: 1564,
        }, {
            type: 5,
            duration: 500,
        }, {
            type: 5,
            duration: 3566,
        }, {
            type: 5,
            duration: 7086,
        }, {
            type: 1,
            duration: 13426,
        }, {
            type: 2,
            duration: 21236,
        }, {
            type: 2,
            duration: 2326,
        }, {
            type: 1,
            duration: 556,
        },
    ];
    rows = [
        {
            type: 0,
            color: 'transparent',
            name: '自定义'
        }, {
            type: 1,
            color: '#B8E986',
            name: '动画'
        }, {
            type: 2,
            color: '#9986E9',
            name: '灯光'
        }, {
            type: 3,
            color: '#E9A286',
            name: '特效'
        }, {
            type: 4,
            color: '#6FAB5D',
            name: '渲染'
        }, {
            type: 5,
            color: '#8BF7ED',
            name: '剪辑'
        }
    ];

    constructor() {
    }

    ngOnInit() {

        this.$container = $('.play-process-list').first();
        this.cvs = this.$container.find('canvas')[0];
        this.ctx = this.cvs.getContext('2d');
        this.scrollBar.$el = $('.scroll-bar').first();
        this.scrollBar.$resizeBarLeft = $('.resize-bar-left:first');
        this.scrollBar.$resizeBarRight = $('.resize-bar-right:first');

        $(this.cvs).on('click', (e) => {
            this.clickList(e);
        });

        setTimeout(() => {
            this.setCanvasSize(this.cvs, this.$container.width(), this.rows.length * this.rowHeight + this.rows.length);
            this.initCellWidth();
            this.drawList();

            this.scrollBar.parentWidth = $('.scroll-bar-box').first().width();
            this.scrollBar.meta.boundaryLeft = this.getBoxSize('.scroll-bar-box').left;
            this.scrollBar.meta.boundaryRight = this.scrollBar.meta.boundaryLeft + this.getBoxSize('.scroll-bar-box').width;
            if (this.isScrollActive) {
                this.resizeScrollBar({
                    lx: 0,
                    w: this.cvs.width / (this.playlist.length * this.cellWidth) * this.scrollBar.parentWidth,
                    rx: null
                }, false);

                this.scrollBar.$resizeBarLeft.on('mousedown.resizeLeft', (e) => {
                    e.stopPropagation();
                    const offset = e.clientX - this.scrollBar.$resizeBarLeft.offset().left;
                    let _x = 0;
                    let cx = 0; // client x
                    // 左偏移，包裹容器到窗口左边的距离
                    const osl = this.getBoxSize('.scroll-bar-box').left;
                    const bl = this.scrollBar.meta.boundaryLeft;
                    const br = this.scrollBar.$el.offset().left + this.scrollBar.$el.width();

                    $(window).on('mousemove.resizeLeft', (e) => {
                        cx = e.clientX - offset;
                        cx < bl ? _x = bl : cx > br - 35 ? _x = br - 35 : _x = cx;

                        this.resizeScrollBar({
                            lx: _x - osl,
                            w: null,
                            rx: null
                        }, true);
                    });

                    $(window).on('mouseup.resizeLeft', () => {
                        $(window).off('.resizeLeft');
                        // console.log('up!!!');
                    });
                });

                this.scrollBar.$resizeBarRight.on('mousedown.resizeRight', (e) => {
                    e.stopPropagation();
                    const offset = this.scrollBar.$resizeBarRight.offset().left + 15 - e.clientX;
                    let _x = 0;
                    let cx = 0; // client x
                    const bl = this.scrollBar.$el.offset().left;
                    const br = this.scrollBar.meta.boundaryRight;

                    $(window).on('mousemove.resizeRight', (e) => {
                        cx = e.clientX + offset;
                        // 65 = 35 + 15 + offset里面的15
                        cx < bl + 65 ? _x = bl + 65 : cx > br ? _x = br : _x = cx;

                        this.resizeScrollBar({
                            lx: null,
                            w: null,
                            rx: this.scrollBarLeft2Right(_x) // todo: 传入到是相对窗口到left，导致_x这里不统一
                        }, true);
                    });

                    $(window).on('mouseup.resizeRight', () => {
                        $(window).off('.resizeRight');
                        // console.log('up!!!');
                    });
                });
                this.scrollBar.$el.on('mousedown.scrollMove', (e) => {
                    const dl = e.clientX;       // mouse down left
                    const w = this.scrollBar.$el.width();
                    const pw = this.getBoxSize('.scroll-bar-box').width; // parent width
                    const oleft = this.scrollBar.left;
                    const oright = this.scrollBar.right;
                    let l = 0;                  // 移动距离
                    let lx = 0;
                    let rx = 0;
                    console.log('>> down');

                    $(window).on('mousemove.scrollMove', (e) => {
                        l = e.clientX - dl;

                        console.log(`l: ${l}, 记录的x: ${dl}, 当前的x：${e.clientX}`);
                        if (l > 0) {
                            // 向右移动
                            l = l + 15;
                            rx = oright - l > 0 ? oright - l : 0;
                            lx = pw - rx - w - 30;
                        } else {
                            // 向左移动
                            l = l - 15;
                            lx = oleft + l > 0 ? oleft + l : 0;
                            rx = pw - lx - w - 30;
                        }
                        this.resizeScrollBar({
                            lx: lx,
                            rx: rx,
                            w: null
                        }, true);

                    });

                    $(window).on('mouseup.scrollMove', () => {
                        $(window).off('.scrollMove');
                        // console.log(`up!!! ==> ${this.scrollBar.$el.width()}`);
                    });

                });

            } else {
                this.scrollBar.$el.css({
                    'left': 0,
                    'right': 0
                });
            }
            this.setVernierLeft(this.tmpCurrentPlay);

        }, 0);

    }

    setVernierLeft(current) {
        if (!this.allRect.length) return;
        let l = this.allRect.filter((v) => v.i === current);
        this.vernierLeft = l ? 180 + l[0].x + l[0].w / 2 : 180;
    }

    vernierGoto({current, tar}, step = 1) {
        const rects = this.allRect;
        if (tar) {
            this.setVernierLeft(tar);
            return;
        }

        current = current ? current : rects[0].i;

        if (current === this.playlist.length - 1) return;

        if (rects[rects.length - 1].i === current) {
            // 播放到最后一个到时候，设置偏移，重绘list
            let lx = this.scrollBar.left + this.scrollBar.$el.width();
            let rx = this.scrollBar.right - this.scrollBar.$el.width();
            if (rx < 0) {
                rx = 0;
                lx = this.getBoxSize('.scroll-bar-box').width - this.scrollBar.$el.width();
            }
            this.resizeScrollBar({
                lx: lx,
                w: null,
                rx: rx
            }, true);

        } else {
            this.tmpCurrentPlay = current + step;
            this.setVernierLeft(this.tmpCurrentPlay);
        }
    }

    // 临时测试用一下
    nextp() {
        this.vernierGoto({current: this.tmpCurrentPlay, tar: null});
    }

    setCellWidth() {
        this.cellWidth = Math.floor(this.cvs.width / (this.playlist.length * this.scrollBar.$el.width() / this.getBoxSize('.scroll-bar-box').width));
        console.log(`cell width: ${this.cellWidth}`);
    }

    initCellWidth() {
        if (this.playlist.length * this.cellWidth > this.$container.width()) {
            this.isScrollActive = true;
        } else {
            this.cellWidth = Math.floor(this.$container.width() / this.playlist.length);
            this.isScrollActive = false;
        }
    }

    scrollWidth2listWidth(w) {
        // return w === 0 ? 0 : this.cvs.width * this.getBoxSize('.scroll-bar-box').width / w;

        return w === 0 ? 0 : this.cvs.width * w / this.scrollBar.$el.width();
    }

    /*
     * @ bar: scroll-bar's width
     * @ parent： scroll-bar-box's width
     * @ cvs: canvas's width
     * @ cell: cell width
     * */
    // getSize({bar, container, cvs, cell}, length = this.playlist.length) {
    //     bar = bar !== undefined ? bar : this.scrollBar.$el.width();
    //     container = container !== undefined ? container : this.getBoxSize('.scorll-bar-box').width;
    //     cvs = cvs !== undefined ? cvs : this.cvs.width;
    //     cell = cell !== undefined ? cell : this.cellWidth;
    //
    // }

    drawGrid() {
        const cvs = this.cvs;
        const c = this.ctx;
        const lh = this.rowHeight;

        c.clearRect(0, 0, cvs.width, cvs.height);
        c.strokeStyle = '#363636';
        c.lineWidth = 1;
        c.beginPath();
        for (let i = 0; i < this.rows.length + 1; i++) {
            c.moveTo(0.5, 0.5 + i * lh);
            c.lineTo(cvs.width, 0.5 + i * lh);
        }
        c.stroke();
        c.closePath();
    }


    drawList() {
        const cw = this.cellWidth;
        const cvs = this.cvs;
        const c = this.ctx;
        const lh = this.rowHeight;
        const x = this.scrollWidth2listWidth(this.scrollBar.left);  // offset = 0
        const offset = Math.floor(x / cw);
        const pl = this.playlist;

        // console.log(`offset x: ${x}`);
        this.clearList();
        this.drawGrid();

        for (let i = offset; i < pl.length; i++) {
            const y = (pl[i].type) * lh;
            // const y = (pl[i].type - 1) * lh;
            if (-x + i * cw > cvs.width) return;
            c.globalAlpha = 1;
            c.fillStyle = this.getRowMeta(pl[i].type).color;
            c.fillRect(-x + i * cw + 1, 1, cw - 1, lh - 1);
            c.globalAlpha = 0.6;
            c.fillRect(-x + i * cw + 1, y + 1, cw - 1, lh - 1);

            this.allRect.push({
                x: -x + i * cw,
                y: 1,
                // y: y,
                w: cw,
                h: lh,
                i: i
            });
            this.allRect.push({
                x: -x + i * cw,
                y: y,
                w: cw,
                h: lh,
                i: i
            });
        }
    }

    clearList() {
        this.allRect = [];
    }

    clickList(event) {
        event.stopPropagation();
        const size = this.getBoxSize(this.cvs);
        const x = event.clientX - size.left;
        const y = event.clientY - size.top;

        const t = this.whichClicked(x, y);
        console.log('点了')
        // console.log(`x: ${x}, y: ${y}, off top: ${size.top}, off left: ${size.left}, 鼠标要点画布了：${t ? t : '没有点到'}`);
        if (t) {
            alert('奥哟 点到了: ' + t.i);
        }
    }

    whichClicked(a, b) {
        const clicked = this.allRect.filter((v, i) => {
            return (a >= v.x) && (a <= v.x + v.w) && (b >= v.y) && (b <= v.h + v.y);
        });
        return clicked.length ? clicked[0] : null;
    }

    /*
     * @ return: { type: 1, color: '#B8E986', name: '动画' }
     * */
    getRowMeta(type) {
        return this.rows.filter((x) => x.type === type)[0];
    }


    setCanvasSize(cvs, w, h) {
        cvs.width = w;
        cvs.height = h;
    }

    getBoxSize(el) {
        return $(el)[0].getBoundingClientRect();
    }


    /*
     * @ lx: 左边bar的 x
     * @ rx: 右边bar的 x
     * @ w: scrollBar 的 width
     * @ isSet: 是否设置时间刻度
     * */
    resizeScrollBar({lx, rx, w}, isSet) {
        const sb = this.scrollBar.$el;
        if (lx !== null) {
            sb.css('left', lx);
            this.scrollBar.left = lx;
        }
        if (w) rx = $('.scroll-bar-box').first().width() - (lx + w);
        if (rx !== null) {
            sb.css('right', rx);
            this.scrollBar.right = rx;
        }

        // 等会再来
        isSet && this.reDrawAll();

    }

    reDrawAll() {
        this.setCellWidth();
        this.drawList();
        this.setVernierLeft(this.tmpCurrentPlay);
    }

    /*
     * @l: 相对于window到left
     * */
    scrollBarLeft2Right(l) {
        const parentSize = this.getBoxSize('.scroll-bar-box');
        return parentSize.width + parentSize.left - l;
    }

}
