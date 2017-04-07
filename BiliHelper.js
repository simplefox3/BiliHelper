// ==UserScript==
// @name        bilibili HTML5播放器
// @author      nanavao
// @namespace   nana_vao_script
// @description 启用bilibili的html5播放器，自动宽屏、原生右键菜单
// @version     1.23
// @include     http://www.bilibili.com/video/av*
// @include     http://bangumi.bilibili.com/anime/v/*
// @run-at      document-start
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// ==/UserScript==
'use strict';
(function () {
    let url = GM_getValue('url');
    GM_deleteValue('url');
    if (location.hostname == 'bangumi.bilibili.com') {
        if(url === location.href){
            return;
        }
        GM_setValue('url', location.href);
        document.addEventListener('DOMContentLoaded', function () {
            window.stop();
            location.href = document.querySelector('.v-av-link').href;
        });
    } else {
        try{
            localStorage.setItem('bilibililover', 'YESYESYES');
            localStorage.setItem('defaulth5', '1');
        }catch(e){}
        window.addEventListener('load', function () {
            this.$ = unsafeWindow.jQuery;
            $('.bilibili-player-iconfont-web-fullscreen').click();

            scrollToPlayer();
            let intervalId  = setInterval(function(){
                if($('.bilibili-player-video-wrap video').length){
                    setContextMenuHandler();
                    clearInterval(intervalId);
                }
            },500);
        });
    }
    
    function scrollToPlayer(){
        var player = $('#bilibiliPlayer');
        if($(window).scrollTop() === 0){
            $(window).scrollTop(player.offset().top + player.height() - $(window).height());
        }
    }
    
    function setContextMenuHandler(){
        let contextMenuEvent = $._data( document.querySelector('.bilibili-player-video-wrap'), "events" ).contextmenu[0];
        let oldHandler = contextMenuEvent.handler;

        let isElementClicked = function(ele, x, y){
            let rect = ele.getBoundingClientRect();
            return ((x > rect.left) && (x < rect.right) && (y > rect.top) && (y < rect.bottom));
        };

        let anyElementClicked = function(arr,x,y){
            for(let i = 0;i < arr.length; i++){
                if(isElementClicked(arr[i],x,y)){
                    return true;
                }
            }
            return false;
        };

        let newHandler = function(e){  
            let eleArr = document.querySelectorAll('.bilibili-danmaku');
            if(anyElementClicked(eleArr,e.clientX,e.clientY)){
                oldHandler(e);
            }
        };

        contextMenuEvent.handler = exportFunction(newHandler,contextMenuEvent);
    }
}) ();

