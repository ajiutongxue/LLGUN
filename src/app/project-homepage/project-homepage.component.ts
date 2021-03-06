import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-project-homepage',
    templateUrl: './project-homepage.component.html',
    // styleUrls: ['./project-homepage.component.css']
})
export class ProjectHomepageComponent implements OnInit {
    isActive = false;   // 测试临时用，没用

    initWidth = 0;      // 左边部分初始宽度设置

    boundaryTop = 68;   // 上边界，顶上两条导航的高度和
    scrollBarBoundaryTop = 240;   // 图片的高度
    $scrollBox = null;   // 带滚动条带div =》 ll-main-box _homepage
    $tabsBox = null;
    $siderBox = null;   // 右边的div  right-content-box , 要取里面跟内容关联的div
    siderContainer = null;
    siderHeight = 0;
    // $leftContainer = null;
    chartContainer = null
    $chartBox = null; // 左边的放图表的div
    chartHeight = 0

    constructor() {
    }

    ngOnInit() {
        this.$scrollBox = $('.ll-main-box._homepage');
        this.$tabsBox = $('.homepage-tabs');
        this.$siderBox = $('.right-content-box');
        // this.$leftContainer = $('.ll-main-container._homepage');
        // this.$leftContainer.css('minHeight', $('.ll-right-container').height());
        this.siderContainer = $('.ll-right-container')[0];

        this.chartContainer = $('.ll-left-piechart-container')[0]
        this.$chartBox = $('.ll-left-piechart-container>div');

        this.initDom();

        $(window).on('resize', () => {
            this.initDom();
        });
    }

    initDom() {
        // $('.homepage-content').css('minHeight', $('.ll-right-container').height() - this.$tabsBox.height());
        $('.homepage-content').css('minHeight', $(window).height() - this.$tabsBox.height() - this.boundaryTop - this.scrollBarBoundaryTop - 1);
        this.initWidth = $(window).width() - 480 - 480; // 左边又空了480 放饼图
        this.siderHeight = this.$siderBox.height();
        this.chartHeight = this.$chartBox.height()

        this.$scrollBox.on('scroll', () => {
            this.bindScrollHandle();
        });
    }

    bindScrollHandle() {
        if (this.$scrollBox[0].scrollTop > this.scrollBarBoundaryTop) {
            this.$tabsBox.css({
                'position': 'fixed',
                'left': 480,
                'border-left': '1px solid #ccc',
                'top': this.boundaryTop + 'px',
                'right': this.$scrollBox.width() - (this.siderContainer.getBoundingClientRect().left + this.siderContainer.getBoundingClientRect().width)        
                // 'right': $(window).width() - $('.ll-main-container._homepage').width() + 'px'
            });

            // siderbox
            if ($(window).height() > (this.siderHeight + this.boundaryTop)) {
                this.$siderBox.css({
                    'position': 'fixed',
                    'top': this.boundaryTop + 'px',
                    'bottom': 'unset',
                    'left': this.siderContainer.getBoundingClientRect().left,
                    'right': this.$scrollBox.width() - (this.siderContainer.getBoundingClientRect().left + this.siderContainer.getBoundingClientRect().width)        
                });
            } else {
                this.$siderBox.css({
                    'position': 'static',
                });
                if ((this.$scrollBox.height() + this.$scrollBox[0].scrollTop - 240) > this.siderHeight) {
                    this.$siderBox.css({
                        'position': 'fixed',
                        'top': 'unset',
                        'bottom': 0,
                        'left': this.siderContainer.getBoundingClientRect().left,
                        'right': this.$scrollBox.width() - (this.siderContainer.getBoundingClientRect().left + this.siderContainer.getBoundingClientRect().width)        
                    });
                } else {
                    this.$siderBox.css({
                        'top': 'unset',
                        'bottom': this.siderHeight - (this.$scrollBox.height() + this.$scrollBox[0].scrollTop - 240) + 'px',
                        'left': this.siderContainer.getBoundingClientRect().left,
                        'right': this.$scrollBox.width() - (this.siderContainer.getBoundingClientRect().left + this.siderContainer.getBoundingClientRect().width)        
                    });
                }
            }

            // chart box
            if ($(window).height() > (this.chartHeight + this.boundaryTop)) {
                this.$chartBox.css({
                    'position': 'fixed',
                    'top': this.boundaryTop + 'px',
                    'bottom': 'unset',
                    'left': this.chartContainer.getBoundingClientRect().left,
                    'right': this.$scrollBox.width() - (this.chartContainer.getBoundingClientRect().left + this.chartContainer.getBoundingClientRect().width)        
                });
            } else {
                this.$chartBox.css({
                    'position': 'static',
                });
                if ((this.$scrollBox.height() + this.$scrollBox[0].scrollTop - 240) > this.chartHeight) {
                    this.$chartBox.css({
                        'position': 'fixed',
                        'top': 'unset',
                        'bottom': 0,
                        'left': 0,
                        'right': this.$scrollBox.width() - (this.chartContainer.getBoundingClientRect().left + this.chartContainer.getBoundingClientRect().width)        
                    });
                } else {
                    this.$siderBox.css({
                        'top': 'unset',
                        'bottom': this.chartHeight - (this.$scrollBox.height() + this.$scrollBox[0].scrollTop - 240) + 'px',
                        'left': 0,
                        'right': this.$scrollBox.width() - (this.chartContainer.getBoundingClientRect().left + this.chartContainer.getBoundingClientRect().width)        
                    });
                }
            }

        } else {
            this.$tabsBox.css({
                'position': 'absolute',
                'left': 0,
                'border-left': 'none',
                'top': 0,
                'right': 0       
            });
            this.$siderBox.css({
                'position': 'static',
            });
            this.$chartBox.css({
                'position': 'static',
            });
        }
    }

}
