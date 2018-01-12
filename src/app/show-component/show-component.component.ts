import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-show-component',
    templateUrl: './show-component.component.html',
    styleUrls: ['./show-component.component.css']
})
export class ShowComponentComponent implements OnInit {
    isCreateHistory = true;
    selectedFile = true; // 是否选择了文件
    isCatchFile = false; // 是否鼠标点中文件在进行拖拽
    isStepOne = false;
    isHaveParent = true;

    constructor() {
    }

    ngOnInit() {
    }

}
