import {Component, OnInit} from '@angular/core';


@Component ({
    selector: 'app-my-new-task-detail',
    templateUrl: './my-new-task-detail.component.html',
    styleUrls: ['./my-new-task-detail.component.less', './layout.less', './log.less', './files.less', './detail-info.less']
})
export class MyNewTaskDetailComponent implements OnInit {

    tab = 'info';

    constructor() {
    }

    ngOnInit() {
    }

}
