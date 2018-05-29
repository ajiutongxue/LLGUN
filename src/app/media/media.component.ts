import {Component, OnInit, HostListener, HostBinding} from '@angular/core';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.less']
})
export class MediaComponent implements OnInit {

  container;

  // mediaType = 'video';    // img
  pic = new Image();
  picCvs;
  picCtx;
  // msgbox
  msgBoxDefaultWidth = '360px';
  isShowMsgBox = true;
  // player
  vdo;
  vdoList = [
      {
          type: 'img',
          src: '../../assets/style/images/img.jpg',
          qcList: []
      }, {
          type: 'video',
          src: '../../assets/style/tmpImg/v2.mp4',
          qcList: []
      }, {
          type: 'video',
          src: '../../assets/style/tmpImg/v.mp4',
          qcList: []
      }, {
          type: 'video',
          src: '../../assets/style/tmpImg/v2.mp4',
          qcList: []
      }, {
          type: 'video',
          src: '../../assets/style/tmpImg/v.mp4',
          qcList: []
      }, {
          type: 'video',
          src: '../../assets/style/tmpImg/v2.mp4',
          qcList: []
      }, {
          type: 'video',
          src: '../../assets/style/tmpImg/v.mp4',
          qcList: []
      }, {
          type: 'video',
          src: '../../assets/style/tmpImg/v2.mp4',
          qcList: []
      },
  ];
  isPlayInList = true;
  isShowFrame = true;
  currentVdoIndex = 0;
  isPlaying = false;
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
  drawAt = 0;
  isDrawn = false;
  scaleRate = 1;
  scaleMsg = '';
  // pencil mode
  borderWidthList = [3, 7, 15];
  fontsizeList = [14, 25, 32];
  fontsizeLevel = 1;
  colorList = [
      'rgba(153, 2, 48, 1)',
      'rgba(255, 229, 16, 1)',
      'rgba(86, 181, 69, 1)',
      'rgba(54, 146, 225, 1)',
      'rgba(255, 255, 255, 1)',
      'rgba(190, 192, 194, 1)'
  ];
  colorIndex = 0;
  borderWidthLevel = 1;
  opacityLevel = 3;
  bgColorList = [
      'rgba(0,0,0,0)',
      'rgba(255, 255, 255, 0.45)',
      'rgba(80, 166, 225, 0.45)',
      'rgba(135, 137, 139, 0.46)',
      'rgba(0, 0, 0, 0.51)',
      'rgba(153, 2, 48, 0.49)'
  ];
  bgColorIndex = 1;
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

  qcModeType = 'pencil'; // pencil, arrow, round, rect, eraser, words
  qcTypeIcon = 'fa fa-pencil';
  qcSingedList = [];
  qcImgList = [];
  imgs = [];
  toolsBoxStyle = {
      'position': 'absolute',
      'left': 0,
      'right': 0,
      'top': '30px',
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

  $playListContent = null;
  $mediaList = [];


  isFullscreen = false;
  playerTop = 0;
  playerMsgWidth = 0;
  playerPanelWidth = 0;

  constructor() {
  }

  ngOnInit() {
      this.container = document.querySelector('.player-video-box');
      this.vdo = this.container.querySelector('video');
      if (this.vdoList[this.currentVdoIndex].type === 'img') {
          this.pic.src = this.vdoList[this.currentVdoIndex].src;
          this.vdo.src = '../../assets/style/tmpImg/v2.mp4';
          this.picCvs = $('.pic-cvs')[0];
          this.picCtx = this.picCvs.getContext('2d');
      } else {
          this.vdo.src = this.vdoList[this.currentVdoIndex].src;
      }

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
  }

  vdoEnd = function () {
      if (this.isPlayInList && this.currentVdoIndex < this.vdoList.length - 1) {
          this.changeVdoSrc(this.currentVdoIndex + 1);
      } else {
          this.vdoPause(event);
      }
  };

  vdoReady = function () {

      if (this.vdoList[this.currentVdoIndex].type === 'img') {
          this.META.owidth = this.picCvs.width = this.pic.naturalWidth;
          this.META.oheight = this.picCvs.height = this.pic.naturalHeight;
          this.picCtx.drawImage(this.pic, 0, 0, this.META.owidth, this.META.oheight);
          // this.setCvsPos(this.picCvs, this.vdo);
      } else {
          this.META.owidth = this.vdo.videoWidth;
          this.META.oheight = this.vdo.videoHeight;
      }

      // todo: 从META里面拿出去，currenttime  currentframe
      this.META.duration = this.vdo.duration;
      this.META.frames = this.time2Frame(this.META.duration);
      this.META.currentTime = 0;
      this.META.currentFrame = 0;
      this.playPercent = '0%';
      if (this.cvs) {
          this.cvs.width = this.META.owidth;
          this.cvs.height = this.META.oheight;
          this.setCvsPos(this.cvs, this.vdo);
      }

      if (!this.vdo.style.width) {
          this.setVdoPos(this.vdo, this.getVdoPos, this);
          this.META.scale = this.META.owidth / parseInt(this.vdo.style.width, 10);
      } else {
          this.META.scale = this.META.owidth / parseInt(this.vdo.style.width, 10);
      }

      // if (this.vdoList[this.currentVdoIndex].type === 'img') {
      //     this.setCvsPos(this.picCvs, this.vdo);
      // }

      this.qcSingedList = this.getQcData();
      this.qcSingedList.forEach(function (item) {
          this.qcImgList[item.frame] = item.image;
          // item.left = item.frame / this.META.frames * 100 + '%';
          item.left = item.currentTime / this.META.duration * 100 + '%';
      }, this);

      // if (this.isPlaying) this.vdoPause();

      if (this.isPlaying) {
          this.vdoPlay(event);
      }
  };

  toggleFullScreen() {
      this.isFullscreen = !this.isFullscreen;

      if (this.isFullscreen) {
          this.playerTop = $('.ll-player').offset().top;
          this.playerMsgWidth = $('.ll-player-msg').css('flexBasis');
          this.playerPanelWidth = $('.ll-player-panel').css('flexBasis');

          $('.ll-player').css('top', 0);
          $('.msg-toggle-btn').hide();
          $('.ll-player-msg').css('flexBasis', 0).hide();
          $('.ll-player-panel').css('flexBasis', 0).hide();
          $('.ll-header-box').hide();

      } else {
          $('.ll-player').css('top', this.playerTop);
          $('.msg-toggle-btn').show();
          $('.ll-player-msg').css('flexBasis', this.playerMsgWidth).show();
          $('.ll-player-panel').css('flexBasis', this.playerPanelWidth).show();
      }
      this.resetZoomAndPos();
      this.resizeVdoBox();
  }





  changeVdoSrc = function (vdoIndex) {
      if (!this.$mediaList.length) {
          this.$playListContent = $('.playlist-content');
          this.$mediaList = this.$playListContent.find('ul li');
      }

      let mediaTop = 0;
      const mediaHeight = this.$mediaList.eq(this.currentVdoIndex).height();
      const contentTop = this.$playListContent.offset().top;
      const contentHeight = this.$playListContent.height();

      // this.vdo.removeEventListener('loadedmetadata');
      // console.log('>>>>>>>');
      // console.log(this.vdoList[this.currentVdoIndex].type === 'img');
      if (this.vdoList[this.currentVdoIndex].type === 'img') this.clearPic();

      if (this.currentVdoIndex !== vdoIndex) {
          this.currentVdoIndex = vdoIndex;
          this.vdo.removeEventListener('loadedmetadata', this.vdoReady);

          if (this.vdoList[this.currentVdoIndex].type === 'img') {
              this.pic.src = this.vdoList[this.currentVdoIndex].src;
              this.vdo.src = '../../assets/style/tmpImg/v2.mp4';
              this.picCvs = $('.pic-cvs')[0];
              this.picCtx = this.picCvs.getContext('2d');
          } else {
              this.vdo.src = this.vdoList[this.currentVdoIndex].src;
          }


          // this.vdo.src = this.vdoList[vdoIndex].src;
          this.vdo.addEventListener('loadedmetadata', this.vdoReady.bind(this));
      }

      // 没有完全显示
      mediaTop = this.$mediaList.eq(this.currentVdoIndex).offset().top;
      if ((mediaTop + mediaHeight) > (contentTop + contentHeight) || mediaTop < contentTop) {
          this.$playListContent[0].scrollTop = this.$playListContent[0].scrollTop + (mediaTop - contentTop);
      }

  };

  clearPic() {
      this.clearCvs(this.picCtx);
      // this.picCtx.clearRect(0, 0, this.picCtx.width, this.picCtx.height);
      this.picCvs = null;
      this.picCtx = null;

  }

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
      if (!this.isZoomOrMove) {
          this.setCvsPos(this.cvs, this.vdo);
      }
  }

  toggleVdoPlay (event) {
      this.isPlaying = !this.isPlaying;
      this.isPlaying ? this.vdoPlay(event) : this.vdoPlay(event);
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

      if (e.keyCode == 32) {
          this.toggleVdoPlay (e);
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

  resizeVdoBox() {
      if (!this.isZoomOrMove) {
          setTimeout(() => {
              this.setVdoPos(this.vdo, this.getVdoPos, this);
              if (this.cvs) {
                  this.setCvsPos(this.cvs, this.vdo);
              }
          }, 0);
      }
  }

  // ***
  // player 相关
  // ***

  vdoPlay = function (event) {
      // if (noSrc) return;

      this.beforeClick(event);

      this.vdo.play();
      this.isPlaying = true;

      if (this.playHandler) {
          clearInterval(this.playHandler);
      }
      this.playHandler = setInterval(() => {
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
      // console.log('>>>>> ratio: ' + ratio);
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
          // console.log('>>>>>> styles.width: ' + styles.width);
          // console.log('>>>>>> styles.height: ' + styles.height);
          styles.left = vp.left + 'px';
          styles.top = (vp.height - parseInt(styles.height, 10)) / 2 + 'px';
      }
      return styles;
  };

  setVdoPos = function (vdo, getVdoPos, rt) {
      const styles = getVdoPos(vdo, rt);
      rt.setCss(vdo, styles);
    //   console.log(`vdo style = ${vdo.style.cssText}`);
      if (rt.picCvs) {
          rt.picCvs.style.cssText = vdo.style.cssText;
      }
  };

  time2Frame = function (time) {
      return Math.floor(time * this.META.FRAME);
  };

  frame2Time = function (frame) {
      return frame / this.META.FRAME;
  };

  playProgress = function (rt) {
      if (rt.drawHistory.length) {
          rt.clearHistory();
          rt.saveQcImage(rt.createQcImage(rt.cvs));
          rt.clearCvs(rt.ctx);
      } else {
          rt.META.currentFrame = rt.time2Frame(rt.vdo.currentTime);
          rt.playPercent = (rt.vdo.currentTime / rt.META.duration * 100) + '%';
          rt.clearCvs(rt.ctx);
          if (rt.qcImgList[rt.META.currentFrame]) {
              rt.imgShowInCanvas(rt.qcImgList[rt.META.currentFrame], rt.ctx);
          }
      }

  };

  gotoAndPlay = function (event) {
      this.beforeClick(event);
      this.playProgress(this);
      // this.clearCvs(this.ctx);
      this.vdo.currentTime = this.frame2Time(event.pageX / this.vdo.parentNode.getBoundingClientRect().width * this.META.frames);
      this.playProgress(this);
  };
  gotoAndStop = function (event, frame) {
      this.playProgress(this);
      // this.clearCvs(this.ctx);
      setTimeout(function () {
          this.vdo.currentTime = this.frame2Time(frame);
          this.playProgress(this);

          if (this.isPlaying) {
              this.vdoPause(event);
          }
      }.bind(this), 0);

      event.stopPropagation();
  };

  imgShowInCanvas = function (img, ctx) {
      ctx.drawImage(img, 0, 0, this.META.owidth, this.META.oheight);
  };

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
      console.log('现在正在set cvs pos， 马上要进入 set vdo pos');
      this.setVdoPos(vdo, this.getVdoPos, this);
      console.log('已经从 setvdopos出来了');
      cvs.style.cssText = vdo.style.cssText;
      cvs.style.zIndex = 10;
  };

  setTmpCvs = function (tmpCvs) {
      tmpCvs.width = this.cvs.width;
      tmpCvs.height = this.cvs.height;
      tmpCvs.style.cssText = this.cvs.style.cssText;
      this.tmpCvsIndex = parseInt(this.cvs.style.zIndex, 10) + 1;
  };

  exitAllMode = function () {
      this.qcMode = false;
      this.zoomMode = false;
      this.moveMode = false;
      this.watchMode = false;
      // console.log('>>>> exit edit type');
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

  createQcImage = function (cvs) {
      const image = new Image();
      image.src = cvs.toDataURL('image/png');
      image.width = 50;
      image.height = 30;
      image.style.display = 'none';
      document.querySelector('.ll-player-msg').appendChild(image);
      return image;
  };

  saveQcImage = function (image) {
      // const cf = this.time2Frame(this.vdo.currentTime);
      const cf = this.time2Frame(this.drawAt);
      const rt = this;
      this.qcSingedList.push({
          frame: cf,
          image: image,
          left: cf / rt.META.frames * 100 + '%'
      });
      this.qcImgList[cf] = image;

      // console.log('!!!!!! ' + this.qcSingedList.length);
  };

  clearCvs = function (ctx) {
      ctx.clearRect(0, 0, this.META.owidth, this.META.oheight);
  };

  resetZoomAndPos = function () {
      this.scaleRate = 1;
      this.vdo.style.transform = 'scale(1)';
      this.cvs.style.transform = 'scale(1)';
      this.picCvs.style.cssText = this.vdo.style.cssText;
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

      this.vdo.style.transform = 'scale(' + scale + ')';
      this.cvs.style.transform = 'scale(' + scale + ')';
      this.picCvs.style.cssText = this.vdo.style.cssText;

      this.scaleMsg = Math.round(scale * 100) + '%  【 按 R 键恢复默认位置及大小 】';
  };


  @HostListener('mouseover', ['$event']) onmouseover(e) {
      switch (this.qcModeType) {
          case 'pencil':
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
      }
  }

  @HostListener('mousedown', ['$event']) onmousedown(e) {
      this.drawAt = this.vdo.currentTime;
      if (this.qcMode && e.target === this.tmpCvs) {
          this.mouseDownPosition.x = e.clientX;
          this.mouseDownPosition.y = e.clientY;
          if (this.isPlaying) {
              this.vdoPause(e);
          }
          // 获取当前qc工具设置
          if (this.qcModeType === 'arrow') {
              this.arrowSetting.border = this.borderWidthList[this.borderWidthLevel];
              this.arrowSetting.color = this.colorList[this.colorIndex];
          }
          if (this.qcModeType === 'rect' || this.qcModeType === 'round') {
              this.rectSetting.border = this.borderWidthList[this.borderWidthLevel];
              this.rectSetting.borderColor = this.colorList[this.colorIndex];
              this.rectSetting.bgColor = this.colorList[this.colorIndex].replace('1)', this.opacityLevel / 10 + ')');
          }

          this.isMouseDown = true;
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
      }
  }

  @HostListener('mousemove', ['$event']) onmousemove(e) {
      if (this.isMouseDown) {
          this.isMouseMoved = true;
          if (e.target === this.tmpCvs) {
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
                  this.picCvs.style.cssText = this.vdo.style.cssText;
              }
          }
      }

  }

  drawToMainCvs = function (type, fromPos, toPos, setting) {
      this.clearCvs(this.tmpCtx);
      this.ctx.globalCompositeOperation = 'source-over';
      if (type === 'arrow') {
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
          }
      }
      if (this.moveMode) {
          this.activePosition.x = parseInt(this.vdo.style.left, 10);
          this.activePosition.y = parseInt(this.vdo.style.top, 10);
      }
      if (this.zoomMode) {
          this.scaleMsg = '';
      }
      this.isMouseDown = false;
      this.isMouseMoved = false;
  }

  @HostListener('click', ['$event']) onclick(e) {

      if (this.isTyping) {
          this.drawText();
      } else {
          if (this.qcMode && this.qcModeType === 'words') {
              if (e.target !== this.cvs) {
                  return;
              }
              // 设置文字样式
              this.fontSetting.fontSize = this.fontsizeList[this.fontsizeLevel];
              this.fontSetting.color = this.colorList[this.colorIndex];
              this.fontSetting.bgColor = this.bgColorList[this.bgColorIndex];
              this.createTextarea();
          }
      }

      e.stopPropagation();
  }

  draw = function (e) {
      this.drawHistoryCell.push({
          type: this.qcModeType,
          x: this.lastLoc.x,
          y: this.lastLoc.y,
          w: this.borderWidthList[this.borderWidthLevel],
          c: this.colorList[this.colorIndex]
      });
      // console.log('))))))) ' + this.drawHistory.length);
      const curLoc = this.windowToCanvas(e.clientX, e.clientY);

      this.oneStepDrawLine(this.lastLoc, curLoc, this.qcModeType, {
          w: this.borderWidthList[this.borderWidthLevel],
          c: this.colorList[this.colorIndex]
      });
      this.lastLoc = curLoc;
  };

  // showLength = function() {
  //     console.log('<><><><><><> ' + this.drawHistory.length);
  // };

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
          c.save();
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
          c.restore();
      }
  };

  // window 和 canvas 的坐标转换
  windowToCanvas = function (x, y) {
      const c = this.cvs.getBoundingClientRect();
      const _scale = this.META.owidth / c.width;
      return {
          x: Math.round(x - c.left) * _scale,
          y: Math.round(y - c.top) * _scale
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

              // console.log('eraser is point in path');
              if (this.drawHistoryCell.length) {
                  // console.log('has draw history cell length');
                  this.drawHistoryCell.push({
                      type: this.qcModeType,
                      x: this.lastLoc.x,
                      y: this.lastLoc.y,
                      w: this.borderWidthList[this.borderWidthLevel],
                      c: this.colorList[this.colorIndex]
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
                  setting: {
                      border: this.rectSetting.border,
                      bgColor: this.rectSetting.bgColor,
                      borderColor: this.rectSetting.borderColor
                  }
              });
              this.lastLoc = this.mouseDownPosition = {x: 0, y: 0};
          } else if (this.qcModeType === 'arrow') {
              this.drawHistory.push({
                  type: this.qcModeType,
                  fromPos: this.windowToCanvas(this.mouseDownPosition.x, this.mouseDownPosition.y),
                  toPos: this.lastLoc,
                  setting: {
                      border: this.arrowSetting.border,
                      theta: this.arrowSetting.theta,
                      color: this.arrowSetting.color
                  }
              });
              this.lastLoc = this.mouseDownPosition = {x: 0, y: 0};
          }
      } else if (this.qcModeType === 'words') {
          if (this.textareaValue.trim()) {
              this.drawHistory.push({
                  type: this.qcModeType,
                  pos: this.windowToCanvas(parseInt(this.textarea.style.left, 10), parseInt(this.textarea.style.top, 10)),
                  text: this.textareaValue,
                  setting: {
                      fontSize: this.fontSetting.fontSize,
                      lineHeight: 1.2,
                      color: this.fontSetting.color,
                      bgColor: this.fontSetting.bgColor
                  }
              });
              this.lastLoc = this.mouseDownPosition = {x: 0, y: 0};
          }

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
                  // console.log('words');
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
          for (let l = 0; l < this.drawHistoryBackup.length; l++) {
              // console.log(this.drawHistoryBackup[l].type);
              if (this.drawHistoryBackup[l].type === 'pencil' || this.drawHistoryBackup[l].type === 'eraser') {
                  this.drawHistory[l] = {
                      type: this.drawHistoryBackup[l].type,
                      data: []
                  };
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
      console.log('已经执行了 clearhistory，看看现在到lenght：' + this.drawHistory.length);
  };

  createTextarea = function () {
      this.isTyping = true;
      const _scale = this.META.owidth / this.vdo.getBoundingClientRect().width;

      this.fontSetting.maxWidth = this.container.getBoundingClientRect().width + this.container.getBoundingClientRect().left - this.mouseDownPosition.x;
      this.fontSetting.maxHeight = this.container.getBoundingClientRect().height + this.container.getBoundingClientRect().top - this.mouseDownPosition.y;

      this.textarea = document.createElement('textarea');
      this.textarea.className = 'qc-textarea';
      this.textarea.setAttribute('spellcheck', false);
      this.shadowTa = document.createElement('span');
      this.shadowTa.className = 'qc-shadow-text';
      this.shadowTa.style.cssText = 'font-size: ' + this.fontSetting.fontSize + 'px;' +
          'min-width: 20px;' +
          'max-width: ' + this.fontSetting.maxWidth + 'px;' +
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
          'top: ' + (this.mouseDownPosition.y - 10) + 'px;' +
          'color: ' + this.fontSetting.color;
      this.container.appendChild(this.textarea);
      this.textarea.focus();
      this.textarea.addEventListener('input', this.textareaChangeHandler.bind(this));
  };
  textareaChangeHandler = function () {
      const _scale = this.META.owidth / this.vdo.getBoundingClientRect().width;
      this.shadowTa.innerHTML = this.textarea.value.replace(/\b/g, '&nbsp;').replace(/\n/g, '<br>') + '&nbsp;';
      this.textarea.style.width = this.shadowTa.getBoundingClientRect().width / this.META.scale + 'px';
      this.textarea.style.height = this.shadowTa.getBoundingClientRect().height / this.META.scale + 'px';
  };


  /* 绘制文字步骤 */
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
              ctx.fillText(formattedTextList[k], pos.x + 5, pos.y + k * lineHeight + 5 + s.fontSize / 2 + 2);
          }
      }
  };

  drawText = function () {
      // 把字画到主画布上
      this.textareaValue = this.textarea.value;
      this.oneStepDrawText(
          this.ctx,
          this.windowToCanvas(parseInt(this.textarea.style.left, 10), parseInt(this.textarea.style.top, 10)),
          this.qcModeType,
          this.textareaValue,
          this.fontSetting
      );

      this.finishDraw();
  };

  beforeClick = function (event) {
      event && event.stopPropagation();
      if (this.isTyping) {
          this.drawText();
      }
  };

  // ***
  // 辅助
  // ***
  setCss = function (ele, styles) {
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

  // 生成qc缩略图
  createImg() {
      const cvs = document.createElement('canvas');
      const c = cvs.getContext('2d');
      // 我随便设置到尺寸
      const w = cvs.width = 360;
      const h = cvs.height = 160;

      c.drawImage(this.vdo, 0, 0, this.META.owidth, this.META.oheight, 0, 0, w, h);
      // 这个cvs是用鼠标画了东西的那个cvs
      c.drawImage(this.cvs, 0, 0, this.META.owidth, this.META.oheight, 0, 0, w, h);

      // const img = document.createElement('img');
      // img.src = cvs.toDataURL('image/jpg');

      // 使用 b64ToBlob() 处理这个东西 cvs.toDataURL('image/jpg')，然后用传给api保存
  }

}
