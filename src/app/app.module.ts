import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ModalComponent } from './modal/modal.component';
import { EditorStringInputComponent } from './editor-string-input/editor-string-input.component';
import { StringInputComponent } from './string-input/string-input.component';

import { jqxWindowComponent } from '../assets/jqwidgets-ts/angular_jqxwindow';
import { TextComponent } from './text/text.component';
import { FatherComponent } from './father/father.component';
import { ChildComponent } from './child/child.component';
import { SelectInputComponent } from './select-input/select-input.component';
//import { HighlightDirective } from './highlight.directive';

@NgModule({
  declarations: [
    AppComponent,
    ModalComponent,
    EditorStringInputComponent,
    StringInputComponent,
    jqxWindowComponent,
    TextComponent,
    FatherComponent,
    ChildComponent,
    SelectInputComponent,
    //HighlightDirective
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
