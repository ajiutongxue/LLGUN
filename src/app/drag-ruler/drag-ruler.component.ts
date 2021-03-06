import { Component, OnInit } from '@angular/core';

// import {Media} from './Media';

@Component({
    selector: 'app-drag-ruler',
    templateUrl: './drag-ruler.component.html',
    styleUrls: ['./drag-ruler.component.less']
})
export class DragRulerComponent implements OnInit {
    tmpCurrentPlay = 10;

    isFullscreen = false;

    // sIcon = null;  // status icon
    sIcons = [];
    sUrls = [
        '../assets/status-icon/ban.png',
        '../assets/status-icon/dlvr.png',
        '../assets/status-icon/end.png',
        '../assets/status-icon/waiting.png',
    ];
    // sUrl = '../assets/status-icon/ban.png';

    // ruler number
    $rContainer = null;
    rCvs = null;
    rCtx = null;
    rStep = 2;

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
    // minCellWidth = 10;
    offsetLeftLenght = 0;

    // 游标
    $theVernier = null;
    vernierLeft = 180;

    playlist = [
        {
            type: 3,
            duration: 2600,
            active: false,
        }, {
            type: 3,
            duration: 1260,
            active: false,
        }, {
            type: 3,
            duration: 600,
            active: false,
        }, {
            type: 3,
            duration: 588,
            active: false,
        }, {
            type: 3,
            duration: 3888,
            active: false,
        }, {
            type: 3,
            duration: 1564,
            active: false,
        }, {
            type: 3,
            duration: 500,
            active: false,
        }, {
            type: 3,
            duration: 3566,
            active: false,
        }, {
            type: 3,
            duration: 7086,
            active: false,
        }, {
            type: 3,
            duration: 13426,
            active: false,
        }, {
            type: 3,
            duration: 21236,
            active: false,
        }, {
            type: 3,
            duration: 2326,
            active: false,
        }, {
            type: 3,
            duration: 556,
            active: false,
        }, {
            type: 3,
            duration: 2600,
            active: false,
        }, {
            type: 3,
            duration: 1260,
            active: false,
        }, {
            type: 3,
            duration: 600,
            active: false,
        }, {
            type: 3,
            duration: 588,
            active: false,
        }, {
            type: 3,
            duration: 3888,
            active: false,
        }, {
            type: 3,
            duration: 1564,
            active: false,
        }, {
            type: 3,
            duration: 500,
            active: false,
        }, {
            type: 3,
            duration: 3566,
            active: false,
        }, {
            type: 3,
            duration: 7086,
            active: false,
        }, {
            type: 3,
            duration: 13426,
            active: false,
        }, {
            type: 3,
            duration: 21236,
            active: false,
        }, {
            type: 3,
            duration: 2326,
            active: false,
        }, {
            type: 3,
            duration: 556,
            active: false,
        }, {
            type: 3,
            duration: 2600,
            active: false,
        }, {
            type: 3,
            duration: 1260,
            active: false,
        }, {
            type: 3,
            duration: 600,
            active: false,
        }, {
            type: 3,
            duration: 588,
            active: false,
        }, {
            type: 3,
            duration: 3888,
            active: false,
        }, {
            type: 3,
            duration: 1564,
            active: false,
        }, {
            type: 3,
            duration: 500,
            active: false,
        }, {
            type: 3,
            duration: 3566,
            active: false,
        }, {
            type: 3,
            duration: 7086,
            active: false,
        }, {
            type: 3,
            duration: 13426,
            active: false,
        }, {
            type: 3,
            duration: 21236,
            active: false,
        }, {
            type: 3,
            duration: 2326,
            active: false,
        }, {
            type: 3,
            duration: 556,
            active: false,
        }, {
            type: 3,
            duration: 2600,
            active: false,
        }, {
            type: 3,
            duration: 1260,
            active: false,
        }, {
            type: 3,
            duration: 600,
            active: false,
        }, {
            type: 3,
            duration: 588,
            active: false,
        }, {
            type: 3,
            duration: 3888,
            active: false,
        }, {
            type: 3,
            duration: 1564,
            active: false,
        }, {
            type: 3,
            duration: 500,
            active: false,
        }, {
            type: 3,
            duration: 3566,
            active: false,
        }, {
            type: 3,
            duration: 7086,
            active: false,
        }, {
            type: 3,
            duration: 13426,
            active: false,
        }, {
            type: 3,
            duration: 21236,
            active: false,
        }, {
            type: 3,
            duration: 2326,
            active: false,
        }, {
            type: 3,
            duration: 556,
            active: false,
        }, {
            type: 3,
            duration: 2600,
            active: false,
        }, {
            type: 3,
            duration: 1260,
            active: false,
        }, {
            type: 3,
            duration: 600,
            active: false,
        }, {
            type: 3,
            duration: 588,
            active: false,
        }, {
            type: 3,
            duration: 3888,
            active: false,
        }, {
            type: 3,
            duration: 1564,
            active: false,
        }, {
            type: 3,
            duration: 500,
            active: false,
        }, {
            type: 3,
            duration: 3566,
            active: false,
        }, {
            type: 3,
            duration: 7086,
            active: false,
        }, {
            type: 3,
            duration: 13426,
            active: false,
        }, {
            type: 3,
            duration: 21236,
            active: false,
        }, {
            type: 3,
            duration: 2326,
            active: false,
        }, {
            type: 3,
            duration: 556,
            active: false,
        }, {
            type: 3,
            duration: 2600,
            active: false,
        }, {
            type: 3,
            duration: 1260,
            active: false,
        }, {
            type: 3,
            duration: 600,
            active: false,
        }, {
            type: 3,
            duration: 588,
            active: false,
        }, {
            type: 3,
            duration: 3888,
            active: false,
        }, {
            type: 3,
            duration: 1564,
            active: false,
        }, {
            type: 3,
            duration: 500,
            active: false,
        }, {
            type: 3,
            duration: 3566,
            active: false,
        }, {
            type: 3,
            duration: 7086,
            active: false,
        }, {
            type: 3,
            duration: 13426,
            active: false,
        }, {
            type: 3,
            duration: 21236,
            active: false,
        }, {
            type: 3,
            duration: 2326,
            active: false,
        }, {
            type: 3,
            duration: 556,
            active: false,
        }, {
            type: 3,
            duration: 2600,
            active: false,
        }, {
            type: 3,
            duration: 1260,
            active: false,
        }, {
            type: 3,
            duration: 600,
            active: false,
        }, {
            type: 3,
            duration: 588,
            active: false,
        }, {
            type: 3,
            duration: 3888,
            active: false,
        }, {
            type: 3,
            duration: 1564,
            active: false,
        }, {
            type: 3,
            duration: 500,
            active: false,
        }, {
            type: 3,
            duration: 3566,
            active: false,
        }, {
            type: 3,
            duration: 7086,
            active: false,
        }, {
            type: 3,
            duration: 13426,
            active: false,
        }, {
            type: 3,
            duration: 21236,
            active: false,
        }, {
            type: 3,
            duration: 2326,
            active: false,
        }, {
            type: 3,
            duration: 556,
            active: false,
        },
    ];
    rows = [
        {
            type: 0,
            color: 'none',
            name: '自定义'
        }, {
            type: 1,
            color: '#B8E986',
            name: '动画'
        }, {
            type: 2,
            // color: '#9986E9',
            color: 'transparent',
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

    // media1: Media;

    // $hoverRect = $('<div></div>');
    // isRectHover = false;
    // hoverIndex: number;
    // hoverPosY = 0;

    constructor() {
        // this.media1 = new Media(3, 100);
        // console.log(`>>>>>>>> media 1 is: ${this.media1.type}`);
    }

    ngOnInit() {
        this.$rContainer = $('.list-number-ruler').first();
        this.rCvs = this.$rContainer.find('canvas')[0];
        this.rCtx = this.rCvs.getContext('2d');
        this.$container = $('.play-process-list').first();
        // this.$hoverRect.css({
        //     'display': 'none',
        //     'border': '2px solid #50A6E1',
        //     'position': 'absolute',
        //     'background': 'rgba(80, 166, 225, .3)',
        //     'z-index': 100,
        //     'box-shadow': '0 0 3px rgb(80, 166, 225)',
        // });
        // this.$container.append(this.$hoverRect);
        this.cvs = this.$container.find('canvas')[0];
        this.ctx = this.cvs.getContext('2d');
        this.scrollBar.$el = $('.scroll-bar').first();
        this.scrollBar.$resizeBarLeft = $('.resize-bar-left:first');
        this.scrollBar.$resizeBarRight = $('.resize-bar-right:first');

        $(this.cvs).on('click', (e) => {
            this.clickList(e);
        });

        this.sUrls.forEach((v) => {
            const _img = new Image();
            _img.src = v;
            this.sIcons.push(_img);
            // document.body.appendChild(this.sIcons[this.sIcons.length - 1]);
        });
        // console.log(`>>>><<<< sicons: ${this.sIcons}`);

        // this.sIcon = document.createElement('img');
        // this.sIcon.src = this.sUrl;
        // document.body.appendChild(this.sIcon);

        setTimeout(() => {
            this.setCanvasSize(this.rCvs, this.$rContainer.width(), 42);
            this.setCanvasSize(this.cvs, this.$container.width(), this.rows.length * this.rowHeight + this.rows.length);
            this.initCellWidth();
            this.setNumberRulerStep();
            this.drawList();
            this.drawRulerNumber();

            this.$theVernier = $('.drag-vernier-handle').first();
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

            this.$theVernier.on('mousedown', (e) => {
                const sx = e.pageX;     // start x
                const ol = this.vernierLeft;    // originally left
                const _min = this.getBoxSize(this.cvs).left;
                const _max = this.getBoxSize(this.cvs).right;
                let _x = 0;

                this.$theVernier.parent().addClass('active');
                $('body').css('cursor', 'move');
                console.log('>>> down!!');

                $(window).on('mousemove.drag', (e) => {
                    console.log('>>> move!!');
                    _x = (e.pageX > _max ? _max : e.pageX < _min ? _min : e.pageX) - sx + ol;
                    this.vernierLeft = _x;

                    $(window).on('mouseup.drag', (e) => {
                        this.tmpCurrentPlay = this.whichHover(e.pageX) !== null ? this.whichHover(e.pageX) :
                            _x > ol ? this.allRect[this.allRect.length - 1].i : this.allRect[0].i;
                        this.setVernierLeft(this.tmpCurrentPlay);
                        this.$theVernier.parent().removeClass('active');
                        $(window).off('.drag');
                        $('body').css('cursor', 'default');
                        console.log('>>> up');
                    });
                });
            });

            $(window).on('resize', () => {
                this.cvsResizeHandler();
            });

        }, 0);
    }


    // 通过播放列表index设置vernier left
    setVernierLeft(current) {
        if (!this.allRect) return;
        const l = this.allRect.find(v => v.i === current);
        // this.vernierLeft = l ? 180 + l.x + l.w / 2 : 180;
        // if (l) {
        //     this.vernierLeft = 180 + l.x + l.w / 2;
        // } else {
        //     if (current < this.allRect[0].i) {
        //         this.vernierLeft = 180;
        //     } else {
        //         this.vernierLeft = $('.play-list-row').width();
        //     }
        // }
        this.vernierLeft = l ? 180 + l.x + l.w / 2 : 
            current < this.allRect[0].i ? 180 : $('.play-list-row').width();
    }

    vernierGoto({ current, tar }, step = 1) {
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
        this.vernierGoto({ current: this.tmpCurrentPlay, tar: null });
    }

    okk() {
        // alert('okk');
    }

    setCellWidth() {
        // this.cellWidth = Math.floor(this.cvs.width / (this.playlist.length * this.scrollBar.$el.width() / this.getBoxSize('.scroll-bar-box').width));
        this.cellWidth = (this.cvs.width / (this.playlist.length * this.scrollBar.$el.width() / this.getBoxSize('.scroll-bar-box').width));
        // console.log(`cell width: ${this.cellWidth}`);
    }

    setNumberRulerStep() {
        this.rStep = this.cellWidth > 35 ? 5 : 10;
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


    // 整理绘制数据
    getDrawData() {
        const cw = this.cellWidth;
        const cvs = this.cvs;
        const lh = this.rowHeight;
        const x = this.scrollWidth2listWidth(this.scrollBar.left);  // offset = 0
        const offset = Math.floor(x / cw);
        const pl = this.playlist;
        const icons = this.sIcons;
        const iconWidth = cw >= 12 ? 10 : cw - 2;
        const _l = [];

        this.offsetLeftLenght = x === 0 ? 0 : x / cw;
        console.log(`getDrawData 中设置的 this.offsetLeftLenght: ${this.offsetLeftLenght}`);
        this.clearList();

        for (let i = offset; i < pl.length; i++) {
            const item = {
                x: 0,
                y: 0,
                w: 0,
                h: 0,
                strokeStyle: '#444',
                strokeWidth: 1,
                fillStyle: '',
                active: false,
                icon: null,
                iw: iconWidth,
            };

            if (-x + i * cw > cvs.width) break;

            if (this.getRowMeta(pl[i].type).color !== 'transparent') {
                item.fillStyle = this.getRowMeta(pl[i].type).color;
            } else {
                item.fillStyle = 'rgba(255, 255, 255, .1)';
            }

            item.x = -x + i * cw;
            item.y = (pl[i].type) * lh;
            item.icon = icons[pl[i].type > 3 ? 3 : pl[i].type];
            item.w = cw;
            item.h = lh;
            item.active = pl[i].active;

            _l.push(item);
            // console.log(`push to _l is: ${item}, list is: ${_l}`);

            // 第一行数据
            // this.allRect.push({
            //     x: -x + i * cw,
            //     y: 1,
            //     w: cw,
            //     h: lh,
            //     i: i,
            //     active: item.active
            // });
            this.allRect.push({
                x: -x + i * cw,
                y: item.y,
                w: cw,
                h: lh,
                i: i,
                active: item.active
            });
        }

        return _l;
    }


    /*drawList() {
     const cw = this.cellWidth;
     const cvs = this.cvs;
     const c = this.ctx;
     const lh = this.rowHeight;
     const x = this.scrollWidth2listWidth(this.scrollBar.left);  // offset = 0
     const offset = Math.floor(x / cw);
     const pl = this.playlist;

     const icons = this.sIcons;
     const iconWidth = cw >= 12 ? 10 : cw - 2;


     // console.log(`offset x: ${x}`);
     this.clearList();
     this.drawGrid();

     c.strokeStyle = '#444';
     c.strokeWidth = 1;


     for (let i = offset; i < pl.length; i++) {
     const y = (pl[i].type) * lh;
     // const y = (pl[i].type - 1) * lh;
     if (-x + i * cw > cvs.width) return;
     // c.globalAlpha = 1;

     if (this.getRowMeta(pl[i].type).color !== 'transparent') c.fillStyle = this.getRowMeta(pl[i].type).color;
     else {
     c.fillStyle = 'rgba(255, 255, 255, .1)';
     c.strokeRect(-x + i * cw + 1.5, 1.5, cw - 2, lh - 2);
     c.strokeRect(-x + i * cw + 1.5, y + 1.5, cw - 2, lh - 2);
     }
     c.fillRect(-x + i * cw + 1, 1, cw - 1, lh - 1);
     // c.globalAlpha = 0.6;
     c.fillRect(-x + i * cw + 1, y + 1, cw - 1, lh - 1);
     c.save();
     c.globalCompositeOperation = 'difference';
     c.globalAlpha = 0.9;
     c.drawImage(icons[pl[i].type > 3 ? 3 : pl[i].type], -x + i * cw + cw / 2 - iconWidth / 2 + 1, y + lh / 2 - iconWidth / 2 + 1, iconWidth, iconWidth);
     c.restore();
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
     }*/
    drawList() {
        const dl = this.getDrawData();
        const c = this.ctx;
        // this.clearList();
        this.drawGrid();

        dl.forEach((v) => {
            c.globalAlpha = 1;

            c.fillStyle = v.fillStyle;
            c.strokeStyle = v.strokeStyle;
            c.strokeWidth = v.strokeWidth;

            // c.fillRect(v.x + 1, 1, v.w - 1, v.h - 1);
            // c.globalAlpha = 0.6;
            c.fillRect(v.x + 1, v.y + 1, v.w - 1, v.h - 1);
            c.save();
            c.globalCompositeOperation = 'difference';
            c.globalAlpha = 0.9;
            c.drawImage(v.icon, v.x + v.w / 2 - v.iw / 2 + 1, v.y + v.h / 2 - v.iw / 2 + 1, v.iw, v.iw);
            c.restore();

            // console.log(`&&&&&&: ${v.active}`);

            if (v.active) {
                c.save();
                c.strokeStyle = '#55acec';
                c.strokeWidth = 2;
                c.fillStyle = 'rgba(80, 166, 225, 0.3)';
                // c.fillRect(v.x + 1, 1, v.w - 1, v.h - 1);
                c.fillRect(v.x + 1, v.y + 1, v.w - 1, v.h - 1);
                c.strokeRect(v.x + 0.5, v.y + 0.5, v.w, v.h);
                c.restore();
            }
        });
    }

    drawRulerNumber() {
        const cw = this.cellWidth;
        const cvs = this.rCvs;
        const c = this.rCtx;
        const x = this.scrollWidth2listWidth(this.scrollBar.left);  // offset = 0
        const offset = Math.floor(x / cw);
        const pl = this.playlist; // 取最长的那个子数组
        const step = this.rStep;

        c.clearRect(0, 0, cvs.width, cvs.height);
        c.font = '10px sans-serif';
        c.fillStyle = '#999';
        c.strokeWidth = 1;
        c.strokeStyle = '#555';
        c.textAlign = 'center';
        c.save();
        c.fillStyle = '#555';
        c.fillRect(0, 40, cvs.width, 2);
        c.restore();
        c.beginPath();
        for (let i = offset; i < pl.length; i++) {
            if (-x + i * cw > cvs.width) return;
            if (i % step === 0) {
                c.moveTo(-x + i * cw + cw * 0.5 + 0.5, 32);
                c.lineTo(-x + i * cw + cw * 0.5 + 0.5, 42);
                c.stroke();
                c.fillText(i + 1, -x + i * cw + cw * 0.5, 26);
            } else {
                c.moveTo(-x + i * cw + cw * 0.5 + 0.5, 36);
                c.lineTo(-x + i * cw + cw * 0.5 + 0.5, 42);
                c.stroke();
            }
        }
        c.closePath();
    }

    clearList() {
        this.allRect = [];
    }

    removeActiveSign() {
        this.playlist.forEach(v => {
            v.active = false;
        });
    }

    clickList(event) {
        event.stopPropagation();
        const size = this.getBoxSize(this.cvs);
        const x = event.clientX - size.left;
        const y = event.clientY - size.top;

        const t = this.whichClicked(x, y);

        if (t) {
            this.removeActiveSign();
            this.playlist[t.i].active = true;
            this.drawList();
        }

        // return t;

        // console.log('点了')
        // console.log(`****** ${this.allRect.length}`);
        // console.log(`x: ${x}, y: ${y}, off top: ${size.top}, off left: ${size.left}, 鼠标要点画布了：${t ? t : '没有点到'}`);
        // if (t) {
        //     this.isRectHover = true;
        //     this.hoverIndex = t.i;
        //     this.hoverPosY = t.y;
        //     this.drawHoverRect();
        // }
    }

    /* clickList(event) {
     event.stopPropagation();
     const size = this.getBoxSize(this.cvs);
     const x = event.clientX - size.left;
     const y = event.clientY - size.top;

     const t = this.whichClicked(x, y);
     console.log('点了')
     // console.log(`x: ${x}, y: ${y}, off top: ${size.top}, off left: ${size.left}, 鼠标要点画布了：${t ? t : '没有点到'}`);
     if (t) {
     this.isRectHover = true;
     this.hoverIndex = t.i;
     this.hoverPosY = t.y;
     this.drawHoverRect();
     }
     }*/


    // drawLeaveRect() {
    //     this.isRectHover = false;
    //     this.$hoverRect.css('display', 'none');
    // }

    // drawHoverRect() {
    //     if (!this.isRectHover) return;
    //     const hr = this.allRect.find(item => item.i === this.hoverIndex);
    //     if (hr) {
    //         this.$hoverRect.css({
    //             'left': hr.x + 'px',
    //             'top': this.hoverPosY === 1 ? 0 : this.hoverPosY + 'px',
    //             'width': hr.w + 1 + 'px',
    //             'height': hr.h + 1 + 'px',
    //             'display': 'block',
    //         });
    //     } else {
    //         this.$hoverRect.css('display', 'none');
    //     }
    // }

    whichClicked(a, b) {

        console.log(`~~~~~~~~~~~~~~~~~~~~~ ${this.allRect.length}`);
        const clicked = this.allRect.find((v) => {
            // console.log(`~~~~~~ a >= v.x: ${a} - ${v.x} - ${a >= v.x}`);
            return (a >= v.x) && (a <= v.x + v.w) && (b >= v.y) && (b <= v.h + v.y);
        });
        return clicked ? clicked : null;
    }

    /*
     * @retrun: index
     * */
    whichHover(x) {
        const _x = x - this.getBoxSize(this.cvs).left;
        const hover = this.allRect.find((v) => {
            return (_x >= v.x) && (_x <= v.x + v.w);
        });
        return hover ? hover['i'] : null;
    }

    /*
     * @ return: { type: 1, color: '#B8E986', name: '动画' }
     * */
    getRowMeta(type) {
        // return this.rows.filter((x) => x.type === type)[0];
        return this.rows.find(x => x.type === type);
    }


    showOne() { console.log('one one one~~~~~~~~~~~~'); }
    showTwo() { console.log('two two two~~~~~~~~~~~~'); }

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
    resizeScrollBar({ lx, rx, w }, isSet) {
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
        this.setNumberRulerStep();
        this.drawList();
        this.drawRulerNumber();
        this.setVernierLeft(this.tmpCurrentPlay);
        // if (this.isRectHover) this.drawHoverRect();
    }

    /*
     * @l: 相对于window到left
     * */
    scrollBarLeft2Right(l) {
        const parentSize = this.getBoxSize('.scroll-bar-box');
        return parentSize.width + parentSize.left - l;
    }


    cvsResizeHandler () {
        const cw = this.cellWidth;
        const ar = this.allRect;
        const pl = this.playlist;

        this.setCanvasSize(this.rCvs, this.$rContainer.width(), 42);
        this.setCanvasSize(this.cvs, this.$container.width(), this.rows.length * this.rowHeight + this.rows.length);
        this.scrollBar.parentWidth = $('.scroll-bar-box').first().width();
        this.scrollBar.meta.boundaryLeft = this.getBoxSize('.scroll-bar-box').left;
        this.scrollBar.meta.boundaryRight = this.scrollBar.meta.boundaryLeft + this.getBoxSize('.scroll-bar-box').width;


        // 单元格宽度不变，填满画布需要的格子数量
        let nl = Math.ceil(this.cvs.width / cw);   // need length
        console.log(`need length nl=${nl}， all rect 最后一个i is： ${ar[ar.length - 1].i}`);
        // 判断变大了还是变小了
        // if (nl > ar.length) {
        if (nl > (ar[ar.length - 1].i - ar[0].i)) {
            // 需要的比原来的多，变宽了
            
            // 判断剩下的数据够不够显示
            if ((pl.length - ar[0].i) > nl) {
                console.log(`数据够显示了`);
                // 起始位置是 allRect 第一个元素 在 playlist里面对应的位置，也就是  ar[0].i，
                // 剩下的数据够显示
                // do: 偏移量不变，重新整理数据，一直凑够 nl 个
                this.resetDrawData(ar[0].i, nl);
                let scrollWidth = this.scrollBar.parentWidth * (this.cvs.width / (this.cellWidth * this.playlist.length));
                // let scrollLeft = this.scrollBar.parentWidth * (this.offsetLeftLenght * this.cellWidth) / (this.cellWidth * this.playlist.length);
                
                this.resizeScrollBar({ lx: this.scrollBar.left, rx: null, w: scrollWidth }, false);
    
            } else if (nl < pl.length) {
                console.log(`用整个列表的数据够显示`);                
                // 剩下的数据不够，但是整个播放列表的数据够了
                // do: 从最后一个开始数，一直凑够 nl 个
                this.resetDrawData(pl.length - nl, nl);
                let scrollWidth = this.scrollBar.parentWidth * (this.cvs.width / (this.cellWidth * this.playlist.length));
                // let scrollLeft = this.scrollBar.parentWidth * (this.offsetLeftLenght * this.cellWidth) / (this.cellWidth * this.playlist.length);
                
                this.resizeScrollBar({ lx: null, rx: 0, w: scrollWidth }, false);

            } else {
                console.log(`不够显示了`);                
                // 整个播放列表的数据都不够显示的·
                // do: 重新计算 cellWidth，绘制playlist中的所有元素
                this.setCellWidth();
                this.setNumberRulerStep();
                this.resetDrawData(0, pl.length);

                // this.isScrollActive = false;
                this.scrollBar.left = 0,
                this.scrollBar.right = 0,
                this.scrollBar.$el.css({
                    'left': 0,
                    'right': 0
                });
            }
                    // console.log(`******** this.offsetLeftLenght is: ${this.offsetLeftLenght}`);

        } else {
            console.log('变窄了');
            // 变窄了
            // todo:需要判断当前播放的游标位置

            // 粗暴解决：截掉多余数据
            ar.length = nl;
            // do: 重新绘制开始
            let scrollWidth = this.scrollBar.parentWidth * (this.cvs.width / (this.cellWidth * this.playlist.length));
            // let scrollLeft = this.scrollBar.parentWidth * (this.offsetLeftLenght * this.cellWidth) / (this.cellWidth * this.playlist.length);
            // console.log(`scrollWidth: ${scrollWidth}, scrollLeft: ${scrollLeft}`);
            this.resizeScrollBar({ lx: this.scrollBar.left, rx: null, w: scrollWidth }, false);

        }
        this.drawList();        
        this.drawRulerNumber();
        this.setVernierLeft(this.tmpCurrentPlay);
    }


    /**
     * @ start: 画出来的第一个格子在整个playlist中对应的index =》allRect[0].i
     * @ count: 要画的格子数量
     */
    resetDrawData(start, count) {
        const cw = this.cellWidth;
        const cvs = this.cvs;
        const lh = this.rowHeight;
        const x = this.scrollWidth2listWidth(this.scrollBar.left);  // offset = 0
        const offset = Math.floor(x / cw);
        const pl = this.playlist;
        const icons = this.sIcons;
        const iconWidth = cw >= 12 ? 10 : cw - 2;
        const _l = [];

        this.clearList();
        this.offsetLeftLenght = start === 0 ? 0 : start + (x / cw - offset); // 取小数部分
console.log(`!!!!!!!!!!!!offsetLeftLenght: ${this.offsetLeftLenght},,,, start: ${start}`);
        for (let i = start; i < count; i++) {
            const item = {
                x: 0,
                y: 0,
                w: 0,
                h: 0,
                strokeStyle: '#444',
                strokeWidth: 1,
                fillStyle: '',
                active: false,
                icon: null,
                iw: iconWidth,
            };

            if (-x + i * cw > cvs.width) break;

            if (this.getRowMeta(pl[i].type).color !== 'transparent') {
                item.fillStyle = this.getRowMeta(pl[i].type).color;
            } else {
                item.fillStyle = 'rgba(255, 255, 255, .1)';
            }

            item.x = -x + i * cw;
            item.y = (pl[i].type) * lh;
            item.icon = icons[pl[i].type > 3 ? 3 : pl[i].type];
            item.w = cw;
            item.h = lh;
            item.active = pl[i].active;

            _l.push(item);
            // console.log(`push to _l is: ${item}, list is: ${_l}`);

            // 第一行数据
            // this.allRect.push({
            //     x: -x + i * cw,
            //     y: 1,
            //     w: cw,
            //     h: lh,
            //     i: i,
            //     active: item.active
            // });
            this.allRect.push({
                x: -x + i * cw,
                y: item.y,
                w: cw,
                h: lh,
                i: i,
                active: item.active
            });
        }

        return _l;
    }


}
