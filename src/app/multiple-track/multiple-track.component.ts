import { Component, OnInit } from '@angular/core'
import { Version } from '../player-layer/version'
import { VERSION_LISTS } from '../player-layer/mock-version'
declare const PxLoader: any, PxLoaderImage: any

class Rect {
    x: number
    y: number
    w: number
    h: number
    text: string
    version: Version
    pic: Pic
    picObj: null
    startFrame: number
    endFrame: number
}

class Pic {
    w: number
    h: number
    ow: number // 原始图片上截取的宽度
    oh: number // 原始图片上截取的高度
    url: string
}

class ControlPanel {
    title: string
    isShow: boolean
    isShowPic: boolean
    // isShowText: boolean
    opacity: number
    copyFinished: boolean
}

class Track {
    ctrl: ControlPanel
    data: Array<any>
}

class Info {
    frame: number
    title: string
}

@Component({
    selector: 'app-multiple-track',
    templateUrl: './multiple-track.component.html',
    styleUrls: ['./multiple-track.component.less']
})
export class MultipleTrackComponent implements OnInit {
    version_lists = VERSION_LISTS

    private readonly FRAMES = 30
    rulerCvs = null
    rulerCtx = null
    // 单位长度和单位时间段关系： 单位长度 / canvas长度 = 单位时间段 / canvas显示的时间段长度
    // unitWidth = 60 // 1000ms 对应的像素长度
    unitDuration = 1000

    // unit frame width: 默认的 1 倍的 1 帧的显示像素值
    unitFrameWidth = 0.1
    // unitFrameMaxWidth = 10
    unitScale = 20
    maxScale = 100
    minScale = 0  // 还是需要这个值的
    // minScale  不设置这个值，只设置小于多少的时候就不显示图片，只显示色块了
    rectHeight = 85
    $scrollbar = null
    scrollbarBoxContentWidth = 0
    $scrollbarHandlerLeft = null
    $scrollbarHandlerRight = null
    scrollbarMinWidth = 0
    scrollbarScaleStep = 0 // 滚动条控制缩放时的步长
    offsetLeft = 0 // 画布偏移量

    totalDuration = 0
    totalCvsWidth = 0 // single 里面的shadowcvs的width
    currentFrame = 0
    ifNextVersion = true
    // currentVersion = null
    currentVersionIndex = 0
    // 当前版本的durationFrame
    currentDurationFrame = {
        start: 0,
        end: 0
    }

    /* {c: canvasDOM, t: canvasContext} */
    cache = []
    cacheMaxCount = 0

    shownDuration = 0

    WORDSHEIGHT = 16
    RECTFONT = '10px sans-serif'
    trackList: Track[] = []
    trackListBoxHeight = 0 // 带滚动条的div
    trackListBoxWidth = 0 // 带滚动条的div

    $vernier = null
    $vernierHandler = null
    vernierLeft = 400
    vernierBoundaryLeft = 0
    vernierBoundaryRight = 0 // 代表的是这个元素的最大的 left 属性的值

    playTimer = null

    isShowText = true
    isDrawPic = true

    screenIndex = 0

    infos = []

    constructor() {}

    ngOnInit() {
        // console.log(`[init start] unitframewidth: ${this.unitFrameWidth}`)
        this.$vernier = $('.vernier')
        this.$vernierHandler = this.$vernier.find('.drag-vernier-handle')
        this.$scrollbar = $('.scrollbar:first')
        this.$scrollbarHandlerLeft = this.$scrollbar.find('.resize-left:first')
        this.$scrollbarHandlerRight = this.$scrollbar.find(
            '.resize-right:first'
        )
        this.totalDuration = this.version_lists[0].data.reduce((prev, cur) => {
            return prev + cur.duration
        }, 0)
        this.rulerCvs = document.getElementById('ruler-canvas')
        this.rulerCvs.width = $('.ruler-box').width()
        this.rulerCvs.height = 30
        this.rulerCtx = this.rulerCvs.getContext('2d')

        // init tracks 的外面带滚动条的div的尺寸
        this.trackListBoxHeight = $('.shot-box').height()
        this.trackListBoxWidth =
            this.version_lists.length * this.rectHeight >
            this.trackListBoxHeight
                ? this.rulerCvs.width - 16
                : this.rulerCvs.width

        this.vernierBoundaryLeft = $(this.rulerCvs).offset().left
        this.vernierBoundaryRight =
            this.vernierBoundaryLeft + this.trackListBoxWidth

        // this.shownDuration = Math.floor(this.totalDuration * 0.3)
        this.shownDuration = this.frame2Duration(
            // this.trackListBoxWidth / this.unitFrameWidth
            this.trackListBoxWidth / this.getFrameWidth()
        )
      

        // this.scrollbarBoxContentWidth = $('.scrollbar-box').width() - 30
        this.scrollbarBoxContentWidth = $('.scrollbar-box').width() - 30
        // this.setUnitFrameMaxWidth()
        /*
         * 检查是否需要设置 unitFrameWidth
         * */
        // this.checkUnitFrameWidth()

        this.setTrackList()
        this.drawRuler()

        this.scrollbarScaleStep = this.scrollbarBoxContentWidth / (this.maxScale - this.minScale)
        this.scrollbarMinWidth = this.scrollbarScaleStep  // 最小的宽度就是一个步长

        this.initScrollbar()
        this.setCurrentFrame()
        // this.setScreenIndex()
        
        // this.scrollbarMinWidth = this.scrollbarBoxContentWidth * this.trackListBoxWidth / (this.maxScale * this.unitFrameWidth * this.totalDuration / (1000 / this.FRAMES))
        // console.log(`scrollbarMinWidth is: ${this.scrollbarMinWidth}`)

        this.currentVersionIndex = this.whichVersionPlaying(
            this.currentFrame
        ).index
        this.$scrollbar.on('mousedown', event => {
            const x = event.clientX
            const scrollbarOffsetLeft = parseInt(
                this.$scrollbar.css('left'),
                10
            )

            $(document).on('mousemove.forSb', e => {
                const moveLength = e.clientX - x
                let newLeft = scrollbarOffsetLeft + moveLength

                const remainder = (scrollbarOffsetLeft + moveLength) % this.scrollbarScaleStep

                if (moveLength > 0) {
                    newLeft -= remainder
                } else {
                    newLeft += remainder
                }

                if (scrollbarOffsetLeft + moveLength < 0) {
                    newLeft = 0
                } else if (
                    scrollbarOffsetLeft + moveLength >
                    this.scrollbarBoxContentWidth - this.$scrollbar.width()
                ) {
                    newLeft =
                        this.scrollbarBoxContentWidth - this.$scrollbar.width()
                } /* else {
                    newLeft = scrollbarOffsetLeft + moveLength
                } */

                this.setScrollbarLeft(newLeft)
            })

            $(document).on('mouseup.forSb', () => {
                $(document).off('.forSb')
            })
        })



        this.$scrollbarHandlerRight.on('mousedown', e => {
            e.stopPropagation()
            const x = e.pageX
            const w = this.$scrollbar.width()
            // const minWidth = 20  // TODO: 这两个值应该是用倍率来算出来的
            const minWidth = this.scrollbarMinWidth
            const maxWidth = (this.maxScale + 1) * this.unitFrameWidth - this.$scrollbar.css('left')
            //     // this.rulerCvs.width - parseInt(this.$scrollbar.css('left'))
                // this.rulerCvs.width - parseInt(this.$scrollbar.css('left')) - 30

            $(document).on('mousemove.forSr', e => {
                let width = w + e.pageX - x
                let remainder = width % this.scrollbarScaleStep
                width = remainder ? width - remainder : width
                if (width > maxWidth) {
                    width = maxWidth
                } else if (width < minWidth) {
                    width = minWidth
                }
                // this.unitScale = Math.floor(width / this.scrollbarScaleStep)
                this.$scrollbar.width(width)
                this.setOffsetLeft()
                this.resizeShownDuration()
                this.setVernierLeft(null, 0, true)
            })
            $(document).on('mouseup.forSr', () => {
                $(document).off('.forSr')
            })
        })

        this.$scrollbarHandlerLeft.on('mousedown', e => {
            e.stopPropagation()
            const x = e.pageX
            const w = this.$scrollbar.width()
            const l = parseInt(this.$scrollbar.css('left'))
            const minWidth = this.scrollbarMinWidth
            // const minWidth = 20
            const maxWidth = w + l
            // const maxWidth = this.scrollbarScaleStep * this.maxScale

            $(document).on('mousemove.forSl', e => {
                let width = w + (x - e.pageX)
                if (width > maxWidth) {
                    width = maxWidth
                } else if (width < minWidth) {
                    width = minWidth
                }                // this.offsetLeft = this.offsetLeft + width - w
                this.$scrollbar.css('left', l - width + w)
                this.$scrollbar.width(width)
                this.setOffsetLeft()
                this.resizeShownDuration()
                this.setVernierLeft(null, 0, true)
            })
            $(document).on('mouseup.forSl', () => {
                $(document).off('.forSl')
                // this.offsetLeft = parseInt(this.$scrollbar.css('left'))
            })

        })

        
        // this.setCurrentDurationFrame(null)
        this.setCurrentDurationFrame({
            version: this.trackList[0].data[this.currentVersionIndex],
            index: this.currentVersionIndex
        })

        this.playing()
        // console.log(`[init end] unitframewidth: ${this.unitFrameWidth}`)

        // console.log('total cvswidth: ' + this.totalCvsWidth)
    }


    vernierMousedown(e) {
        // let isDown = true
        let isPlaying = false
        this.$vernier.parent().addClass('active')
        $('body').css('cursor', 'move')
        console.log('down====')

        if (this.playTimer) {
            isPlaying = true
            this.stop()
        }

        $(window).on('mousemove.drag', e => {
            this.setVernierLeft(e)
            // this.setCurrentFrame()
            this.currentVersionIndex = this.whichVersionPlaying(
                this.currentFrame
            ).index

        })
            
        $(window).on('mouseup.drag', e => {
            this.$vernier.parent().removeClass('active')
            $(window).off('.drag')
            $('body').css('cursor', 'default')
            this.setCurrentDurationFrame({
                version: this.trackList[0].data[
                    this.currentVersionIndex
                ],
                index: this.currentVersionIndex
            })
            if (isPlaying) {
                this.playing()
            }
        })
    }


    // /* 
    //  * 画面向前走一屏
    //  * */
    // flipPrev() {}

    // /* 
    //  * 画面向后走一屏
    //  * */
    // flipNext() {}
    

    getScrollbarBoundaryRight() {
        return $('.scrollbar-box').width() - this.$scrollbar.outerWidth()
    }

    setScrollbarLeft(left) {
        this.$scrollbar.css('left', left)
        this.setOffsetLeft()
        this.drawRuler()
        this.setVernierLeft(null, 0, true)
    }

    setVernierLeft(e, moveWidth = 0, ifMoveToCurrentFrame = false) {
        if (
            this.vernierLeft < this.vernierBoundaryLeft ||
            this.vernierLeft > this.vernierBoundaryRight
        ) {
            this.$vernier.css('display', 'none')
        } else {
            this.$vernier.css('display', 'block')
        }

        if (e) {
            const l = e.pageX - $('.layer-container').offset().left
            if ( l > this.vernierBoundaryRight ) {
                this.vernierLeft = this.vernierBoundaryRight
            } else if (l < this.vernierBoundaryLeft) {
                this.vernierLeft = this.vernierBoundaryLeft 
            } else {
                // let _frameCount = Math.floor(this.duration2Frame(this.width2Duration(this.offsetLeft + l)))
                const remainder = (this.offsetLeft + l) % (this.unitFrameWidth * this.unitScale)
                this.vernierLeft = remainder ? l - remainder : l
            }
           
            this.setCurrentFrame()
            this.setCurrentDurationFrame(null)
            return
        }

        if (ifMoveToCurrentFrame) {
            this.vernierLeft =
                this.frame2Width(this.currentFrame) -
                this.offsetLeft +
                $('.left-section:first').width()
            return
        }

        if (moveWidth !== 0) {
            // console.log(`set vernier left, unitFrameWidth: ${moveWidth}`)
            this.vernierLeft += moveWidth
            if (this.vernierLeft > this.vernierBoundaryRight) {
                this.stop()
            }
        }
    }

    vernierMove2NextFrame() {
        // this.setVernierLeft(null, this.unitFrameWidth)
        this.setVernierLeft(null, this.getFrameWidth())

        if (
            parseInt(this.$scrollbar.css('left'), 10) <
            this.getScrollbarBoundaryRight()
        ) {
            if (this.vernierLeft > this.vernierBoundaryRight - 30) {
                let left =
                    parseInt(this.$scrollbar.css('left'), 10) +
                    this.$scrollbar.width()

                this.setScrollbarLeft(
                    left <= this.getScrollbarBoundaryRight()
                        ? left
                        : this.getScrollbarBoundaryRight()
                )
            }
        }
        this.setCurrentFrame(1)
    }

    playNextVersion() {
        if (!this.ifNextVersion) return
        
        this.currentVersionIndex += 1
        this.setCurrentDurationFrame({
            version: this.trackList[0].data[this.currentVersionIndex],
            index: this.currentVersionIndex
        })
        // this.setCurrentFrame()
        this.currentFrame = this.currentDurationFrame.start
        this.setVernierLeft(null, 0, true)
        
        this.playing()
    }

    playing() {
        if (this.playTimer) return
        this.playTimer = window.setInterval(() => {
            // if a version ended
            this.vernierMove2NextFrame()
            if (this.currentFrame >= this.currentDurationFrame.end) {
                this.stop()
                setTimeout(() => {
                    console.log('该走啦')
                    this.playNextVersion()
                }, 1000)
            }
        }, 1000 / 5)
    }

    stop() {
        window.clearInterval(this.playTimer)
        this.playTimer = null
        // console.log(`stop=========================`)
    }

    setCurrentFrame(step = 0) {
        if (step) {
            this.currentFrame += step
            return
        }

        const offsetLeftDuration = this.width2Duration(
            this.offsetLeft + this.vernierLeft - $('.left-section:first').width() )
        this.currentFrame = Math.round(this.duration2Frame(offsetLeftDuration))
    }

    /* 
     * 设置当前播放的版本的进入帧及结束帧
     * 当currentFrame > 结束帧的时候，就证明这个版本播放完了
     * 同时加了个是否有下一个版本的判断
    */
    setCurrentDurationFrame(version) {
        version = version || this.whichVersionPlaying(this.currentFrame)

        this.currentDurationFrame.start = version.version.startFrame
        this.currentDurationFrame.end = version.version.endFrame

        if (this.trackList[0].data.length > version.index + 1) {
            this.ifNextVersion = true
        } else {
            this.ifNextVersion = false
        }
    }

    whichVersionPlaying(frame) {
        const track = this.trackList[0].data
        const version = track.find(rect => {
            return (
                this.currentFrame >= rect.startFrame &&
                this.currentFrame <= rect.endFrame
            )
        })
        return { version: version, index: track.indexOf(version) }
    }

    // 测试用
    pause() {
        this.stop()
    }
    play() {
        this.playing()
    }
    reset() {
        if (this.playTimer) this.stop()
        this.vernierLeft = this.vernierBoundaryLeft
        this.$scrollbar.css('left', 0)
        this.currentFrame = 0
        this.currentVersionIndex = 0
        this.setCurrentDurationFrame(null)
    }

    // ok
    initScrollbar() {
        // this.$scrollbar.width(
        //     this.scrollbarBoxContentWidth *
        //         this.trackListBoxWidth /
        //         this.getLatestTotalCvsWidth()
        // )
        this.$scrollbar.width(this.unitScale * this.scrollbarScaleStep)
    }

    /* 
     * XXX这个应该不要了
     * 初始化时，最小 unitFrameWidth 设置
     * 当按照给定的默认unitFrameWidth（目前这个值是 1），track 格子不足以横向填充满画布时，
     * 增加这个值的大小，能让他出现横行滚动条，
     * 如果要想刚好铺满，那也可以改变计算方法
     * 这个操作可能应该跟 setUnitFrame 合并
     *  */
    // TODO: 要改个合适的名字呀
    // setUnitFrameWidthAsMinWidth() {
    //     this.unitFrameWidth *= 1.5
    //     this.setIsDrawPic()
    //     console.log(`current unitFrameWidth: ${this.unitFrameWidth}`)
    // }
    // checkUnitFrameWidth() {
    //     while (
    //         this.duration2Width(this.totalDuration) < this.trackListBoxWidth
    //     ) {
    //         this.setUnitFrameWidthAsMinWidth()
    //     }
    // }

    /* 
     * 判断是否满足绘制缩略图的条件
     * */
    // TODO: 需要改一下
    setIsDrawPic() {
        // this.isDrawPic = this.unitFrameWidth >= 0.5
        this.isDrawPic = this.unitScale > 10
        // console.log(`is draw Pic? ${this.isDrawPic}`)
    }

    /* 
     * 设置当前画面允许的最大单帧宽度
     * */
    // setUnitFrameMaxWidth() {
    //     // 1、考虑滚动条的对应宽度
    //     // 2、
    //     // 3、
    //     // 4、最大值和上面设置的最小值冲突
    //     const _shadowCvsWidth =
    //         this.scrollbarBoxContentWidth * this.trackListBoxWidth / 10
    //     let _w = _shadowCvsWidth / this.duration2Frame(this.totalDuration)
    //     _w = _w < 1 ? 1 : _w
    //     this.unitFrameMaxWidth = _w
    //     // console.log(`now, unitFrameMaxWidth: ${this.unitFrameMaxWidth}`)
    // }

    resizeShownDuration() {
        this.shownDuration = //this.frame2Duration()
            this.totalDuration *
            this.$scrollbar.width() /
            this.scrollbarBoxContentWidth
        this.setUnitScale(0, true)
        // this.setUnitFrameWidth()
        this.drawRuler()
        this.updateTrackList()
    }


    // TODO: 这是一个要被替换掉的方法，不再直接设置这个值，而是要去设置 unitScale
    // setUnitFrameWidth() {
    //     let w = this.trackListBoxWidth / this.shownDuration * 1000 / this.FRAMES

    //     this.unitFrameWidth =
    //         w < this.unitFrameMaxWidth ? w : this.unitFrameMaxWidth
    //     this.setIsDrawPic()
    // }


    /* 
     * 设置缩放倍率
     * 只通过当前方法来设置
     * rate === 0 时，表示没有进行缩放，unitFrameWidth为默认宽度
     * rate > 0, 表示被放大了，即 unitFrameWidth变为了原来的 (1 + rate) 倍
     * rate < 0, 表示被缩小了，即 unitFrameWidth变为了原来的 1 / (1 - rate) 倍
     * */
    setUnitScale(rate, isShownDurationChanged = false) {
        // console.log(this.shownDuration + ' ...[shown]')
        const maxScale = this.maxScale
        // const minScale = this.minScale
        let _scale = 0
        if (isShownDurationChanged) {
            // let w = this.trackListBoxWidth / this.shownDuration * 1000 / this.FRAMES
            _scale = Math.round(this.trackListBoxWidth * this.FRAMES / this.shownDuration / this.unitFrameWidth)
            this.unitScale = _scale
            // console.log(`~~~~ ${rate}`)
            // this.unitFrameWidth =
            //     w < this.unitFrameMaxWidth ? w : this.unitFrameMaxWidth
            this.setIsDrawPic()
            return
        } 

        // _scale = rate >= 0 ? this.unitScale * (1 + rate) : this.unitScale / (1 - rate)
        _scale = this.unitScale + rate

        // if (rate >= 0) {
        //     this.unitScale += rate
        // } else {
        //     if (this.unitScale > rate) {
        //         this.unitScale -= rate
        //     } else {

        //     }
        // }

        if (_scale > maxScale) {
            this.unitScale = maxScale
        // } else if (_scale < minScale) {
        //     this.unitScale = minScale
        } else {
            this.unitScale = _scale
        }

        this.setIsDrawPic()
        // this.unitScale = rate >= 0 ? this.unitScale * (1 + rate) : this.unitScale / (1 - rate)
    }


    // ok
    formatRulerShowTime(time) {
        const h = Math.floor(time / 3600000)
        const m = Math.floor((time % 3600000) / 60000)
        const s = Math.floor((time % 60000) / 1000)
        const f = Math.floor((time % 1000) / this.FRAMES)

        return (
            (h > 9 ? h : '0' + h) +
            ' : ' +
            (m > 9 ? m : '0' + m) +
            ' : ' +
            (s > 9 ? s : '0' + s) +
            ' : ' +
            (f > 9 ? f : '0' + f)
        )
    }

    /* 
     * 双击时间轴，添加注释信息
     * */
    addInfo(e) {
        this.infos.push({
            frame: this.duration2Frame(this.width2Duration(this.offsetLeft + e.pageX)),
            title: 'this is paopao add',
            left: e.pageX - $(this.rulerCvs).offset().left
        })
    }

    

    // ok
    getLatestTotalCvsWidth() {
        this.totalCvsWidth = this.duration2Width(this.totalDuration)
        return this.totalCvsWidth
    }

    /* 
     * 获取缩放比例后的单个frame的宽度
     * */
    getFrameWidth () {
        return this.unitFrameWidth * this.unitScale
    }


    /* 
     * XXX测试用，改变 unitFrameWidth 的值 
     * 改变缩放倍率
     */
    unitWidthChanged(step) {
        this.setUnitScale(step)
        // this.unitWidth += step
        // this.unitScale = step >= 0 ? this.unitScale * step : this.unitScale / -step
        // const w =
        //     step > 0 ? this.unitFrameWidth * step : this.unitFrameWidth / -step

        // if (w > this.unitFrameMaxWidth) {
        //     this.unitFrameWidth = this.unitFrameMaxWidth
        // } else if (w < 1) {
        //     this.unitFrameWidth = 1
        // } else {
        //     this.unitFrameWidth = w
        // }
        this.initScrollbar()
        this.drawRuler()
        this.updateTrackList()
    }

    getScrollbarOffsetLeft() {
        return parseInt(this.$scrollbar.css('left'), 10)
    }

    setOffsetLeft() {
        const left = this.getScrollbarOffsetLeft()
        this.offsetLeft =
            left === 0
                ? 0
                : left /
                  this.scrollbarBoxContentWidth *
                  this.getLatestTotalCvsWidth()

        // console.log(`[setOffsetLeft] offsetLeft: ${this.offsetLeft}`)

    }

    /* 
     * 绘制时间轴
     * */
    // TODO: start偏移有问题，不行就换成tracklist的画法，用三个cache
    drawRuler () {
        // console.log(`[drawRuler] offsetLeft: ${this.offsetLeft}`)
        const cvs = this.rulerCvs
        const c = this.rulerCtx
        const stepTime = 200 // todo: 暂时写死 200ms 一个小刻度
        // const stepWidth = Math.round(this.duration2Width(stepTime))
        const stepWidth = this.duration2Width(stepTime)

        // const start = Math.round(this.offsetLeft % this.duration2Width(stepTime))
        const start = this.offsetLeft % this.duration2Width(stepTime) 
        // console.log(`[draw ruler] start: ${start}`)
        let currentCount = Math.floor(this.offsetLeft / stepWidth)

        c.clearRect(0, 0, cvs.width, cvs.height)

        c.font = '10px sans-serif'
        c.fillStyle = '#979797'
        c.strokeStyle = '#979797'
        c.lineWidth = 1
        c.beginPath()
        
        for (let x = start + 0.5; x < cvs.width; currentCount++, x += stepWidth) {
            let y = 23
            if (stepWidth < 10) {
                if (currentCount % 30 === 0) {
                    c.fillText(this.formatRulerShowTime(currentCount * stepTime), x - 40, 14)
                    y = 18
                }
            } else if (stepWidth > 20) {
                if (currentCount % 5 === 0) {
                    c.fillText(this.formatRulerShowTime(currentCount * stepTime), x - 40, 14)
                    y = 18
                }
            } else {
                if (currentCount % 10 === 0) {
                    c.fillText(this.formatRulerShowTime(currentCount * stepTime), x - 40, 14)
                    y = 18
                }
            }
            c.moveTo(x, y)
            c.lineTo(x, 30)
            c.stroke()
        }
        c.fillStyle = '#979797'
        c.fillRect(0, 30 - 2, cvs.width, 2)
        c.closePath()
    }

    // 单行控制状态时候 添加参数 text = false
    updateTrackList() {

        this.trackList.forEach(track => {
            let row = track.data
            let ol = 0

            row.forEach(rect => {
                rect.x = ol
                rect.w = this.frame2Width(
                    Math.ceil(this.duration2Frame(rect.version.duration))
                )
                
                rect.pic.w = this.frame2Width(
                    Math.ceil(
                        this.duration2Frame(
                            rect.version.movie.getActualDuration()
                        )))
                ol += rect.w
            })
        })
    }


    setTrackList() {
        // TODO: 数据不要每次清空重新整理，取到的数据不改变时，只进行内部值的重新计算，需要改下结构，把图片文件存进来

        const lh = this.rectHeight
        const version_lists = this.version_lists
        const shadowRects = []
        let frames = 0

        version_lists.forEach((row, index) => {
            frames = 0

            const ctrl: ControlPanel = {
                title: row.title,
                isShow: true,
                isShowPic: index !== 3,
                // isShowText: true,
                opacity: 100,
                copyFinished: false
            }

            shadowRects[index] = []
            let ol = 0

            for (let i = 0; i < row.data.length; i++) {
                const item = row.data[i]

                const pic: Pic = {
                    // w: this.duration2Width(item.movie.getActualDuration()),
                    w: this.frame2Width(
                        Math.ceil(
                            this.duration2Frame(item.movie.getActualDuration())
                        )
                    ),
                    // h: lh - this.WORDSHEIGHT * 2,
                    h: lh,
                    oh: 0,
                    ow: 0,
                    url: item.movie.picUrl
                }

                const rect: Rect = {
                    x: ol,
                    y: 0,
                    // w: this.duration2Width(item.duration),
                    w: this.frame2Width(
                        Math.ceil(this.duration2Frame(item.duration))
                    ),
                    h: lh,
                    text: item.movie.title,
                    version: item,
                    pic: pic,
                    picObj: null,
                    startFrame: frames,
                    endFrame:
                        frames + Math.ceil(this.duration2Frame(item.duration))
                }

                frames += Math.ceil(this.duration2Frame(item.duration))
                shadowRects[index].push(rect)
                ol += rect.w
            }

            this.trackList.push({
                ctrl: ctrl,
                data: shadowRects[index]
            })
        })
    }

    duration2Width(duration) {
        // return duration / (1000 / this.FRAMES) * this.unitFrameWidth
        return duration / (1000 / this.FRAMES) * this.getFrameWidth()
    }

    width2Duration(width) {
        // return width / this.unitFrameWidth * (1000 / this.FRAMES)
        return width / this.getFrameWidth() * (1000 / this.FRAMES)
    }

    duration2Frame(duration) {
        return duration / (1000 / this.FRAMES)
    }

    frame2Duration(frame) {
        return frame * (1000 / this.FRAMES)
    }

    frame2Width(frame) {
        // return frame * this.unitFrameWidth
        return frame * this.getFrameWidth()
    }
}
