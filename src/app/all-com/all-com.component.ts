import {Component, Output, Input, ViewChild} from '@angular/core';

@Component({
    selector: 'all-component',
    templateUrl: './all-com.component.html',
    styleUrls: ['group-select.less']
})

export class AllComponentComponent {
    myopt = {
        inline: true
    }
//     dateOptions;

//     constructor() {
//     this.dateOptions.dateFormat = 'yyyy-mm-dd';
//     this.dateOptions.firstDayOfWeek = 'su';
//     this.dateOptions.sunHighlight = true;
//     this.dateOptions.selectionTxtFontSize = '14px';
//     this.dateOptions.inline = true;
// }

    params = {

        dataSource: [
            {id: 1, description: '任务名', name: 'content', nullable: false, editable: true, visible: true},
            {id: 11, description: 'KPI', name: 'kpi', nullable: true, editable: true, visible: false},
            {id: 12, description: '百分比', name: 'reach_rate', nullable: true, editable: true, visible: false},
            {id: 20, description: '备注', name: 'remark', nullable: true, editable: true, visible: false},
            {id: 21, description: '开始日期', name: 'start_date', nullable: true, editable: true, visible: false},
            {id: 22, description: '结束日期', name: 'due_date', nullable: true, editable: true, visible: false},
            {id: 300, description: '通知单', name: 'ticket', nullable: true, editable: true, visible: false},
            {id: 301, description: '用时', name: 'duration', nullable: true, editable: true, visible: false},
            {id: 1001, description: '连接对象', name: 'entity_id', nullable: true, editable: true, visible: false},
            {id: 1211, description: '创建时间', name: 'created_at', nullable: true, editable: true, visible: false},
            {id: 2011, description: '项目名', name: 'project_id', nullable: true, editable: true, visible: false},
            {id: 2211, description: '步骤', name: 'step_id', nullable: true, editable: true, visible: false}
        ],
        pipeLineSource: [
            {id: 1, description: 'pipeline1', color: '#00FFFF', nullable: true, editable: true, visible: false},
            {id: 2, description: 'ZZZZZZZZZ', color: '#A52A2A', nullable: true, editable: true, visible: false},
            {id: 3, description: '动画', color: '#5F9EA0', nullable: true, editable: true, visible: false},
            {id: 50, description: '模型', color: '#D2691E', nullable: true, editable: true, visible: false},
            {id: 60, description: '道具', color: '#6495ED', nullable: true, editable: true, visible: false},
            {id: 300, description: '场景', color: '#BDB76B', nullable: true, editable: true, visible: false},
            {id: 345, description: '测试', color: '#9400D3', nullable: true, editable: true, visible: false},
            {id: 347, description: 'xL123', color: '#D19275', nullable: true, editable: true, visible: false},
            {id: 378, description: '567ss', color: '#808080', nullable: true, editable: true, visible: false},
            {id: 1007, description: '中标123', color: '#CD5C5C', nullable: true, editable: true, visible: false},
            {id: 2008, description: '噢as32', color: '#FFFACD', nullable: true, editable: true, visible: false},
            {id: 3009, description: 'ttttssss', color: '#ADD8E6', nullable: true, editable: true, visible: false}
        ]
    };

    uploader = {
        isUploading: false
    };

}

