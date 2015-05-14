/**
 * jquery.wechat.js
 * @author vivian
 * @time 2015-03-02
 * Copyright 2015 by gandxiaowei@gmail.com
 */
;
(function ($, window, document) {
    'use strict';

    //默认设置
    var shareOption = {
        imgUrl: 'http://www.youguu.com/images/logo.gif',
        title: document.title,
        desc: $('#desc').text(),
        link: window.location.href
    };

    /**
     * 注册微信组件
     * @param options 分享参数
     */
    var register = function (options) {
        $.extend(shareOption, options);
        $.ajax({
            url: 'http://asteroid.youguu.com/asteroid/wx/signature',
            data: {
                url: encodeURIComponent(window.location.href.replace(window.location.hash, ''))
            },
            dataType: 'json',
            success: function (data) {
                if (data && data.status == '0000') {
                    processWechatAuth(data);
                }
            }
        });
    };

    /**
     * 设置分享到朋友额参数
     * @param options 分享出去的参数（包括:title,desc,link,imgUrl）
     */
    var setAppMessage = function (options) {
        $.extend(shareOption, options);
        wx.onMenuShareAppMessage(shareOption);
    };

    /**
     * 设置分享到朋友圈参数
     * @param options 分享出去的参数（包括:title,link,imgUrl）
     */
    var setTimeline = function (options) {
        $.extend(shareOption, options);
        wx.onMenuShareTimeline(shareOption);
    };

    /**
     * 转换微信授权的参数
     * @param data 后台处理过后的参数
     */
    var processWechatAuth = function (data) {
        var wx_options = {
            debug: false,
            appId: 'wx7f5b58f40c143dcc',
            timestamp: data.timestamp,
            nonceStr: data.noncestr,
            signature: data.signature,
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
        };
        wx.config(wx_options);
    };

    /**
     * 隐藏微信菜单
     * @param menus 菜单名称列表(具体名字参照：http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html#.E9.99.84.E5.BD.953-.E6.89.80.E6.9C.89.E8.8F.9C.E5.8D.95.E9.A1.B9.E5.88.97.E8.A1.A8)
     */
    var hideMenu = function (menus) {
        if (!menus) {
            wx.hideOptionMenu();
        } else {
            wx.hideMenuItems({
                menuList: menus // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
            });
        }
    };

    /**
     * 获取用户手机网络状态
     * @param callback 成功回调函数
     */
    var getNetworkType = function (callback) {
        if (!callback) {
            return;
        }
        wx.getNetworkType({
            success: callback
        });
    };

    wx.ready(function () {
        setAppMessage();
        setTimeline();
    });

    $.wechat = {};

    //设置插件方法
    $.extend($.wechat, {
        register: register,
        setAppMessage: setAppMessage,
        setTimeline: setTimeline,
        hideMenu: hideMenu,
        getNetworkType: getNetworkType
    });
})(jQuery, window, document);