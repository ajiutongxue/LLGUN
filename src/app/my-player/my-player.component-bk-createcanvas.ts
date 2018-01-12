import {Component, OnInit, HostListener, HostBinding} from '@angular/core';

@Component({
    selector: 'app-my-player',
    templateUrl: './my-player.component.html',
    styleUrls: ['./my-player.component.less']
})
export class MyPlayerComponent implements OnInit {
    container;

    // msgbox
    msgBoxDefaultWidth = '280px';
    isShowMsgBox = false;
    // player
    vdo;
    vdoSrc = '../../assets/style/tmpImg/v.mp4';
    vdoList = [
        {
            src: '../../assets/style/tmpImg/v.mp4',
            qcList: []
        }, {
            src: '../../assets/style/tmpImg/v2.mp4',
            qcList: []
        }
    ];
    isPlayInList = true;
    isShowFrame = true;
    currentVdoIndex = 0;
    isPlaying = true;
    volumeOn = true;
    playPercent = '0%';
    playHandler;
    META = {
        owidth: 0,
        oheight: 0,
        FRAME: 25,
        duration: 0,
        currentTime: 0,
        frames: 0,
        currentFrame: 0,
        scale: 1
    };
    scaleRate = 1;
    scaleMsg = '';

    pencilWidth = [3, 7, 11];
    pencilColor = ['#990230', '#ffe510', '#56b545', '#3692e1', '#fff', '#bec0c2'];
    currentPencilColorIndex = 0;
    currentPencilWidthIndex = 0;

    qcMode = false;
    zoomMode = false;
    moveMode = false;
    watchMode = true;

    // draw
    cvs = null;
    ctx = null;
    scale = 1;

    qcModeType = 'pencil'; // pencil, arrow, round, rect, eraser, words
    qcTypeIcon = 'fa fa-pencil';
    qcSingedList = [];
    qcImgList = [];
    imgs = [];
    toolsBoxStyle = {
        'position': 'absolute',
        'left': 0,
        'right': 0,
        'top': '60px',
        'height': '40px',
        'background': 'rgba(0,0,0,.7)'
    };

    isMouseDown = false;
    isZoomOrMove = false;
    lastLoc = {x: 0, y: 0};
    mouseDownPosition = {
        x: 0,
        y: 0
    };
    activePosition = {
        x: 0,
        y: 0,
        w: 0,
        h: 0
    };
    defaultPosition = {
        x: 0,
        y: 0,
        w: 0,
        h: 0
    };
    drawHistory = [];
    drawHistoryCell = [];
    drawHistoryBackup = [];

    constructor() {
    }

    ngOnInit() {
        this.container = document.querySelector('.player-video-box');
        this.vdo = this.container.querySelector('video');
        this.vdo.src = this.vdoList[this.currentVdoIndex].src;
        this.vdo.addEventListener('loadedmetadata', this.vdoReady.bind(this));
        this.vdo.addEventListener('ended', this.vdoEnd.bind(this));
        this.activePosition.x = this.defaultPosition.x = parseInt(this.vdo.style.left, 10);
        this.activePosition.y = this.defaultPosition.y = parseInt(this.vdo.style.top, 10);

        /* this.vdo.addEventListener('loadedmetadata', () => {
         /!*            this.META.owidth = this.vdo.videoWidth;
         this.META.oheight = this.vdo.videoHeight;
         this.META.duration = this.vdo.duration;
         this.META.frames = this.time2Frame(this.META.duration);
         // this.META.scale =
         this.setVdoPos(this.vdo, this.getVdoPos, this);
         this.activePosition.x = this.defaultPosition.x = parseInt(this.vdo.style.left, 10);
         this.activePosition.y = this.defaultPosition.y = parseInt(this.vdo.style.top, 10);

         this.qcSingedList = this.getQcData();
         // this.getQcData().forEach(function (item) {
         //     item.left = item.frame / this.META.frames * 100 + '%';
         //     this.qcSingedList[item.frame] = item;
         // }, this);
         this.qcSingedList.forEach(function (item) {
         this.qcImgList[item.frame] = item.image;
         item.left = item.frame / this.META.frames * 100 + '%';
         }, this);*!/
         });*/

        // this.vdo.addEventListener('timeupdate', () => {
        //     this.playPercent = (this.vdo.currentTime / this.META.duration * 100) + '%';
        //     this.META.currentFrame = this.time2Frame(this.vdo.currentTime);
        //     console.log('update' + this.vdo.currentTime);
        // });
    }

    vdoEnd = function () {
        if (this.isPlayInList && this.currentVdoIndex < this.vdoList.length - 1) {
            this.changeVdoSrc(this.currentVdoIndex + 1);
        } else {
            this.vdoPause();
        }
    };

    vdoReady = function () {
        // todo: 把变的东西从META里面拿出去，currenttime  currentframe
        this.META.owidth = this.vdo.videoWidth;
        this.META.oheight = this.vdo.videoHeight;
        this.META.duration = this.vdo.duration;
        this.META.frames = this.time2Frame(this.META.duration);
        this.META.currentTime = 0;
        this.META.currentFrame = 0;
        this.playPercent = '0%';
        // if (this.cvs) {
        //     this.cvsReset();
        // } else {
        //     this.setVdoPos(this.vdo, this.getVdoPos, this);
        // }
        if (this.cvs) {
            // this.clearHistory();
            // this.drawHistoryBackup.lenght = 0;
            // this.lastLoc = {x: 0, y: 0};
            this.cvs.width = this.META.owidth;
            this.cvs.height = this.META.oheight;
            ///
            // this.setCvsPos(this.cvs, this.vdo);
            // this.ctx = this.cvs.getContext('2d');
        }

        if (!this.vdo.style.width) {
            this.setVdoPos(this.vdo, this.getVdoPos, this);
            this.META.scale = this.META.owidth / parseInt(this.vdo.style.width, 10);
        }

        // if (this.activePosition.x === 0) {
        //     this.activePosition.x = this.defaultPosition.x = parseInt(this.vdo.style.left, 10);
        //     this.activePosition.y = this.defaultPosition.y = parseInt(this.vdo.style.top, 10);
        // }

        this.qcSingedList = this.getQcData();
        // this.getQcData().forEach(function (item) {
        //     item.left = item.frame / this.META.frames * 100 + '%';
        //     this.qcSingedList[item.frame] = item;
        // }, this);
        this.qcSingedList.forEach(function (item) {
            this.qcImgList[item.frame] = item.image;
            item.left = item.frame / this.META.frames * 100 + '%';
        }, this);

        // if (this.playHandler) {
        //     this.clearInterval(this.playHandler);
        // }

        if (this.isPlaying) {
            // clearInterval(this.playHandler);
            this.vdoPlay();
        }
        /*else {
         this.vdoPause();
         }*/
    };

    changeVdoSrc = function (vdoIndex) {
        if (this.currentVdoIndex !== vdoIndex) {
            this.currentVdoIndex = vdoIndex;
            // if (this.cvs) {
            //     this.cvsReset();
            //     // this.cvs.remove();
            // }
            // if (this.playHandler) {
            //     clearInterval(this.playHandler);
            // }
            this.vdo.removeEventListener('loadedmetadata', this.vdoReady);
            this.vdo.src = this.vdoList[vdoIndex].src;
            this.vdo.addEventListener('loadedmetadata', this.vdoReady.bind(this));

            // if (this.isPlaying) {
            //     this.vdo.play();
            // }
            /*else {
             this.vdo.pause();
             }*/
        }
    };

    getQcData = function () {
        return [
            // {
            //     frame: 230,
            //     image: '',
            //     left: '0'
            // },
        ];
    };


    @HostListener('window:resize', []) onresize() {
        // console.log('resized!!!');
        if (!this.isZoomOrMove) {
            this.setVdoPos(this.vdo, this.getVdoPos, this);
            if (this.cvs) {
                this.setCvsPos(this.cvs, this.vdo);
            }
        }
    }

    @HostListener('window:keypress', ['$event']) onkeypress(e) {
        // alert(e.keyCode)
        // 按下 r
        if (e.keyCode === 82 || e.keyCode === 114) {
            // alert('rr');
            this.resetZoomAndPos();
        }
    }

    // ***
    // 右侧msgbox 相关
    // ***

    toggleMsgBox = function () {
        this.isShowMsgBox = !this.isShowMsgBox;
        if (!this.isZoomOrMove) {
            setTimeout(() => {
                this.setVdoPos(this.vdo, this.getVdoPos, this);
                if (this.cvs) {
                    this.setCvsPos(this.cvs, this.vdo);
                }
            }, 0);
        }
    };

    // ***
    // player 相关
    // ***

    vdoPlay = function () {
        this.vdo.play();
        this.isPlaying = true;
        // if (this.cvs) {
        //     this.saveQcImage(this.createQcImage(this.cvs));
        // }
        // if (this.ctx) {
        //     this.clearCvs(this.ctx);
        // }

        if (this.playHandler) {
            clearInterval(this.playHandler);
        }
        this.playHandler = setInterval(() => {
            // this.clearCvs(this.ctx);
            this.playProgress(this);
        }, 1000 / this.META.FRAME);
    };

    vdoPause = function () {
        this.vdo.pause();
        this.isPlaying = false;
        clearInterval(this.playHandler);
    };

    getVdoDuration = function () {
        this.META.duration = this.vdo.duration;
        if (!this.META.duration) {
            setTimeout(this.getVdoDuration, 0);
        }
    };

    getVdoPos = function (vdo, rt) {
        // const parentBox = vdo.parentNode;
        const styles = {
            position: 'absolute',
            height: '',
            width: '',
            left: '',
            top: ''
        };
        const vp = vdo.parentNode.getBoundingClientRect();
        const ratio = rt.META.owidth / rt.META.oheight;
        console.log('>>>>> ratio: ' + ratio);
        if (vp.width / vp.height > ratio) {
            // 外容器太宽了
            styles.height = vp.height + 'px';
            styles.width = parseInt(styles.height, 10) * ratio + 'px';
            styles.top = 0 + 'px';
            styles.left = (vp.width - parseInt(styles.width, 10)) / 2 + 'px';
        } else {
            // 外容器不够宽
            styles.width = vp.width + 'px';
            styles.height = parseInt(styles.width, 10) / ratio + 'px';
            console.log('>>>>>> styles.width: ' + styles.width);
            console.log('>>>>>> styles.height: ' + styles.height);
            styles.left = vp.left + 'px';
            styles.top = (vp.height - parseInt(styles.height, 10)) / 2 + 'px';
        }
        return styles;
    };

    setVdoPos = function (vdo, getVdoPos, rt) {
        const styles = getVdoPos(vdo, rt);
        // for (const k in styles) {
        //     if (k) {
        //         console.log(k + ' ::: ' + styles[k]);
        //     }
        // }
        rt.setCss(vdo, styles);
        // 设置缩放比例，后续需拿出去
        // rt.META.scale = rt.META.owidth / parseInt(styles.width, 10);
        // rt.META.scale = this.META.owidth  / c.width;
    };

    time2Frame = function (time) {
        return Math.floor(time * this.META.FRAME);
    };

    frame2Time = function (frame) {
        return frame / this.META.FRAME;
    };

    playProgress = function (rt) {
        rt.META.currentFrame = rt.time2Frame(rt.vdo.currentTime);
        rt.playPercent = (rt.vdo.currentTime / rt.META.duration * 100) + '%';
        if (rt.drawHistory.length) {
            rt.clearHistory();
            console.log('XXXXXXX');
            rt.saveQcImage(rt.createQcImage(rt.cvs));
            // rt.finishDraw();
        } else {
            if (rt.qcImgList[rt.META.currentFrame]) {
                rt.imgShowInCanvas(rt.qcImgList[rt.META.currentFrame], rt.ctx);
                console.log('rt.qcImgList[rt.META.currentFrame]:::' + (rt.qcImgList[rt.META.currentFrame] instanceof HTMLElement));
            } else {
                if (rt.ctx) {
                    console.log('有ctx');
                    rt.clearCvs(rt.ctx);
                }
            }
        }


        // rt.isSigned(rt);
    };

    gotoAndPlay = function (event) {
        this.vdo.currentTime = this.frame2Time(event.pageX / this.vdo.parentNode.getBoundingClientRect().width * this.META.frames);
        this.playProgress(this);
    };
    gotoAndStop = function (event, frame) {
        this.vdo.currentTime = this.frame2Time(frame);
        this.playProgress(this);

        if (this.isPlaying) {
            this.vdoPause();
        }
        event.stopPropagation();
    };

    imgShowInCanvas = function (img, ctx) {
        // const imgObj = new Image();
        // imgObj.src = img;
        // console.log('<><><><><><><>::::: ' + (img instanceof HTMLElement));
        ctx.drawImage(img, 0, 0, this.META.owidth, this.META.oheight);
    };

    // isSigned = function (rt) {
    //     rt.qcSingedList.some(function (item) {
    //         // clearCanvas($scope.theContext);
    //         if (item.frame === rt.META.currentFrame) {
    //             if (item.image) {
    //                 // rt.imgShowInCanvas(item.image, rt.ctx);
    //                 rt.imgShowInCanvas(rt.imgs[item.frame], rt.ctx);
    //                 console.log('<><><><><><><><><><><' + (rt.imgs[item.frame] instanceof HTMLElement));
    //                 // const img = document.createElement('img');
    //                 // img.src = 'data:image/gif;base64,R0lGODlhHAAmAKIHAKqqqsvLy0hISObm5vf394uLiwAAAP///yH5B…EoqQqJKAIBaQOVKHAXr3t7txgBjboSvB8EpLoFZywOAo3LFE5lYs/QW9LT1TRk1V7S2xYJADs=';
    //                 // img.style.cssText = 'border: 5px solid red; width: 30%; height:auto;';
    //                 // document.querySelector('.ll-player-msg').appendChild(img);
    //                 // console.log(item.image);
    //                 return true;
    //             } else {
    //             }
    //         }
    //     });
    // };

    toggleVolume = function () {
        if (this.volumeOn) {
            this.vdo.volume = 0;
        } else {
            this.vdo.volume = 1;
        }
        this.volumeOn = !this.volumeOn;
    };

    // ***
    // 绘制
    // ***
    setCurrentMode = function (mode) {
        if (this[mode]) {
            this.exitAllMode();
            this.watchMode = true;
        } else {
            this.exitAllMode();
            this[mode] = true;
        }
    };
    setQcModeType = function (type) {
        this.qcModeType = type;
        switch (type) {
            case 'pencil':
                this.qcTypeIcon = 'fa fa-pencil';
                break;
            case 'arrow':
                this.qcTypeIcon = 'fa fa-long-arrow-up';
                break;
            case 'round':
                this.qcTypeIcon = 'll-icon-round';
                break;
            case 'rect':
                this.qcTypeIcon = 'll-icon-rect';
                break;
            case 'eraser':
                this.qcTypeIcon = 'fa fa-eraser';
                break;
            case 'words':
                this.qcTypeIcon = 'fa fa-text-width';
                break;
            default:
                this.qcTypeIcon = 'fa fa-pencil';
        }
    };

    setCvsPos = function (cvs, vdo) {
        this.setVdoPos(vdo, this.getVdoPos, this);
        cvs.style.cssText = vdo.style.cssText;
        cvs.style.zIndex = 10;
        cvs.style.background = 'rgba(200, 50, 50, .5)';

        // this.META.scale = this.META.owidth / parseInt(vdo.styles.width, 10);

    };

    exitAllMode = function () {
        this.qcMode = false;
        this.zoomMode = false;
        this.moveMode = false;
        this.watchMode = false;
        console.log('>>>> exit edit type');
    };

    createCanvas = function () {
        this.cvs = document.createElement('canvas');
        this.cvs.width = this.META.owidth;
        this.cvs.height = this.META.oheight;
        this.setCvsPos(this.cvs, this.vdo);
        this.container.appendChild(this.cvs);
        this.ctx = this.cvs.getContext('2d');
    };

    // cvsReset = function () {
    //     this.clearCvs(this.ctx);
    //     this.clearHistory();
    //     this.drawHistoryBackup.lenght = 0;
    //     this.lastLoc = {x: 0, y: 0};
    //     this.cvs.width = this.META.owidth;
    //     this.cvs.height = this.META.oheight;
    //     this.ctx = this.cvs.getContext('2d');
    //     this.setCvsPos(this.cvs, this.vdo);
    // };

    createQcImage = function (cvs) {
        const image = new Image();
        image.src = cvs.toDataURL('image/png');
        image.width = 50;
        image.height = 30;
        image.style.display = 'none';
        // image.style.display = 'none';
        // const image = this.b64ToBlob(cvs.toDataURL().split(',')[1]);
        document.querySelector('.ll-player-msg').appendChild(image);
        return image;
    };

    saveQcImage = function (image) {
        const cf = this.time2Frame(this.vdo.currentTime);
        const rt = this;
        this.qcSingedList.push({
            frame: cf,
            image: image,
            left: cf / rt.META.frames * 100 + '%'
        });
        this.qcImgList[cf] = image;
        console.log('!!!!!! ' + this.qcSingedList.length);
    };

    clearCvs = function (ctx) {
        ctx.clearRect(0, 0, this.META.owidth, this.META.oheight);
    };

    resetZoomAndPos = function () {
        this.scaleRate = 1;
        this.vdo.style.transform = 'scale(1)';
        this.cvs.style.transform = 'scale(1)';
        if (this.cvs) {
            this.setCvsPos(this.cvs, this.vdo);
            this.activePosition.x = this.defaultPosition.x = parseInt(this.vdo.style.left, 10);
            this.activePosition.y = this.defaultPosition.y = parseInt(this.vdo.style.top, 10);
        }
        this.isZoomOrMove = false;
    };

    zoom = function (e) {
        if (Math.abs(e.clientY - this.mouseDownPosition.y) > 10 && Math.abs(e.clientX - this.mouseDownPosition.x) < 10) {
            return;
        }
        const x = parseFloat(((e.clientX - this.mouseDownPosition.x) / 100).toFixed(2));
        // let scale = (parseFloat(parseFloat(this.scaleRate).toFixed(2)) + x / 10).toFixed(2);
        let scale = parseFloat((this.scaleRate + x / 10).toFixed(2));

        if (x > 0) {
            if (scale > 9) {
                scale = 9;
            }
        } else {
            if (scale < 0.1) {
                scale = 0.1;
            }
        }
        scale = parseFloat(scale.toFixed(2));
        this.scaleRate = scale;

        // $scope.$qcContainer.css("transform", "scale(" + scale + "," + scale + ")");
        this.vdo.style.transform = 'scale(' + scale + ')';
        this.cvs.style.transform = 'scale(' + scale + ')';
        // this.isZoomOrMove = true;

        this.scaleMsg = Math.round(scale * 100) + '%  【 按 R 键恢复默认位置及大小 】';
        // $(".message").show().delay(1500).fadeOut();
        // cvsScale = $scope.theCanvas.getBoundingClientRect().width / WIDTH;

        // const translateX = (this.defaultPosition.w - this.META.owidth) / 2;
        // const translateY = (this.defaultPosition.h - this.META.oheight) / 2;

        // this.translate.x = translateX;
        // this.translate.y = translateY;
    };


    @HostListener('mouseover', ['$event']) onmouseover(e) {
        switch (this.qcModeType) {
            case 'pencil':
                console.log('pencil...');
                break;
            case 'rect':
                break;
            case 'arrow':
                break;
            case 'text':
                break;
            case 'zoom':
                break;
            case 'move':
                break;
            default:
                console.log('current is ' + this.isMouseDown);
        }
    }

    @HostListener('mousedown', ['$event']) onmousedown(e) {
        // if (!this.watchMode && (e.target.tagName.toLowerCase() === 'video' || e.target.tagName.toLowerCase() === 'canvas' || e.target == this.container)) {
        if (e.target === this.cvs || e.target === this.vdo || e.targe === this.container) {
            // if (e.target == this.container) {
            //     alert('container');
            // }
            this.mouseDownPosition.x = e.clientX;
            this.mouseDownPosition.y = e.clientY;

            if (!this.cvs) {
                this.createCanvas();
            }
            if (this.isPlaying) {
                this.vdoPause();
            }
            this.isMouseDown = true;
            this.lastLoc = this.windowToCanvas(e.clientX, e.clientY);
            // console.log('create canvas okkkkkk');
        }
        console.log('current is ' + this.isMouseDown);

    }

    @HostListener('mousemove', ['$event']) onmousemove(e) {
        if (this.isMouseDown) {
            // if (e.target.tagName.toLowerCase() !== 'canvas') {
            //     this.finishDraw();
            // } else {
            if (e.target === this.cvs || e.target === this.vdo || e.targe === this.container) {
                /* switch (this.qcModeType) {
                 case 'pencil': {
                 this.draw(e);
                 break;
                 }
                 case 'rect':
                 break;
                 case 'arrow':
                 break;
                 case 'text':
                 break;
                 case 'zoom':
                 break;
                 case 'move':
                 // this.setVdoPos(this.vdo, this.getVdoPos, this);
                 this.vdo.style.left = this.cvs.style.left = parseInt(this.vdo.style.left, 10) + (e.clientX - this.mouseDownPosition.x) + 'px';
                 this.vdo.style.top = this.cvs.style.top = parseInt(this.vdo.style.top, 10) + (e.clientY - this.mouseDownPosition.y) + 'px';
                 break;
                 default:
                 console.log(this.qcModeType + this.qcModeType + this.qcModeType);
                 }*/
                if (this.qcMode) {
                    this.draw(e);
                }
                if (this.zoomMode) {
                    this.isZoomOrMove = true;
                    this.zoom(e);
                }
                if (this.moveMode) {
                    this.isZoomOrMove = true;
                    this.vdo.style.left = this.activePosition.x + (e.clientX - this.mouseDownPosition.x) + 'px';
                    this.cvs.style.left = this.vdo.style.left;
                    this.vdo.style.top = this.activePosition.y + (e.clientY - this.mouseDownPosition.y) + 'px';
                    this.cvs.style.top = this.vdo.style.top;
                    // this.vdo.style.transform = this.cvs.style.transform = 'translate(' +
                    //     this.activePosition.x + (e.clientX - this.mouseDownPosition.x) + 'px,' +
                    //     this.activePosition.y + (e.clientY - this.mouseDownPosition.y) + 'px)';
                }
            }
        }

    }

    @HostListener('mouseup', []) onmouseup() {

        if (this.qcMode) {
            this.finishDraw();
        }
        if (this.moveMode) {
            this.activePosition.x = parseInt(this.vdo.style.left, 10);
            this.activePosition.y = parseInt(this.vdo.style.top, 10);
        }
        if (this.zoomMode) {
            this.scaleMsg = '';
        }
        this.isMouseDown = false;
    }

    @HostListener('click', ['$event']) onclick(e) {
        switch (e.target.className) {
            case '_progress-box':
                console.log('666');
                break;
        }
    }

    // drawOnVdo = function () {
    //     if (!this.cvs) {
    //         this.createCanvas();
    //     }
    //
    //     this.drawing();
    //     console.log('drawing....');
    // };

    draw = function (e) {
        this.drawHistoryCell.push({
            type: this.qcModeType,
            x: this.lastLoc.x,
            y: this.lastLoc.y,
            w: this.pencilWidth[this.currentPencilWidthIndex],
            c: this.pencilColor[this.currentPencilColorIndex]
        });
        // console.log('))))))) ' + this.drawHistory.length);
        const curLoc = this.windowToCanvas(e.clientX, e.clientY);

        this.drawLine(this.lastLoc, curLoc, this.qcModeType, {
            w: this.pencilWidth[this.currentPencilWidthIndex],
            c: this.pencilColor[this.currentPencilColorIndex]
        });
        this.lastLoc = curLoc;
    };

    drawLine = function (from, to, type, setting) {
        const c = this.ctx;
        if (type === 'pencil') {
            c.beginPath();
            c.moveTo(from.x, from.y);
            c.lineTo(to.x, to.y);
            c.strokeStyle = setting.c;
            c.lineWidth = setting.w;
            c.lineCap = 'round';
            c.lineJoin = 'round';
            c.stroke();
            c.closePath();
        }
    };

    // window 和 canvas 的坐标转换
    windowToCanvas = function (x, y) {
        const c = this.cvs.getBoundingClientRect();
        // todo: 拿出去
        // this.META.scale = this.META.owidth / c.width;
        const _scale = this.META.owidth / c.width;
        return {
            x: Math.round(x - c.left) * _scale,
            y: Math.round(y - c.top) * _scale
            // x: Math.round(x - c.left) * this.META.scale,
            // y: Math.round(y - c.top) * this.META.scale
        };
    };

    finishDraw = function () {
        if (this.isMouseDown) {
            this.isMouseDown = false;

            if (this.drawHistoryCell.length) {
                this.drawHistoryCell.push({
                    type: this.qcModeType,
                    x: this.lastLoc.x,
                    y: this.lastLoc.y,
                    w: this.pencilWidth[this.currentPencilWidthIndex],
                    c: this.pencilColor[this.currentPencilColorIndex]
                });
                this.drawHistory.push([]);
                for (let i = 0; i < this.drawHistoryCell.length; i++) {
                    this.drawHistory[this.drawHistory.length - 1][i] = this.drawHistoryCell[i];
                }
                this.drawHistoryCell.length = 0;
                this.lastLoc = {x: 0, y: 0};
            }
        }
    };
    /* undo 绘制 */
    undoDrawn = function (e) {
        if (this.drawHistory.length > 1) {

            this.clearCvs(this.ctx);

            this.drawHistory.length--;

            for (let l = 0; l < this.drawHistory.length; l++) {
                for (let i = 1; i < this.drawHistory[l].length; i++) {
                    this.drawLine(this.drawHistory[l][i - 1], this.drawHistory[l][i], this.drawHistory[l][i].type, {
                        c: this.drawHistory[l][i].c,
                        w: this.drawHistory[l][i].w
                    });
                }
            }

        } else if (this.drawHistory.length === 1) {
            this.clearCvs(this.ctx);
            this.clearHistory();
        } else if (this.drawHistoryBackup.length && this.drawHistory.length === 0) {
            // 暂时保留全部历史记录，如需合并清空之前历史操作，则合并drawHistoryBackup数组后拷贝给drawHistory
            for (let l = 0; l < this.drawHistoryBackup.length; l++) {
                this.drawHistory[l] = [];
                this.drawHistory[l][0] = this.drawHistoryBackup[l][0];
                for (let i = 1; i < this.drawHistoryBackup[l].length; i++) {
                    this.drawHistory[l][i] = this.drawHistoryBackup[l][i];
                    this.drawLine(this.drawHistoryBackup[l][i - 1], this.drawHistoryBackup[l][i], this.drawHistoryBackup[l][i].type, {
                        c: this.drawHistoryBackup[l][i].c,
                        w: this.drawHistoryBackup[l][i].w
                    });
                }
            }
        }
        e.stopPropagation();
    };

    clearDrawn = function (e) {
        if (this.drawHistory.length) {
            this.backupHistory();
        }
        this.clearCvs(this.ctx);
        e.stopPropagation();
    };
    /* 清空画布，备份历史纪录 */
    backupHistory = function () {
        this.drawHistoryBackup = []; // 清空前将最后canvas状态保存，以备后退操作使用
        for (let i = 0; i < this.drawHistory.length; i++) {
            this.drawHistoryBackup.push(this.drawHistory[i]);
        }
        this.drawHistory = [];
    };
    /* 清空画布历史纪录 */
    clearHistory = function () {
        this.drawHistoryBackup = []; // 历史纪录备份
        this.drawHistory = []; // 历史纪录
    };


    // ***
    // 辅助
    // ***
    setCss = function (ele, styles) {
        // let s = ele.style.cssText;
        let s = '';
        for (const k in styles) {
            if (k) {
                s += k + ':' + styles[k] + ';';
            }
        }
        ele.style.cssText = s;
    };

    /* Base64 to Blob */
    b64ToBlob(b64Data, contentType, sliceSize) {
        if (!contentType) {
            contentType = 'image/png';
        }
        if (!sliceSize) {
            sliceSize = 512;
        }

        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }
        const blob = new Blob(byteArrays, {
            type: contentType
        });
        return blob;
    }

}

