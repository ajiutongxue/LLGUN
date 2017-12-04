import {Directive, ElementRef, Renderer, Input} from '@angular/core';

@Directive({
    selector: '[appHighlight]'
})
export class HighlightDirective {

    private _defaultColor = 'green';
    @Input() set defaultColor(colorName: string) {
        this._defaultColor = colorName || this._defaultColor;
    }

    constructor(private _element: ElementRef, private renderer: Renderer) {
        renderer.setElementStyle(_element.nativeElement, 'color', this._defaultColor);
    }
}
