import {Directive, ElementRef, HostListener, Renderer2} from '@angular/core';

@Directive({
    selector: '[appDragSetWidth]'
})
export class DragSetWidthDirective {

    theParent;
    theLeft = 0;        // 默认最左边div用这个
    minWidth = 200;
    maxWidth = 460;
    lineMovFn: Function;
    lineUpFn: Function;

    constructor(private _ele: ElementRef, private renderer: Renderer2) {
    }

    @HostListener('mousedown', ['$event']) onmousedown() {
        this.theParent = this._ele.nativeElement.parentNode;
        this._ele.nativeElement.style.opacity = 1;

        this.lineMovFn = this.renderer.listen('document', 'mousemove', (e) => {
            if ((e.pageX - this.theLeft) > this.maxWidth) {
                this.theParent.style.flexBasis = this.maxWidth + 'px';
            } else if ((e.pageX - this.theLeft) < this.minWidth) {
                this.theParent.style.flexBasis = this.minWidth + 'px';
            } else {
                this.theParent.style.flexBasis = e.pageX - this.theLeft + 'px';
            }
        });

        this.lineUpFn = this.renderer.listen('document', 'mouseup', (e) => {
            this.lineMovFn();
            this.lineUpFn();
            this._ele.nativeElement.style.opacity = 0;
        });
    }
}
