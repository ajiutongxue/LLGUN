import {Component, HostListener, OnInit} from '@angular/core';

@Component({
    selector: 'app-my-task',
    templateUrl: './my-task.component.html',
    styleUrls: ['./my-task.component.less']
})

export class MyTaskComponent {
    editing = false;   // 遮罩层 dialog
    showMenu = false; // 状态下拉菜单
    outing = false;


    taskCards = [
        {
            'type': 'shot',
            'name': 'mytask0001',
            'process': '30%',
            'status': '进行中'
        }, {
            'type': 'shot',
            'name': 'mytask0001',
            'process': '90%',
            'status': '暂停'
        }, {
            'type': 'asset',
            'name': 'mytask0001',
            'process': '10%',
            'status': '进行中'
        }, {
            'type': 'sequence',
            'name': 'mytask0001',
            'process': '100%',
            'status': '完成'
        }, {
            'type': 'shot',
            'name': 'mytask0001',
            'process': '30%',
            'status': '进行中'
        }, {
            'type': 'shot',
            'name': 'mytask0001',
            'process': '90%',
            'status': '暂停'
        }, {
            'type': 'asset',
            'name': 'mytask0001',
            'process': '10%',
            'status': '进行中'
        }, {
            'type': 'sequence',
            'name': 'mytask0001',
            'process': '100%',
            'status': '完成'
        }
    ];

    /////
    // tabs
    // tasks finished waiting
    currentTab = 'tasks';
    finishedList = [];

    // tasklist 重新计算
    countInRow = 0; // 每行能显示下的条数
    listRows = 1; // tasks行数
    rowHeight = 300;
    currentRow = 0; // 当前行 0,1,2...
    baseTop = 0; // 单行居中时top
    taskListContainerTop = 0;
    itemsInCurrentRow = [];
    maskHeight = 100;


    // 计时
    cur_hour: string = this.timeFormat(23, 3); // 小时三位数字表示
    cur_minutes: string = this.timeFormat(59, 2); // 分钟两位数字表示
    cur_seconds = 59000;  // 取到的毫秒数
    needTime = 60000;

    numberList = [];

    // return：字符串
    timeFormat(tm, size) {
        let s = tm.toString();
        if (s.length < size) {
            for (let i = 0; i < size - s.length; i++) {
                s = '0' + s;
            }
        }
        // console.log('<><><><><><><> ' + s);
        return s;
    }

    // pos: x; ==> this.numberList[x]
    changeMinutes(elArr, pos) {
        elArr[pos].move = true;
        setTimeout(() => {
            elArr[pos].move = false;
            if (pos === 3 && elArr[pos].val === 5) {
                elArr[pos].val = 0;
                this.doPrevAnimate(pos);
            } else if (elArr[pos].val === 9) {
                elArr[pos].val = 0;
                this.doPrevAnimate(pos);
            } else {
                elArr[pos].val = elArr[pos].val + 1;
            }
        }, 500); // 500是css动画的时间
    }

    doPrevAnimate(pos) {
        if (pos === 0) {
            return; // 一个任务1000小时了
        }
        this.changeMinutes(this.numberList, pos - 1);
    }

    constructor() {
        this.numberList = [
            { // 时 百位
                el: document.documentElement.querySelector('.hb'), // 这个我是做了一个 所以就取的第一个 .hb, 其他几个也一样
                val: parseInt(this.cur_hour[0], 10),
                move: false
            },
            { // 时 十位
                el: document.documentElement.querySelector('.hs'),
                val: parseInt(this.cur_hour[1], 10),
                move: false

            },
            { // 时 个位
                el: document.documentElement.querySelector('.hf'),
                val: parseInt(this.cur_hour[2], 10),
                move: false

            },
            { // 分 十位
                el: document.documentElement.querySelector('.ms'),
                val: parseInt(this.cur_minutes[0], 10),
                move: false

            },
            { // 分 个位
                el: document.documentElement.querySelector('.mg'),
                val: parseInt(this.cur_minutes[1], 10),
                move: false

            },
        ];

        setTimeout(() => {
            this.runTime();
        }, this.needTime - this.cur_seconds);

        // 完成任务列表
        for (let f = 0; f < 20; f++) {
            this.finishedList.push({
                'name': '恐龙特级克塞好',
                'task': '绑定啊234289823',
                'thinkTime': '24 h',
                'time': '24 h'
            });
        }

        this.listRows = this.getListRowsCount(this.taskCards.length);
        this.setTaskListContainerTop(this.currentRow);
        this.setCountInRow();
        this.setItemsInCurrentRow();
        this.setMaskHeight();

    }

    runTime() {
        this.changeMinutes(this.numberList, 4);

        setInterval(() => {
            this.changeMinutes(this.numberList, 4);
        }, this.needTime);
    }


    checkCurrentRow() {
        if (this.currentRow > this.listRows) {
            this.currentRow = this.listRows - 1;
        }
    }

    setMaskHeight() {
        if (document.querySelector('.clip-container')) {
            const _h = Math.abs(document.querySelector('.clip-container').getBoundingClientRect().height);
            if (_h < 320) {
                this.maskHeight = 0;
            } else {
                this.maskHeight = Math.abs(document.querySelector('.clip-container').getBoundingClientRect().height) / 2 - 150 - 20;
            }
            return;
        } else {
            window.setTimeout(() => {
                this.setMaskHeight();
            }, 0);
        }

    }

    changeRow(step) {
        this.currentRow += step;
        this.setTaskListContainerTop(this.currentRow);
        this.setItemsInCurrentRow();
    }

    ifInShowRow(i) {
        for (let m = 0; m < this.itemsInCurrentRow.length; m++) {
            // console.info('>>>> ', this.itemsInCurrentRow);
            if (this.itemsInCurrentRow[m] === i) {
                return true;
            }
        }
        return false;
    }

    // count in row
    setCountInRow() {
        if (document.querySelector('.clip-container')) {
            this.countInRow = Math.floor(document.documentElement.clientWidth / 360);
            return;
        } else {
            window.setTimeout(() => {
                this.setCountInRow();
            }, 0);
        }
    }

    // set items in current row
    setItemsInCurrentRow() {
        if (document.querySelector('.clip-container')) {
            this.itemsInCurrentRow = [];
            let index = this.countInRow * this.currentRow;
            for (let i = 0; i < this.countInRow; i++) {
                this.itemsInCurrentRow.push(index);
                index++;
            }
            // console.info(this.itemsInCurrentRow);
            return;
        } else {
            window.setTimeout(() => {
                this.setItemsInCurrentRow();
            }, 0);
        }
    }

    // 行数
    getListRowsCount(len) { // tasks个数
        return Math.ceil(len / Math.floor(document.documentElement.clientWidth / 360));
    }


    setTaskListContainerTop(n) {
        if (document.querySelector('.clip-container')) {
            this.baseTop = Math.abs(document.querySelector('.clip-container').getBoundingClientRect().height) / 2 - 150;
            // console.log('>>>>> ', document.querySelector('.clip-container').getBoundingClientRect().height);
            this.taskListContainerTop = this.baseTop - n * 300;
            return;
        } else {
            window.setTimeout(() => {
                this.setTaskListContainerTop(n);
            }, 0);
        }
    }


    setDlgVis() {
        this.outing = true;
        window.setTimeout(() => {
            this.editing = false;
            this.outing = false;
        }, 200);
    }

    @HostListener('window:resize') onresize() {
        this.listRows = this.getListRowsCount(this.taskCards.length);
        this.checkCurrentRow();
        this.setTaskListContainerTop(this.currentRow);
        this.setCountInRow();
        this.setItemsInCurrentRow();
        this.setMaskHeight();
    }
}
