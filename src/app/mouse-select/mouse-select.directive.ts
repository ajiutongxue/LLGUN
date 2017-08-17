// 版本三，mousedown后的move事件在document上
import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';
import { Renderer } from '@angular/core';
@Directive({
    selector: '[mouseSelect]'
})

export class MosueSelectDirective {

    _isDown = false;

    _start = {         // 记录初始点击坐标，相对于屏幕
        l: 0,
        t: 0
    };

    theRound = {
        ol: 0,         // 初始x坐标 left
        ot: 0,         // 初始y坐标 top
        l: 0,
        t: 0,
        w: 0,
        h: 0,
        mw: 0,         // max-width, mouse move - right
        mh: 0          // max-height, mouse move - bottom
    };

    theParent;         // 有可能出现滚动条的那个父容器
    // timer;

    _canvas;
    _cxt;

    docUpFun: Function;
    docMoveFun: Function;

    constructor(private el: ElementRef, private renderer: Renderer) {

    }

    ngOnInit() {
        this._canvas = this.el.nativeElement;
        this._cxt = this._canvas.getContext('2d');
        this.theParent = this._canvas.parentNode;

        this._canvas.style.background = 'transparent';
        this._canvas.style.position = 'absolute';
        this._canvas.style.left = 0;
        this._canvas.style.top = 0;
        this._canvas.style.zIndex = 0;
    }

    @HostListener('mousedown', ['$event']) onmousedown(e: MouseEvent) {
        // console.warn('>>>> down!!!!');
        if (!this._isDown) {
            this._isDown = true;
            this._canvas.style.zIndex = 299;
            this._canvas.style.opacity = 1;

            let canvasSize = this._canvas.getBoundingClientRect();

            this._start.l = e.pageX;
            this._start.t = e.pageY
            
            this.theRound.ol = e.pageX - this._canvas.getBoundingClientRect().left; // 如果canvas出去了  那就是 -- = 正
            this.theRound.ot = e.pageY - this._canvas.getBoundingClientRect().top;

            this.theRound.mw = canvasSize.left + canvasSize.width - this._start.l;
            this.theRound.mh = canvasSize.top + canvasSize.height - this._start.t;
        }

        // 鼠标移动事件监听
        this.docMoveFun = this.renderer.listenGlobal('document', 'mousemove', (e) => {
            if (this._isDown) {
                if(e.pageX - this._canvas.getBoundingClientRect().left < this.theRound.ol) {
                    // 鼠标左移动
                    this.theRound.l = (e.pageX - this._canvas.getBoundingClientRect().left) > 0 ? (e.pageX - this._canvas.getBoundingClientRect().left) : 0;
                    this.theRound.w = this.theRound.ol - this.theRound.l;
                } else {
                    // 鼠标右移动了
                    this.theRound.l = this.theRound.ol;
                    this.theRound.w = (e.pageX - this._canvas.getBoundingClientRect().left - this.theRound.l) < this.theRound.mw ? (e.pageX - this._canvas.getBoundingClientRect().left - this.theRound.l) : this.theRound.mw;
                }

                if (e.pageY - this._canvas.getBoundingClientRect().top < this.theRound.ot) {
                    // 鼠标向上移动
                    this.theRound.t = (e.pageY - this._canvas.getBoundingClientRect().top) > 0 ? (e.pageY - this._canvas.getBoundingClientRect().top) : 0;
                    this.theRound.h = this.theRound.ot - this.theRound.t;
                } else {
                    // 鼠标向下移动
                    this.theRound.t = this.theRound.ot;
                    this.theRound.h = (e.pageY - this._canvas.getBoundingClientRect().top - this.theRound.t) < this.theRound.mh ? (e.pageY - this._canvas.getBoundingClientRect().top - this.theRound.t) : this.theRound.mh;
                }
             
                requestAnimationFrame(() => {
                    this.clearCanvas();
                    this._cxt.fillStyle = 'rgba(169, 203, 237, .5)';
                    this._cxt.strokeStyle = '#50A6E1';
                    this._cxt.lineWidth = 1;
                    this._cxt.fillRect(this.theRound.l, this.theRound.t, this.theRound.w, this.theRound.h);
                    this._cxt.strokeRect(this.theRound.l + 0.5, this.theRound.t + 0.5, this.theRound.w, this.theRound.h);

                    if (e.pageY > this.theParent.getBoundingClientRect().top + this.theParent.getBoundingClientRect().height) {
                        this.theParent.scrollTop += 10;
                    }

                    if (e.pageY < this.theParent.getBoundingClientRect().top) {
                        this.theParent.scrollTop -= 10;
                    }

                    if (e.pageX > this.theParent.getBoundingClientRect().left + this.theParent.getBoundingClientRect().width) {
                        this.theParent.scrollLeft += 10;
                    }

                    if (e.pageX < this.theParent.getBoundingClientRect().left ) {
                        this.theParent.scrollLeft -= 10;
                    }
                });
            }
        });

        // 鼠标松开事件监听
        this.docUpFun = this.renderer.listenGlobal('document', 'mouseup', (e) => {
            if (this._isDown) {
                this.mouseUpHandler();

                this.docMoveFun();
                this.docUpFun();
            }
        });
    }

    mouseUpHandler() {
        this._isDown = false;
        this.clearCanvas();
        this._canvas.style.zIndex = 0;
        this._canvas.style.opacity = 0;
        // console.info('widht>>>>>> ', this.theRound.w, '   >>>>height>>>> ', this.theRound.h);
    }

    clearCanvas() {
        this._cxt.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }

}

