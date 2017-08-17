// 第一、二版本，mousedown时的move事件在canvas上

import { Directive, ElementRef, Input, HostListener, OnInit, Attribute } from '@angular/core';
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

    theRound = {
        l: 0,
        t: 0,
        w: 0,
        h: 0
    };

    // defaultSet;

    _canvas;
    _cxt;
    // theDiv;
    // _box;

    docUpFun: Function;
    docMoveFun: Function;

    constructor(private el: ElementRef, private renderer: Renderer, @Attribute('defaultSet') public defSet: string) {

    }

    ngOnInit() {
        this._canvas = this.el.nativeElement;
        this._cxt = this._canvas.getContext('2d');
        // this.renderer.listenGlobal('document', 'click', function(){});
    }

    @HostListener('mousedown', ['$event']) onmousedown(e: MouseEvent) {
        console.warn('>>>> down!!!!');
        if (!this._isDown) {
            this._isDown = true;
            this._canvas.style.zIndex = 299;
            
            this._start.l = e.pageX - this._canvas.getBoundingClientRect().left;
            this._start.t = e.pageY - this._canvas.getBoundingClientRect().top;
        
            this.theRound.l = this._start.l;
            this.theRound.t = this._start.t;
        }
    }

    @HostListener('mousemove', ['$event']) onmousemove(e) {
        console.warn('>>>> move!!!!');
        
        if (this._isDown) {
            // this.theDiv.style.display = 'block';

            if (e.pageX - this._canvas.getBoundingClientRect().left < this._start.l) {
                this.theRound.l = e.pageX - this._canvas.getBoundingClientRect().left;
            }
            this.theRound.w = Math.abs(e.pageX - this._canvas.getBoundingClientRect().left - this._start.l);

            if (e.pageY - this._canvas.getBoundingClientRect().top < this._start.t) {
                this.theRound.t = e.pageY - this._canvas.getBoundingClientRect().top;
            }
            this.theRound.h = Math.abs(e.pageY - this._canvas.getBoundingClientRect().top - this._start.t);

            requestAnimationFrame(() => {
                this.clearCanvas();
                this._cxt.fillStyle = 'rgba(169, 203, 237, .5)';
                this._cxt.strokeStyle = '#50A6E1';
                this._cxt.lineWidth = 1;
                this._cxt.fillRect(this.theRound.l, this.theRound.t, this.theRound.w, this.theRound.h);
                this._cxt.strokeRect(this.theRound.l + 0.5, this.theRound.t + 0.5, this.theRound.w, this.theRound.h);
            });
        }
    }

    @HostListener('mouseup') onmouseup() {
        console.warn('>>>> up!!!!');
        // alert(this.defSet);
        
        if (this._isDown) {
            this.mouseUpHandler();
        }

        this.docUpFun();
        this.docMoveFun();
    }

    @HostListener('mouseleave') onmouseleave() {
        console.warn('>>>> leave!!!!');

        this.docUpFun = this.renderer.listenGlobal('document', 'mouseup', () => {
            if (this._isDown) {
                this.mouseUpHandler();
            }
        });

        this.docMoveFun = this.renderer.listenGlobal('document', 'mousemove', (event) => {
            if (this._isDown) {
                console.info(event.pageX);
            }
        });

    }   

    mouseUpHandler() {
        this._isDown = false;
        this.clearCanvas();
        this._canvas.style.zIndex = 0;
    }

    clearCanvas() {
        this._cxt.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }

    // drawRect(x, y, w, h) {
    //     this._cxt.fillRect(x, y, w, h);
    // }


}

// export class MosueSelectDirective {

//     _isDown = false;

//     _start = {
//         l: 0,
//         t: 0
//     };

//     theDiv;
//     _box;

//     constructor(private el: ElementRef, renderer: Renderer) {
//         renderer.listenGlobal('document', 'mouseup', function() {
//             if (this._isDown) {
//                 this.mouseUpHandler();
//             }
//         }.bind(this));
//     }

//     ngOnInit() {
//         this.theDiv = this.el.nativeElement.querySelector('.mouse-select-div');
//         this.theDiv.style.display = 'none';
//         this.theDiv.style.position = 'absolute';
//         this._box = this.el.nativeElement.getBoundingClientRect();
//     }

//     @HostListener('mousedown', ['$event']) onmousedown(e: MouseEvent) {
//         if (!this._isDown) {
//             this._isDown = true;
            
//                 this._start.l = e.pageX - this._box.left + this.el.nativeElement.scrollLeft;
//                 this._start.t = e.pageY - this._box.top + this.el.nativeElement.scrollTop;
        
//                 this.theDiv.style.left = e.pageX - this._box.left + this.el.nativeElement.scrollLeft + 'px';
//                 this.theDiv.style.top = e.pageY - this._box.top + this.el.nativeElement.scrollTop + 'px';
//         }
//     }

//     @HostListener('mousemove', ['$event']) onmousemove(e) {
//         if (this._isDown) {
//             this.theDiv.style.display = 'block';

//             if (e.pageX - this._box.left + this.el.nativeElement.scrollLeft < this._start.l) {
//                 this.theDiv.style.left = e.pageX - this._box.left + this.el.nativeElement.scrollLeft + 'px';
//             }
//             // this.theDiv.style.width = Math.abs(Math.abs(e.pageX) - Math.abs(this._start.l)) + this.el.nativeElement.scrollTop + 'px';
//             this.theDiv.style.width = Math.abs(e.pageX - this._box.left + this.el.nativeElement.scrollLeft - this._start.l) + 'px';

//             if (e.pageY - this._box.top + this.el.nativeElement.scrollTop < this._start.t) {
//                 this.theDiv.style.top = e.pageY - this._box.top + this.el.nativeElement.scrollTop + 'px';
//             }
//             // this.theDiv.style.height = Math.abs(Math.abs(e.pageY) - Math.abs(this._start.t)) + this.el.nativeElement.scrollLeft + 'px';
//             this.theDiv.style.height = Math.abs(e.pageY - this._box.top + this.el.nativeElement.scrollTop - this._start.t) + 'px';

//         }
//     }

//     @HostListener('mouseup') onmouseup() {
//         if (this._isDown) {
//             this.mouseUpHandler();
//         }
//     }

//     mouseUpHandler() {
//         this._isDown = false;
//         this.theDiv.style.display = 'none';
//         this.theDiv.style.width = 0;
//         this.theDiv.style.height = 0;
//     }

//     @HostListener('mouseleave', ['$event']) onmouseleave(e) {

//         // if (this._isDown) {
//         //     setTimeout(function() {
//         //         this._isDown = false;
//         //         this.theDiv.style.display = 'none';
//         //         this.theDiv.style.width = 0;
//         //         this.theDiv.style.height = 0;    
//         //     }.bind(this), 300);
//         // }
//     }

//     // renderer.listenGlobal("documnet", "mouseup", (event: any)=>{
//     //     alert('hhh')
//     // });

// }