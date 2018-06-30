// ==UserScript==
// @name        bilibili HTML5播放器
// @author      nanavao
// @namespace   nana_vao_script
// @description 启用bilibili的html5播放器，自动宽屏、原生右键菜单
// @version     1.25
// @include     http://www.bilibili.com/video/av*
// @include     https://www.bilibili.com/video/av*
// @include     http://bangumi.bilibili.com/anime/v/*
// @include     https://bangumi.bilibili.com/anime/v/*
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
            this.$ = unsafeWindow.jQuery;
            waitElement(function() {
                document.getElementsByClassName("bilibili-player-iconfont-web-fullscreen")[0].click();
            }, ".bilibili-player-iconfont-web-fullscreen");
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
            _self = this,
            _selector = selector, //选择器
            _iIntervalID; //定时器id
        if( this.length ){ //如果已经获取到了，就直接执行函数
            func && func.call(this);
        } else {
            _iIntervalID = setInterval(function() {
                if(!_times) { //是0就退出
                    clearInterval(_iIntervalID);
                }
                _times <= 0 || _times--; //如果是正数就 --
                _self = $(_selector); //再次选择
                if( _self.length ) { //判断是否取到
                    func && func.call(_self);
                    clearInterval(_iIntervalID);
                }
            }, _interval);
        }
        return this;
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

