import { isString } from './sort-table.service';


export class DataTransferEffect {

    static COPY = new DataTransferEffect('copy');
    static LINK = new DataTransferEffect('link');
    static MOVE = new DataTransferEffect('move');
    static NONE = new DataTransferEffect('none');

    constructor(public name: string) { }
}

// export class DragImage {
//     constructor(
//         public imageElement: any,
//         public x_offset = 0,
//         public y_offset = 0) {
//         if (isString(this.imageElement)) {
//             // Create real image from string source
//             const imgScr: string = <string>this.imageElement;
//             this.imageElement = new HTMLImageElement();
//             (<HTMLImageElement>this.imageElement).src = imgScr;
//         }
//     }
// }

export class DragDropConfig {
    public onDragStartClass = 'dnd-drag-start';
    public onDragEnterClass = 'dnd-drag-enter';
    public onDragOverClass = 'dnd-drag-over';
    public onSortableDragClass = 'dnd-sortable-drag';

    public dragEffect: DataTransferEffect = DataTransferEffect.MOVE;
    public dropEffect: DataTransferEffect = DataTransferEffect.MOVE;
    public dragCursor = 'move';
    // public dragImage: DragImage;
    public defaultCursor = 'pointer';
}
