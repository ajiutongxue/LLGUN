import { Component } from '@angular/core';

import {ICellEditorAngularComp} from 'ag-grid-angular';


@Component({
    selector: 'app-grid-user',
    templateUrl: './user.component.html'
})

export class GridUserComponent implements ICellEditorAngularComp {
    value;
    constructor() {

    }

    // 初始化
    agInit(params: any): void {
        this.value = params.value;
    }

    // 值返回
    getValue(): any {
        return this.value + '这是测试';
    }

    // 弹出
    isPopup(): boolean {
        return false;
    }
}
