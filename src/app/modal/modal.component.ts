import { Component, OnInit } from '@angular/core';
import { EditorStringInputComponent } from '../editor-string-input/editor-string-input.component';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  // directives: [EditorStringInputComponent],
  styleUrls: ['./modal.component.less']
})
export class ModalComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  modalTitle = "新建资产";
}
