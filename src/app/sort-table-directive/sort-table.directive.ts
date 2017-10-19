import { ChangeDetectorRef } from '@angular/core';
import { Directive, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { DragDropConfig } from './dnd.config';
import { AbstractComponent, AbstractHandleComponent } from './abstract.component.ts';
import { DragDropService, DragDropSortTableService } from './sort-table.service';

@Directive({ selector: '[appSortTableContainer]' })
export class SortTableContainerDirective extends AbstractComponent {

    @Input('dragEnabled') set draggable(value: boolean) {
        this.dragEnabled = !!value;
    }

    private _sortableData: Array<any> = [];

    @Input() set sortableData(sortableData: Array<any>) {
        this._sortableData = sortableData;
        this.dropEnabled = !!this._sortableData;
    }
    get sortableData(): Array<any> {
        return this._sortableData;
    }

    @Input('dropZones') set dropzones(value: Array<string>) {
        this.dropZones = value;
    }

    constructor(elemRef: ElementRef, dragDropService: DragDropService, config: DragDropConfig, cdr: ChangeDetectorRef,
        private _sortableDataService: DragDropSortTableService) {

        super(elemRef, dragDropService, config, cdr);
        this.dragEnabled = false;
    }

    _onDragEnterCallback(event: Event) {
        if (this._sortableDataService.isDragged) {
            const item = this._sortableDataService.sortableContainer._sortableData[this._sortableDataService.index];
            // Check does element exist in sortableData of this Container
            if (this._sortableData.indexOf(item) === -1) {
                // Remove item from previouse list
                this._sortableDataService.sortableContainer._sortableData.splice(this._sortableDataService.index, 1);
                if (this._sortableDataService.sortableContainer._sortableData.length === 0) {
                    this._sortableDataService.sortableContainer.dropEnabled = true;
                }
                // Add item to new list
                this._sortableData.unshift(item);
                this._sortableDataService.sortableContainer = this;
                this._sortableDataService.index = 0;
            }
            // Refresh changes in properties of container component
            this.detectChanges();
        }
    }
}

@Directive({ selector: '[appDNDSortTable]' })
export class SortTableDirective extends AbstractComponent {
    @Input('index') index: number;
    @Input('dragEnabled') set draggable(value: boolean) {
        this.dragEnabled = !!value;
    }
    @Input('dropEnabled') set droppable(value: boolean) {
        this.dropEnabled = !!value;
    }
    /**
     * The data that has to be dragged. It can be any JS object
     */
    @Input() dragData: any;
    /**
     * Drag allowed effect
     */
    @Input('effectAllowed') set effectallowed(value: string) {
        this.effectAllowed = value;
    }
    /**
     * Drag effect cursor
     */
    @Input('effectCursor') set effectcursor(value: string) {
        this.effectCursor = value;
    }
    /**
     * Callback function called when the drag action ends with a valid drop action.
     * It is activated after the on-drop-success callback
     */
    @Output() onDragSuccessCallback: EventEmitter<any> = new EventEmitter<any>();
    @Output() onDragStartCallback: EventEmitter<any> = new EventEmitter<any>();
    @Output() onDragOverCallback: EventEmitter<any> = new EventEmitter<any>();
    @Output() onDragEndCallback: EventEmitter<any> = new EventEmitter<any>();
    @Output() onDropSuccessCallback: EventEmitter<any> = new EventEmitter<any>();

    constructor(elemRef: ElementRef, dragDropService: DragDropService, config: DragDropConfig,
        private _sortableContainer: SortTableContainerDirective,
        private _sortableDataService: DragDropSortTableService,
        private cdr: ChangeDetectorRef) {
        super(elemRef, dragDropService, config, cdr);
        this.dropZones = this._sortableContainer.dropZones;
        this.dragEnabled = true;
        this.dropEnabled = true;
    }

    _onDragStartCallback(event: Event) {
        this._sortableDataService.isDragged = true;
        this._sortableDataService.sortableContainer = this._sortableContainer;
        this._sortableDataService.index = this.index;
        // this._sortableDataService.markSortable(this._elem);
        // Add dragData
        this._dragDropService.isDragged = true;
        this._dragDropService.dragData = this.dragData;
        this._dragDropService.onDragSuccessCallback = this.onDragSuccessCallback;
        //
        this.onDragStartCallback.emit(this._dragDropService.dragData);
    }

    _onDragOverCallback(event: Event) {
        if (this._sortableDataService.isDragged && this._elem !== this._sortableDataService.elem) {
            this._sortableDataService.sortableContainer = this._sortableContainer;
            this._sortableDataService.index = this.index;
            // this._sortableDataService.markSortable(this._elem);
            this.onDragOverCallback.emit(this._dragDropService.dragData);
        }
    }

    _onDragEndCallback(event: Event) {
        this._sortableDataService.isDragged = false;
        this._sortableDataService.sortableContainer = null;
        this._sortableDataService.index = null;
        // this._sortableDataService.markSortable(null);
        // Add dragGata
        this._dragDropService.isDragged = false;
        this._dragDropService.dragData = null;
        this._dragDropService.onDragSuccessCallback = null;
        //
        this.onDragEndCallback.emit(this._dragDropService.dragData);
    }

    _onDragEnterCallback(event: Event) {
        if (this._sortableDataService.isDragged) {
            // this._sortableDataService.markSortable(this._elem);
            if ((this.index !== this._sortableDataService.index) ||
                (this._sortableDataService.sortableContainer.sortableData !== this._sortableContainer.sortableData)) {
                // Get item
                const item = this._sortableDataService.sortableContainer.sortableData[this._sortableDataService.index];
                // Remove item from previouse list
                this._sortableDataService.sortableContainer.sortableData.splice(this._sortableDataService.index, 1);
                if (this._sortableDataService.sortableContainer.sortableData.length === 0) {
                    this._sortableDataService.sortableContainer.dropEnabled = true;
                }
                // Add item to new list
                this._sortableContainer.sortableData.splice(this.index, 0, item);
                if (this._sortableContainer.dropEnabled) {
                    this._sortableContainer.dropEnabled = false;
                }
                this._sortableDataService.sortableContainer = this._sortableContainer;
                this._sortableDataService.index = this.index;
            }
        }
    }

    _onDropCallback(event: Event) {
        if (this._sortableDataService.isDragged) {
            this.onDropSuccessCallback.emit(this._dragDropService.dragData);
            if (this._dragDropService.onDragSuccessCallback) {
                this._dragDropService.onDragSuccessCallback.emit(this._dragDropService.dragData);
            }
            // Refresh changes in properties of container component
            this._sortableContainer.detectChanges();
        }
    }
}

@Directive({ selector: '[appSortTableHandle]' })
export class SortTableHandleDirective extends AbstractHandleComponent {
    constructor(elemRef: ElementRef, dragDropService: DragDropService, config: DragDropConfig, _Component: SortTableDirective,
        cdr: ChangeDetectorRef) {
        super(elemRef, dragDropService, config, _Component, cdr);
    }
}
