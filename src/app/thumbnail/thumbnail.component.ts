import {Component, Input} from '@angular/core';

@Component({
    selector: 'thumbnail',
    templateUrl: './thumbnail.component.html',
    styleUrls: ['./thumbnail.component.less']
})

export class ThumbnailComponent {
    @Input()
    notShowThumFiels;

    curRange: number = 1.5;
    dataSource = [
        {
            show: 1,
            name: '名称',
            value: '项目一自称一'
        },
        {
            show: 1,
            name: '创建人',
            value: '刘大宝'
        },
        {
            show: 1,
            name: '创建时间',
            value: '2016-12-12 '
        },
    ];

    showRange(e) {
        this.curRange = e.target.value;
    }
}
