/**
 * 解析url参数
 * @example ?id=12345&a=b
 * @return Object {id:12345,a:b}
 */

function urlParse() {
    var url = window.location.search;
    var obj = {};
    var reg = /[?&][^?&]+=[^?&]+/g;
    var arr = url.match(reg);
    // ['?id=12345', '&a=b']
    if (arr) {
        for (var i = 0; i < arr.length; i++) {
            var tempArr = arr[i].substring(1).split('=');
            var key = decodeURIComponent(tempArr[0]);
            var val = decodeURIComponent(tempArr[1]);
            obj[key] = val;
        }
    }
    return obj;
}
//加载中 loading   loader.init();//初始化放在顶部  loader.showL();显示  loader.hideL();隐藏
var loader = {
    loaderHTML: '<div class="loader"><div class="ball-spin-fade-loader"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>',
    ticketLoaderHTML: '<div style="display:none;" class="ticket-loading"><img class="loading-img" src="./images/auz/loading-img.gif" alt=""> <p class="text">正在认证中，请不要退出<span>.</span><span>.</span><span>.</span></p> </div>',
    mebaHTML: '<div class="mask"></div><div class="mask-transparent"></div> ',
    init: function () {
        $("body").append(loader.loaderHTML + loader.mebaHTML + loader.ticketLoaderHTML);
    },
    showL: function () {
        $(".loader,.mask").show();
    },
    hideL: function () {
        $(".loader,.mask").hide();
    },
    showMask: function () {
        $(".mask-transparent").show();
    },
    hideMask: function () {
        $(".mask-transparent").hide();
    },
    showTicketMask: function () {
        $(".ticket-loading,.mask").show();
    },
    hideTicketMask: function () {
        $(".ticket-loading,.mask").hide();
    }
};

// show error msg  showMsg($('.error-msg'), '请输入正确的手机号码');
function showMsg(obj, msg, time) {
//        var obj = $('.error-msg');
    clearTimeout(obj.timeout);
    time = time || 1500;
    obj.html(msg).addClass('active');
    obj.timeout = setTimeout(function () {
        obj.removeClass('active');
    }, time);
}


//监听网络连接状态
(function(win){
    function BBNetwork(callback){
        this.navigator = win.navigator ;
        this.callback = callback ;
        this._init() ;
    } ;
    var bbNetworkProto = BBNetwork.prototype ;
    bbNetworkProto._init = function(){
        var that = this ;
        win.addEventListener("online",function(){
            that._fnNetworkHandler() ;
        },true) ;
        win.addEventListener("offline",function(){
            that._fnNetworkHandler() ;
        },true) ;
    } ;
    bbNetworkProto._fnNetworkHandler = function(){
        this.callback && this.callback(this.navigator.onLine ? "online" : "offline") ;
    } ;
    bbNetworkProto.isOnline = function(){
        return this.navigator.onLine ;
    } ;
    win.BBNetwork = BBNetwork ;
})(window) ;

