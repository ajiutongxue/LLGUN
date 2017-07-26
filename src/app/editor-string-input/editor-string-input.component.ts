import { Component, Input,OnInit } from '@angular/core';
import { StringInputComponent } from '../string-input/string-input.component';

@Component({
	selector: 'app-editor-string-input',
	templateUrl: './editor-string-input.component.html',
	styleUrls: ['./editor-string-input.component.css']
})
export class EditorStringInputComponent implements OnInit {

	allFields = [];
	inputList = ['序列号', '资产名称', '创建时间', '资产简介', '创建人', '资产描述', '修改时间', '所属类别', '状态', '资产名称', '创建时间', '资产简介', '创建人', '资产描述', '修改时间', '所属类别', '状态', '资产名称'];
	
	@Input('rowLength') 
	len: number;

	constructor() { 
	}

	ngOnInit() {
		if (this.len) {
			for(let i = 0; i < this.len; i++) {
				this.allFields[i] = this.inputList[i];
			}
		}
  	}
}
