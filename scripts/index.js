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
        console.log(result);
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
 * 首页曲线page
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
                callback: load
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
        console.log(data);
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
        console.log(result);
        chart.setData(result);
    }

    return page;
}