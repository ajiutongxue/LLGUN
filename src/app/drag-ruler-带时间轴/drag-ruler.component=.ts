import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-drag-ruler',
    templateUrl: './drag-ruler.component.html',
    styleUrls: ['./drag-ruler.component.less']
})
export class DragRulerComponent implements OnInit {

    timeRulerContainer = null;
    timeRulerCvs = null;
    timeRulerCtx = null;
    // // 时间和像素对应关系 初始值 1s = 60px
    // timeAsWidth = 60;
    // 刻度粒度 100ms 为一个最小刻度
    rulerCellWidth = 6; // 初始为 一个刻度的宽度 px
    timeCell = 100; // 和reuler cell width 对应的时间粒度 默认值
    totalTime = 0;     // 设：总时长30s
    shownTime = 0;      // 当前显示了的时间刻度
    offsetTime = 0;     // 显示出来的时间刻度的 起点值
    // scroll bar
    scrollBar = {
        $el: null,
        left: 0,
        right: 0,
        $resizeBarLeft: null,
        $resizeBarRight: null,
        meta: {
            boundaryLeft: 0,    // 对应的，右边bar的左边界线就 + 15
            boundaryRight: 0
        },
    };
    // 中间播放格子列表部分
    $listContainer = null;
    listCvs = null;
    listCtx = null;
    listRowHeight = 30;
    listTitleWidth = 180;
    allRect = [];

    playlist = [{
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
    },];

    rows = [{
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
    },];

    constructor() {
    }

    ngOnInit() {
        // console.log(this.getRowMeta(2));
        this.drawList();
        this.timeRulerContainer = $('.player-time-ruler-box')[0];
        this.timeRulerCvs = $('.time-ruler')[0];
        this.timeRulerCtx = this.timeRulerCvs.getContext('2d');


        // 初始化 格子列表
        this.$listContainer = $('.play-process-list').first();
        this.listCvs = $('.process-list')[0];
        this.listCtx = this.listCvs.getContext('2d');

        setTimeout(() => {
            this.setCanvasSize(this.timeRulerCvs, this.getBoxSize(this.timeRulerContainer).width);
            this.setCanvasSize(this.listCvs, this.$listContainer.width(), this.rows.length * this.listRowHeight);
        }, 0);
        $(this.listCvs).on('click', (e) => {
            this.clickList(e);
        });

        // 时间刻度预设值相关
        this.totalTime = this.playlist.map(item => item.duration).reduce((sum, v) => sum + v, 0);
        // 默认让进来显示总进度的 30%
        this.shownTime = Math.floor(this.totalTime * 0.3);
        this.timeCell = this.shownTime / (this.timeRulerCvs.width / this.rulerCellWidth);

        this.setShownTime();
        this.drawRuler();
        this.drawList();

        this.scrollBar.$el = $('.scroll-bar').first();

        this.resizeScrollBar({
            // lx: this.scrollBar.left,
            lx: 0,
            w: this.shownTime / this.totalTime * this.getBoxSize(this.timeRulerContainer).width,
            rx: null
        }, false);

        // initScrollWidth();
        this.scrollBar.$resizeBarLeft = $('.resize-bar-left:first');
        this.scrollBar.$resizeBarRight = $('.resize-bar-right:first');
        this.scrollBar.meta.boundaryLeft = this.getBoxSize(this.timeRulerContainer).left;
        this.scrollBar.meta.boundaryRight = this.scrollBar.meta.boundaryLeft + this.getBoxSize(this.timeRulerContainer).width;

        this.scrollBar.$resizeBarLeft.on('mousedown.resizeLeft', (e) => {
            e.stopPropagation();
            const offset = e.clientX - this.scrollBar.$resizeBarLeft.offset().left;
            let _x = 0;
            let cx = 0; // client x
            // 左偏移，包裹容器到窗口左边举例
            const osl = this.getBoxSize(this.timeRulerContainer).left;
            const bl = this.scrollBar.meta.boundaryLeft;
            const br = this.scrollBar.$el.offset().left + this.scrollBar.$el.width();

            $(window).on('mousemove.resizeLeft', (e) => {
                cx = e.clientX - offset;
                cx < bl ? _x = bl : cx > br - 35 ? _x = br - 35 : _x = cx;

                // console.log(`clientX: ${e.clientX}, boundary right: ${br}`);
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
    }

    // Rect(x, y, w, h) {
    //     this.x = x;
    //     this.y = y;
    //     this.w = w;
    //     this.h = h;
    // }

    clearList() {
        this.allRect = [];
    }

    clickList(event) {
        const size = this.getBoxSize(this.listCvs);
        const x = event.clientX - size.left;
        const y = event.clientY - size.top;

        let t = this.whichClicked(x, y);
        console.log(`x: ${x}, y: ${y}, off top: ${size.top}, off left: ${size.left}, 鼠标要点画布了：${t ? t : '没有点到'}`);
    }

    whichClicked(a, b) {
        const clicked = this.allRect.filter((v, i) => {
            return (a >= v.x) && (a <= v.x + v.w) && (b >= v.y) && (b <= v.h + v.y);
        });
        return clicked.length ? clicked[0] : null;
    }

    // drawListGrid() {}

    drawList() {
        // const tc = this.timeCell;
        // const step = this.rulerCellWidth;
        const lh = this.listRowHeight;
        const cvs = this.listCvs;
        const c = this.listCtx;
        // offset === 0
        let x = this.getTimeWidth(this.offsetTime);

        this.clearList();
        c.clearRect(0, 0, cvs.width, cvs.height);
        // todo: 优化，超出画布部分不画
        this.playlist.forEach((v, i) => {
            const w = this.getTimeWidth(v.duration);
            const y = (v.type - 1) * lh;
            c.fillStyle = this.getRowMeta(v.type).color;
            c.fillRect(x + 1, y + 1, w - 1, lh - 1);

            this.allRect.push({
                x: x,
                y: y,
                w: w,
                h: lh
            });
            // c.beginPath();
            // c.lineWidth = 1;
            // c.strokeStyle = '#000';
            // c.moveTo(x + w - 2, y);
            // c.lineTo(x + w - 2, y + lh - 1);
            // c.stroke();
            // c.closePath();
            x += w;
        });
    }

    /*
     * @ return: { type: 1, color: '#B8E986', name: '动画' }
     * */
    getRowMeta(type) {
        return this.rows.filter((x) => x.type === type)[0];
    }

    // 获取一段时间 对应的显示长度
    getTimeWidth(duration) {
        const tc = this.timeCell;
        const step = this.rulerCellWidth;

        return duration / tc * step;
    }

    setCanvasSize(cvs, w, h = 30) {
        cvs.width = w;
        cvs.height = h;
    }

    getBoxSize(el) {
        return $(el)[0].getBoundingClientRect();
    }

    /*
     * @l: 相对于window到left
     * */
    scrollBarLeft2Right(l) {
        const parentSize = this.getBoxSize(this.timeRulerContainer);
        return parentSize.width + parentSize.left - l;
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

        isSet && this.reDrawAll();

    }

    reDrawAll() {
        this.reDrawRuler();
        this.drawList();
    }

    reDrawRuler() {
        this.changeOffsetTime();
        this.changeShownTime();
        this.changeRulerCellWidth();
        this.drawRuler();
    }

    changeShownTime() {
        const shownPercent = this.scrollBar.$el.width() / this.getBoxSize('.scroll-bar-box').width;
        this.shownTime = this.totalTime * shownPercent;
    }

    changeRulerCellWidth() {
        this.rulerCellWidth = this.timeRulerCvs.width * this.timeCell / this.shownTime;
    }

    changeOffsetTime() {
        const timeRate = this.scrollBar.left === 0 ? 0 : this.scrollBar.left / this.scrollBar.$el.width();
        this.offsetTime = this.shownTime * timeRate;
    }

    // 得到能当前能显示的时间刻度长度
    setShownTime() {
        // console.log(`ruler cvs width: ${this.timeRulerCvs.width}`);
        this.shownTime = this.timeRulerCvs.width / this.rulerCellWidth * this.timeCell;
    }

    drawRuler() {
        const totalWidth = this.timeRulerCvs.width;
        const step = this.rulerCellWidth;
        const c = this.timeRulerCtx;
        const offsetTime = this.offsetTime;
        const offsetLeft = (offsetTime % this.timeCell) * step; // 十个小格子为一组，从一个最高的短线节点到下一个

        c.clearRect(0, 0, totalWidth, this.timeRulerCvs.height);
        c.font = '12px sans-serif';
        c.fillStyle = '#111';
        c.beginPath();
        console.log(`<><><> offset time: ${offsetTime}, totalwidth: ${totalWidth}`);
        for (let x = -offsetLeft; x < totalWidth; x += step) {
            console.log(`当前偏移： ${x}`);
        }

        // for (let i = 0, x = -offsetLeft; x < totalWidth + 20 * this.timeCell * step; i++, x += step) {
        //     console.log('>>>>>>> ' + i);
            // const y = (i % 10 === 0) ? 18 : 23;
            // c.moveTo(x, y);
            // c.lineTo(x, 30);
            // c.stroke();
            // if (i % 10 === 0) c.fillText(i, x - 5, 14);
            // if (i % 10 === 0) {
            //     c.fillText(Math.floor(i * this.timeCell + offsetTime), x - 20, 14);
            // }
        // }
        c.fillStyle = 'orange';
        c.fillRect(0, 30 - 2, totalWidth, 2);
        c.closePath();


        /*const totalWidth = this.timeRulerCvs.width;
         const step = this.rulerCellWidth;
         const c = this.timeRulerCtx;
         const offsetTime = this.offsetTime;
         // console.log(`total width: ${totalWidth}, step: ${step}, c: ${c}, offsetTime: ${offsetTime}`);
         const offsetLeft = offsetTime % (this.timeCell) * step; // 十个小格子为一组，从一个最高的短线节点到下一个
         // console.log(`offset left: ${offsetLeft}, offset time: ${offsetTime}`);

         c.clearRect(0, 0, totalWidth, this.timeRulerCvs.height);
         c.font = '12px sans-serif';
         c.fillStyle = '#111';
         c.beginPath();
         // totalWidth + 20 * this.timeCell , 因为有偏移问题，所以这里补 20个 小格子
         for (let i = 0, x = -offsetLeft; x < totalWidth; i++, x += step) {
         // for (let i = 0, x = -offsetLeft; x < totalWidth + 20 * this.timeCell * step; i++, x += step) {
         const y = (i % 10 === 0) ? 18 : 23;
         c.moveTo(x, y);
         c.lineTo(x, 30);
         c.stroke();
         // console.log('>>>' + i);
         // todo: 时间显示内容
         // const text = Math.ceil((i + offsetTime / this.timeCell - 1) * this.timeCell / 10);
         if (i % 10 === 0) {
         c.fillText(Math.floor(i * this.timeCell + offsetTime), x - 20, 14);
         }
         }
         // c.moveTo(0, 30 - 2);
         // c.lineTo();
         c.fillStyle = 'orange';
         c.fillRect(0, 30 - 2, totalWidth, 2);
         c.closePath();*/
    }

}
