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
    // pencil mode
    pencilWidth = [3, 7, 11];
    pencilColor = ['#990230', '#ffe510', '#56b545', '#3692e1', '#fff', '#bec0c2'];
    currentPencilColorIndex = 0;
    currentPencilWidthIndex = 0;

    // words mode
    textarea = null;
    shadowTa = null;
    isTyping = false;
    textareaValue = '';
    fontSetting = {
        fontSize: 20,
        lineHeight: 1.2,
        color: 'rgb(255, 255, 255)',
        scale: this.META.scale,
        maxWidth: 400,
        maxHeight: 400,
        bgColor: 'rgba(0, 80, 250, .4)'
    };
    rectSetting = {
        border: 5,
        bgColor: 'rgba(0, 200, 10, 0.3)',
        opacity: 0.3,
        borderColor: 'green'
    };
    arrowSetting = {
        border: 30,
        theta: 35,
        color: 'orange'
    };
    // fontSize = 20; // 临时
    // textArr = [];
    // formattedTextList = [];

    qcMode = false;
    zoomMode = false;
    moveMode = false;
    watchMode = true;

    // draw
    cvs = null;
    ctx = null;
    tmpCvs = null;
    tmpCtx = null;
    scale = 1;
    tmpCvsIndex = -1;
    isTmpCvs = false;

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
    isMouseMoved = false;
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
        // this.cvs = this.container.querySelector('canvas');
        this.cvs = this.container.querySelector('.main-cvs');
        this.ctx = this.cvs.getContext('2d');
        if (!this.tmpCvs) {
            this.tmpCvs = this.container.querySelector('.top-cvs');
            this.tmpCtx = this.tmpCvs.getContext('2d');
        }
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
            this.vdoPause(event);
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
            this.setCvsPos(this.cvs, this.vdo);
            // this.ctx = this.cvs.getContext('2d');
        }

        if (!this.vdo.style.width) {
            this.setVdoPos(this.vdo, this.getVdoPos, this);
            this.META.scale = this.META.owidth / parseInt(this.vdo.style.width, 10);
        } else {
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
            this.vdoPlay(event);
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
            // this.setVdoPos(this.vdo, this.getVdoPos, this);
            // if (this.cvs) {
            this.setCvsPos(this.cvs, this.vdo);
            // }
        }
    }

    @HostListener('window:keydown', ['$event']) onkeydown(e) {
        // alert(e.keyCode)
        // 按下 r
        if (e.keyCode === 82 || e.keyCode === 114) {
            // alert('rr');
            if (this.isTyping) {
                return;
            }
            this.resetZoomAndPos();
        }
        // tab
        if (e.keyCode === 9) {
            if (this.isTyping) {
                this.drawText();
            }
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

    vdoPlay = function (event) {
        this.beforeClick(event);

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

    vdoPause = function (event) {
        this.beforeClick(event);

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
            // console.log('XXXXXXX');
            rt.saveQcImage(rt.createQcImage(rt.cvs));
            // rt.finishDraw();
        } else {
            if (rt.qcImgList[rt.META.currentFrame]) {
                rt.imgShowInCanvas(rt.qcImgList[rt.META.currentFrame], rt.ctx);
                // console.log('rt.qcImgList[rt.META.currentFrame]:::' + (rt.qcImgList[rt.META.currentFrame] instanceof HTMLElement));
            } else {
                if (rt.ctx) {
                    // console.log('有ctx');
                    rt.clearCvs(rt.ctx);
                }
            }
        }


        // rt.isSigned(rt);
    };

    gotoAndPlay = function (event) {
        this.beforeClick(event);
        this.vdo.currentTime = this.frame2Time(event.pageX / this.vdo.parentNode.getBoundingClientRect().width * this.META.frames);
        this.playProgress(this);
    };
    gotoAndStop = function (event, frame) {
        this.vdo.currentTime = this.frame2Time(frame);
        this.playProgress(this);

        if (this.isPlaying) {
            this.vdoPause(event);
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
    setCurrentMode = function (event, mode) {
        this.beforeClick(event);

        if (this[mode]) {
            this.exitAllMode();
            this.watchMode = true;
        } else {
            this.exitAllMode();
            this[mode] = true;
        }

        if (this.mode !== 'qcMode') {
            this.hideTmpCvs();
        } else {
            if (this.qcModeType === 'rect' || this.qcModeType === 'round' || this.qcModeType === 'arrow') {
                this.setTmpCvs(this.tmpCvs);
            }
        }
    };
    setQcModeType = function (event, type) {
        // console.log('this.isTypingthis.isTypingthis.isTyping=' + this.isTyping);
        this.beforeClick(event);
        this.qcModeType = type;
        switch (type) {
            case 'pencil':
                this.qcTypeIcon = 'fa fa-pencil';
                this.hideTmpCvs();
                break;
            case 'arrow':
                this.qcTypeIcon = 'fa fa-long-arrow-up';
                this.setTmpCvs(this.tmpCvs);
                break;
            case 'round':
                this.qcTypeIcon = 'll-icon-round';
                this.setTmpCvs(this.tmpCvs);
                break;
            case 'rect':
                this.qcTypeIcon = 'll-icon-rect';
                this.setTmpCvs(this.tmpCvs);
                break;
            case 'eraser':
                this.qcTypeIcon = 'fa fa-eraser';
                this.hideTmpCvs();
                break;
            case 'words':
                this.qcTypeIcon = 'fa fa-text-width';
                this.hideTmpCvs();
                break;
            default:
                this.qcTypeIcon = 'fa fa-pencil';
        }
    };

    hideTmpCvs = function () {
        this.tmpCvsIndex = -1;
    };

    setCvsPos = function (cvs, vdo) {
        this.setVdoPos(vdo, this.getVdoPos, this);
        cvs.style.cssText = vdo.style.cssText;
        cvs.style.zIndex = 10;
        // cvs.style.background = 'rgba(200, 50, 50, .5)';

        // this.META.scale = this.META.owidth / parseInt(vdo.styles.width, 10);

    };

    setTmpCvs = function (tmpCvs) {
        tmpCvs.width = this.cvs.width;
        tmpCvs.height = this.cvs.height;
        // position: absolute; height: 397px; width: 705.778px; left: 34px; top: 0px; z-index: 10;
        // const cssText = this.cvs.style.cssText;
        tmpCvs.style.cssText = this.cvs.style.cssText;
        this.tmpCvsIndex = parseInt(this.cvs.style.zIndex, 10) + 1;
        // tmpCvs.style.zIndex = parseInt(this.cvs.style.zIndex, 10) + 1;
    };

    exitAllMode = function () {
        this.qcMode = false;
        this.zoomMode = false;
        this.moveMode = false;
        this.watchMode = false;
        console.log('>>>> exit edit type');
    };

    // 这个不用了
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
        // console.log('进入clearCvs了！！！！！！');
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

    // todo: zoom和move的时候 临时插入新标签，操作全部响应在新建的标签上
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
            // console.log('current is ' + this.isMouseDown);
        }
    }

    @HostListener('mousedown', ['$event']) onmousedown(e) {

        // if (!this.qcMode) {
        //     return;
        // }

        if (this.qcMode && e.target === this.tmpCvs) {
            this.mouseDownPosition.x = e.clientX;
            this.mouseDownPosition.y = e.clientY;
            if (this.isPlaying) {
                this.vdoPause(e);
            }

            this.isMouseDown = true;
            // this.clearCvs(this.tmpCtx);
        } else if (e.target === this.cvs || e.target === this.vdo || e.target === this.container) {
            // if (e.target == this.container) {
            //     alert('container');
            // }
            this.mouseDownPosition.x = e.clientX;
            this.mouseDownPosition.y = e.clientY;
            // console.log('<><><><><> ' + this.mouseDownPosition.y);

            if (!this.cvs) {
                this.createCanvas();
            }
            if (this.isPlaying) {
                this.vdoPause(e);
            }
            this.isMouseDown = true;
            this.lastLoc = this.windowToCanvas(e.clientX, e.clientY);

            // if (this.qcModeType === 'words') {
            //     if (this.isTyping) {
            //         this.finishDraw();
            //         this.isTyping = false;
            //     } else {
            //         if (!this.textarea) {
            //             this.createTextarea();
            //         }
            //     }
            // }
            // console.log('create canvas okkkkkk');
        }
        // console.log('current is ' + this.isMouseDown);

    }

    @HostListener('mousemove', ['$event']) onmousemove(e) {
        if (this.isMouseDown) {
            this.isMouseMoved = true;
            if (e.target === this.tmpCvs) {
                // console.log('进入到mousemove在tmpCvs分支了');
                if (this.qcModeType === 'rect' || this.qcModeType === 'round') {
                    const startPoint = this.windowToCanvas(this.mouseDownPosition.x, this.mouseDownPosition.y);
                    this.lastLoc = this.windowToCanvas(e.clientX, e.clientY);
                    this.clearCvs(this.tmpCtx);
                    this.tmpCtx.fillStyle = this.rectSetting.bgColor;
                    this.tmpCtx.strokeStyle = this.rectSetting.borderColor;
                    this.tmpCtx.lineWidth = this.rectSetting.border;
                    if (this.qcModeType === 'rect') {
                        this.tmpCtx.strokeRect(startPoint.x, startPoint.y, this.lastLoc.x - startPoint.x, this.lastLoc.y - startPoint.y);
                        this.tmpCtx.fillRect(startPoint.x, startPoint.y, this.lastLoc.x - startPoint.x, this.lastLoc.y - startPoint.y);
                    } else if (this.qcModeType === 'round') {
                        this.drawEllipse(
                            this.tmpCtx,
                            startPoint.x + (this.lastLoc.x - startPoint.x) / 2,
                            startPoint.y + (this.lastLoc.y - startPoint.y) / 2,
                            (this.lastLoc.x - startPoint.x) / 2,
                            (this.lastLoc.y - startPoint.y) / 2);
                    }
                } else if (this.qcModeType === 'arrow') {
                    const startPoint = this.windowToCanvas(this.mouseDownPosition.x, this.mouseDownPosition.y);
                    this.lastLoc = this.windowToCanvas(e.clientX, e.clientY);
                    this.clearCvs(this.tmpCtx);
                    // this.tmpCtx.strokeStyle = 'green';
                    // this.tmpCtx.lineWidth = 10;
                    this.drawArrow(this.tmpCtx, startPoint.x, startPoint.y, this.lastLoc.x, this.lastLoc.y, this.arrowSetting);
                }
            } else if (e.target === this.cvs || e.target === this.vdo || e.target === this.container) {
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

    drawToMainCvs = function (type, fromPos, toPos, setting) {
        this.clearCvs(this.tmpCtx);
        this.ctx.globalCompositeOperation = 'source-over';
        if (type === 'arrow') {
            // this.ctx.stroke = setting.color;
            // this.ctx.lineWidth = setting.border;
            this.drawArrow(this.ctx, fromPos.x, fromPos.y, toPos.x, toPos.y, setting);
        } else {
            this.ctx.fillStyle = setting.bgColor;
            this.ctx.strokeStyle = setting.borderColor;
            this.ctx.lineWidth = setting.border;

            if (type === 'rect') {
                this.ctx.fillRect(fromPos.x, fromPos.y, (toPos.x - fromPos.x), (toPos.y - fromPos.y));
                this.ctx.strokeRect(fromPos.x, fromPos.y, (toPos.x - fromPos.x), (toPos.y - fromPos.y));
            } else if (type === 'round') {
                this.drawEllipse(
                    this.ctx,
                    fromPos.x + (toPos.x - fromPos.x) / 2,
                    fromPos.y + (toPos.y - fromPos.y) / 2,
                    (toPos.x - fromPos.x) / 2,
                    (toPos.y - fromPos.y) / 2);
            }

        }
    };

    drawArrow = function (ctx, x1, y1, x2, y2, setting) {
        // const lineWidth = 30;
        const theta = setting.theta;
        const headlen = 2 * setting.border;
        const angle = Math.atan2(y1 - y2, x1 - x2) * 180 / Math.PI;
        const angle1 = (angle + theta) * Math.PI / 180;
        const angle2 = (angle - theta) * Math.PI / 180;
        const topX = headlen * Math.cos(angle1);
        const topY = headlen * Math.sin(angle1);
        const botX = headlen * Math.cos(angle2);
        const botY = headlen * Math.sin(angle2);

        let arrowX = x1 - topX;
        let arrowY = y1 - topY;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineWidth = setting.border;
        ctx.strokeStyle = setting.color;
        ctx.stroke();
        arrowX = x2 + topX;
        arrowY = y2 + topY;
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(x2, y2);
        arrowX = x2 + botX;
        arrowY = y2 + botY;
        ctx.lineTo(arrowX, arrowY);
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.closePath();
    };

    // x,y: 圆心
    // a,b: 半径
    drawEllipse = function (ctx, x, y, a, b) {
        // ctx.fillStyle = setting.bgColor;
        // ctx.strokeStyle = setting.borderColor;
        // ctx.lineWidth = setting.border;
        a = Math.abs(a);
        b = Math.abs(b);
        ctx.save();
        const r = (a > b) ? a : b;
        const ratioX = a / r;
        const ratioY = b / r;
        ctx.scale(ratioX, ratioY);
        ctx.beginPath();
        ctx.arc(x / ratioX, y / ratioY, r, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.restore();
        ctx.fill();
        ctx.stroke();
    };

    @HostListener('mouseup', ['$event']) onmouseup(e) {

        if (this.qcMode && this.isMouseDown) {
            if (!this.isMouseMoved) {
                this.isMouseDown = false;
                return;
            }

            switch (this.qcModeType) {
                case 'pencil':
                case 'eraser':
                    this.finishDraw();
                    break;
                case 'rect':
                case 'round':
                    this.drawToMainCvs(this.qcModeType, this.windowToCanvas(this.mouseDownPosition.x, this.mouseDownPosition.y), this.lastLoc, this.rectSetting);
                    this.finishDraw();
                    break;
                case 'arrow':
                    this.drawToMainCvs(this.qcModeType, this.windowToCanvas(this.mouseDownPosition.x, this.mouseDownPosition.y), this.lastLoc, this.arrowSetting);
                    this.finishDraw();
                    break;
                // case 'words':
                //     this.isTyping = true;
                //     // if (!this.isTyping && !this.textarea) {
                //     //     // if (!this.textarea) {
                //     //         this.createTextarea();
                //     //     // }
                //     // }
                //     break;
            }
        }
        if (this.moveMode) {
            this.activePosition.x = parseInt(this.vdo.style.left, 10);
            this.activePosition.y = parseInt(this.vdo.style.top, 10);
        }
        if (this.zoomMode) {
            this.scaleMsg = '';
        }
        // this.isMouseDown = false;
        // this.isMouseMoved = false;
    }

    @HostListener('click', ['$event']) onclick(e) {
        // console.log('this.isTyping++++++++ ' + this.isTyping);
        console.log('><><><><><><><><><<>>' + e.target.tagName);
        // switch (e.target.className) {
        //     case '_progress-box':
        //         // if (this.isTyping) {
        //         //     this.drawText();
        //         // }
        //         console.log('666');
        //         break;
        // }

        if (this.isTyping) {
            console.log('马上就drawtext了');
            this.drawText();
        } else {
            if (this.qcMode && this.qcModeType === 'words') {
                this.createTextarea();
            }
        }

        // if (this.qcModeType === 'words' && !this.isTyping) {
        //     console.log('进来了为啥不createa');
        //
        // }
        e.stopPropagation();

        // if (this.qcModeType === 'words') {
        //     if (e.target !== this.textarea) {
        //         if (this.isTyping) {
        //             this.drawText();
        //         } else {
        //             this.createTextarea();
        //         }
        //     }
        // }

        // if (e.target === this.cvs || e.target === this.vdo) {
        //     if (this.qcModeType === 'words') {
        //         // if (Boolean(this.textarea)) {
        //         //     this.textarea.blur();
        //         //     return;
        //         // }
        //         // alert();
        //         if (this.isTyping) {
        //             this.textarea.blur();
        //             return;
        //         }
        //         this.createTextarea();
        //         // alert(this.qcModeType);
        //         // alert(this.textarea == true);
        //
        //         // if (this.isTyping) {
        //         //     this.finishDraw();
        //         //     // this.isTyping = false;
        //         // } else {
        //         //     this.isTyping = true;
        //         //     if (!this.textarea) {
        //         //         this.createTextarea();
        //         //     }
        //         // }
        //     }
        // }
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

        this.oneStepDrawLine(this.lastLoc, curLoc, this.qcModeType, {
            w: this.pencilWidth[this.currentPencilWidthIndex],
            c: this.pencilColor[this.currentPencilColorIndex]
        });
        this.lastLoc = curLoc;
    };

    oneStepDrawLine = function (from, to, type, setting) {
        const c = this.ctx;
        if (type === 'pencil') {
            c.globalCompositeOperation = 'source-over';
            c.beginPath();
            c.moveTo(from.x, from.y);
            c.lineTo(to.x, to.y);
            c.strokeStyle = setting.c;
            c.lineWidth = setting.w;
            c.lineCap = 'round';
            c.lineJoin = 'round';
            c.stroke();
            c.closePath();
        } else if (type === 'eraser') {
            c.globalCompositeOperation = 'destination-out';
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
            if (!this.isMouseMoved) {
                this.isMouseDown = false;
                return;
            }
            this.isMouseDown = false;
            this.isMouseMoved = false;

            if (this.qcModeType === 'pencil' || this.qcModeType === 'eraser') {
                if (this.drawHistoryCell.length) {
                    this.drawHistoryCell.push({
                        type: this.qcModeType,
                        x: this.lastLoc.x,
                        y: this.lastLoc.y,
                        w: this.pencilWidth[this.currentPencilWidthIndex],
                        c: this.pencilColor[this.currentPencilColorIndex]
                    });
                    this.drawHistory.push({type: this.qcModeType, data: []});
                    for (let i = 0; i < this.drawHistoryCell.length; i++) {
                        this.drawHistory[this.drawHistory.length - 1].data[i] = this.drawHistoryCell[i];
                    }
                    this.drawHistoryCell.length = 0;
                    this.lastLoc = {x: 0, y: 0};
                }
            } else if (this.qcModeType === 'rect' || this.qcModeType === 'round') {
                this.drawHistory.push({
                    type: this.qcModeType,
                    fromPos: this.windowToCanvas(this.mouseDownPosition.x, this.mouseDownPosition.y),
                    toPos: this.lastLoc,
                    setting: this.rectSetting
                });
                this.lastLoc = this.mouseDownPosition = {x: 0, y: 0};
            } else if (this.qcModeType === 'arrow') {
                this.drawHistory.push({
                    type: this.qcModeType,
                    fromPos: this.windowToCanvas(this.mouseDownPosition.x, this.mouseDownPosition.y),
                    toPos: this.lastLoc,
                    setting: this.arrowSetting
                });
                this.lastLoc = this.mouseDownPosition = {x: 0, y: 0};
            }
        } else if (this.qcModeType === 'words') {
            if (this.textareaValue.trim()) {
                this.drawHistory.push({
                    // pos: this.windowToCanvas(this.mouseDownPosition.x, this.mouseDownPosition.y),
                    pos: this.windowToCanvas(parseInt(this.textarea.style.left, 10), parseInt(this.textarea.style.top, 10)),
                    type: this.qcModeType,
                    text: this.textareaValue,
                    setting: this.fontSetting
                });
                this.lastLoc = this.mouseDownPosition = {x: 0, y: 0};
            }

            // this.textarea.removeEventListener('blur', this.textBlurHandler);
            this.textarea.remove();
            this.shadowTa.remove();
            this.textarea = null;
            this.shadowTa = null;
            this.textareaValue = '';
            this.isTyping = false;
        }
    };
    /* undo 绘制 */
    undoDrawn = function (e) {
        e.stopPropagation();
        if (this.isTyping) {
            this.textarea.value = '';
            this.drawText();
            return;
        }

        if (this.drawHistory.length > 1) {

            this.clearCvs(this.ctx);

            this.drawHistory.length--;

            for (let l = 0; l < this.drawHistory.length; l++) {
                // console.log('current ===> ' + this.drawHistory[l].type);
                if (this.drawHistory[l].type === 'pencil' || this.drawHistory[l].type === 'eraser') {
                    // console.log('这是pencil没有进来');
                    for (let i = 1; i < this.drawHistory[l].data.length; i++) {
                        this.oneStepDrawLine(
                            this.drawHistory[l].data[i - 1],
                            this.drawHistory[l].data[i],
                            this.drawHistory[l].data[i].type, {
                                c: this.drawHistory[l].data[i].c,
                                w: this.drawHistory[l].data[i].w
                            });
                    }
                } else if (this.drawHistory[l].type === 'words') {
                    console.log('words');

                    this.oneStepDrawText(
                        this.ctx,
                        this.drawHistory[l].pos,
                        this.drawHistory[l].type,
                        this.drawHistory[l].text,
                        this.drawHistory[l].setting
                    );
                } else if (this.drawHistory[l].type === 'rect' || this.drawHistory[l].type === 'round' || this.drawHistory[l].type === 'arrow') {
                    this.drawToMainCvs(
                        this.drawHistory[l].type,
                        this.drawHistory[l].fromPos,
                        this.drawHistory[l].toPos,
                        this.drawHistory[l].setting);
                }
            }
        } else if (this.drawHistory.length === 1) {
            this.clearCvs(this.ctx);
            this.clearHistory();
        } else if (this.drawHistoryBackup.length && this.drawHistory.length === 0) {
            // 暂时保留全部历史记录，如需合并清空之前历史操作，则合并drawHistoryBackup数组后拷贝给drawHistory
            for (let l = 0; l < this.drawHistoryBackup.length; l++) {
                // console.log(this.drawHistoryBackup[l].type);
                if (this.drawHistoryBackup[l].type === 'pencil' || this.drawHistoryBackup[l].type === 'eraser') {
                    this.drawHistory[l] = {
                        type: this.drawHistoryBackup[l].type,
                        data: []
                    };
                    // this.drawHistory[l].data = [];
                    // this.drawHistory[l].type = this.drawHistoryBackup[l].type;
                    // this.drawHistory[l].data[0] = this.drawHistoryBackup[l].data[0];
                    this.drawHistory[l].data[0] = this.drawHistoryBackup[l].data[0];
                    for (let i = 1; i < this.drawHistoryBackup[l].data.length; i++) {
                        this.drawHistory[l].data[i] = this.drawHistoryBackup[l].data[i];
                        this.oneStepDrawLine(
                            this.drawHistoryBackup[l].data[i - 1],
                            this.drawHistoryBackup[l].data[i],
                            this.drawHistoryBackup[l].data[i].type,
                            {
                                c: this.drawHistoryBackup[l].data[i].c,
                                w: this.drawHistoryBackup[l].data[i].w
                            });
                    }
                } else if (this.drawHistoryBackup[l].type === 'words') {
                    this.drawHistory[l] = this.drawHistoryBackup[l];
                    this.oneStepDrawText(
                        this.ctx,
                        this.drawHistory[l].pos,
                        this.drawHistory[l].type,
                        this.drawHistory[l].text,
                        this.drawHistory[l].setting
                    );
                } else if (this.drawHistoryBackup[l].type === 'rect' || this.drawHistoryBackup[l].type === 'round' || this.drawHistoryBackup[l].type === 'arrow') {
                    this.drawHistory[l] = this.drawHistoryBackup[l];
                    this.drawToMainCvs(
                        this.drawHistory[l].type,
                        this.drawHistory[l].fromPos,
                        this.drawHistory[l].toPos,
                        this.drawHistory[l].setting);
                }
            }
        }
        e.stopPropagation();
    };

    clearDrawn = function (e) {
        if (this.isTyping) {
            this.textarea.value = '';
            this.drawText();
        }
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

    createTextarea = function () {
        // if (this.textarea) {
        //     // this.finishDraw();
        //     // this.textarea.focus();
        //     return;
        // }
        this.isTyping = true;
        const _scale = this.META.owidth / this.vdo.getBoundingClientRect().width;

        this.fontSetting.maxWidth = this.container.getBoundingClientRect().width + this.container.getBoundingClientRect().left - this.mouseDownPosition.x;
        this.fontSetting.maxHeight = this.container.getBoundingClientRect().height + this.container.getBoundingClientRect().top - this.mouseDownPosition.y;

        this.textarea = document.createElement('textarea');
        // alert(Boolean(this.textarea));
        this.textarea.className = 'qc-textarea';
        this.textarea.setAttribute('spellcheck', false);
        this.shadowTa = document.createElement('span');
        this.shadowTa.className = 'qc-shadow-text';
        this.shadowTa.style.cssText = 'font-size: ' + this.fontSetting.fontSize + 'px;' +
            'min-width: 20px;' +
            'max-width: ' + this.fontSetting.maxWidth + 'px;' +
            // 'padding: ' + 5 + 'px;' +
            // 'word-break: break-all;' +
            // 'position: absolute;' +
            // 'z-index: 9999;' +
            // 'left: 100px;' +
            'min-height:' + this.fontSetting.fontSize * this.fontSetting.lineHeight + 'px;' +
            'transform: scale(' + this.scaleRate + ');' +
            'max-height:' + this.fontSetting.maxHeight + 'px;';
        this.container.appendChild(this.shadowTa);
        this.textarea.style.cssText = 'max-width: ' + this.fontSetting.maxWidth / _scale + 'px;' +
            'width: ' + 20 / _scale + 'px;' +
            'padding: ' + 5 / _scale + 'px;' +
            'font-size:' + this.fontSetting.fontSize / _scale + 'px;' +
            'background: ' + this.fontSetting.bgColor + ';' +
            'height: ' + this.fontSetting.fontSize * this.fontSetting.lineHeight / _scale + 'px;' +
            'line-height: ' + this.fontSetting.lineHeight + 'em;' +
            'left: ' + (this.mouseDownPosition.x - 10) + 'px;' +
            'top: ' + (this.mouseDownPosition.y - 10) + 'px;';
        this.container.appendChild(this.textarea);
        this.textarea.focus();
        this.textarea.addEventListener('input', this.textareaChangeHandler.bind(this));
        // this.textarea.addEventListener('blur', this.textBlurHandler.bind(this));
    };
    textareaChangeHandler = function () {
        const _scale = this.META.owidth / this.vdo.getBoundingClientRect().width;
        this.shadowTa.innerHTML = this.textarea.value.replace(/\b/g, '&nbsp;').replace(/\n/g, '<br>') + '&nbsp;';
        // this.textarea.style.width = parseInt(this.shadowTa.style.width, 10) / _scale + 'px';
        // this.textarea.style.height = parseInt(this.shadowTa.style.height, 10) / _scale + 'px';
        // this.textarea.style.width = (this.shadowTa.getBoundingClientRect().width - 10) / _scale + 'px';
        // this.textarea.style.height = (this.shadowTa.getBoundingClientRect().height - 10) / _scale + 'px';
        this.textarea.style.width = this.shadowTa.getBoundingClientRect().width / this.META.scale + 'px';
        this.textarea.style.height = this.shadowTa.getBoundingClientRect().height / this.META.scale + 'px';
    };

    // setTextareaSize = function (e) {
    //     e = e || event;
    //     let s = '';
    //     s = this.textarea.value.replace(/\b/g, '&nbsp;').replace(/\n/g, '<br>');
    //     this.shadowTa.innerHTML = s;
    //     this.textarea.style.width = this.shadowTa.getBoundingClientRect().width + 'px';
    //     this.textarea.style.height = this.shadowTa.getBoundingClientRect().height + 'px';
    //     if (e.keyCode === 13) {
    //         this.addRowHeight(this.textarea, this.fontSize);
    //     } /*else {
    //         if (this.shadowTa.getBoundingClientRect().width > 400) {
    //             this.textarea.style.width = '400px';
    //         } else {
    //             this.textarea.style.width = this.shadowTa.getBoundingClientRect().width + 'px';
    //         }
    //     }*/
    // };
    // addRowHeight = function (textarea, fontSize) {
    //     textarea.style.height = parseInt(textarea.style.height, 10) + fontSize * 1.25 + 'px'; // 1.5 is line-height
    // };
    // addRowWidth = function (textarea, fontSize) {
    //     textarea.style.height = parseInt(textarea.style.height, 10) + fontSize * 1.25 + 'px'; // 1.5 is line-height
    // };

    /** 绘制文字步骤
     * @setting: {fontSize, lineHeight, color, scale = META.scale, maxWidth, maxHeight, bgColor}
     **/
    oneStepDrawText = function (ctx, pos, type, text, setting) {
        if (!text.trim()) {
            return;
        }
        if (type === 'words') {
            const s = setting;
            const textArr = text.trim().split('\n');
            const MAXWIDTH = s.maxWidth * s.scale;
            const lineHeight = s.fontSize * s.lineHeight;
            let textWidth = 0;
            const formattedTextList = [];

            ctx.font = s.fontSize + 'px sans-serif';
            ctx.textBaseline = 'middle';
            for (let i = 0; i < textArr.length; i++) {
                if (ctx.measureText(textArr[i]).width > MAXWIDTH) {
                    textWidth = MAXWIDTH;
                    let currentText = '';
                    let oldText = '';
                    for (let j = 0; j < textArr[i].length; j++) {
                        currentText = oldText + textArr[i][j];
                        if (ctx.measureText(currentText).width > MAXWIDTH) {
                            formattedTextList.push(oldText);
                            oldText = textArr[i][j];
                        } else {
                            oldText = currentText;
                        }
                    }
                    if (oldText) {
                        formattedTextList.push(oldText);
                    }
                } else {
                    textWidth = ctx.measureText(textArr[i]).width > textWidth ?
                        ctx.measureText(textArr[i]).width : textWidth;
                    formattedTextList.push(textArr[i]);
                }
            }

            ctx.fillStyle = s.bgColor;
            ctx.fillRect(pos.x, pos.y, textWidth + 10, formattedTextList.length * lineHeight + 10);

            for (let k = 0; k < formattedTextList.length; k++) {
                ctx.fillStyle = s.color;
                ctx.fillText(formattedTextList[k], pos.x + 5, pos.y + k * lineHeight + 12 + 5);
            }
        }
    };
    /*
     textBlurHandler = function () {
     // draw the words to ctx
     this.textArr = this.textarea.value.split('\n');
     const maxWidth = parseInt(this.textarea.style.maxWidth, 10) * this.META.scale;
     const lineHeight = this.fontSize * 1.25;
     let textWidth = 0;
     const p = this.windowToCanvas(this.mouseDownPosition.x, this.mouseDownPosition.y);

     this.ctx.font = this.fontSize + 'px sans-serif';
     this.ctx.textBaseline = 'middle';
     for (let i = 0; i < this.textArr.length; i++) {
     if (this.ctx.measureText(this.textArr[i]).width > maxWidth) {
     textWidth = maxWidth;
     let currentText = '';
     let oldText = '';
     for (let j = 0; j < this.textArr[i].length; j++) {
     currentText = oldText + this.textArr[i][j];
     if (this.ctx.measureText(currentText).width > maxWidth) {
     this.formattedTextList.push(oldText);
     oldText = this.textArr[i][j];
     } else {
     oldText = currentText;
     }
     }
     if (oldText) {
     this.formattedTextList.push(oldText);
     }
     } else {
     textWidth = this.ctx.measureText(this.textArr[i]).width > textWidth ?
     this.ctx.measureText(this.textArr[i]).width : textWidth;
     this.formattedTextList.push(this.textArr[i]);
     }
     }

     this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
     // this.ctx.fillRect(this.mouseDownPosition.x, this.mouseDownPosition.y, textWidth, this.formattedTextList.length * lineHeight);
     this.ctx.fillRect(p.x - 5, p.y - 5, textWidth + 10, this.formattedTextList.length * lineHeight + 10);

     for (let k = 0; k < this.formattedTextList.length; k++) {
     this.ctx.fillStyle = 'blue';
     // this.ctx.fillText(this.formattedTextList[k], this.mouseDownPosition.x, this.mouseDownPosition.y + k * lineHeight);
     this.ctx.fillText(this.formattedTextList[k], p.x, p.y + k * lineHeight + 12, 600);
     }

     this.textarea.removeEventListener('blur', this.textBlurHandler);
     this.textarea.remove();
     this.shadowTa.remove();
     this.textarea = null;
     this.shadowTa = null;
     this.textArr = [];
     this.formattedTextList = [];
     };
     */

    // textBlurHandler = function () {
    drawText = function () {
        // draw the words to ctx
        this.textareaValue = this.textarea.value;
        this.oneStepDrawText(
            this.ctx,
            // this.windowToCanvas(this.mouseDownPosition.x, this.mouseDownPosition.y),
            this.windowToCanvas(parseInt(this.textarea.style.left, 10), parseInt(this.textarea.style.top, 10)),
            this.qcModeType,
            this.textareaValue,
            this.fontSetting
            // {
            //     fontSize: 20,
            //     lineHeight: 1.2,
            //     color: 'rgb(255, 255, 255)',
            //     scale: this.META.scale,
            //     maxWidth: 400,
            //     maxHeight: 400,
            //     bgColor: 'rgba(0, 80, 250, .7)'
            // }
        );


        /*this.textArr = this.textarea.value.split('\n');
         const maxWidth = parseInt(this.textarea.style.maxWidth, 10) * this.META.scale;
         const lineHeight = this.fontSize * 1.25;
         let textWidth = 0;
         const p = this.windowToCanvas(this.mouseDownPosition.x, this.mouseDownPosition.y);

         this.ctx.font = this.fontSize + 'px sans-serif';
         this.ctx.textBaseline = 'middle';
         for (let i = 0; i < this.textArr.length; i++) {
         if (this.ctx.measureText(this.textArr[i]).width > maxWidth) {
         textWidth = maxWidth;
         let currentText = '';
         let oldText = '';
         for (let j = 0; j < this.textArr[i].length; j++) {
         currentText = oldText + this.textArr[i][j];
         if (this.ctx.measureText(currentText).width > maxWidth) {
         this.formattedTextList.push(oldText);
         oldText = this.textArr[i][j];
         } else {
         oldText = currentText;
         }
         }
         if (oldText) {
         this.formattedTextList.push(oldText);
         }
         } else {
         textWidth = this.ctx.measureText(this.textArr[i]).width > textWidth ?
         this.ctx.measureText(this.textArr[i]).width : textWidth;
         this.formattedTextList.push(this.textArr[i]);
         }
         }

         this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
         // this.ctx.fillRect(this.mouseDownPosition.x, this.mouseDownPosition.y, textWidth, this.formattedTextList.length * lineHeight);
         this.ctx.fillRect(p.x - 5, p.y - 5, textWidth + 10, this.formattedTextList.length * lineHeight + 10);

         for (let k = 0; k < this.formattedTextList.length; k++) {
         this.ctx.fillStyle = 'blue';
         // this.ctx.fillText(this.formattedTextList[k], this.mouseDownPosition.x, this.mouseDownPosition.y + k * lineHeight);
         this.ctx.fillText(this.formattedTextList[k], p.x, p.y + k * lineHeight + 12, 600);
         }
         */
        this.finishDraw();
        // 拿到了 finish draw
        // this.textarea.removeEventListener('blur', this.textBlurHandler);
        // this.textarea.remove();
        // this.shadowTa.remove();
        // this.textarea = null;
        // this.shadowTa = null;
        // this.textArr = [];
        // this.formattedTextList = [];
    };

    beforeClick = function (event) {
        event.stopPropagation();
        if (this.isTyping) {
            this.drawText();
        }
        // if (this.isTmpCvs) {
        //     // 把tmp cvs的东西画到main-cvs上面
        // }
    };


    // getTextOffsetTop = function (fontSize, lineHeight, baseline) {
    //     baseline = baseline || 'middle';
    //     let t = 0;
    //     if (baseline === 'middle') {
    //         t = lineHeight / 2;
    //     }
    //     return t;
    // };
    //
    // blurTextarea = function () {
    // };


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

