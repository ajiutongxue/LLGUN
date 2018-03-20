import {
    Component,
    OnInit,
    Input,
    ViewChild,
    ViewContainerRef,
    OnChanges,
    SimpleChanges
} from '@angular/core'

declare const PxLoader: any, PxLoaderImage: any


@Component({
    selector: 'app-single-track',
    templateUrl: './single-track.component.html',
    styleUrls: ['./single-track.component.less']
})
export class SingleTrackComponent implements OnInit, OnChanges {
    WORDSHEIGHT = 16
    RECTFONT = '10px sans-serif'

    @Input() unitWidth
    @Input() unitDuration

    @Input() rectHeight
    @Input() offsetLeft
    @Input() track
    @Input() row

    @ViewChild('cvs', { read: ViewContainerRef })
    private cvsRef: ViewContainerRef
    cvs = null
    ctx = null

    @ViewChild('shadowCvs', { read: ViewContainerRef })
    private shadowCvsRef: ViewContainerRef
    shadowCvs = null
    shadowCtx = null

    statusIcons = null

    constructor() {}

    ngOnInit() {
        const loader = new PxLoader()
        const img = loader.addImage('../assets/status-icon/waiting.png')
        loader.addCompletionListener(() => {
            this.statusIcons = img
            this.initCanvases()
            this.drawShadowCvs()
            this.drawFrontCvs()
        })
        loader.start()
    }

    ngOnChanges(changes: SimpleChanges) {
        if (
            (changes.unitWidth && !changes.unitWidth.isFirstChange()) ||
            (changes.offsetLeft && !changes.offsetLeft.isFirstChange())
        ) {
            this.reDrawTheRow()
        }
    }

    getTotalDuration() {
        return this.track.data.reduce((prev, cur) => {
            return prev + cur.version.duration
        }, 0)
    }

    initCanvases() {
        this.cvs = this.cvsRef.element.nativeElement
        this.shadowCvs = this.shadowCvsRef.element.nativeElement

        this.cvs.height = this.shadowCvs.height = this.rectHeight
        this.cvs.width = $(this.cvs)
            .parent()
            .width()
        this.shadowCvs.width = this.duration2Width(this.getTotalDuration())

        this.ctx = this.cvs.getContext('2d')
        this.shadowCtx = this.shadowCvs.getContext('2d')
    }

    drawShadowCvs() {
        const c = this.shadowCtx
        // const rects = this.track.data

        c.clearRect(0, 0, this.shadowCvs.width, this.shadowCvs.height)

        c.fillStyle = '#BDD3DC'
        c.font = this.RECTFONT
        c.textAlign = 'left'
        c.textBaseline = 'middle'
        this.drawShadowRectsTheRow(this.track, c)
    }

    drawShadowRectsTheRow(rowData, c) {
        // this.drawShadowWords(r)
        if (rowData.ctrl.isShowPic) {
            rowData.data.forEach(r => {
                if (r.picObj === null) {
                    const loader = new PxLoader()
                    const img = loader.addImage(r.version.movie.picUrl)
                    loader.addCompletionListener(() => {
                        r.picObj = img
                        r.pic.oh = img.naturalHeight
                        r.pic.ow =
                            r.pic.oh *
                            this.duration2Width(
                                r.version.movie.getActualDuration()
                            ) /
                            r.pic.h
                        c.drawImage(
                            r.picObj,
                            0,
                            0,
                            r.pic.ow,
                            r.pic.oh,
                            r.x + 1,
                            this.WORDSHEIGHT + 1,
                            r.pic.w - 2,
                            r.pic.h - 2
                        )

                        if (rowData.ctrl.copyFinished && this.isInFrontCvs(r)) {
                            this.drawFrontCvs()
                        }

                    })
                    loader.start()
                } else {
                    r.pic.ow =
                        r.pic.oh *
                        this.duration2Width(
                            r.version.movie.getActualDuration()
                        ) /
                        r.pic.h
                    c.drawImage(
                        r.picObj,
                        0,
                        0,
                        r.pic.ow,
                        r.pic.oh,
                        r.x + 1,
                        this.WORDSHEIGHT + 1,
                        r.pic.w - 2,
                        r.pic.h - 2
                    )
                }
                this.drawShadowWords(r)
                // 立体边框线
                c.save()
                // c.strokeStyle = '#fff'
                c.strokeStyle = '#333'
                c.lineWidth = 1
                c.beginPath()
                c.moveTo(r.x + 1, r.h)
                c.lineTo(r.x + 1, 1)
                c.lineTo(r.x + r.w, 1)
                c.stroke()
                // c.strokeStyle = '#8399a2'
                c.strokeStyle = '#111'
                c.beginPath()
                c.moveTo(r.x + r.w, 1)
                c.lineTo(r.x + r.w, r.h)
                c.lineTo(r.x + 1, r.h)
                c.stroke()
                c.restore()
            })
        }

        // })
    }

    drawShadowWords(r) {
        const c = this.shadowCtx
        const wordsList = [r.text, r.version.title]

        c.save()
        c.fillStyle = '#ccc'
        // c.fillStyle = '#111'
        c.textBaseline = 'top'
        c.textAlign = 'left'
        wordsList.forEach((words, index) => {
            c.fillText(
                words,
                r.x + 16,
                index === 0 ? 0 : this.rectHeight - this.WORDSHEIGHT
            )
            c.drawImage(
                this.statusIcons,
                // r.x + r.w / 2 - wordsWidth / 2,
                r.x + 2,
                index === 0 ? 3 : 3 + (this.rectHeight - this.WORDSHEIGHT),
                10,
                10
            )
        })
        c.restore()
    }

    drawFrontCvs() {
        this.copyShadow2FrontCvs()
    }

    copyShadow2FrontCvs() {
        const fc = this.ctx
        const sc = this.shadowCvs
        const w = this.cvs.width
        const h = this.cvs.height

        const start = this.offsetLeft

        fc.clearRect(0, 0, w, h)
        fc.drawImage(sc, start, 0, w, h, 0, 0, w, h)

        this.row.ctrl.copyFinished = true
    }

    reDrawTheRow() {
        this.drawShadowCvs()
        this.drawFrontCvs()
    }

    duration2Width(duration) {
        return duration * this.unitWidth / this.unitDuration // 1000ms 一个单位长度
    }

    isInFrontCvs(rect) {
        const start = this.offsetLeft
        const end = start + this.cvs.width
        return !(
            (rect.x < start && rect.x + rect.w < start) ||
            (rect.x > end && rect.x + rect.w < end)
        )
    }
}
