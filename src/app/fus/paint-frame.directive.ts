import {Directive, HostListener, ElementRef, Renderer2, OnInit} from '@angular/core';

@Directive({
    selector: '[appPaintFrame]',
})
export class PaintFrameDirective {
    theCanvas = document.createElement('canvas');
    // thediv = document.createElement('div');
    theCtx;
    theBg = new Image(); // long picture
    theOneWidth = 400; // get from database? // 实际截图的单张图片原始尺寸 ／／绘制时，从长图截取的宽度
    theOneHeight = 226;
    theUrl = '';
    _count = 0; // 长图中截图数量
    _boxWidth = 0; // 含背景的div，即外层container
    _x = 0; // 绘制时，相对长图的坐标
    _y = 0;

    constructor(private ele: ElementRef, private renderer: Renderer2) {
    }

    ngOnInit() {
        this.theBg.src = this.ele.nativeElement.style.backgroundImage.replace('url("', '').replace('")', '');
        this._count = Math.floor(this.theBg.width / this.theOneWidth);
        // 以后如果canvas的宽和外层container宽不一致时，此处不会有影响
        this._boxWidth = this.ele.nativeElement.getBoundingClientRect().width;
        // this.thediv.innerHTML = '<ul><li>hahaha</li></ul>';
    }

    @HostListener('mousemove', ['$event']) onmousemove(event) {
        if (!this.ele.nativeElement.getElementsByTagName('canvas').length) {
            this.ele.nativeElement.append(this.theCanvas);
            // this.ele.nativeElement.append(this.thediv);
        }
        // 此处按照canvas和外层的container宽高一致的情况计算
        this.theCanvas.width = this.ele.nativeElement.getBoundingClientRect().width;
        this.theCanvas.height = this.ele.nativeElement.getBoundingClientRect().height;
        this.theCtx = this.theCanvas.getContext('2d');

        requestAnimationFrame(() => {
            this.theCtx.clearRect(0, 0, this.theCanvas.width, this.theCanvas.height);
            this.setCurrentFrameX(event.pageX - this.ele.nativeElement.getBoundingClientRect().left);
            this.theCtx.drawImage(
                this.theBg, this._x, this._y, this.theOneWidth, this.theOneHeight,
                0, 0, this.theCanvas.width, this.theCanvas.height);
        });

        // this.renderer.listen('this.ele.nativeElement', 'mouseout', (e) => {
        //     this.theCanvas.remove();
        // });
    }

    setCurrentFrameX(pos_x, one_w = this.theOneWidth, small_one_w = this._boxWidth / this._count) {
        this._x = Math.floor(pos_x / small_one_w) * one_w;
    }

}
