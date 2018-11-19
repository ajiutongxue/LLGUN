import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.less']
})
export class ContextMenuComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  viewData = [
    { type: '', editable: true, icon: 'fa fa-pencil', name: '这个是一个右键菜单'},
    { type: '', editable: true, icon: 'fa fa-pencil', name: '这个是一个右键菜单'},
    { type: '', editable: true, icon: 'fa fa-pencil', name: '这个是一个右键菜单'},
    { type: '', editable: true, icon: 'fa fa-pencil', name: '这个是一个右键菜单'},
    { type: '', editable: true, icon: 'fa fa-pencil', name: '这个是一个右键菜单'},
    { type: 'line', },
    { type: '', editable: true, icon: 'fa fa-pencil', name: '这个是一个右键菜单'},
    { type: '', editable: true, icon: 'fa fa-pencil', name: '这个是一个右键菜单'},
    { type: '', editable: true, icon: 'fa fa-pencil', name: '这个是一个右键菜单'},
    { type: '', editable: true, icon: 'fa fa-pencil', name: '这个是一个右键菜单'},
    { type: '', editable: true, icon: 'fa fa-pencil', name: '这个是一个右键菜单'},
    { type: '', editable: true, icon: 'fa fa-pencil', name: '这个是一个右键菜单'},
    { type: '', editable: true, icon: 'fa fa-pencil', name: '这个是一个右键菜单'},
    { type: 'line', },
    { type: '', editable: true, icon: 'fa fa-pencil', name: '这个是一个右键菜单'},
    { type: '', editable: true, icon: 'fa fa-pencil', name: '这个是一个右键菜单'},
    { type: '', editable: true, icon: 'fa fa-pencil', name: '这个是一个右键菜单'},
    { type: '', editable: true, icon: 'fa fa-pencil', name: '这个是一个右键菜单'},
    { type: '', editable: true, icon: 'fa fa-pencil', name: '这个是一个右键菜单'},
    { type: '', editable: true, icon: 'fa fa-pencil', name: '这个是一个右键菜单'},
    { type: '', editable: true, icon: 'fa fa-pencil', name: '这个是一个右键菜单'},
    { type: 'line', },
    { type: '', editable: true, icon: 'fa fa-pencil', name: '这个是一个右键菜单'},
    { type: '', editable: true, icon: 'fa fa-pencil', name: '这个是一个右键菜单'},
  ]
}
