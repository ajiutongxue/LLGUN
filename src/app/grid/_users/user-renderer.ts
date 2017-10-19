import { Component } from '@angular/core';

@Component({
    selector: 'app-render-user',
    template: `<div class="ll-cell"><i class="input-ppl-color" style="background: red;"></i><span>{{value}}</span></div>`
})

export class GridUserRender {
    value = '';

    constructor() {
    }

    agInit(params: any): void {
        this.value = params.value;
    }
}
