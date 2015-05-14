/**
 * index.js
 * @author Vivian
 * @version 1.0.0
 * CopyRight 2014-2015, Gandxiaowei@gmail.com.All Rights Reserved.
 */
var analysis = new Analysis({});
var fragments = [
    'home.html',
    'profit_ana.html',
    'profitability_analysis_asset_fluctuation.html',
    'profitability_analysis_annual_profit.html',
    'daily_trading_analysis_profit_loss_total.html',
    'daily_trading_analysis_profit_loss_avg.html',
    'daily_trading_analysis_position_stat.html',
    'stock_selection_analysis_success_rate.html',
    'stock_selection_analysis_stock_selection.html',
    'share.html'
];

var callbacks = [
    function () {
        var profitChart = new AnnulusChart('w', {color: '#FF8C86'});
        var stableChart = new AnnulusChart('w1', {color: '#1FBCFB'});
        var rightChart = new AnnulusChart('w2', {color: '#AA80F9'});
        analysis.request('home', function (data) {
            if (!data || !data.result) {
                return;
            }
            bindSoreData(data.result);
            profitChart.to(data.result.profitability * 2 / 10);
            stableChart.to(data.result.stability * 2 / 10);
            rightChart.to(data.result.accuracy * 2 / 10);
        });
    },
    function () {
        var assetLine = new AssetLine('asset');
        var requestAnalysisLine = function(type){
            analysis.request(type, {
                reqnum: 250, pflag: -1
            }, function (data) {
                var result = data.result;
                assetLine.line(result.reverse(), 'profit_ana');
            });
        };
        $('#select ul li').click(function () {
            if ($(this).hasClass('checked')) {
                return;
            }
            $(this).attr('class', 'checked').siblings().attr('class', 'unchecked');
            requestAnalysisLine($(this).attr('type'));
        });
        analysis.request('profit_ana', function (data) {
            bindAnaData(data.result);
        });
        requestAnalysisLine($('.checked').attr('type'));
    }
];

$(function () {

    for (var i = 0; i < fragments.length; i++) {
        $('<div/>', {class: 'swiper-slide', id: 'page' + (i)}).appendTo($('.swiper-wrapper')).text(fragments[i]);
    }

    new Swiper('.swiper-container', {
        // Optional parameters
        direction: 'vertical',
        // If we need pagination
        pagination: '.swiper-pagination',
        onInit: requestAnalysis,
        onSlideChangeStart: requestAnalysis
    });

});


function requestAnalysis(swiper) {
    var index = swiper.activeIndex;
    var page = $('#page' + index);
    if (page.children().length === 0) {
        page.load('fragment/' + fragments[index], callbacks[index]);
    }
}

function bindSoreData(data) {
    $('#username').text(data.nick);
    $('#totaldays').text(data.totalDays + '天');
    var url = 'images/level_' + data.ratingGrade.toLowerCase() + '.png';
    var img = new Image();
    img.onload = function () {
        $('.concer').empty();
        console.log($(img));
        $(img).appendTo($('.concer')).addClass('animateimg');
    };
    img.src = url;
}

function bindAnaData(result) {
    console.log(result.totalAssets);
    var totalassets = new formatBigNum(result.totalAssets);
    $('#totalassets').text(totalassets.num);
    $('#totalassetsunit').text(totalassets.unit);
    $('#totalprofit').parent().css('color', result.totalProfit > 0 ? '#F3001A' : '#00941F');
    var totalprofit = new formatBigNum(result.totalProfit);
    $('#totalprofit').text(totalprofit.num);
    $('#totalprofitunit').text(totalprofit.unit);
    $('#totalprofitrate').parent().css('color', result.totalProfitRate > 0 ? '#F3001A' : '#00941F');
    $('#totalprofitrate').text((result.totalProfitRate * 100).toFixed(2));
    $('#indexcontant').css('color', result.indexChangeRate > 0 ? '#F3001A' : '#00941F');
    $('#indexchangerate').text((result.indexChangeRate * 100).toFixed(2));
    $('#winratecontant').css('color', result.winRate > 0 ? '#F3001A' : '#00941F');
    $('#winrate').text((result.winRate * 100).toFixed(2));
    $('#anaremark').text(result.remark);
}

function formatBigNum(num) {
    if (Math.abs(num) < 10000) {
        this.num = num.toFixed(2);
        this.unit = '';
    } else if (Math.abs(num) >= 10000 && Math.abs(num) < 100000000) {
        this.num = (num / 10000).toFixed(2);
        this.unit = '万';
    } else {
        this.num = (num / 100000000).toFixed(2);
        this.unit = '亿';
    }
}

formatBigNum.prototype.toString = function () {
    return this.num + this.unit;
};
