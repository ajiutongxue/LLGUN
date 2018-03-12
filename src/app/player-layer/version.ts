export class Movie {
    title: string;
    duration: number;
    // url: string;
    picUrl: string;
    cutIn: number;
    cutOut: number;

    constructor(title, duration, picUrl, cutIn, cutOut) {
        this.title = title;
        this.duration = duration;
        this.picUrl = picUrl || '/assets/style/tmpImg/long_pic.jpg';
        this.cutIn = cutIn || 0;
        this.cutOut = cutOut || duration;
    }

    getActualDuration() {
        return this.cutOut - this.cutIn;
    }
}

export class Version {
    duration: number;
    title: string;
    movie: Movie;
}

export class VersionList {
    title: string;
    // isShow: true;
    // isShowImg: true;
    data: Version[];
}
