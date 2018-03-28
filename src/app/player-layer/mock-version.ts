import {Movie, Version, VersionList} from './version';


const _row: Version[] = [
    {duration: 2000, title: 'newititle', movie: new Movie('1mov12345677.omove-al', 1000, null, null, null)},
    {duration: 3000, title: 'newititle', movie: new Movie('2mov1asf.aslfjsl.223', 2300, '/assets/style/tmpImg/long-pic/3453.png', null, null)},
    {duration: 30, title: 'duanduanduan', movie: new Movie('2mov1asf.aslfjsl.223', 30, '/assets/style/tmpImg/long-pic/3453.png', null, null)},
    {duration: 2400, title: 'newititle', movie: new Movie('3mov1-asd-asdf-asf.mov', 2000, '/assets/style/tmpImg/long-pic/66666.png', null, null)},
    {duration: 2000, title: 'newititle', movie: new Movie('4mov1.nva.asd.er', 1000, '/assets/style/tmpImg/long-pic/234234.png', null, null)},
    {duration: 12000, title: 'newititle', movie: new Movie('5mov1asfasaf', 8000, '/assets/style/tmpImg/long-pic/ewrw.png', null, null)},
    {duration: 6000, title: 'newititle', movie: new Movie('6mov1', 1000, null, null, null)},
    
];

const _row1: Version[] = [
    {duration: 2000, title: '这么大的中文看得清楚么', movie: new Movie('正文三闾大夫就啊书法家', 1800, '/assets/style/tmpImg/long-pic/123.png', null, null)},
    {duration: 3000, title: 'newititle', movie: new Movie('mov1asf.aslfjsl.223', 2900, '/assets/style/tmpImg/long-pic/342.png', null, null)},
    {duration: 30, title: 'duanduanduan', movie: new Movie('2mov1asf.aslfjsl.223', 30, '/assets/style/tmpImg/long-pic/3453.png', null, null)},
    {duration: 2400, title: 'newititle', movie: new Movie('mov1-asd-asdf-asf.mov', 2400, '/assets/style/tmpImg/long-pic/534.png', null, null)},
    {duration: 2000, title: 'newititle', movie: new Movie('mov1.nva.asd.er', 2000, '/assets/style/tmpImg/long-pic/655.png', null, null)},
    {duration: 12000, title: 'newititle', movie: new Movie('mov1asfasaf', 11000, '/assets/style/tmpImg/long-pic/999.png', null, null)},
    {duration: 6000, title: 'newititle', movie: new Movie('mov1', 6000, '/assets/style/tmpImg/long-pic/3342.png', null, null)},
];


export const VERSION_LISTS: VersionList[] = [
    {title: '这么大的中文看得清楚么', data: _row},
    {title: 'abcd02.mov', data: _row1},
    {title: 'abcd03.mov', data: _row},
    {title: 'abcd04.mov', data: _row},
    {title: 'abcd05.mov', data: _row},
    {title: 'abcd05.mov', data: _row},
    {title: 'abcd05.mov', data: _row},
    {title: 'abcd05.mov', data: _row},
    {title: 'abcd05.mov', data: _row},
    {title: 'abcd05.mov', data: _row},
    {title: 'abcd05.mov', data: _row},
];
