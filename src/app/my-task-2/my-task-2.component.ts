import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-my-task-2',
    templateUrl: './my-task-2.component.html',
    styleUrls: ['./my-task-2.component.less', '../my-new-task/my-new-task.component.less']
})
export class MyTask2Component implements OnInit {

    tab = 'tasks';

    constructor() {
    }

    ngOnInit() {
    }

}
