import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'note-add',
    templateUrl: './note-add.component.html',
    styleUrls: ['./note-add.component.less']
})
export class NoteAddComponent implements OnInit {

    hideAddPanel = true;
    hideStatusSelect = false;
    hideSearchSelect = false;

    constructor() {
    }

    ngOnInit() {
    }

}
