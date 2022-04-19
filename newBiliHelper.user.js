// ==UserScript==
// @name        bilibili 自动网页全屏
// @author      sangkuanji
// @namespace   nana_vao_script
// @description 启用bilibili的html5播放器，自动宽屏、原生右键菜单
// @version     1.29
// @include     http://www.bilibili.com/video/BV*
// @include     https://www.bilibili.com/video/BV*
// @include     https://www.bilibili.com/video/av*
// @include     http://bangumi.bilibili.com/anime/v/*
// @include     https://bangumi.bilibili.com/anime/v/*
// @include     https://live.bilibili.com/*
// @run-at      document-start
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// ==/UserScript==

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
            console.log("load wait success");
            this.$ = unsafeWindow.jQuery;
            waitElement(function() { //等待#btn_comment_submit元素的加载
                console.log("wait element, click element " + document.getElementsByClassName("bilibili-player-iconfont-web-fullscreen-off").length);
                document.getElementsByClassName("bilibili-player-iconfont-web-fullscreen-off")[0].click();
                console.log("click succes");
            }, ".bilibili-player-iconfont-web-fullscreen-off");
            scrollToPlayer();
            let intervalId  = setInterval(function(){
                if($('.bilibili-player-video-wrap video').length){
                    setContextMenuHandler();
                    clearInterval(intervalId);
                }
            },500);
        });
    }

    function waitElement(func,selector, times, interval) {
        this.$ = unsafeWindow.jQuery;
        var _times = times || -1, //100次
            _interval = interval || 20, //20毫秒每次
            _self = document.getElementsByClassName("bilibili-player-iconfont-web-fullscreen-off"),
            _selector = selector, //选择器
            _iIntervalID; //定时器id
        if( _self.length != 0){ //如果已经获取到了，就直接执行函数
            func && func.call(this);
        } else {
            console.log("times" + _times);
            _iIntervalID = setInterval(function() {
                if(!_times) { //是0就退出
                    clearInterval(_iIntervalID);
                }
                _times <= 0 || _times--; //如果是正数就 --
                _self = document.getElementsByClassName("bilibili-player-iconfont-web-fullscreen-off"); //再次选择
                if( _self.length != 0) { //判断是否取到
                    func && func.call(_self);
                    clearInterval(_iIntervalID);
                }
            }, _interval);
        }
        return this;
    }
    function scrollToPlayer(){
        console.log("scrollTopPlayer");
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
