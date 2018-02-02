import { Component } from '@angular/core';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.less']
})

export class LayoutComponent {
    // contextDisplay = 'block';
    isActive = false;

    showConfirm = false;

    hideMsg = true;
    hideErr = true;

    treeDataSource = [{
        id: 82741,
        name: '1',
        children: [{
            name: '名ASF就爱上了',
            children: [{
                assign_id: null,
                assign_date: '',
                content: '模板名称板名称(asset模板)1',
                created_at: '2017-08-04 14:44:49',
                created_by_id: 6,
                entity_type: '资产',
                user: '刘大宝',
                entity_type_icon: 'fa fa-cube',
                imgUrl: '/assets/style/images/thumbnail-default-task.png',
            }, {
                assign_id: null,
                assign_date: '',
                content: '模板名称(asset模板)1',
                created_at: '2017-08-04 14:44:49',
                created_by_id: 6,
                entity_type: '资产',
                user: '刘大宝',
                entity_type_icon: 'fa fa-cube',
                imgUrl: '/assets/style/images/thumbnail-default-shot.png',
            }, {
                assign_id: null,
                assign_date: '',
                content: '模板名称(asset模板)1',
                created_at: '2017-08-04 14:44:49',
                created_by_id: 6,
                entity_type: '资产',
                user: '刘大宝',
                entity_type_icon: 'fa fa-cube',
                imgUrl: '/assets/style/images/thumbnail-default-shot.png',
            }],
        }]
    }, {
        id: 827412,
        name: '122',
        children: [{
            name: '名ASF就爱上了',
            children: [{
                assign_id: null,
                assign_date: '',
                content: '模板名称板名称(asset模板)1',
                created_at: '2017-08-04 14:44:49',
                created_by_id: 6,
                entity_type: '资产',
                user: '刘大宝',
                entity_type_icon: 'fa fa-cube',
                imgUrl: '/assets/style/images/thumbnail-default-task.png',
            }, {
                assign_id: null,
                assign_date: '',
                content: '模板名称(asset模板)1',
                created_at: '2017-08-04 14:44:49',
                created_by_id: 6,
                entity_type: '资产',
                user: '刘大宝',
                entity_type_icon: 'fa fa-cube',
                imgUrl: '/assets/style/images/thumbnail-default-task.png',
            }, {
                assign_id: null,
                assign_date: '',
                content: '模板名称(asset模板)1',
                created_at: '2017-08-04 14:44:49',
                created_by_id: 6,
                entity_type: '资产',
                user: '刘大宝',
                entity_type_icon: 'fa fa-cube',
                imgUrl: '/assets/style/images/thumbnail-default-shot.png',
            }],
        }]
    }, {
        id: 8274123,
        name: '3名就爱上了',
            children: [{
                assign_id: null,
                assign_date: '',
                content: '模板名称板名称(asset模板)1',
                created_at: '2017-08-04 14:44:49',
                created_by_id: 6,
                entity_type: '资产',
                user: '刘大宝',
                entity_type_icon: 'fa fa-cube',
                imgUrl: '/assets/style/images/thumbnail-default-shot.png',
            }, {
                assign_id: null,
                assign_date: '',
                content: '模板名称(asset模板)1',
                created_at: '2017-08-04 14:44:49',
                created_by_id: 6,
                entity_type: '资产',
                user: '刘大宝',
                entity_type_icon: 'fa fa-cube',
                imgUrl: '/assets/style/images/img2.jpg',
            }, {
                assign_id: null,
                assign_date: '',
                content: '模板名称(asset模板)1',
                created_at: '2017-08-04 14:44:49',
                created_by_id: 6,
                entity_type: '资产',
                user: '刘大宝',
                entity_type_icon: 'fa fa-cube',
                imgUrl: '/assets/style/images/img3.jpg',
            }],
    }];

// treeDataSource = {
//     id: 82741,
//     name: '名ASF就爱上了',
//     children: [{
//         assign_id: null,
//         assign_date: '',
//         content: '模板名称板名称(asset模板)1',
//         created_at: '2017-08-04 14:44:49',
//         created_by_id: 6,
//         entity_type: '资产',
//         user: '刘大宝',
//         entity_type_icon: 'fa fa-cube',
//         imgUrl: '/assets/style/images/thumbnail-default-task.png',
//     }]
// };

    treeOptions = {
        useVirtualScroll: true,
        nodeHeight: 24,
        displayField: 'content',
        animateExpand: true,
        animateSpeed: 15,
        // levelPadding: 15,
        animateAcceleration: 1.5,
        actionMapping: {
            // mouse: {
            //     contextMenu: (tree, node, $event) => {
            //         $event.preventDefault();
            //         this.contextDisplay = 'block';
            //         setSubPopupPosition3($event.target.getBoundingClientRect(), this.menuDiv, 4);
            //     }
            // }
        }
    };
}
