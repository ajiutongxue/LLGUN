import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-alert-dialog',
    templateUrl: './alert-dialog.component.html',
    styleUrls: ['./alert-dialog.component.less']
})
export class AlertDialogComponent implements OnInit {

    isShowAlert = true;
    mask = false;

    constructor() {
    }

    ngOnInit() {
    }

}
