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
    unitFrameWidth = 1
    unitFrameMaxWidth = 10
    rectHeight = 85
    $scrollbar = null
    scrollbarBoxContentWidth = 0
    $scrollbarHandlerLeft = null
    $scrollbarHandlerRight = null
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
    // nextDurationFrame = {
    //     start: -1,
    //     end: -1
    // }

    shadowRulerCvs = null
    shadowRulerCtx = null
    /* {c: canvasDOM, t: canvasContext} */
    // shadowRuler = []
    cache = []
    cacheMaxCount = 0

    shownDuration = 0
    // 当前画面显示的起始和结束帧数
    // shownStart = 0  // 这个东西其实就是offsetleft
    // shownEnd = 0

    WORDSHEIGHT = 16
    RECTFONT = '10px sans-serif'
    trackList: Track[] = []
    trackListBoxHeight = 0 // 带滚动条的div
    trackListBoxWidth = 0 // 带滚动条的div

    $vernier = null
    vernierLeft = 400
    vernierBoundaryLeft = 0
    vernierBoundaryRight = 0 // 代表的是这个元素的最大的 left 属性的值

    playTimer = null

    isShowText = true
    isDrawPic = true

    screenIndex = 0

    constructor() {}

    ngOnInit() {
        this.$vernier = $('.vernier')
        this.shadowRulerCvs = document.querySelector('#shadow-ruler')
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
        // $(this.rulerCvs).offset().left - $('.layer-container').offset().left 改成全屏了  左边没有空了
        this.vernierBoundaryRight =
            this.vernierBoundaryLeft + this.trackListBoxWidth

        // todo: 暂时不判断设为显示30%的时间段
        // this.shownDuration = Math.floor(this.totalDuration * 0.3)
        this.shownDuration = this.frame2Duration(
            this.trackListBoxWidth / this.unitFrameWidth
        )
        // this.unitDuration =
        //     this.shownDuration / (this.rulerCvs.width / this.unitWidth)
        // console.log(`unit duration is: ${this.unitDuration}`)
        // this.setUnitFrameWidth()

        // this.initShadow()
        this.scrollbarBoxContentWidth = $('.scrollbar-box').width() - 30
        this.setUnitFrameMaxWidth()
        /*
         * 检查是否需要设置 unitFrameWidth
         * */
        this.checkUnitFrameWidth()

        // this.initCache()
        
        /* 
         * 初始化画布数组
         * 每个画布最大宽度为：5000
         * */
        // let totalWidth = this.getLatestTotalCvsWidth()
        // let singleWidth = 5000
        // let cvsCount = Math.ceil(totalWidth / singleWidth)
        // const shadowParent = document.querySelector('.ruler-content')
        // for (let i = 0; i < cvsCount; i++) {
        //     const cvs = document.createElement('canvas')
        //     const ctx = cvs.getContext('2d')
        //     if ( cvsCount > i + 1 ) {
        //         cvs.width = singleWidth
        //     } else {
        //         cvs.width = totalWidth % singleWidth
        //     }
        //     cvs.height = 30
        //     // cvs.style.display = 'none'
        //     shadowParent.appendChild(cvs)

        //     this.shadowRuler.push({
        //         c: cvs,
        //         t: ctx
        //     })
        // }

        this.setTrackList()
        this.shadowRulerCvs.width = this.getLatestTotalCvsWidth()
        this.shadowRulerCvs.height = 30
        this.shadowRulerCtx = this.shadowRulerCvs.getContext('2d')
        this.drawShadowRuler()
        this.copyShadowRuler2FrontCvs()

        this.initScrollbar()
        this.setCurrentFrame()
        // this.setScreenIndex()
        
        this.currentVersionIndex = this.whichVersionPlaying(
            this.currentFrame
        ).index
        // console.log(`init currentversion index: ${this.currentVersionIndex}`)
        this.$scrollbar.on('mousedown', event => {
            const x = event.clientX
            const scrollbarOffsetLeft = parseInt(
                this.$scrollbar.css('left'),
                10
            )

            $(document).on('mousemove.forSb', e => {
                const moveLength = e.clientX - x
                let newLeft = 0
                if (scrollbarOffsetLeft + moveLength < 0) {
                    newLeft = 0
                } else if (
                    scrollbarOffsetLeft + moveLength >
                    this.scrollbarBoxContentWidth - this.$scrollbar.width()
                ) {
                    newLeft =
                        this.scrollbarBoxContentWidth - this.$scrollbar.width()
                } else {
                    newLeft = scrollbarOffsetLeft + moveLength
                }

                // this.$scrollbar.css('left', newLeft)
                this.setScrollbarLeft(newLeft)
                // this.setOffsetLeft()
                // this.copyShadowRuler2FrontCvs()
                // this.drawFrontCvs()
            })

            $(document).on('mouseup.forSb', () => {
                $(document).off('.forSb')
            })
        })

        this.$scrollbarHandlerRight.on('mousedown', e => {
            e.stopPropagation()
            const x = e.pageX
            const w = this.$scrollbar.width()
            const minWidth = 20
            const maxWidth =
                this.rulerCvs.width - parseInt(this.$scrollbar.css('left')) - 30

            $(document).on('mousemove.forSr', e => {
                let width = w + e.pageX - x
                if (width > maxWidth) width = maxWidth
                if (width < minWidth) width = minWidth
                this.$scrollbar.width(width)
                this.setOffsetLeft()
                this.resizeShownDuration()
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
            const minWidth = 20
            const maxWidth = w + l

            $(document).on('mousemove.forSl', e => {
                let width = w + (x - e.pageX)
                if (width > maxWidth) width = maxWidth
                if (width < minWidth) width = minWidth
                // this.offsetLeft = this.offsetLeft + width - w
                this.$scrollbar.css('left', l - width + w)
                this.$scrollbar.width(width)
                this.setOffsetLeft()
                this.resizeShownDuration()
            })
            $(document).on('mouseup.forSl', () => {
                $(document).off('.forSl')
                // this.offsetLeft = parseInt(this.$scrollbar.css('left'))
            })
        })

        this.$vernier.on('mousedown', e => {
            this.$vernier.parent().addClass('active')
            $('body').css('cursor', 'move')
            let isPlaying = false

            if (this.playTimer) {
                isPlaying = true
                this.stop()
            }

            $(window).on('mousemove.drag', e => {
                this.setVernierLeft(e)
                this.setCurrentFrame()
                this.currentVersionIndex = this.whichVersionPlaying(
                    this.currentFrame
                ).index

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
            })
        })

        // this.setCurrentDurationFrame(null)
        this.setCurrentDurationFrame({
            version: this.trackList[0].data[this.currentVersionIndex],
            index: this.currentVersionIndex
        })

        this.playing()

        // console.log('total cvswidth: ' + this.totalCvsWidth)
    }

    // setScreenIndex() {
    //     this.screenIndex = Math.floor(this.currentFrame / this.duration2Frame(this.shownDuration))
    //     console.log(`current Index: ${this.screenIndex}`)
    // }

    getScrollbarBoundaryRight() {
        return $('.scrollbar-box').width() - this.$scrollbar.outerWidth()
    }

    setScrollbarLeft(left) {
        this.$scrollbar.css('left', left)
        this.setOffsetLeft()
        this.copyShadowRuler2FrontCvs()
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
            this.vernierLeft = e.pageX - $('.layer-container').offset().left
            // if (this.vernierLeft % this.unitFrameWidth) {
            //     this.vernierLeft -= this.vernierLeft % this.unitFrameWidth
            // }
            this.setCurrentFrame()
            this.setCurrentDurationFrame(null)
            return
        }

        if (ifMoveToCurrentFrame) {
            // console.log(`offset left: ${this.offsetLeft}`)
            // console.log(`frame: ${this.currentFrame}`)
            // console.log(`width: ${this.frame2Width(this.currentFrame)}`)
            this.vernierLeft =
                this.frame2Width(this.currentFrame) -
                this.offsetLeft +
                $('.left-section:first').width()
            // if (this.vernierLeft % this.unitFrameWidth) {
            //     this.vernierLeft -= this.vernierLeft % this.unitFrameWidth
            // }
            return
        }

        if (moveWidth !== 0) {
            // console.log(`set vernier left, unitFrameWidth: ${moveWidth}`)
            this.vernierLeft += moveWidth
            if (this.vernierLeft > this.vernierBoundaryRight) {
                this.stop()
            }
            // if (this.vernierLeft % this.unitFrameWidth) {
            //     this.vernierLeft -= this.vernierLeft % this.unitFrameWidth
            // }
            // this.setCurrentFrame()
        }
    }

    vernierMove2NextFrame() {
        // this.setCurrentFrame(1)

        // if (!this.ifNextVersion) return
        this.setVernierLeft(null, this.unitFrameWidth)

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

                // this.setVernierLeft(null, 0, true)
                // this.stop()
            }
        }
        this.setCurrentFrame(1)
    }

    playNextVersion() {
        if (!this.ifNextVersion) return
        // this.vernierMove2NextFrame()
        // this.setCurrentDurationFrame({
        //     version: this.trackList[0].data[
        //         this.whichVersionPlaying(this.currentFrame).index + 1
        //     ],
        //     index: this.whichVersionPlaying(this.currentFrame).index + 1
        // })
        this.currentVersionIndex += 1
        this.setCurrentDurationFrame({
            version: this.trackList[0].data[this.currentVersionIndex],
            index: this.currentVersionIndex
        })
        // this.setCurrentFrame()
        this.currentFrame = this.currentDurationFrame.start
        this.setVernierLeft(null, 0, true)
        console.log(
            `current is: ${this.currentVersionIndex}\n title: ${
                this.trackList[0].data[this.currentVersionIndex].version.title
            }`
        )
        console.log(
            ` start: ${this.currentDurationFrame.start}\n end: ${
                this.currentDurationFrame.end
            }`
        )
        this.playing()
        console.log('playing')
        // this.setCurrentDurationFrame()
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
        console.log(`stop=========================`)
    }

    setCurrentFrame(step = 0) {
        if (step) {
            this.currentFrame += step
            // this.setScreenIndex()
            return
        }

        const offsetLeftDuration = this.width2Duration(
            this.offsetLeft +
                this.vernierLeft -
                $('.left-section:first').width()
        )
        this.currentFrame = this.duration2Frame(offsetLeftDuration)
        /* 在currentFrame每次变化后，都去更新screenIndex */
        // this.setScreenIndex()
        // this.setCurrentDurationFrame(null)
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
        // console.log('which....' + track.indexOf(version))
        // return index
        // console.log(`find version: ${version}`)
        // return version ? track.indexOf(version) : -1
        // this.currentVersionIndex = track.indexOf(version)
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
        this.$scrollbar.width(
            this.scrollbarBoxContentWidth *
                this.trackListBoxWidth /
                this.getLatestTotalCvsWidth()
        )

        // console.log(`[init] showDuration: ${this.shownDuration}`)
    }

    /* 
     * 初始化时，最小 unitFrameWidth 设置
     * 当按照给定的默认unitFrameWidth（目前这个值是 1），track 格子不足以横向填充满画布时，
     * 增加这个值的大小，能让他出现横行滚动条，
     * 如果要想刚好铺满，那也可以改变计算方法
     * 这个操作可能应该跟 setUnitFrame 合并
     *  */
    // TODO: 要改个合适的名字呀
    setUnitFrameWidthAsMinWidth() {
        this.unitFrameWidth *= 1.5
        this.setIsDrawPic()
        console.log(`current unitFrameWidth: ${this.unitFrameWidth}`)
    }
    checkUnitFrameWidth() {
        while (
            this.duration2Width(this.totalDuration) < this.trackListBoxWidth
        ) {
            this.setUnitFrameWidthAsMinWidth()
        }
    }

    /* 
     * 判断是否满足绘制缩略图的条件
     * */
    setIsDrawPic() {
        this.isDrawPic = this.unitFrameWidth >= 1
    }

    /* 
     * 设置当前画面允许的最大单帧宽度
     * */
    setUnitFrameMaxWidth() {
        // 1、考虑滚动条的对应宽度
        // 2、
        // 3、
        // 4、最大值和上面设置的最小值冲突

        // scrollbar minwidth = 10
        const _shadowCvsWidth =
            this.scrollbarBoxContentWidth * this.trackListBoxWidth / 10
        let _w = _shadowCvsWidth / this.duration2Frame(this.totalDuration)
        _w = _w < 1 ? 1 : _w
        this.unitFrameMaxWidth = _w
        console.log(`now, unitFrameMaxWidth: ${this.unitFrameMaxWidth}`)
    }

    resizeShownDuration() {
        this.shownDuration = //this.frame2Duration()
            this.totalDuration *
            this.$scrollbar.width() /
            this.scrollbarBoxContentWidth
        this.setUnitFrameWidth()
        // this.initScrollbar()
        this.shadowRulerCvs.width = this.getLatestTotalCvsWidth()
        this.drawShadowRuler()
        this.copyShadowRuler2FrontCvs()
        this.updateTrackList()
        // console.log(`[resize] showDuration: ${this.shownDuration}`)

        // this.shadowRulerCvs.width = this.getLatestTotalCvsWidth()
        // this.drawShadowRuler()
        // this.copyShadowRuler2FrontCvs()
        // this.updateTrackList()
        // // this.unitWidth = this.unitDuration * this.rulerCvs.width / this.shownDuration
        // this.setUnitFrameWidth()
        // this.setVernierLeft(null, 0, true)
    }
    setUnitFrameWidth() {
        // this.unitFrameWidth = Math.floor(this.unitWidth / this.FRAMES)
        // this.unitFrameWidth = this.unitWidth / this.FRAMES
        // this.unitFrameWidth = 10
        let w = this.trackListBoxWidth / this.shownDuration * 1000 / this.FRAMES

        this.unitFrameWidth =
            w < this.unitFrameMaxWidth ? w : this.unitFrameMaxWidth
        // this.trackListBoxWidth / this.shownDuration * 1000 / this.FRAMES
        // this.checkUnitFrameWidth()
        this.setIsDrawPic()
        // this.unitFrameWidth = this.totalCvsWidth / (this.totalDuration / (1000 / this.FRAMES))
        // console.log(`set unit frame width: ${this.unitFrameWidth}`)
    }

    // resizeScrollbar(leftHandler = 0, rightHandler = 0) {}
    // resizeScrollbarWithLeftHandler(width) {
    //     const leftBoundary = -15 - this.getScrollbarOffsetLeft()
    //     // const rightBoundary =
    // }
    // resizeScrollbarWithRightHandler(e) {

    // }

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
     * 清空所有shadow画布
     *  */
    // clearShadowCvs() {
    //     this.shadowRuler.forEach(sr => {
    //         sr.t.clearRect(0, 0, sr.c.width, sr.c.height)
    //     })
    // }

    initCache() {
        this.cacheMaxCount = Math.ceil(
            this.getLatestTotalCvsWidth() / this.rulerCvs.width
        )
        const len = this.cacheMaxCount > 3 ? 3 : this.cacheMaxCount
        this.cache = []

        for(let i = 0; i < len; i++) {
            const cvs = document.createElement('canvas')
            const ctx = cvs.getContext('2d')

            if (i < this.cacheMaxCount - 1) {
                cvs.width = this.rulerCvs.width
            } else {
                let _lastWidth = this.totalCvsWidth % this.rulerCvs.width
                cvs.width = _lastWidth === 0 ? this.rulerCvs.width : _lastWidth
            }
            cvs.height = 30
            this.cache.push({
                c: cvs,
                t: ctx
            })
        }

        /* 
         * 绘制缓存
         * */
        // 从 0 开始
        const screenIndex = Math.floor(this.currentFrame / this.duration2Frame(this.shownDuration))
        let startIndex = screenIndex > 0 ? screenIndex - 1 : 0
        this.cache.forEach((cache, index) => {
            this.drawOneCache(cache, startIndex + index)
        })
    }

    drawOneCache(cache, index) {
        const cvs = cache.c
        const c = cache.t

    }

    // ok
    drawShadowRuler() {
        const cvs = this.shadowRulerCvs
        const c = this.shadowRulerCtx
        const stepTime = 200 // todo: 暂时写死 200ms 一个小刻度
        const stepWidth = Math.round(this.duration2Width(stepTime))

        c.clearRect(0, 0, cvs.width, cvs.height)

        c.font = '10px sans-serif'
        c.fillStyle = '#979797'
        c.strokeStyle = '#979797'
        c.lineWidth = 1
        c.beginPath()
        for (let i = 0, x = 0.5; x < cvs.width; i++, x += stepWidth) {
            const y = i % 10 === 0 ? 18 : 23
            c.moveTo(x, y)
            c.lineTo(x, 30)
            c.stroke()
            if (stepWidth < 10) {
                if (i % 30 === 0) {
                    c.fillText(this.formatRulerShowTime(i * stepTime), x, 14)
                }
            } else if (stepWidth > 20) {
                if (i % 5 === 0) {
                    c.fillText(this.formatRulerShowTime(i * stepTime), x, 14)
                }
            } else {
                if (i % 10 === 0) {
                    c.fillText(this.formatRulerShowTime(i * stepTime), x, 14)
                }
            }
        }
        c.fillStyle = '#979797'
        c.fillRect(0, 30 - 2, cvs.width, 2)
        c.closePath()
    }

    // ok
    getLatestTotalCvsWidth() {
        this.totalCvsWidth = this.duration2Width(this.totalDuration)
        return this.totalCvsWidth
    }

    /* 
     * 测试用，改变 unitFrameWidth 的值 
     */
    unitWidthChanged(step) {
        // this.unitWidth += step
        const w =
            step > 0 ? this.unitFrameWidth * step : this.unitFrameWidth / -step

        if (w > this.unitFrameMaxWidth) {
            this.unitFrameWidth = this.unitFrameMaxWidth
        } else if (w < 1) {
            this.unitFrameWidth = 1
        } else {
            this.unitFrameWidth = w
        }
        this.initScrollbar()
        this.drawShadowRuler()
        this.copyShadowRuler2FrontCvs()
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
        // FIXME: 感觉这个参数有问题啊  好像算的不对
        //   this.shadowRulerCvs.width
        // this.setCurrentFrame()
    }

    copyShadowRuler2FrontCvs() {
        const w = this.rulerCvs.width
        const h = this.rulerCvs.height
        const fc = this.rulerCtx
        const sc = this.shadowRulerCvs
        // const start = this.getOffsetLeft()
        const start = this.offsetLeft
        fc.clearRect(0, 0, w, h)
        fc.drawImage(sc, start, 0, w, h, 0, 0, w, h)
    }

    // 单行控制状态时候 添加参数 text = false
    updateTrackList() {
        // if (text) {
        //     this.trackList.forEach(track => {
        //         track.ctrl.isShowText = this.isShowText
        //     })
        //     return
        // }
        // console.log(`updateTrackList 现在的 unitFrameWidth: ${this.unitFrameWidth}`)

        this.trackList.forEach(track => {
            let row = track.data
            let ol = 0

            row.forEach(rect => {
                rect.x = ol
                // rect.w = this.duration2Width(rect.version.duration)
                rect.w = this.frame2Width(
                    Math.ceil(this.duration2Frame(rect.version.duration))
                )
                // rect.pic.w = this.duration2Width(
                //     rect.version.movie.getActualDuration()
                // )
                ;(rect.pic.w = this.frame2Width(
                    Math.ceil(
                        this.duration2Frame(
                            rect.version.movie.getActualDuration()
                        )
                    )
                )),
                    (ol += rect.w)
            })
        })
        // console.log('update start ==================')
        // this.trackList[0].data.forEach((rect, index) => {
        //     console.log(`[${index}] duration: ${rect.version.duration}, width: ${rect.w}, unitFrameWidth: ${this.unitFrameWidth}`)
        // })
        // console.log('update end ====================')
    }

    // toggleText() {
    //     // this.isShowText = !this.isShowText
    //     this.updateTrackList(true)
    //     // this.drawShadowRuler()
    //     // this.copyShadowRuler2FrontCvs()
    // }

    setTrackList() {
        // TODO: 数据不要每次清空重新整理，取到的数据不改变时，只进行内部值的重新计算，需要改下结构，把图片文件存进来
        console.log(
            `setTrackList 现在的 unitFrameWidth: ${this.unitFrameWidth}`
        )

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
        // return duration * this.unitWidth / this.unitDuration // 1000ms 一个单位长度
        return duration / (1000 / this.FRAMES) * this.unitFrameWidth
    }

    width2Duration(width) {
        // return width * this.unitDuration / this.unitWidth
        return width / this.unitFrameWidth * (1000 / this.FRAMES)
    }

    duration2Frame(duration) {
        // return Math.ceil(duration / this.FRAMES)
        return duration / (1000 / this.FRAMES)
    }

    frame2Duration(frame) {
        return frame * (1000 / this.FRAMES)
    }

    frame2Width(frame) {
        // console.log('f2w: ' + this.unitFrameWidth * frame);
        // return this.duration2Width(this.FRAMES * frame)
        // return frame / this.FRAMES * this.unitWidth
        return frame * this.unitFrameWidth
    }
}
