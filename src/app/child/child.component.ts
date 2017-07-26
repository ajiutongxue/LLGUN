import { Component, Input } from '@angular/core';

@Component({
  selector: 'my-child',
  templateUrl: './child.component.html',
  styles: []
})
export class ChildComponent {
  @Input() info: Array<Object>;
  constructor() { }


}
