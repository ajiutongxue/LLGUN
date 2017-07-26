import { Component, Input } from '@angular/core';

@Component({
  selector: 'my-father',
  templateUrl: './father.component.html',
  styles: []
})
export class FatherComponent {
  data: Array<Object>;

  @Input('testenter')
  inputSize: number;

  constructor() { 
    this.data = [
      {
        "id": 1,
        "name": "html"
      },
      {
        "id": 2,
        "name": "css"
      },
      {
        "id": 3,
        "name": "angular"
      },
      
    ];
  }


}
