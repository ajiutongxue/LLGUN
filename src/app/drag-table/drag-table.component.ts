import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-drag-table',
    templateUrl: './drag-table.component.html',
    styleUrls: ['./drag-table.component.less']
})
export class DragTableComponent implements OnInit {

  // 一行的所有单元格的宽度组成的数组
    w = [28,50,80,50,80,50,80,50,80,50]
    tw = 0
    $tbBody = null
    dragTbContainerScrollLeft = 0

    tbHeaderData_1 = ['Id','Thumbnail','Shot Code','Sequence','Status','Id','Status','Id','Status','Id',]
    tbHeaderData_2 = ['Id','Thumbnail','Shot Code','Sequence','Status','Id','Status','Id','Status','Id',]
    // body的数据这里就写成一样的了
    tbBodyData = [
        ['956','null','sdf3424545','6464','ok','4','345','345','--','22'],
        ['956','null','sdf3424545','6464','ok','4','345','345','--','22'],
        ['956','null','sdf3424545','6464','ok','4','345','345','--','22'],
        ['956','null','sdf3424545','6464','ok','4','345','345','--','22'],
        ['956','null','sdf3424545','6464','ok','4','345','345','--','22'],
        ['956','null','sdf3424545','6464','ok','4','345','345','--','22'],
    ]

    totalWidth() {
        this.tw = this.w.reduce((pre, cur) => {
            return pre + cur
        });
        // console.log(this.tw)
    }

    minWidth = 10;

    dragWidth(e, index) {
        $('body').css('cursor', 'col-resize');

        let start = e.pageX;
        let cur = start;
        let oldWidth = this.w[index]
        // console.log(`down: x is ${start}`);
        
        $(window).on('mousemove.dragWidth', (event) => {
            cur = event.pageX;
            // console.log(`move: x is ${cur}`);
            let newWidth = oldWidth + (cur - start);
            newWidth > this.minWidth ? this.w[index] = newWidth : this.w[index] = this.minWidth;
            this.totalWidth()
            $(window).on('mouseup.dragWidth', () => {
                $(window).off('.dragWidth');
                $('body').css('cursor', 'auto');
            })
        });
    }

    constructor() { }

    ngOnInit() {
        this.totalWidth()
        this.$tbBody = $('.tb-body');
        console.log(`length: ${this.$tbBody.length}`);

        this.$tbBody.on('scroll', (event) => {
            console.log(`skrskr`);
            this.dragTbContainerScrollLeft = -$(event.target).scrollLeft()
        });

    }

}
