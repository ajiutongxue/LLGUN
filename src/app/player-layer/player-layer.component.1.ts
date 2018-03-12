import { Component, OnInit } from '@angular/core';
import { Version } from './version';
// import {VersionService} from './version.service';
import { VERSION_LISTS } from './mock-version';
declare const PxLoader: any, PxLoaderImage: any;

class Rect {
    x: number;
    y: number;
    w: number;
    h: number;
    // isActive: boolean;
    text: string;
    version: Version;
    pic: Pic;
    picObj: null;
    // painted: boolean;
}


class Pic {
    w: number;
    h: number;
    ow: number; // 原始图片上截取的宽度
    oh: number; // 原始图片上截取的高度
    url: string;
}

class ControlPanel {
    title: string;
    isShow: boolean;
    isShowPic: boolean;
    opacity: number;
}


@Component({
    selector: 'app-player-layer',
    templateUrl: './player-layer.component.html',
    styleUrls: ['./player-layer.component.less'],
})

export class PlayerLayerComponent implements OnInit {
    version_lists = VERSION_LISTS;
    verCvs = null;
    verCtx = null;
    rulerCvs = null;
    rulerCtx = null;
    // 单位长度和单位时间段关系： 单位长度 / canvas长度 = 单位时间段 / canvas显示的时间段长度
    unitLength = 30;    // 1000ms 对应的像素长度
    unitDuration = 1000;
    rectHeight = 70;
    // rects = [];
    $scrollbar = null;
    scrollbarBoxContentWidth = 0;
    // scrollbarOffsetLeft = 0;
    // img = null;

    totalDuration = 0;
    totalCvsWidth = 0;
    shadowCvs = null;
    // shadowCvs = document.createElement('canvas');
    shadowCtx = null;
    shadowRectData = [];
    statusIcons = null; // 应该是个数组，暂时就先只放一张图片

    controlList: ControlPanel[] = [];

    // shadowRulerCvs = document.createElement('canvas');
    shadowRulerCvs = null;
    shadowRulerCtx = null;

    activeRect = null;

    copyFinished = false;

    shownDuration = 0;

    constructor() {
    }


    ngOnInit() {
        this.preload();
    }

    preload() {
        const loader = new PxLoader();
        const img = loader.addImage('../assets/status-icon/waiting.png');
        loader.addCompletionListener(() => {
            this.statusIcons = img;
            this.shadowRulerCvs = document.querySelector('#shadow-ruler');
            this.shadowCvs = document.querySelector('#shadow-version');
            this.$scrollbar = $('.scrollbar:first');
            this.totalDuration = this.version_lists[0].data.reduce((prev, cur) => {
                return prev + cur.duration;
            }, 0);

            this.version_lists.forEach((row, i) => {
                this.controlList[i] = {
                    title: row.title,
                    isShow: true,
                    isShowPic: !!(i % 2),
                    opacity: 100
                };
            });

            this.verCvs = document.getElementById('version-canvas');
            this.verCvs.height = this.version_lists.length * this.rectHeight;

            this.verCvs.width = $(this.verCvs).parent().width();
            // console.log(`version cvs width is: ${this.verCvs.width},,,$(this.verCvs).parent().width()is: ${$(this.verCvs).parent().width()}`);
            this.verCtx = this.verCvs.getContext('2d');
            // init ruler canvas
            this.rulerCvs = document.getElementById('ruler-canvas');
            // this.rulerCvs.width = this.verCvs.width;
            this.rulerCvs.width = $('.ruler-box').width();
            this.rulerCvs.height = 30;
            this.rulerCtx = this.rulerCvs.getContext('2d');

            // todo: 暂时不判断设为显示30%的时间段
            this.shownDuration = Math.floor(this.totalDuration * 0.3);
            this.unitDuration = this.shownDuration / (this.rulerCvs.width / this.unitLength);

            this.initShadow();

            this.initScrollbar();

            // draw
            this.setShadowRectData();
            this.drawShadowRects();
            this.drawShadowRuler();
            this.drawFrontCvs();
            // this.drawRuler();


            this.$scrollbar.on('mousedown', (event) => {
                const x = event.clientX;
                const scrollbarOffsetLeft = parseInt(this.$scrollbar.css('left'), 10);

                $(document).on('mousemove.forSb', (e) => {
                    const moveLength = e.clientX - x;
                    let newLeft = 0;
                    if ((scrollbarOffsetLeft + moveLength) < 0) {
                        newLeft = 0;
                    } else
                        if (scrollbarOffsetLeft + moveLength > this.scrollbarBoxContentWidth - this.$scrollbar.width()) {
                            newLeft = this.scrollbarBoxContentWidth - this.$scrollbar.width();
                        } else {
                            newLeft = scrollbarOffsetLeft + moveLength;
                        }

                    this.$scrollbar.css('left', newLeft);
                    this.drawFrontCvs();
                });

                $(document).on('mouseup.forSb', () => {
                    $(document).off('.forSb');
                });

            });
        });
        loader.start();
    }


    showStatusChanged(rowIndex) {
        // console.log('changed......');
        this.reDrawTheRow(rowIndex);
    }

    initScrollbar() {
        this.scrollbarBoxContentWidth = $('.scrollbar-box').width() - 30;
        // $('.scrollbar').outerWidth($('.scrollbar-box').width() * this.verCvs.width / this.shadowCvs.width);
        this.$scrollbar.width(this.scrollbarBoxContentWidth * this.verCvs.width / this.getLatestTotalCvsWidth());
        // console.log(`init:: version canvas width is: ${this.verCvs.width}`);
        // console.log();
    }

    formatRulerShowTime(time) {
        const h = Math.floor(time / 3600000);
        const m = Math.floor((time % 3600000) / 60000);
        const s = Math.floor((time % 60000) / 1000);
        const f = Math.floor(time % 1000 / 33);

        return (h > 9 ? h : '0' + h) + ' : '
            + (m > 9 ? m : '0' + m) + ' : '
            + (s > 9 ? s : '0' + s) + ' : '
            + (f > 9 ? f : '0' + f);
    }

    drawShadowRuler() {
        const cvs = this.shadowRulerCvs;
        const c = this.shadowRulerCtx;
        const stepTime = 200; // todo: 暂时写死 200ms 一个小刻度
        const stepWidth = Math.round(this.duration2Width(stepTime));

        c.font = '10px sans-serif';
        c.fillStyle = '#979797';
        c.strokeStyle = '#979797';
        c.lineWidth = 1;
        c.beginPath();
        console.log('stepWidth is: ' + stepWidth);
        for (let i = 0, x = 0.5; x < cvs.width; i++ , x += stepWidth) {
            // console.log(`i is: ${i}, x is: ${x}`);
            const y = (i % 10 === 0) ? 18 : 23;
            c.moveTo(x, y);
            c.lineTo(x, 30);

            c.stroke();
            // const text = i * stepTime;
            if (i % 10 === 0) {
                c.fillText(this.formatRulerShowTime(i * stepTime), x, 14);
            }
        }
        c.fillStyle = '#979797';
        c.fillRect(0, 30 - 2, cvs.width, 2);
        c.closePath();

        // $('body').append(cvs);
    }

    getLatestTotalCvsWidth() {
        this.totalCvsWidth = this.duration2Width(this.totalDuration);
        return this.totalCvsWidth;
    }

    unitLengthChanged(step) {
        this.unitLength += step;
        this.initShadow();
        this.initScrollbar();
        // this.setShadowRectData();
        this.updateShadowRectData();
        this.drawShadowRects();
        this.drawShadowRuler();
        this.drawFrontCvs();
        // console.log(`changed: unit length: ${this.unitLength},  unit duration: ${this.unitDuration}`);
    }


    initShadow() {
        // const totalDuration = this.totalDuration;
        const count = this.version_lists.length;
        const rectHeight = this.rectHeight;

        this.shadowCvs.width = this.shadowRulerCvs.width = this.getLatestTotalCvsWidth();
        this.shadowCvs.height = count * rectHeight;
        this.shadowCtx = this.shadowCvs.getContext('2d');

        this.shadowRulerCvs.height = 30;
        this.shadowRulerCtx = this.shadowRulerCvs.getContext('2d');

        // this.copyFinished = false;

        // console.log(`cvs width is: ${this.shadowCvs.width}`);
    }

    getScrollbarOffsetLeft() {
        return parseInt(this.$scrollbar.css('left'), 10);
    }

    // 暂时先不换算 测试用着
    getOffsetLeft() {
        return this.getScrollbarOffsetLeft() / this.scrollbarBoxContentWidth * this.getLatestTotalCvsWidth();
    }

    drawFrontCvs() {
        this.copyShadow2FrontCvs();
        this.drawActiveRect(this.activeRect);
    }

    copyShadow2FrontCvs() {
        const fc = this.verCtx;
        const sc = this.shadowCvs;
        const w = this.verCvs.width;
        const h = this.verCvs.height;

        const fr = this.rulerCtx;
        const sr = this.shadowRulerCvs;
        const rh = 30;  //  ruler height

        const start = this.getOffsetLeft();

        fc.clearRect(0, 0, w, h);
        fr.clearRect(0, 0, this.rulerCvs.width, rh);
        // fr.clearRect(0, 0, w, rh);
        fc.drawImage(sc, start, 0, w, h, 0, 0, w, h);
        fr.drawImage(sr, start, 0, this.rulerCvs.width, rh, 0, 0, this.rulerCvs.width, rh);
        // fr.drawImage(sr, start, 0, w, rh, 0, 0, w, rh);
        this.copyFinished = true;
    }

    updateShadowRectData() {

        this.shadowRectData.forEach((row) => {
            let ol = 0;

            row.forEach(rect => {
                rect.x = ol;
                rect.w = this.duration2Width(rect.version.duration);
                rect.pic.w = this.duration2Width(rect.version.movie.getActualDuration());
                ol += rect.w;
            });

        });

    }

    setShadowRectData() {
        // todo: 数据不要每次清空重新整理，取到的数据不改变时，只进行内部值的重新计算，需要改下结构，把图片文件存进来
        const lh = this.rectHeight;
        const version_lists = this.version_lists;
        const shadowRects = this.shadowRectData = [];

        this.copyFinished = false;

        version_lists.forEach((row, s) => {
            shadowRects[s] = [];
            let ol = 0;

            for (let i = 0; i < row.data.length; i++) {
                const item = row.data[i];

                const pic: Pic = {
                    w: this.duration2Width(item.movie.getActualDuration()),
                    h: lh - 18,
                    oh: 0,
                    ow: 0,
                    url: item.movie.picUrl
                };

                const rect: Rect = {
                    x: ol,
                    y: lh * s,
                    w: this.duration2Width(item.duration),
                    h: lh,
                    // isActive: false,
                    text: item.movie.title,
                    version: item,
                    pic: pic,
                    picObj: null,
                    // painted: false,
                };

                shadowRects[s].push(rect);
                ol += rect.w;
            }
        });
    }


    isInFrontCvs(rect: Rect) {
        const start = this.getOffsetLeft();
        const end = start + this.verCvs.width;
        return !(rect.x < start && (rect.x + rect.w) < start || rect.x > end && (rect.x + rect.w) < end);
    }

    drawShadowRects(rowIndex = -1) {
        const c = this.shadowCtx;
        const rects = this.shadowRectData;

        // const textMarginLeft = 6;
        // const textMarginTop = 2;

        c.clearRect(0, 0, this.shadowCvs.width, this.shadowCvs.height);

        c.fillStyle = '#BDD3DC';
        c.font = '11px sans-serif';
        c.textAlign = 'left';
        c.textBaseline = 'middle';

        if (rowIndex > -1) {
            this.drawShadowRectsTheRow(rects[rowIndex], rowIndex, c);
        } else {
            rects.forEach((row, index) => {
                this.drawShadowRectsTheRow(row, index, c);
            });
        }
    }

    reDrawTheRow(rowIndex) {
        this.drawShadowRects(rowIndex);
        this.drawFrontCvs();
    }

    drawShadowRectsTheRow(rowData, rowIndex, c) {

        rowData.forEach((r) => {
            c.fillRect(r.x + 1, r.y + 1, r.w - 1, r.h - 1);

            if (this.controlList[rowIndex].isShowPic) {
                if (r.picObj === null) {
                    const loader = new PxLoader();
                    const img = loader.addImage(r.version.movie.picUrl);
                    loader.addCompletionListener(() => {
                        r.picObj = img;
                        r.pic.oh = img.naturalHeight;
                        r.pic.ow = r.pic.oh * this.duration2Width(r.version.movie.getActualDuration()) / r.pic.h;
                        c.drawImage(
                            r.picObj,
                            0, 0, r.pic.ow, r.pic.oh,
                            r.x + 1, r.y + 1, r.pic.w - 2, r.h - 2
                            // r.x + 2, r.y + 18 + 1, r.pic.w - 2, r.pic.h - 1
                        );
                        this.drawShadowWords(r);
                        if (this.copyFinished && this.isInFrontCvs(r)) {
                            this.drawFrontCvs();
                        }
                    });
                    loader.start();
                } else {
                    r.pic.ow = r.pic.oh * this.duration2Width(r.version.movie.getActualDuration()) / r.pic.h;
                    c.drawImage(
                        r.picObj,
                        0, 0, r.pic.ow, r.pic.oh,
                        r.x + 1, r.y + 1, r.pic.w - 2, r.h - 2
                        // r.x + 1, r.y + 18 + 1, r.pic.w - 4, r.pic.h - 1
                    );
                    this.drawShadowWords(r);
                }
            } else {
                this.drawShadowWords(r);
            }

            // 立体边框线
            c.save();
            c.strokeStyle = '#fff';
            c.lineWidth = 1;
            c.beginPath();
            c.moveTo(r.x + 1, r.y + r.h);
            c.lineTo(r.x + 1, r.y + 1);
            c.lineTo(r.x + r.w, r.y + 1);
            c.stroke();
            c.strokeStyle = '#8399a2';
            c.beginPath();
            c.moveTo(r.x + r.w, r.y + 1);
            c.lineTo(r.x + r.w, r.y + r.h);
            c.lineTo(r.x + 1, r.y + r.h);
            c.stroke();
            c.restore();
        });
    }


    drawShadowWords(r) {
        const c = this.shadowCtx;
        // 给文字画背景
        c.save();
        c.globalAlpha = 0.5;
        c.fillStyle = '#fff';
        // c.fillStyle = '#43C8FF';
        const wordsList = [
            r.text,
            r.version.title
        ];
        const wordsWidth = c.measureText(wordsList[0]).width > c.measureText(wordsList[1]).width + 16 ?
            c.measureText(wordsList[0]).width : c.measureText(wordsList[1]).width + 16;
        const wordsHeight = 16;
        const wordsPadding = 5;
        c.fillRect(
            r.x + r.w / 2 - wordsWidth / 2 - wordsPadding,
            r.y + r.h / 2 - wordsHeight - wordsPadding,
            wordsWidth + wordsPadding * 2,
            wordsHeight * 2 + wordsPadding * 2);
        c.restore();
        c.save();
        c.fillStyle = '#111';
        c.textBaseline = 'middle';
        c.textAlign = 'left';
        wordsList.forEach((words, index) => {
            c.fillText(
                words,
                r.x + r.w / 2 - wordsWidth / 2 + 16 * index,
                r.y + r.h / 2 - wordsHeight / 2 + wordsHeight * index
            );
            if (index === 1) {
                c.save()
                c.globalCompositeOperation = 'difference';
                c.drawImage(this.statusIcons, 
                    r.x + r.w / 2 - wordsWidth / 2, 
                    r.y + r.h / 2 + 3,
                    10, 10);
                c.restore()
            }
        });
        c.restore();
    }


    duration2Width(duration) {
        return duration * this.unitLength / this.unitDuration;  // 1000ms 一个单位长度
    }

    width2Duration(width) {
        return width * this.unitDuration / this.unitLength;
    }

    clickHandle(e) {
        const whichClicked = this.whichClicked(e);
        // console.log(`active rect x: ${whichClicked.x}, y: ${whichClicked.y}, w: ${whichClicked.w}`);
        if (this.activeRect === whichClicked) {
            return;
        }
        this.activeRect = whichClicked;
        this.drawFrontCvs();
        
    }


    whichClicked(e) {
        const offsetLeft = this.getOffsetLeft();
        const fc = this.verCvs;
        const x = e.pageX - $(fc).offset().left + offsetLeft;
        const rowIndex = Math.floor((e.pageY - $(fc).offset().top) / this.rectHeight);
        const rowData = this.shadowRectData[rowIndex];
        const xIndex = rowData.findIndex((r) => {
            return r.x < x && (r.x + r.w) > x;
        });

        return xIndex === -1 ? null : { i: rowIndex, j: xIndex };
    }

    drawActiveRect(indexs) {
        if (!indexs) {
            return;
        }
        // if (!this.controlList[indexs['i']].isShow) {
        //     return;
        // }
        const offsetLeft = this.getOffsetLeft();
        const fcs = this.verCvs;
        const c = this.verCtx;
        const r = this.shadowRectData[indexs['i']][indexs['j']];

        const toX = r.x - offsetLeft;
        let clipboard;
        let clipboardCtx;


        if (this.controlList[indexs['i']].isShowPic) {
            // 绘制到front上面到参数
            clipboard = document.createElement('canvas');
            clipboard.width = r.w;
            clipboard.height = r.h;
            clipboardCtx = clipboard.getContext('2d');
            clipboardCtx.drawImage(
                fcs,
                toX, r.y, clipboard.width, clipboard.height,
                0, 0, clipboard.width, clipboard.height
            );

        }

        // 画指定格子
        // c.clearRect(0, 0, this.shadowCvs.width, this.shadowCvs.height);

        c.fillStyle = '#43C8FF';
        c.font = '11px sans-serif';
        c.textAlign = 'left';
        c.textBaseline = 'middle';

        c.save();
        // c.fillStyle = 'green';
        c.strokeStyle = '#43C8FF';
        c.strokeWidth = 5;
        c.fillRect(toX + 1, r.y + 1, r.w - 1, r.h - 1);
        // c.strokeRect(toX + 1, r.y + 1, r.w - 1, r.h - 1);
        c.restore();

        // r.pic.oh = img.naturalHeight;
        // r.pic.ow = r.pic.oh * this.duration2Width(r.version.movie.getActualDuration()) / r.pic.h;
        if (this.controlList[indexs['i']].isShowPic) {

            c.drawImage(
                clipboard,
                0, 0, clipboard.width, clipboard.height,
                toX, r.y, clipboard.width, clipboard.height
            );

        }
        c.save();
        c.strokeStyle = '#43C8FF';
        c.lineWidth = 4;
        c.strokeRect(toX + c.lineWidth / 2 + 1,
            r.y + 1 + c.lineWidth / 2,
            r.w - 1 - c.lineWidth,
            r.h - 1 - c.lineWidth);
        c.restore();

        // 给文字画背景
        c.save();
        // c.globalAlpha = 0.7;
        // c.fillStyle = '#fff';
        c.fillStyle = '#43C8FF';
        const wordsList = [
            r.text,
            r.version.title
        ];
        const wordsWidth = c.measureText(wordsList[0]).width > c.measureText(wordsList[1]).width + 16 ?
            c.measureText(wordsList[0]).width : c.measureText(wordsList[1]).width + 16;
        const wordsHeight = 16;
        const wordsPadding = 5;
        // const wordsLineHeight = 16;
        c.fillRect(
            toX + r.w / 2 - wordsWidth / 2 - wordsPadding,
            r.y + r.h / 2 - wordsHeight - wordsPadding,
            wordsWidth + wordsPadding * 2,
            wordsHeight * 2 + wordsPadding * 2);
        c.restore();

        c.save();
        c.fillStyle = '#fff';
        c.textBaseline = 'middle';
        c.textAlign = 'left';
        wordsList.forEach((words, index) => {
            c.fillText(
                words,
                toX + r.w / 2 - wordsWidth / 2 + 16 * index,
                r.y + r.h / 2 - wordsHeight / 2 + wordsHeight * index
            );
            if (index === 1) {
                // c.save()
                // c.globalCompositeOperation = 'difference';
                c.drawImage(this.statusIcons, 
                    toX + r.w / 2 - wordsWidth / 2, 
                    r.y + r.h / 2 + 3,
                    10, 10);
                // c.restore()
            }
        });
        c.restore();
        // this.drawShadowWords(r);

        // 立体边框线
        c.save();
        c.strokeStyle = '#d5f3ff';
        c.lineWidth = 1;
        c.beginPath();
        c.moveTo(toX + 1, r.y + r.h);
        c.lineTo(toX + 1, r.y + 1);
        c.lineTo(toX + r.w, r.y + 1);
        c.stroke();
        c.strokeStyle = '#1881ad';
        c.beginPath();
        c.moveTo(toX + r.w, r.y + 1);
        c.lineTo(toX + r.w, r.y + r.h);
        c.lineTo(toX + 1, r.y + r.h);
        c.stroke();
        c.restore();
    }

}
