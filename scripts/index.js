/**
 * index.js
 * @author Vivian
 * @version 1.0.0
 * CopyRight 2014-2015, Gandxiaowei@gmail.com.All Rights Reserved.
 */

var pages = initPages();

var colorConfig = {
    green: '#00941F',
    red: '#F3001A'
};

$(function () {
    for (var i = 0; i < pages.length; i++) {
        $('<div/>', {
            class: 'swiper-slide',
            id: 'page' + i
        }).appendTo($('.swiper-wrapper'));
        //.css('background', getRandomColor());
    }
    new Swiper('.swiper-container', {
        direction: 'vertical',
        pagination: '.swiper-pagination',
        onInit: loadPage,
        onSlideChangeStart: loadPage
    });
});

function loadPage(swiper) {
    var index = swiper.activeIndex;
    console.log('加载第' + index + '页');
    var page = pages[index];
    if (!page.isLoad()) {
        page.request();
    }
}

function initPages() {
    var pages = [];

    //加载page页
    pages.push(getHomePage());
    pages.push(getProfitAnaPage());
    pages.push(getAssetFluctuationPage());
    pages.push(getAnnualProfitPage());
    pages.push(getProfitLossTotalPage());
    pages.push(getProfitLossAvgPage());
    pages.push(getPositionStatPage());
    pages.push(getSuccessRatePage());
    pages.push(getStockSelectionPage());
    pages.push(getAboutPage());

    return pages;
}

/**
 * 首页page
 */
function getHomePage() {
    var charts = [];
    var colors = ['#FF8C86', '#1FBCFB', '#AA80F9'];
    var i;
    var page = $.page({
        fragment: 'fragment/home.html',
        container: '#page0',
        init: init,
        analysis: $.analysis({
            type: 'home',
            callback: load
        })
    });

    function init() {
        for (i = 0; i < colors.length; i++) {
            charts.push(new $.chart.PiePercentChart('#w' + i, {
                color: [colors[i]],
                format: function (d) {
                    return (d / 10).toFixed(0);
                }
            }));
        }
    }

    function load(data) {
        var result = data.result;
        charts[0].setData(result.profitability * 20);
        charts[1].setData(result.stability * 20);
        charts[2].setData(result.accuracy * 20);
        display(result);
    }

    function display(data) {
        $('#username').text(data.nick);
        $('#totaldays').text(data.totalDays + '天');
        var url = 'images/level_' + data.ratingGrade.toLowerCase() + '.png';
        var img = new Image();
        img.onload = function () {
            $('.concer').empty();
            $(img).appendTo($('.concer')).addClass('animateimg');
        };
        img.src = url;
    }

    return page;
}

/**
 * 收益曲线page
 */
function getProfitAnaPage() {
    var chart;
    var cache = {};
    var page = $.page({
        fragment: 'fragment/profit_ana.html',
        container: '#page1',
        init: init,
        analysis: [
            $.analysis({
                type: 'profit_ana',
                callback: display
            }),
            $.analysis({
                type: 'daily_asset_line',
                extra: {
                    reqnum: 250,
                    pflag: -1
                },
                callback: function (data) {
                    cache.daily_asset_line = data.result;
                    load(data.result);
                }
            })
        ]
    });

    function init() {
        //TODO 刻度未完成
        chart = new $.chart.ProfitLineChart('#asset');
        bindEvent();
    }

    function bindEvent() {
        $('#select ul li').click(function () {
            var $self = $(this);
            if ($self.hasClass('checked')) {
                return;
            }
            $self.attr('class', 'checked').siblings().attr('class', 'unchecked');
            var type = $self.attr('type');
            if (cache[type]) {
                load(cache[type]);
                return;
            }
            $.analysis({
                type: type,
                extra: {
                    reqnum: 250,
                    pflag: -1
                },
                callback: function (data) {
                    cache[type] = data.result;
                    load(data.result);
                }
            }).request();
        });
    }

    function display(data) {
        var result = data.result;
        var totalassets = $.formatNum(result.totalAssets);
        $('#totalassets').text(totalassets.val);
        $('#totalassetsunit').text(totalassets.unit);
        $('#totalprofit').parent().css('color', result.totalProfit > 0 ? colorConfig.red : colorConfig.green);
        var totalprofit = $.formatNum(result.totalProfit);
        $('#totalprofit').text(totalprofit.val);
        $('#totalprofitunit').text(totalprofit.unit);
        $('#totalprofitrate').parent().css('color', result.totalProfitRate > 0 ? colorConfig.red : colorConfig.green);
        $('#totalprofitrate').text((result.totalProfitRate * 100).toFixed(2));
        $('#indexcontant').css('color', result.indexChangeRate > 0 ? colorConfig.red : colorConfig.green);
        $('#indexchangerate').text((result.indexChangeRate * 100).toFixed(2));
        $('#winratecontant').css('color', result.winRate > 0 ? colorConfig.red : colorConfig.green);
        $('#winrate').text((result.winRate * 100).toFixed(2));
        $('#anaremark').text(result.remark);
    }

    function load(result) {
        chart.setData(result);
    }

    return page;
}

/**
 * 回撤曲线page
 */
function getAssetFluctuationPage() {
    //TODO 未设定刻度
    var chart;
    var page = $.page({
        fragment: 'fragment/asset_fluctuation.html',
        container: '#page2',
        init: init,
        analysis: [
            $.analysis({
                type: 'asset_fluctuation',
                callback: display
            }),
            $.analysis({
                type: 'daily_backval_line',
                extra: {
                    reqnum: 250,
                    pflag: -1
                },
                callback: load
            })
        ]
    });

    function init() {
        chart = new $.chart.BackAssetCLineChart('#backvalchart');
    }

    function display(data) {
        var result = data.result;
        $('#avgbackdays').text(result.avgBackDays);
        $('#backrate').text((result.backRate * 100).toFixed(2));
        $('#highrate').text((result.highRate * 100).toFixed(2));
        $('#maxbackrate').text((result.maxBackRate * 100).toFixed(2) + '%');
        $('#maxbackval').text('￥' + result.maxBackVal.toFixed(0));
        $('#fluctuate_remark').text(result.remark);
    }

    function load(data) {
        chart.setData(data.result);
    }

    return page;
}

/**
 * 年化收益page
 */
function getAnnualProfitPage() {
    //TODO 增加图例和数据
    var beatChart, profitChart;
    var page = $.page({
        fragment: 'fragment/annual_profit.html',
        container: '#page3',
        init: init,
        analysis: $.analysis({
            type: 'annual_profit',
            callback: load
        })
    });

    function init() {
        beatChart = new $.chart.BeatChart('#chart_beat', {
            color: ['#FFBF68']
        });
        profitChart = new $.chart.ProfitChart('#chart_profit');
    }

    function load(data) {
        var result = data.result;
        console.log(result);
        beatChart.setData(result.defeatRate * 100);
        profitChart.setData([
            result.annualProfit,
            result.deposit1,
            result.deposit5,
            result.nationalDebt5,
            result.bao,
            result.bankFinancing,
            result.cpi
        ]);
        $('#annual_remark').text(result.remark);
    }

    return page;
}

/**
 * 盈亏天数page
 */
function getProfitLossTotalPage() {
    //TODO 添加数据
    var pieChart;
    var page = $.page({
        fragment: 'fragment/profit_loss_total.html',
        container: '#page4',
        init: init,
        analysis: $.analysis({
            type: 'profit_loss_total',
            callback: load
        })
    });

    function init() {
        pieChart = new $.chart.PieChart('#loss_total_chart');
    }

    function load(data) {
        var result = data.result;
        console.log(result);
        pieChart.setData([
            result.flatDays,
            result.lossDays,
            result.profitDays
        ]);
        $('#loss_total_remark').text(result.remark);
    }

    return page;
}

function getProfitLossAvgPage() {
    var page = $.page({
        fragment: 'fragment/profit_loss_avg.html',
        container: '#page5',
        init: init,
        analysis: $.analysis({
            type: 'profit_loss_avg',
            callback: load
        })
    });

    function init() {

    }

    function load(data) {
        var result = data.result;
        console.log(result);

        $('#loss_avg_remark').text(result.remark);
    }

    return page;
}

function getPositionStatPage() {
    var distributionChart;
    var page = $.page({
        fragment: 'fragment/position_stat.html',
        container: '#page6',
        init: init,
        analysis: $.analysis({
            type: 'position_stat',
            callback: load
        })
    });

    function init() {
        distributionChart = new $.chart.DistributionChart('#position_stat_chart');
    }

    function load(data) {
        var result = data.result;
        distributionChart.setData([
            result.p1,
            result.p15,
            result.p30,
            result.p50,
            result.p75,
            result.p90
        ]);
        display(result);
    }

    function display(result) {
        $('#percent').text((result.avgPositionRate * 100).toFixed(0) + '%');
        $('#fulldays').text(result.full);
        $('#emptydays').text(result.empty);
        $('#position_stat_remark').text(result.remark);
    }

    return page;
}

function getSuccessRatePage() {
    var chart = [];
    var page = $.page({
        fragment: 'fragment/success_rate.html',
        container: '#page7',
        init: init,
        analysis: $.analysis({
            type: 'success_rate',
            callback: load
        })
    });

    function init() {
        chart[0] = new $.chart.DashChart('.suc_total', {colors: ['#732928', '#FFBAB8', '#FFA6A4', '#E14949', '#F96360']});
        chart[1] = new $.chart.DashChart('.suc_t4', {colors: ['#2B6299', '#81D4F9', '#7FD5F9', '#2C6297', '#00A4F8']});
        chart[2] = new $.chart.DashChart('.suc_t1', {colors: ['#8E4D17', '#FFD8B7', '#FFC08E', '#D27327', '#FF8E32']});
    }

    function load(data) {
        var result = data.result;
        chart[0].setData(result.suc * 100);
        chart[1].setData(result.t4 * 100);
        chart[2].setData(result.t1 * 100);
        $('#success_rate_remark').text(result.remark);
    }

    return page;
}

function getStockSelectionPage() {
    var page = $.page({
        fragment: 'fragment/stock_selection.html',
        container: '#page8',
        analysis: $.analysis({
            type: 'stock_selection',
            callback: load
        })
    });

    function load(data) {
        var result = data.result;
        $('#avg_profit').text(result.avgProfit);
        $('#avg_hold').text(result.avgDays);
        $('#trade_rate').text(result.tradingFrequency);
        $('#trade_time').text(result.tradingNum);
        $('#trade_num').text(result.totalStock);
        $('#stockskilled').text(result.remark.split('、')[0]);
    }

    return page;
}

function getAboutPage() {
    var page = $.page({
        fragment: 'fragment/about.html',
        container: '#page9'
    });

    return page;
}