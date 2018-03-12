import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
@Component({
    selector: 'app-my-new-player',
    templateUrl: './my-new-player.component.html',
    styleUrls: ['./my-new-player.component.less']
})
export class MyNewPlayerComponent implements OnInit {
    opacitys = [
        50,
        100
    ];

    pl = [
        {
            src: '../../assets/style/tmpImg/v2.mp4'
        },
        {
            src: '../../assets/style/tmpImg/v.mp4'
        },
    ];

    constructor() {
    }

    ngOnInit() {
    }

    pause() {
        $('video').each(function (i, v) {
            console.log(v);
            v.pause();
        });
    }
}
