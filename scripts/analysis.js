/**
 * analysis.js
 * @author Vivian
 * @version 1.0.0
 * CopyRight 2014-2015, Gandxiaowei@gmail.com.All Rights Reserved.
 */

var urlParams = $.getParams(),
    baseUrl = !!(urlParams || urlParams.debug) ? '119.253.36.116' : 'mncg.youguu.com',
    rateUrl = 'http://' + baseUrl + '/youguu/rating/';

/**
 * 用户评级分析
 * @param user 用户信息
 * @constructor
 */
function Analysis(user) {
    this.user = user;
}

/**
 * 请求分析数据
 * @param type 分析类型
 * @param extra 额外的参数
 * @param callback 数据回调函数
 */
Analysis.prototype.request = function (type, extra, callback) {
    var path = '',
        params = urlParams;
    if (typeof extra == 'function') {
        callback = extra;
    } else {
        $.extend(extra, params);
        params = extra;
    }

    switch (type) {
        case 'home':
            path = 'score?userid={userid}&matchid={matchid}';
            break;
        case 'daily_asset_line':
        case 'week_asset_line':
        case 'month_asset_line':
            path = type + '?userid={userid}&matchid={matchid}&reqnum={reqnum}&pflag={pflag}';
            break;
        case 'profit_ana':
            path = 'profit_ana?userid={userid}&matchid={matchid}';
            break;
        default:
            throw new Error('no such [type]' + type);
    }
    new $.httpRequest(rateUrl + path, params, {
        success: function (data) {
            callback(data);
        },
        error: function (error) {
            console.log(error);
        }
    }).request();
};
