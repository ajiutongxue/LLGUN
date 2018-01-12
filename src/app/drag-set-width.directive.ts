import {Directive, ElementRef, HostListener, Renderer2, Input} from '@angular/core';

@Directive({
    selector: '[appDragSetWidth]'
})
export class DragSetWidthDirective {

    theParent;
    theOffset = 0;        // 默认最左边div用这个
    lineMovFn: Function;
    lineUpFn: Function;

    _direction = 1;  //  hor：水平拖， ver：垂直拖
    @Input() set direction(dir: number) {
        this._direction = dir || this._direction;
    }

    _minWidth = 200;
    _minHeight = 200;

    @Input() set minSize(min: number) {
        this._direction === 1 ? this._minWidth = min || this._minWidth : this._minHeight = min || this._minHeight;
    }

    _maxWidth = 460;
    _maxHeight = 460;

    @Input() set maxSize(max: number) {
        this._direction === 1 ? this._maxWidth = max || this._maxWidth : this._maxHeight = max || this._maxHeight;
    }

    constructor(private _ele: ElementRef, private renderer: Renderer2) {
    }

    @HostListener('mousedown', ['$event']) onmousedown() {
        this.theParent = this._ele.nativeElement.parentNode;
        this._ele.nativeElement.style.opacity = 1;

        this.lineMovFn = this.renderer.listen('document', 'mousemove', (e) => {
            const dis = (this._direction === 1 ? e.pageX : ($(window).height() - e.pageY)) - this.theOffset;
            const _max = this._direction === 1 ? this._maxWidth : this._maxHeight;
            const _min = this._direction === 1 ? this._minWidth : this._minHeight;

            this.theParent.style.flexBasis = (dis > _max ? _max : dis < _min ? _min : dis) + 'px';
        });

        this.lineUpFn = this.renderer.listen('document', 'mouseup', (e) => {
            this.lineMovFn();
            this.lineUpFn();
            this._ele.nativeElement.style.opacity = 0;
        });
    }
}
