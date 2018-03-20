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

    FRAMES = 30
    rulerCvs = null
    rulerCtx = null
    // 单位长度和单位时间段关系： 单位长度 / canvas长度 = 单位时间段 / canvas显示的时间段长度
    unitWidth = 30 // 1000ms 对应的像素长度
    unitDuration = 1000
    unitFrameWidth = 0
    rectHeight = 70
    $scrollbar = null
    scrollbarBoxContentWidth = 0
    offsetLeft = 0  // 画布偏移量

    totalDuration = 0
    totalCvsWidth = 0
    currentFrame = 0
    ifNextVersion = true
    // currentVersion = null
    // currentVersionIndex = 0
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

    shownDuration = 0

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

    constructor() {}

    ngOnInit() {
        this.$vernier = $('.vernier')
        this.shadowRulerCvs = document.querySelector('#shadow-ruler')
        this.$scrollbar = $('.scrollbar:first')
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

        this.vernierBoundaryLeft =
            $(this.rulerCvs).offset().left - $('.layer-container').offset().left
        this.vernierBoundaryRight =
            this.vernierBoundaryLeft + this.trackListBoxWidth

        // todo: 暂时不判断设为显示30%的时间段
        this.shownDuration = Math.floor(this.totalDuration * 0.3)
        this.unitDuration =
            this.shownDuration / (this.rulerCvs.width / this.unitWidth)
        this.setUnitFrameWidth()

        // this.initShadow()
        this.setTrackList()
        this.shadowRulerCvs.width = this.getLatestTotalCvsWidth()
        this.shadowRulerCvs.height = 30
        this.shadowRulerCtx = this.shadowRulerCvs.getContext('2d')
        this.drawShadowRuler()
        this.copyShadowRuler2FrontCvs()

        this.initScrollbar()
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

        this.$vernier.on('mousedown', e => {
            this.$vernier.parent().addClass('active')
            $('body').css('cursor', 'move')

            $(window).on('mousemove.drag', e => {
                this.setVernierLeft(e)

                $(window).on('mouseup.drag', e => {
                    this.$vernier.parent().removeClass('active')
                    $(window).off('.drag')
                    $('body').css('cursor', 'default')
                })
            })
        })

        this.setCurrentDurationFrame(null)
        this.playing()
    }

    getScrollbarBoundaryRight() {
        return $('.scrollbar-box').width() - this.$scrollbar.outerWidth()
    }

    setScrollbarLeft(left) {
        this.$scrollbar.css('left', left)
        this.setOffsetLeft()
        this.copyShadowRuler2FrontCvs()
        this.setVernierLeft(null, 0, true)
    }

    // showVernierMsg() {
    //     console.log(
    //         'f2w: ' + this.frame2Width(this.currentFrame) +
    //         'offsetleft: ' + this.offsetLeft 
    //     )
    // }
    setVernierLeft(e, moveWidth = 0, ifMoveToCurrentFrame = false) {
        if (this.vernierLeft < this.vernierBoundaryLeft || this.vernierLeft > this.vernierBoundaryRight) {
            this.$vernier.css('display', 'none')
        } else {
            this.$vernier.css('display', 'block')
        }

        if (e) {
            this.vernierLeft = e.pageX - $('.layer-container').offset().left
            this.setCurrentFrame()
            return
        } 

        if (ifMoveToCurrentFrame) {
            // console.log(`offsetleft: ${this.offsetLeft}, left section width: ${$('.left-section:first').width()}, frame to width: ${this.frame2Width(this.currentFrame)}`);
            // this.showVernierMsg()
            this.vernierLeft = this.frame2Width(this.currentFrame) - this.offsetLeft + $('.left-section:first').width()
            return
        }
        
        if (moveWidth !== 0) {
            this.vernierLeft += moveWidth
            if (this.vernierLeft > this.vernierBoundaryRight) {
                this.stop()
            }
            // console.log(`vernier left: ${this.vernierLeft}`)
            this.setCurrentFrame()
        }
    }

    setUnitFrameWidth() {
        // this.unitFrameWidth = Math.floor(this.unitWidth / this.FRAMES)
        this.unitFrameWidth = this.unitWidth / this.FRAMES
    }

    vernierMove2NextFrame() {
        // this.setCurrentFrame(1)

        // if (!this.ifNextVersion) return
        this.setVernierLeft(null, this.unitFrameWidth)

        if (parseInt(this.$scrollbar.css('left'), 10) < this.getScrollbarBoundaryRight()) {
            if (this.vernierLeft > this.vernierBoundaryRight - 30) {
                let left = parseInt(this.$scrollbar.css('left'), 10) + this.$scrollbar.width() / 2

                this.setScrollbarLeft(left <= this.getScrollbarBoundaryRight() ? left : this.getScrollbarBoundaryRight())
                
                // this.setVernierLeft(null, 0, true)
                // this.stop()
            }
        }
        
    }

    playNextVersion() {
        if (!this.ifNextVersion) return
        // this.vernierMove2NextFrame()
        this.setCurrentDurationFrame({
            version: this.trackList[0].data[
                this.whichVersionPlaying(this.currentFrame).index + 1
            ],
            index: this.whichVersionPlaying(this.currentFrame).index + 1
        })
        // this.setCurrentFrame()
        this.currentFrame = this.currentDurationFrame.start
        this.setVernierLeft(null, 0, true)
        console.log(`current is: ${this.currentFrame}`);
        this.playing()
        console.log('playing');
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
        }, 1000 / 30)
    }

    stop() {
        window.clearInterval(this.playTimer)
        this.playTimer = null
    }

    setCurrentFrame(step = 0) {
        if (step) {
            this.currentFrame += step
            return
        }

        const offsetLeftDuration = this.width2Duration(
            this.offsetLeft +
                this.vernierLeft -
                $('.left-section:first').width()
        )
        this.currentFrame = this.duration2Frame(offsetLeftDuration)
        this.setCurrentDurationFrame(null)
    }

    setCurrentDurationFrame(version) {
        version = version || this.whichVersionPlaying(this.currentFrame)
        // console.log(
        //     'set duration frame, current : ' +
        //         version.index +
        //         'start & end: ' +
        //         version.version.startFrame +
        //         ' ' +
        //         version.version.endFrame
        // )

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
        this.vernierLeft = this.vernierBoundaryLeft
    }

    // ok
    initScrollbar() {
        this.scrollbarBoxContentWidth = $('.scrollbar-box').width() - 30
        this.$scrollbar.width(
            this.scrollbarBoxContentWidth *
                this.trackListBoxWidth /
                this.getLatestTotalCvsWidth()
        )
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
            if (i % 10 === 0) {
                c.fillText(this.formatRulerShowTime(i * stepTime), x, 14)
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

    unitWidthChanged(step) {
        this.unitWidth += step
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

    updateTrackList() {
        this.trackList.forEach(track => {
            let row = track.data
            let ol = 0

            row.forEach(rect => {
                rect.x = ol
                rect.w = this.duration2Width(rect.version.duration)
                rect.pic.w = this.duration2Width(
                    rect.version.movie.getActualDuration()
                )
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
                opacity: 100,
                copyFinished: false
            }

            shadowRects[index] = []
            let ol = 0

            for (let i = 0; i < row.data.length; i++) {
                const item = row.data[i]

                const pic: Pic = {
                    w: this.duration2Width(item.movie.getActualDuration()),
                    h: lh - this.WORDSHEIGHT * 2,
                    oh: 0,
                    ow: 0,
                    url: item.movie.picUrl
                }

                const rect: Rect = {
                    x: ol,
                    y: 0,
                    w: this.duration2Width(item.duration),
                    h: lh,
                    text: item.movie.title,
                    version: item,
                    pic: pic,
                    picObj: null,
                    startFrame: frames,
                    endFrame: frames + this.duration2Frame(item.duration)
                }

                frames += this.duration2Frame(item.duration)
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
        return duration * this.unitWidth / this.unitDuration // 1000ms 一个单位长度
    }

    width2Duration(width) {
        return width * this.unitDuration / this.unitWidth
    }

    duration2Frame(duration) {
        return Math.ceil(duration / this.FRAMES)
    }

    frame2Width(frame) {
        // console.log('f2w: ' + this.unitFrameWidth * frame);
        return this.duration2Width(this.FRAMES * frame)
        // return frame / this.FRAMES * this.unitWidth 
    }
}
