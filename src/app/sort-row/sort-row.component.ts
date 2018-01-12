import {Component, OnInit} from '@angular/core';
import {DragDropSortTableService, DragDropService} from '../sort-table-directive/sort-table.service';

@Component({
    selector: 'app-sort-row',
    templateUrl: './sort-row.component.html',
    styleUrls: ['./sort-row.component.css'],
    providers: [DragDropSortTableService, DragDropService]
})
export class SortRowComponent implements OnInit {


    dataSource = [
        { id: 1, description: '任务名', name: 'content', nullable: false, editable: true, visible: true },
        { id: 11, description: 'KPI', name: 'kpi', nullable: true, editable: true, visible: false },
        { id: 12, description: '百分比', name: 'reach_rate', nullable: true, editable: true, visible: false },
        { id: 20, description: '备注', name: 'remark', nullable: true, editable: true, visible: false },
        { id: 21, description: '开始日期', name: 'start_date', nullable: true, editable: true, visible: false },
        { id: 22, description: '结束日期', name: 'due_date', nullable: true, editable: true, visible: false },
        { id: 300, description: '通知单', name: 'ticket', nullable: true, editable: true, visible: false },
        { id: 301, description: '用时', name: 'duration', nullable: true, editable: true, visible: false },
        { id: 1001, description: '连接对象', name: 'entity_id', nullable: true, editable: true, visible: false },
        { id: 1211, description: '创建时间', name: 'created_at', nullable: true, editable: true, visible: false },
        { id: 2011, description: '项目名', name: 'project_id', nullable: true, editable: true, visible: false },
        { id: 2211, description: '步骤', name: 'step_id', nullable: true, editable: true, visible: false }
        ];

    constructor() {
    }

    ngOnInit() {
    }

}
