/**
 * jquery.jhss.page
 * @author Vivian
 * @version 1.0.0
 * copyright 2014-2015, gandxiaowei@gmail.com. all rights reserved.
 */
(function ($) {
    'use strict';
    /**
     * 分页
     * @param option
     * @constructor
     */
    function Page(option) {
        option = option || {};
        this.fragment = option.fragment;
        var analysis = option.analysis || [];
        this.analysis = Array.isArray(analysis) ? analysis : [analysis];
        this.init = option.init;
        this.container = option.container;
        this.loadFlag = false;
    }

    /**
     * 读取fragment并请求接口
     */
    Page.prototype.request = function () {
        var self = this;
        $(self.container).load(self.fragment, function () {
            if (self.init) {
                self.init();
            }
            var i;
            for (i = 0; i < self.analysis.length; i++) {
                self.analysis[i].request();
            }
            self.loadFlag = true;
        });
    };

    Page.prototype.isLoad = function () {
        return !!this.loadFlag;
    };

    $.page = function (option) {
        return new Page(option);
    };
})(jQuery);