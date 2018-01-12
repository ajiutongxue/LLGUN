import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-note-msg',
    templateUrl: './note-msg.component.html',
    styleUrls: ['./note-msg.component.less', './upload-box.less']
})
export class NoteMsgComponent implements OnInit {
    isShowFile = true;

    constructor() {
    }

    ngOnInit() {
    }

}
