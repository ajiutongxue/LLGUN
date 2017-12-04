import {Component, HostListener} from '@angular/core';

@Component({
    selector: 'app-my-task',
    templateUrl: './my-task.component.html',
    styleUrls: ['./my-task.component.less']
})

export class MyTaskComponent {
    editing = false;   // 遮罩层 dialog
    showMenu = false; // 状态下拉菜单
    outing = false;

    // window 尺寸
    // ww = 0; // 宽
    // wh = 0; // 高

    // maxSize = 6; // 单页最多显示几个
    // maxRowSize = 5; // 每行最多几个
    // rows = 1; // 行数
    taskCards = [{
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
    }, ];
    domTreeLength = 1; // 页数
    domTreeLengthArr = [0];
    domTree = [];
    currentTr = 0; // 当前页
    /////
    // tabs
    // tasks finished waiting
    currentTab = 'tasks';
    finishedList = [];

    constructor() {
        // 完成任务列表
        for (let f = 0; f < 20; f++) {
            this.finishedList.push({
                'name': '恐龙特级克塞好',
                'task': '绑定啊234289823',
                'thinkTime': '24 h',
                'time': '24 h'
            });
        }

        // this.maxSize = this.setCardCount(document.documentElement.clientWidth, document.documentElement.clientHeight);
        this.orderTaskData(document.documentElement.clientWidth, document.documentElement.clientHeight, this.setCardCount);

        // 整理任务卡片数据
        // if (this.taskCards.length > this.maxSize) {
        //     this.domTreeLength = Math.ceil(this.taskCards.length / this.maxSize);
        //     for (let i = 0; i < this.domTreeLength; i++) {
        //         this.domTreeLengthArr[i] = i;
        //         this.domTree[i] = [];
        //         for (let dom = 0; dom < this.maxSize; dom++) {
        //             if ((this.maxSize * i + dom) < this.taskCards.length) {
        //                 this.domTree[i].push(this.taskCards[this.maxSize * i + dom]);
        //             } else {
        //                 this.domTree[i].push({
        //                     'type': 'kong',
        //                     'name': '',
        //                     'process': '',
        //                     'status': '完成'
        //                 });
        //                 // break;
        //             }
        //         }
        //     }
        // } else {
        //     this.domTree[0] = [];
        //     // 只显示一行
        //     if (this.maxRowSize >= this.taskCards.length) {
        //         for (let i = 0; i < this.taskCards.length; i++) {
        //             this.domTree[0][i] = this.taskCards[i];
        //         }
        //     } else {
        //         // 显示多行
        //         // 算出行数，行数*每行最多个数
        //         for (let i = 0; i < Math.ceil(this.taskCards.length / this.maxRowSize) * this.maxRowSize; i++) {
        //             if (i < this.taskCards.length) {
        //                 this.domTree[0][i] = this.taskCards[i];
        //             } else {
        //                 this.domTree[0][i] = {
        //                     'type': 'kong',
        //                     'name': '',
        //                     'process': '',
        //                     'status': '完成'
        //                 };
        //             }
        //         }
        //     }
        // }
    }

    @HostListener('window:resize') onresize() {
        // this.editing = true;
        // this.maxSize = this.setCardCount(document.documentElement.clientWidth, document.documentElement.clientHeight);
        this.orderTaskData(document.documentElement.clientWidth, document.documentElement.clientHeight, this.setCardCount);
    }

    // return maxCountInOnePage
    setCardCount(w, h) {
        let rowCount;
        if (h < 970) {
            // 一行
            rowCount = 1;
        } else if (h > 1245) {
            rowCount = 3;
        } else {
            rowCount = 2;
        }
        return Math.floor((w > 2160 ? 2160 : w) / 360) * rowCount;
    }

    orderTaskData(w, h, setCardCount) {
        // this.domTreeLength = 1; // 页数
        this.domTreeLengthArr = [0];
        this.domTree = [];
        this.currentTr = 0;
        // 多页
        if (this.taskCards.length > setCardCount(w, h)) {
            this.domTreeLength = Math.ceil(this.taskCards.length / setCardCount(w, h));
            for (let i = 0; i < this.domTreeLength; i++) {
                this.domTreeLengthArr[i] = i;
                this.domTree[i] = [];
                for (let dom = 0; dom < setCardCount(w, h); dom++) {
                    if ((setCardCount(w, h) * i + dom) < this.taskCards.length) {
                        this.domTree[i].push(this.taskCards[setCardCount(w, h) * i + dom]);
                    } else {
                        this.domTree[i].push({
                            'type': 'kong',
                            'name': '',
                            'process': '',
                            'status': '完成'
                        });
                        // break;
                    }
                }
            }
        } else {
            // 单页

            this.domTree[0] = [];
            this.domTreeLength = 1;
            // 只显示一行
            if (Math.floor((w > 2160 ? 2160 : w) / 360) >= this.taskCards.length) {
                for (let i = 0; i < this.taskCards.length; i++) {
                    this.domTree[0][i] = this.taskCards[i];
                }
            } else {
                // 显示多行
                // 算出行数，行数*每行最多个数
                const maxCountInOneRow = Math.floor((w > 2160 ? 2160 : w) / 360);
                for (let i = 0; i < Math.ceil(this.taskCards.length / maxCountInOneRow) * maxCountInOneRow; i++) {
                    if (i < this.taskCards.length) {
                        this.domTree[0][i] = this.taskCards[i];
                    } else {
                        this.domTree[0][i] = {
                            'type': 'kong',
                            'name': '??',
                            'process': '',
                            'status': '完成'
                        };
                    }
                }
            }
        }
    }

    setDlgVis() {
        this.outing = true;
        window.setTimeout(() => {
            this.editing = false;
            this.outing = false;
        }, 200);
    }
}
