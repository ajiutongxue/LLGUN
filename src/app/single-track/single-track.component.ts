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
    private readonly FRAMES = 30

    // @Input() unitWidth
    @Input() unitDuration
    @Input() unitFrameWidth

    @Input() rectHeight
    @Input() offsetLeft
    @Input() track
    @Input() row
    @Input() isShowText
    @Input() isDrawPic
    @Input() totalDuration
    // @Input() screenIndex

    @ViewChild('cvs', { read: ViewContainerRef })
    private cvsRef: ViewContainerRef
    cvs = null
    ctx = null

    // @ViewChild('shadowCvs', { read: ViewContainerRef })
    // private shadowCvsRef: ViewContainerRef
    // shadowCvs = null
    // shadowCtx = null
    /* {c: cvs, t: ctx, i: index} */
    cache = []
    cacheMaxCount = 0
    // offsetScreen = 0
    screenIndex = 0  // 使用当前画面canvas的最右端来确定在第几屏

    totalWidth = 0

    statusIcons = null

    constructor() {}

    ngOnInit() {
        const loader = new PxLoader()
        const img = loader.addImage('../assets/status-icon/waiting.png')
        this.totalWidth = this.duration2Width(this.totalDuration)
        this.initCanvas()
        this.screenIndex = Math.floor((this.offsetLeft + this.cvs.width - 1) / this.cvs.width)
        loader.addCompletionListener(() => {
            this.statusIcons = img
            this.initCache()
            // this.drawShadowCvs()
            this.drawFrontCvs()
        })
        loader.start()
    }

    ngOnChanges(changes: SimpleChanges) {
        if ( 
            (changes.isDrawPic && !changes.isDrawPic.isFirstChange()) ||
            (changes.isShowText && !changes.isShowText.isFirstChange()) ||
            (changes.offsetLeft && !changes.offsetLeft.isFirstChange())
        ) {
            // this.refreshCache()
            if (this.screenIndex !== Math.floor((this.offsetLeft + this.cvs.width - 1) / this.cvs.width)) {
                const _index = Math.floor((this.offsetLeft + this.cvs.width - 1) / this.cvs.width)
                const isIncrease = _index > this.screenIndex
                this.screenIndex = _index
                this.refreshCache(isIncrease)
            }
            this.drawFrontCvs()
        }

        if (
            (changes.unitFrameWidth && !changes.unitFrameWidth.isFirstChange()) 
            // (changes.offsetLeft && !changes.offsetLeft.isFirstChange()) ||
        ) {
            this.totalWidth = this.duration2Width(this.totalDuration)
            this.reDrawTheRow()
        }

        // if (changes.screenIndex && !changes.screenIndex.isFirstChange()) {
        //     this.refreshCache()
        // }
    }

    // getTotalDuration() {
    //     return this.track.data.reduce((prev, cur) => {
    //         return prev + cur.version.duration
    //     }, 0)
    // }

    clearCache() {
        this.cache.forEach(cache => {
            $(cache.c).remove()
        })
        this.cache = []
    }

    initCache() {
        const $cacheParent = $(this.cvs).parent()
        
        this.cacheMaxCount = Math.ceil( this.totalWidth / this.cvs.width )
        const len = this.cacheMaxCount > 3 ? 3 : this.cacheMaxCount

        // this.offsetScreen = Math.floor(this.offsetLeft / this.cvs.width)
        if (this.cache.length) this.clearCache()
        // this.cache = []
        // const _cache = {}
        // 从 0 开始
        const startIndex = this.screenIndex > 0 ? this.screenIndex - 1 : 0

        for (let i = 0; i < len; i++) {
            const cvs = document.createElement('canvas')
            const ctx = cvs.getContext('2d')

            if (i < this.cacheMaxCount - 1) {
                cvs.width = this.cvs.width
            } else {
                let _lastWidth = this.totalWidth % this.cvs.width
                cvs.width = _lastWidth === 0 ? this.cvs.width : _lastWidth
            }
            cvs.height = this.rectHeight
            cvs.style.display = 'none'

            $cacheParent.append(cvs)
            this.cache.push({
                i: startIndex + i,
                c: cvs,
                t: ctx
            })
        }

        /* 
         * 绘制缓存
         * */
        this.cache.forEach((cache) => {
            this.drawOneCache(cache, this.track)
        })
    }

    /* 
     * 刷新 cache 队列
     * 改变的不是某个cache里面的具体数值，
     * 做cache的增减操作
     * cache 列表最大长度是 3 （前一个，当前的，下一个）屏幕
     * 每次队列末尾新增一个cache，都把队列头部的cache删除，保证长度
     * */
    refreshCache(isIncrease) {
        if (this.cacheMaxCount <= 3) return
        if (isIncrease) {
            if (this.screenIndex === 1) return
            if (this.screenIndex === this.cacheMaxCount - 1) return
        } else {
            if (this.screenIndex === 0) return
            if (this.screenIndex === this.cacheMaxCount - 2) return
        }
        // console.log('refresh!!==')
        const newCache = this.createNewCache(isIncrease)

        // console.log(`[before refresh]`)
        // this.cache.forEach(c => {
        //     console.log(`  index: ${c.i}`)
        // })
        this.removeOneCache(isIncrease)
        this.drawOneCache(newCache, this.track)

        isIncrease ? this.cache.push(newCache) : this.cache.unshift(newCache)

        // console.log(`[after refresh]`)
        // this.cache.forEach(c => {
        //     console.log(`  index: ${c.i}`)
        // })
    }

    createNewCache(isIncrease) {
        const cvs = document.createElement('canvas')
        const ctx = cvs.getContext('2d')
        const $cacheParent = $(this.cvs).parent()

        if (this.screenIndex < this.cacheMaxCount - 1) {
            cvs.width = this.cvs.width
        } else {
            let _lastWidth = this.totalWidth % this.cvs.width
            cvs.width = _lastWidth === 0 ? this.cvs.width : _lastWidth
        }
        cvs.height = this.rectHeight
        cvs.style.display = 'none'
        $cacheParent.append(cvs)
        return {
            i: isIncrease ? this.screenIndex + 1 : this.screenIndex - 1,
            c: cvs,
            t: ctx
        }
    }

    removeOneCache(isIncrease) {
        if (isIncrease) {
            $(this.cache.shift().c).remove()
        } else {
            $(this.cache.pop().c).remove()
        }
    }


    /* 
     * 绘制指定缓存画布
     * 缓存画布通常是3个
     * */
    drawOneCache(cache, track) {
        const cvs = cache.c
        const c = cache.t
        const index = cache.i
        const singleCacheWidth = this.cvs.width
        const start = singleCacheWidth * index
        const end = start + singleCacheWidth

        track.data.forEach(r => {
            if (r.x > end || (r.x + r.w) < start) return

            const _x = r.x - start
            if ( !this.isDrawPic ) {
                c.save()
                // TODO: 这个回头试试改成渐变色效果
                c.fillStyle = 'rgb(90, 156, 95)'
                c.fillRect(
                    _x - 0.5,
                    0,
                    r.pic.w + 0.5,
                    r.pic.h - 2
                )
                c.restore()
            } else {
                if (track.ctrl.isShowPic) {
                    if (r.picObj === null) {
                        const loader = new PxLoader()
                        const img = loader.addImage(r.version.movie.picUrl)
                        loader.addCompletionListener(() => {
                            r.picObj = img
                            r.pic.oh = img.naturalHeight
                            r.pic.ow =
                                r.pic.oh * this.duration2Width( r.version.movie.getActualDuration() ) / r.pic.h
                            c.drawImage(
                                r.picObj,
                                0, 0, r.pic.ow, r.pic.oh,
                                _x + 1, 1, r.pic.w - 2, r.pic.h - 2
                            )
                            
                            if (this.isShowText) {
                                this.drawWordsOnCache(r, singleCacheWidth * index, c)
                            }
    
                            if (track.ctrl.copyFinished && this.isInFrontCvs(r)) {
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
                            0, 0, r.pic.ow, r.pic.oh,
                            _x + 1, 1, r.pic.w - 2, r.pic.h - 2
                        )
                        if (this.isShowText) {
                            this.drawWordsOnCache(r, singleCacheWidth * index, c)
                        }
                    }
                } else {
                    if (this.isShowText) {
                        this.drawWordsOnCache(r, singleCacheWidth * index, c)
                    }
                }
    
            }

            if ( this.isDrawPic ) {
                // 立体边框线
                c.save()
                // c.strokeStyle = '#fff'
                c.strokeStyle = '#333'
                c.lineWidth = 1
                c.beginPath()
                c.moveTo(_x + 1, r.h)
                c.lineTo(_x + 1, 1)
                c.lineTo(_x + r.w, 1)
                c.stroke()
                // c.strokeStyle = '#8399a2'
                c.strokeStyle = '#111'
                c.beginPath()
                c.moveTo(_x + r.w, 1)
                c.lineTo(_x + r.w, r.h)
                c.lineTo(_x + 1, r.h)
                c.stroke()
                c.restore()
            }
        })
    }

    initCanvas() {
        this.cvs = this.cvsRef.element.nativeElement
        // this.shadowCvs = this.shadowCvsRef.element.nativeElement

        this.cvs.height = this.rectHeight
        this.cvs.width = $(this.cvs)
            .parent()
            .width()
        // this.shadowCvs.width = this.duration2Width(this.totalDuration)
        // console.log(`init canvas: cvs width: ${this.cvs.width}`)
        this.ctx = this.cvs.getContext('2d')
        // this.shadowCtx = this.shadowCvs.getContext('2d')
    }
/* 
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
 */

    /* drawShadowRectsTheRow(rowData, c) {
        // this.drawShadowWords(r)
        // if (rowData.ctrl.isShowPic) {
        rowData.data.forEach(r => {
            if ( !this.isDrawPic ) {
                c.save()
                // TODO: 这个回头试试改成渐变色效果
                c.fillStyle = 'rgb(90, 156, 95)'
                c.fillRect(
                    r.x - 0.5,
                    0,
                    r.pic.w + 0.5,
                    r.pic.h - 2
                )
                c.restore()
            } else {
                if (rowData.ctrl.isShowPic) {
                    if (r.picObj === null) {
                        const loader = new PxLoader()
                        const img = loader.addImage(r.version.movie.picUrl)
                        loader.addCompletionListener(() => {
                            r.picObj = img
                            r.pic.oh = img.naturalHeight
                            r.pic.ow =
                                r.pic.oh * this.duration2Width( r.version.movie.getActualDuration() ) / r.pic.h
                            c.drawImage(
                                r.picObj,
                                0,
                                0,
                                r.pic.ow,
                                r.pic.oh,
                                r.x + 1,
                                // this.WORDSHEIGHT + 1,
                                1,
                                r.pic.w - 2,
                                r.pic.h - 2
                            )
                            if (this.isShowText) {
                                this.drawShadowWords(r)
                            }
    
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
                            // this.WORDSHEIGHT + 1,
                            1,
                            r.pic.w - 2,
                            r.pic.h - 2
                        )
                        if (this.isShowText) {
                            this.drawShadowWords(r)
                        }
                    }
                } else {
                    if (this.isShowText) {
                        this.drawWordsOnCache(r)
                    }
                }
    
            }

            if ( this.isDrawPic ) {
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
            }
        })
        // }

        // })
    } */

    drawWordsOnCache(r, offsetLeft = 0, c) {
        // const c = this.shadowCtx
        const wordsList = [r.text, r.version.title]
        const _x = r.x - offsetLeft

        c.save()
        c.fillStyle = '#ccc'
        // c.fillStyle = '#111'
        c.textBaseline = 'top'
        c.textAlign = 'left'
        wordsList.forEach((words, index) => {

            /* 画文字背景颜色 */
            c.save()
            c.fillStyle = 'rgba(0,0,0,.7)'
            c.fillRect(
                _x + 1,
                index === 0 ? 0 : this.rectHeight - this.WORDSHEIGHT,
                r.w,
                this.WORDSHEIGHT
            )
            c.restore()
            
            c.fillText(
                words,
                _x + 16,
                index === 0 ? 0 : this.rectHeight - this.WORDSHEIGHT
            )
            c.drawImage(
                this.statusIcons,
                // _x + r.w / 2 - wordsWidth / 2,
                _x + 2,
                index === 0 ? 3 : 3 + (this.rectHeight - this.WORDSHEIGHT),
                10,
                10
            )
        })
        c.restore()
    }

    drawFrontCvs() {
        // this.copyShadow2FrontCvs()
        this.copyCache2FrontCvs()
    }

    copyCache2FrontCvs() {
        const fc = this.ctx
        // const sc = this.shadowCvs
        const w = this.cvs.width
        const h = this.cvs.height

        const start = this.offsetLeft

        fc.clearRect(0, 0, w, h)
        // fc.drawImage(sc, start, 0, w, h, 0, 0, w, h)
        this.cache.forEach(cache => {
            fc.drawImage(cache.c, 0, 0, w, h, cache.i * w - start, 0, w, h)
        })

        this.row.ctrl.copyFinished = true
    }

    // copyShadow2FrontCvs() {
    //     const fc = this.ctx
    //     const sc = this.shadowCvs
    //     const w = this.cvs.width
    //     const h = this.cvs.height

    //     const start = this.offsetLeft

    //     fc.clearRect(0, 0, w, h)
    //     // fc.drawImage(sc, start, 0, w, h, 0, 0, w, h)
    //     this.cache.forEach(cache => {
    //         fc.drawImage(cache.c, 0, 0, w, h, cache.i * w - start, 0, w, h)
    //     })

    //     this.row.ctrl.copyFinished = true
    // }

    // copyShadow2FrontCvs() {
    //     const fc = this.ctx
    //     const sc = this.shadowCvs
    //     const w = this.cvs.width
    //     const h = this.cvs.height

    //     const start = this.offsetLeft

    //     fc.clearRect(0, 0, w, h)
    //     fc.drawImage(sc, start, 0, w, h, 0, 0, w, h)

    //     this.row.ctrl.copyFinished = true
    // }

    reDrawTheRow() {
        // this.shadowCvs.width = this.duration2Width(this.totalDuration)
        // this.drawShadowCvs()
        this.initCache()
        this.drawFrontCvs()
    }

    // duration2Width(duration, log=false) {
    //     // if(log) {
    //     //     console.log(`In single track ==== \n  unitWidth: ${this.unitWidth}, unitDuration: ${this.unitDuration}`)
    //     //     console.log(`current return width: ${duration * this.unitWidth / this.unitDuration}`)
    //     // }
    //     return duration * this.unitWidth / this.unitDuration // 1000ms 一个单位长度
    // }

    duration2Width(duration) {
        // return duration * this.unitWidth / this.unitDuration // 1000ms 一个单位长度
        return duration / (1000 / this.FRAMES) * this.unitFrameWidth
    }

    /* 
     * 判断指定rect是否绘制在当前屏幕上
     * */
    isInFrontCvs(rect) {
        const start = this.offsetLeft
        const end = start + this.cvs.width
        return !(
            (rect.x < start && rect.x + rect.w < start) ||
            (rect.x > end && rect.x + rect.w < end)
        )
    }
}
