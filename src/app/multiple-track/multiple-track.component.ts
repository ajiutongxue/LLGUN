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

    rulerCvs = null
    rulerCtx = null
    // 单位长度和单位时间段关系： 单位长度 / canvas长度 = 单位时间段 / canvas显示的时间段长度
    unitLength = 30 // 1000ms 对应的像素长度
    unitDuration = 1000
    rectHeight = 70
    $scrollbar = null
    scrollbarBoxContentWidth = 0
    offsetLeft = 0

    totalDuration = 0
    totalCvsWidth = 0

    
    shadowRulerCvs = null
    shadowRulerCtx = null

    shownDuration = 0

    WORDSHEIGHT = 16
    RECTFONT = '10px sans-serif'
    trackList: Track[] = []
    trackListBoxHeight = 0 // 带滚动条的div
    trackListBoxWidth = 0 // 带滚动条的div

    constructor() {}

    ngOnInit() {
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
            this.trackList.length * this.rectHeight > this.trackListBoxHeight
                ? this.rulerCvs.width - 16
                : this.rulerCvs.width

        // todo: 暂时不判断设为显示30%的时间段
        this.shownDuration = Math.floor(this.totalDuration * 0.3)
        this.unitDuration =
            this.shownDuration / (this.rulerCvs.width / this.unitLength)

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

                this.$scrollbar.css('left', newLeft)
                this.setOffsetLeft()
                this.copyShadowRuler2FrontCvs()
                // this.drawFrontCvs()
            })

            $(document).on('mouseup.forSb', () => {
                $(document).off('.forSb')
            })
        })
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
        const f = Math.floor((time % 1000) / 33)

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

    unitLengthChanged(step) {
        this.unitLength += step
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
        this.offsetLeft = left === 0 ? 0 : left / this.scrollbarBoxContentWidth * this.getLatestTotalCvsWidth()
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

        version_lists.forEach((row, index) => {
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
                    picObj: null
                }

                shadowRects[index].push(rect)
                ol += rect.w
            }

            this.trackList.push({
                ctrl: ctrl,
                data: shadowRects[index]
            });
        })
    }

   

    duration2Width(duration) {
        return duration * this.unitLength / this.unitDuration // 1000ms 一个单位长度
    }

    width2Duration(width) {
        return width * this.unitDuration / this.unitLength
    }

}
