/**
 * Created by yang on 2017/9/21.
 */
import {
    Input,
    Output,
    EventEmitter,
    Component,
    ViewContainerRef,
    ViewChild,
    AfterViewInit,
    NgModule
} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular/main';
// import {FormsModule} from "@angular/forms";

@Component({
    selector: 'cell-number',
    template: `
        <div class="ll-cell label-cell">
            <div class="label-cell-content">
                <span class="ll-label">
                    <i class="fa fa-user"></i>
                    <span>英俊 YingJun</span>
                </span>
            
                <span class="ll-label">
                    <i class="fa fa-user"></i>
                    <span>英俊 YingJun</span>
                </span>
            
                <span class="ll-label">
                    <i class="fa fa-user"></i>
                    <span>英俊 YingJun</span>
                </span>
            </div>
        </div>
        <!--<div class="ll-cell" style="color:#f00" tabindex="1" *ngFor="let item of value">{{item}}</div>-->
        <!--<div class="ll-cell" style="color:#f00" tabindex="1" >{{value}}</div>-->
    `,
})

export class GridStringRenderer {
    private items: any[] = [];
    value: any = [];

    constructor() {
    }

    agInit(params: any): void {
        this.value = params.value;
    }
}
