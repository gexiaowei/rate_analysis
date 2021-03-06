/**
 * jquery.jhss.analysis
 * @author Vivian
 * @version 1.0.0
 * copyright 2014-2015, gandxiaowei@gmail.com. all rights reserved.
 */
(function ($) {
    'use strict';

    var urlParams = $.getParams(),
        urlBase = !!(urlParams && urlParams.debug) ? '119.253.36.116' : 'mncg.youguu.com',
        urlRate = 'http://' + urlBase + '/youguu/rating';

    /**
     * 用户评级分析
     * @param option
     * @constructor
     */
    function Analysis(option) {
        this.params = $.getParams();
        this.option = option;
    }

    /**
     * 请求分析数据
     */
    Analysis.prototype.request = function () {
        var type = this.option.type,
            extra = this.option.extra,
            params = this.params,
            callback = this.option.callback;
        var path = '';
        if (typeof extra == 'function') {
            callback = extra;
        } else {
            params = $.extend(params, extra);
        }

        switch (type) {
            case 'home':
                path = '/score?userid={userid}&matchid={matchid}';
                break;
            case 'daily_asset_line':
                path = '/daily_asset_line?userid={userid}&matchid={matchid}&reqnum={reqnum}&pflag={pflag}';
                break;
            case 'week_asset_line':
                path = '/week_asset_line?userid={userid}&matchid={matchid}&reqnum={reqnum}&pflag={pflag}';
                break;
            case 'month_asset_line':
                path = '/month_asset_line?userid={userid}&matchid={matchid}&reqnum={reqnum}&pflag={pflag}';
                break;
            case 'daily_backval_line':
                path = '/daily_backval_line?userid={userid}&matchid={matchid}&reqnum={reqnum}&pflag={pflag}';
                break;
            case 'profit_ana':
                path = '/profit_ana?userid={userid}&matchid={matchid}';
                break;
            case 'asset_fluctuation':
                path = '/asset_fluctuation?userid={userid}&matchid={matchid}';
                break;
            case 'annual_profit':
                path = '/annual_profit?userid={userid}&matchid={matchid}';
                break;
            case 'profit_loss_total':
                path = '/profit_loss_total?userid={userid}&matchid={matchid}';
                break;
            case 'profit_loss_avg':
                path = '/profit_loss_avg?userid={userid}&matchid={matchid}';
                break;
            case 'position_stat':
                path = '/position_stat?userid={userid}&matchid={matchid}';
                break;
            case 'success_rate':
                path = '/success_rate?userid={userid}&matchid={matchid}';
                break;
            case 'stock_selection':
                path = '/stock_selection?userid={userid}&matchid={matchid}';
                break;
            default:
                throw new Error('no such type: ' + type);
        }
        $.httpRequest(urlRate + path, params, {
            success: function (data) {
                callback(data);
            },
            error: function (error) {
                console.error(error);
            }
        }).request();
    };

    $.analysis = function (option) {
        return new Analysis(option);
    };

})(jQuery);