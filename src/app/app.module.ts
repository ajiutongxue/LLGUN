import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// import { NormalStringRendererComponent } from '../grid/normal-string-renderer';

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

// 公司的环境，说找不到这个东西 20181211
// import { FileUploadModule } from 'ng2-file-upload';

import { AgGridModule } from 'ag-grid-angular/main';
import { GridComponent } from './grid/grid.component';

import { GridStringRenderer } from './grid/string-renderer';
import { GridStringInput } from './grid/input.component';
import { NormalStringRendererComponent } from './grid/normal-string-renderer';

import { GridUserComponent } from './grid/_users/user.component';
import { GridUserRender } from './grid/_users/user-renderer';

import { AbstractComponent } from './sort-table-directive/abstract.component.ts';
import { SortTableContainerDirective, SortTableDirective } from './sort-table-directive/sort-table.directive';
import { SortRowComponent } from './sort-row/sort-row.component';
// import {DragDropSortTableService, DragDropService} from './sort-table-directive/sort-table.service';
import { DragDropConfig } from './sort-table-directive/dnd.config';
import { LoginComponent } from './login/login.component';
import { MyTaskComponent } from './my-task/my-task.component';
import { MyPlayerComponent } from './my-player/my-player.component';
import { VideoPlayerDirective } from './my-player/video-player.directive';
import { ShowComponentComponent } from './show-component/show-component.component';
import { DragRulerComponent } from './drag-ruler/drag-ruler.component';
import { NoteMsgComponent } from './note-msg/note-msg.component';
import { ProjectHomepageComponent } from './project-homepage/project-homepage.component';
import { MyNewPlayerComponent } from './my-new-player/my-new-player.component';
import { PlayerLayerComponent } from './player-layer/player-layer.component';
import { SingleTrackComponent } from './single-track/single-track.component';
import { MultipleTrackComponent } from './multiple-track/multiple-track.component';
import { MediaComponent } from './media/media.component';
import { DragTableComponent } from './drag-table/drag-table.component';
import { PermissionComponent } from './permission/permission.component';
import { MenuContentComponent } from './menu-content/menu-content.component';
import { MenuShowsComponent } from './menu-shows/menu-shows.component';
import { CommentComponent } from './comment/comment.component';
import { LabelStringInputComponent } from './label-string-input/label-string-input.component';
import { ContextMenuComponent } from './context-menu/context-menu.component';
import { MyNewTaskComponent } from './my-new-task/my-new-task.component';
import { MyNewTaskDetailComponent } from './my-new-task/my-new-task-detail.component';
import { SearchBoxComponent } from './my-new-task/search-box/search-box.component';
import { MyTask2Component } from './my-task-2/my-task-2.component';
import { TaskActivityComponent } from './my-new-task/task-activity/task-activity.component';
import { NoteAddComponent } from './my-new-task/task-activity/note-add/note-add.component';
import { NoteReplyComponent } from './my-new-task/note-reply/note-reply.component';
import { AlertBoxComponent } from './my-new-task/alert-box/alert-box.component';
import { AlertDialogComponent } from './my-new-task/alert-dialog/alert-dialog.component';
import { NoticComponent } from './my-new-task/notic/notic.component';
import { StoryBoardComponent } from './my-new-task/story-board/story-board.component';

const appRoutes: Routes = [

    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'media',
        component: MediaComponent
    },
    {
        path: 'player-layer',
        component: PlayerLayerComponent
    },
    {
        path: 'track',
        component: MultipleTrackComponent
    },
    {
        path: 'home',
        component: ProjectHomepageComponent
    },
    {
        path: 'new',
        component: MyNewPlayerComponent
    },
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
        path: 'my-task',
        component: MyTaskComponent
    },
    {
        path: 'new-task',
        component: MyNewTaskComponent
    },
    {
        path: 'task-dark',
        component: MyTask2Component
    },
    {
        path: 'task-detail',
        component: MyNewTaskDetailComponent
    },
    {
        path: 'story-board',
        component: StoryBoardComponent,
    },
    {
        path: 'my-player',
        component: MyPlayerComponent
    },
    {
        path: 'grid',
        component: GridComponent
    },
    {
        path: 'sort',
        component: SortRowComponent
    },
    {
        path: 'show',
        component: ShowComponentComponent
    },
    {
        path: 'ruler',
        component: DragRulerComponent
    },
    {
        path: 'dragTable',
        component: DragTableComponent
    },
    {
        path: 'permission',
        component: PermissionComponent
    },
    {
        path: 'menu',
        component: MenuShowsComponent
    },
    {
        path: 'comment',
        component: CommentComponent
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
        GridStringRenderer,
        GridStringInput,
        GridUserComponent,
        GridUserRender,
        NormalStringRendererComponent,
        // AbstractComponent,
        SortTableContainerDirective,
        SortTableDirective,
        SortRowComponent,
        LoginComponent,
        MyTaskComponent,
        MyPlayerComponent,
        VideoPlayerDirective,
        ShowComponentComponent,
        DragRulerComponent,
        NoteMsgComponent,
        ProjectHomepageComponent,
        MyNewPlayerComponent,
        PlayerLayerComponent,
        MultipleTrackComponent,
        SingleTrackComponent,
        MediaComponent,
        DragTableComponent,
        PermissionComponent,
        MenuContentComponent,
        MenuShowsComponent,
        CommentComponent,
        LabelStringInputComponent,
        ContextMenuComponent,
        MyNewTaskComponent,
        MyNewTaskDetailComponent,
        MyTask2Component,
        SearchBoxComponent,
        TaskActivityComponent,
        NoteAddComponent,
        NoteReplyComponent,
        AlertBoxComponent,
        AlertDialogComponent,
        NoticComponent,
        StoryBoardComponent,
        // HighlightDirective
    ],
    imports: [
        BrowserModule,
        MyDatePickerModule, ReactiveFormsModule, FormsModule,
        TreeModule,
        // FileUploadModule,
        AgGridModule.withComponents([GridStringRenderer, GridStringInput, NormalStringRendererComponent, GridUserComponent, GridUserRender],
        ),
        RouterModule.forRoot(appRoutes)
    ],
    providers: [DragDropConfig],
    bootstrap: [AppComponent]
})
export class AppModule {
}
