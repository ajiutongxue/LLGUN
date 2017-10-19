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
    NgModule,
    enableProdMode,
    OnInit,
    OnDestroy,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ICellEditorAngularComp} from 'ag-grid-angular';

@Component({
    selector: 'grid-string-input',
    template: `
        <!--<div class="ll-cell">-->
        <div class="ll-cell">aaa</div>
        <div class="ll-cell">bbb</div>
        <div class="select-box" style="position:absolute; top: 20px; width: 100%;">
            <div class="input-box">
                <i class="fa fa-play"></i>
                <input type="text" value="进行中" (click)="show01 = !show01"/>
            </div>
            <div *ngIf="true" class="modal-flatest-container put-down" style="width: 150px; height: 130px;">
                <div class="select-content common-content">
                    <table class="table-fixed status-body status-col-3">
                        <tr>
                            <td><i class="fa fa-fw fa-stop"></i></td>
                            <td>stp</td>
                            <td>暂停</td>
                        </tr>
                        <tr>
                            <td><i class="fa fa-fw fa-play"></i></td>
                            <td>pl</td>
                            <td>进行中</td>
                        </tr>
                        <tr>
                            <td><i class="fa fa-fw fa-undo"></i></td>
                            <td>fin</td>
                            <td>完成</td>
                        </tr>
                        <tr>
                            <td><i class="fa fa-fw fa-play"></i></td>
                            <td>pl</td>
                            <td>进行中</td>
                        </tr>
                        <tr>
                            <td><i class="fa fa-fw fa-undo"></i></td>
                            <td>fin</td>
                            <td>完成</td>
                        </tr>
                    </table>
                </div>
            </div>
        <!--</div>-->
        </div>`,
})

export class GridStringInput implements ICellEditorAngularComp {
    private value: String = '';
    @ViewChild('string', {read: ViewContainerRef}) private input;
    show01 = false;
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
