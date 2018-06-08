$(function(){
    //正常
    // $('.cb_normal').on('touchstart',function(){
    //     $(this).attr('src','./images/normal_after.png');
    // });
    // $('.cb_normal').on('touchend',function(){
    //     $(this).attr('src','./images/normal_before.png');
    // });
    // //休假
    // $('.ac_leave').on('touchstart',function(){
    //     $(this).attr('src','./images/leave_after.png');
    // });
    // $('.ac_leave').on('touchend',function(){
    //     $(this).attr('src','./images/leave_before.png');
    // });
    // //外出
    // $('.ac_goout').on('touchstart',function(){
    //     $(this).attr('src','./images/goout_after.png');
    // });
    // $('.ac_goout').on('touchend',function(){
    //     $(this).attr('src','./images/goout_before.png');
    // });
    // //外出
    // $('.ac_another').on('touchstart',function(){
    //     $(this).attr('src','./images/another_after.png');
    // });
    // $('.ac_another').on('touchend',function(){
    //     $(this).attr('src','./images/another_before.png');
    // });
    // //外出
    // $('.ac_chai').on('touchstart',function(){
    //     $(this).attr('src','./images/chai_after.png');
    // });
    // $('.ac_chai').on('touchend',function(){
    //     $(this).attr('src','./images/chai_before.png');
    // });
    //
    // //关闭
    // $('.close_btn').click(function(){
    //     $('.content_box_alert').addClass('hidden');
    //     $('.content_box').removeClass('filter');
    // });
});

//底部导航
function genFooterBar(first,second,type){
    $('.footer_bar').html('<div class="fb_left nav">' +
        '        <dl>\n' +
        '            <dt><img src="'+first+'" alt=""></dt>\n' +
        '            <dd class="index">首页</dd>\n' +
        '        </dl>\n' +
        '    </div>\n' +
        '    <div class="fb_center">\n' +
        '        <img src="./images/check_in_white.png" alt="">\n' +
        '    </div>\n' +
        '    <div class="fb_right nav">\n' +
        '        <dl>\n' +
        '            <dt><img src="'+second+'" alt=""></dt>\n' +
        '            <dd class="mine">我的</dd>\n' +
        '        </dl>\n' +
        '    </div>');
        if(type =='index'){
            $('.index').addClass('font_blue');
        }else{
            $('.mine').addClass('font_blue');
        }
}

//遮罩层
function genMenuOver(){
    $('.content_box_alert').html('<img src="./images/normal_before.png" alt="" class="cb_normal">\n' +
        '    <div class="another_content">\n' +
        '        <img src="./images/leave_before.png" alt="" class="left ac_leave">\n' +
        '        <img src="./images/goout_before.png" alt="" class="right ac_goout">\n' +
        '        <img src="./images/another_before.png" alt="" class="left ac_another">\n' +
        '        <img src="./images/chai_before.png" alt="" class="right ac_chai">\n' +
        '    </div>\n' +
        '    <img src="./images/close.png" alt="" class="close_btn">');
}

// 验证手机号是否正确
function isPhoneNum(phoneNum) {
    var reg = /^1(([3|8|7|5][0-9])|(5[^4|\D]))\d{8}$/;
    return reg.test(phoneNum);
}

// 验证内容中是否包括特殊字符
function isIncludeSpecalStr(str) {
    var reg = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/;
    return reg.test(str);
}
// 验证文本内容是否为空
function isValContent(str) {
    if($.trim(str) == ''){
        return true;
    }else{
        return false;
    }
}

//收回错误信息提示框
function errorMessageSlideUpFn(msg){
    $('.message_box').html(msg).slideDown().delay(2000).slideUp();
}
//固定错误信息提示框
function errorMessageFixFn(msg){
    $('.message_box').html(msg).slideDown();
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

