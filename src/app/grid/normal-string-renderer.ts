/**
 * Created by yang on 2017/10/4.
 */
import { Component } from '@angular/core';

@Component({
    selector: 'app-normal-string',
    template: `<div class="ll-cell" tabindex="0">{{ value }}</div>`,
    // styles: [`app-normal-string { height: inherit;}`]
})

export class NormalStringRendererComponent {
    value: any = [];

    constructor() {
    }

    agInit(params: any): void {
        this.value = params.value;
    }
}
