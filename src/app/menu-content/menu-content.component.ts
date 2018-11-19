import { Component, OnInit, Input, ElementRef } from '@angular/core';

@Component({
  selector: 'app-menu-content',
  templateUrl: './menu-content.component.html',
  styleUrls: ['./menu-content.component.less']
})
export class MenuContentComponent implements OnInit {

  // @Input() realClass;
  @Input() cols;
  @Input() maxWidth;

  container;
  data;

  dataCol3 = [{
    i: 'fa fa-play',
    a: 'inpros',
    t: '进行中'
  }, {
    i: 'fa fa-circl',
    a: 'fin',
    t: '完成'
  }, {
    i: 'fa fa-pause',
    a: 'hld',
    t: '暂停'
  }]

  dataCol2 = [{
    i: 'fa fa-play',
    t: 'asset_2323'
  }, {
    i: 'fa fa-circl',
    t: 'sets Element'
  }, {
    i: 'fa fa-pause',
    t: 'asdfji new paroalsdjc'
  }]

  dataCol1 = [{
    t: 'asset_232 paroal paroal3'
  }, {
    t: 'sets Element'
  }, {
    t: 'asdfji new paroalsdjc'
  }]
  constructor(private _element: ElementRef) {
    this.container = _element.nativeElement;
}

  ngOnInit() {
    if (this.maxWidth) {
      this.container.querySelector('.container').style.setProperty('--set-max-width', this.maxWidth + 'px');
    }


    if (this.cols === 3) {
      this.data = this.dataCol3;
    }
    if (this.cols === 2) {
      this.data = this.dataCol2;
    }
    if (this.cols === 1) {
      this.data = this.dataCol1;
    }
  }

}
