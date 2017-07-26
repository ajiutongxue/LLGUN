import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-text', 
  templateUrl: './text.component.html',
  styles: []
})
export class TextComponent implements OnInit {
  setsize: number;

  allrows = [];

  constructor() { 
      for(let i = 0; i < this.setsize; i++) {
          this.allrows[i].rowname = "hah " + i;
      }
  }

  ngOnInit() {
  }


}
