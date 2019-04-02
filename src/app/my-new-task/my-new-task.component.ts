import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-my-new-task',
    templateUrl: './my-new-task.component.html',
    styleUrls: ['./my-new-task.component.less', './layout.less', './context-menu.less']
})
export class MyNewTaskComponent implements OnInit {

    currentTab = 'finished';
    toggle = false;
    isContextMenu = false;
    isShowUserMenu = false;

    constructor() {
        document.addEventListener('contextmenu', (e) => {
            e.returnValue = false;
            this.isContextMenu = true;

            document.addEventListener('click', function cancelContext() {
                this.isContextMenu = false;
                document.removeEventListener('click', cancelContext);
            }.bind(this));

        });
    }

    ngOnInit() {
    }

}
