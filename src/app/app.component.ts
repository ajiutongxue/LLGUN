import { Component, ViewChild, AfterViewInit, OnInit, ElementRef } from '@angular/core';
import { EditorStringInputComponent } from './editor-string-input/editor-string-input.component';
import { ModalComponent } from './modal/modal.component';

import { jqxWindowComponent } from '../assets/jqwidgets-ts/angular_jqxwindow';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'app';

    inputList = ['序列号', '资产名称', '创建时间', '资产简介', '创建人', '资产描述', '修改时间', '所属类别', '状态', '资产名称'];
    ides = this.inputList[Math.floor(Math.random() * 10)];

    rowsize: number;

    myopt = {
      inline: true
    }
}
