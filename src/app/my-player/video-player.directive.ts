import {Directive, ElementRef, OnInit} from '@angular/core';

@Directive({
    selector: '[appVideoPlayer]'
})
export class VideoPlayerDirective {
    vdo = document.createElement('video');
    ctrBar;

    constructor(private ele: ElementRef) {
    }

    ngOnInit() {
        // this.ctrBar.ele = this.ele.nativeElement.parentNode.querySelector('.player-ctrl-box');
        // this.ctrBar.play = this.ctrBar.ele.querySelector('.fa-play');
        this.vdo.src = '../../assets/style/tmpImg/v.mp4';
        this.vdo.style.cssText = 'width: 100%; height: 100%;';
        this.ele.nativeElement.appendChild(this.vdo);
    }

    vdoPlay = function () {
        this.vdo.play();
    };
}
