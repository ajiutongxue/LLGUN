import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-note-reply',
  templateUrl: './note-reply.component.html',
  styleUrls: ['../layout.less', './note.component.less', './note-reply.component.less']
})
export class NoteReplyComponent implements OnInit {

    isLabelString = true;
    isStatusSelect = true;
    // ttt

  constructor() { }

  ngOnInit() {
  }

}
