import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'label-string-input',
  templateUrl: './label-string-input.component.html',
  styleUrls: ['./label-string-input.component.less']
})
export class LabelStringInputComponent implements OnInit {

@Input() commentState;
@Input() commentTitle;
@Input() commentLable;

  constructor() { }

  ngOnInit() {
  }

}
