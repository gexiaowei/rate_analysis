/**
 * index.js
 * @author Vivian
 * @version 1.0.0
 * CopyRight 2014-2015, Gandxiaowei@gmail.com.All Rights Reserved.
 */

var pages = [];

$(function () {
    for (var i = 0; i < 7; i++) {
        $('<div/>', {
            class: 'swiper-slide',
            id: 'page' + i
        }).appendTo($('.swiper-wrapper')).css('background', getRandomColor());
    }
    new Swiper('.swiper-container', {
        direction: 'vertical',
        pagination: '.swiper-pagination',
        onInit: requestAnalysis,
        onSlideChangeStart: requestAnalysis
    });
});

function requestAnalysis(swiper) {
    //var index = swiper.activeIndex;
    //var page = $('#page' + index);
    //if (page.children().length === 0) {
    //    page.load('fragment/' + fragments[index], callbacks[index]);
    //}
}


function getRandomColor() {
    return "#" + ("00000" + ((Math.random() * 16777215 + 0.5) >> 0).toString(16)).slice(-6);
}