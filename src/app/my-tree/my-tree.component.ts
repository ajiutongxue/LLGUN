import {Component} from '@angular/core'

@Component({
    selector: 'my-tree',
    templateUrl: './my-tree.component.html',
    styles: [`
        .node-content-wrapper:hover {
            background: none;
        }
        .node-content-wrapper-active {
            background: none;
        }
        .node-content-wrapper-focused {
            background: none;
        }
    `]
})

export class MyTreeComponent {
    llShow = false;

    option = {
        animateExpand: true,
    }
    nodes = [
        {
            id: 1,
            name: 'root1',
            data: {
                name: 'mao',
                size: 11
            }
        },
        {
            id: 4,
            name: 'root2',
        }
    ];

    constructor() {

    }

    showData(d) {
        console.warn(d);

        for(let k in d) {
            console.info('>>>> ', k, ' ==== ', d[k])
        }
    }
}