import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
// import { ModalComponent } from './modal/modal.component';
import {EditorStringInputComponent} from './editor-string-input/editor-string-input.component';
import {StringInputComponent} from './string-input/string-input.component';

import {jqxWindowComponent} from '../assets/jqwidgets-ts/angular_jqxwindow';
// import { MyDatePickerModule } from 'mydatepicker';
import {MyDatePickerModule} from '../assets/mydatepicker-master/src/my-date-picker/my-date-picker.module';

import {TextComponent} from './text/text.component';
// import { FatherComponent } from './father/father.component';
// import { ChildComponent } from './child/child.component';
import {SelectInputComponent} from './select-input/select-input.component';
// import { HighlightDirective } from './highlight.directive';

import {ThumbnailComponent} from './thumbnail/thumbnail.component';

import {LayoutComponent} from './layout/layout.component';
import {AllComponentComponent} from './all-com/all-com.component';
import {MouseSelectComponent} from './mouse-select/mouse-select.component';
import {MosueSelectDirective} from './mouse-select/mouse-select.directive';

import {TreeModule} from 'angular-tree-component';
import {MyTreeComponent} from './my-tree/my-tree.component';
import {DragSetWidthDirective} from './drag-set-width.directive';
import {MyFnComponent} from './my-fn/my-fn.component';
import { ImgsAsMovComponent } from './fus/imgs-as-mov/imgs-as-mov.component';
import { PaintFrameDirective } from './fus/paint-frame.directive';

import { FileUploadModule } from 'ng2-file-upload';

import { AgGridModule } from 'ag-grid-angular/main';
import { GridComponent } from './grid/grid.component';

const appRoutes: Routes = [

    {
        path: 'layout',
        component: LayoutComponent
    },
    {
        path: 'all',
        component: AllComponentComponent
    },
    {
        path: 'select',
        component: MouseSelectComponent
    },
    {
        path: 'my-tree',
        component: MyTreeComponent
    },
    {
        path: 'my-fn',
        component: MyFnComponent
    },
    {
        path: 'grid',
        component: GridComponent
    },
    {
        path: '',
        redirectTo: '/all',
        pathMatch: 'full' // 这个full是必须的
    }
];

@NgModule({
    declarations: [
        AppComponent,
        // ModalComponent,
        EditorStringInputComponent,
        StringInputComponent,
        jqxWindowComponent,
        TextComponent,
        // FatherComponent,
        // ChildComponent,
        SelectInputComponent,
        ThumbnailComponent,
        LayoutComponent,
        AllComponentComponent,
        MouseSelectComponent,
        MosueSelectDirective,
        MyTreeComponent,
        DragSetWidthDirective,
        MyFnComponent,
        ImgsAsMovComponent,
        PaintFrameDirective,
        GridComponent,
        // HighlightDirective
    ],
    imports: [
        BrowserModule,
        MyDatePickerModule, ReactiveFormsModule, FormsModule,
        TreeModule,
        FileUploadModule,
        AgGridModule.withComponents([],
        ),
        RouterModule.forRoot(appRoutes)
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
