import { Injectable, EventEmitter } from '@angular/core';
import { SortTableContainerDirective } from './sort-table.directive';

export class DragDropData {
    dragData: any;
    mouseEvent: MouseEvent;
}

@Injectable()
export class DragDropService {
    allowedDropZones: Array<string> = [];
    onDragSuccessCallback: EventEmitter<DragDropData>;
    dragData: any;
    isDragged: boolean;
    constructor() {
    }
}


@Injectable()
export class DragDropSortTableService {
    index: number;
    sortableContainer: SortTableContainerDirective;
    isDragged: boolean;

    private _elem: HTMLElement;
    public get elem(): HTMLElement {
        return this._elem;
    }

    constructor() {
    }

}

/**
 * Check and return true if an object is type of string
 */
export function isString(obj: any) {
    return typeof obj === 'string';
}

/**
 * Check and return true if an object not undefined or null
 */
export function isPresent(obj: any) {
    return obj !== undefined && obj !== null;
}

/**
 * Check and return true if an object is type of Function
 */
export function isFunction(obj: any) {
    return typeof obj === 'function';
}

/**
 * Create Image element with specified url string
 */
export function createImage(src: string) {
    const img: HTMLImageElement = new HTMLImageElement();
    img.src = src;
    return img;
}

/**
 * Call the function
 */
export function callFun(fun: Function) {
    return fun();
}
