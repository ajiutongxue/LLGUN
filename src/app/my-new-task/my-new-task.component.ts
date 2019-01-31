import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-my-new-task',
    templateUrl: './my-new-task.component.html',
    styleUrls: ['./my-new-task.component.less', './layout.less']
})
export class MyNewTaskComponent implements OnInit {

    currentTab = 'waiting';
    toggle = false;


    constructor() {
    }

    ngOnInit() {
    }

}
