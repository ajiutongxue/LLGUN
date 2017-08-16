import { Directive, ElementRef, Input, HostListener, OnInit } from '@angular/core';
import { Renderer } from '@angular/core';
@Directive({
    selector: '[mouseSelect]'
})

export class MosueSelectDirective {

    _isDown = false;

    _start = {
        l: 0,
        t: 0
    };

    theDiv;
    _box;

    constructor(private el: ElementRef, renderer: Renderer) {
        renderer.listenGlobal('document', 'mouseup', function() {
            if (this._isDown) {
                this.mouseUpHandler();
            }
        }.bind(this));
    }

    ngOnInit() {
        this.theDiv = this.el.nativeElement.querySelector('.mouse-select-div');
        this.theDiv.style.display = 'none';
        this.theDiv.style.position = 'absolute';
        this._box = this.el.nativeElement.getBoundingClientRect();
    }

    @HostListener('mousedown', ['$event']) onmousedown(e: MouseEvent) {
        if (!this._isDown) {
            this._isDown = true;
            
                this._start.l = e.pageX - this._box.left + this.el.nativeElement.scrollLeft;
                this._start.t = e.pageY - this._box.top + this.el.nativeElement.scrollTop;
        
                this.theDiv.style.left = e.pageX - this._box.left + this.el.nativeElement.scrollLeft + 'px';
                this.theDiv.style.top = e.pageY - this._box.top + this.el.nativeElement.scrollTop + 'px';
        }
    }

    @HostListener('mousemove', ['$event']) onmousemove(e) {
        if (this._isDown) {
            this.theDiv.style.display = 'block';

            if (e.pageX - this._box.left + this.el.nativeElement.scrollLeft < this._start.l) {
                this.theDiv.style.left = e.pageX - this._box.left + this.el.nativeElement.scrollLeft + 'px';
            }
            // this.theDiv.style.width = Math.abs(Math.abs(e.pageX) - Math.abs(this._start.l)) + this.el.nativeElement.scrollTop + 'px';
            this.theDiv.style.width = Math.abs(e.pageX - this._box.left + this.el.nativeElement.scrollLeft - this._start.l) + 'px';

            if (e.pageY - this._box.top + this.el.nativeElement.scrollTop < this._start.t) {
                this.theDiv.style.top = e.pageY - this._box.top + this.el.nativeElement.scrollTop + 'px';
            }
            // this.theDiv.style.height = Math.abs(Math.abs(e.pageY) - Math.abs(this._start.t)) + this.el.nativeElement.scrollLeft + 'px';
            this.theDiv.style.height = Math.abs(e.pageY - this._box.top + this.el.nativeElement.scrollTop - this._start.t) + 'px';

        }
    }

    @HostListener('mouseup') onmouseup() {
        if (this._isDown) {
            this.mouseUpHandler();
        }
    }

    mouseUpHandler() {
        this._isDown = false;
        this.theDiv.style.display = 'none';
        this.theDiv.style.width = 0;
        this.theDiv.style.height = 0;
    }

    @HostListener('mouseleave', ['$event']) onmouseleave(e) {

        // if (this._isDown) {
        //     setTimeout(function() {
        //         this._isDown = false;
        //         this.theDiv.style.display = 'none';
        //         this.theDiv.style.width = 0;
        //         this.theDiv.style.height = 0;    
        //     }.bind(this), 300);
        // }
    }

    // renderer.listenGlobal("documnet", "mouseup", (event: any)=>{
    //     alert('hhh')
    // });

}