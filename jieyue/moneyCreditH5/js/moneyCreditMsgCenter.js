var getParam = urlParse();
var ua = navigator.userAgent;
loader.init();
var randomStr = Math.random().toString(36).substr(2);
$(function(){
    ua = JSON.parse(ua.substring(ua.lastIndexOf('/')+1));
    getMineMessage();
    //tab切换
    $('.msg-title li').click(function(){
        var this_ = $(this);
        this_.addClass('on').siblings().removeClass('on');
        $('.mb_content>div').eq(this_.index()).removeClass('hidden').siblings().addClass('hidden');
        if(this_.hasClass('t-left')){
            getMineMessage();
        }else{
            genSystemMessage();
        }
    });

    //查看消息详情
    $('.list-ul .list-li .con,.list-ul .list-li .conn').live('click',function(){
        var this_ = $(this);
        window.location.href = "moneyCreditMsgDetails.html?time="+this_.parent().attr('time')+'&title='+this_.parent().attr('title')+'&content='+this_.parent().attr('content');
    })

    //同一时刻只有一个删除按钮
    $('.list-li').live('touchstart',function(e) {
        $(this).siblings().css('WebkitTransform','translateX(' + 0 + 'px)');
    });

    //删除
    $('ul .list-li .btn').live("click",function(){
        var this_ = $(this);
        var bodyObj = {
            "id":parseInt(this_.attr('id'))
        }
        var signObj = md5(JSON.stringify(bodyObj)).toUpperCase();//对body内容进行md5加密
        var obj = {
            "header": {
                "appType": ua.appType,
                "appNo": ua.appNo,
                "appVersion": ua.appVersion,
                "requestId": randomStr,
                "sign":signObj,
                "token":ua.token
            },
            "body":{
                "id":parseInt(this_.attr('id'))
            }
        }
        var aseScret = encrypt(JSON.stringify(obj));//aes加密后
        var endObj = {
            "data":aseScret
        }
        endObj = JSON.stringify(endObj);
        $.ajax({
            type: 'POST',
            contentType: "text/html; charset=UTF-8",
            url: '/api/appUser/deleteInnerMail/ValidateState/',
            headers:{AESKEY:'H5AesKey'},
            data: obj,
            dataType: 'json',
            beforeSend: function () {
                loader.showL();
            },
            success: function (data) {
                if(data.header.rspMsg == '成功'){
                    loader.hideL();
                    this_.parent().remove();
                }else{
                    showMsg($('.error-msg'), data.header.rspMsg);
                }
            },
            error: function (e) {
                loader.hideL();
            }
        });

    })
})

//滑动
window.addEventListener('load',function(){
    var initX;
    var moveX;
    var X = 0;
    var objX = 0;
    window.addEventListener('touchstart',function(event){
        var obj = event.target.parentNode;
        if(obj.className == "list-li"){
            initX = event.targetTouches[0].pageX;
            objX =(obj.style.WebkitTransform.replace(/translateX\(/g,"").replace(/px\)/g,""))*1;
        }else if(obj.className == "con"){
            initX = event.targetTouches[0].pageX;
            objX =(obj.parentNode.style.WebkitTransform.replace(/translateX\(/g,"").replace(/px\)/g,""))*1;
        }
        if( objX == 0){
            window.addEventListener('touchmove',function(event) {
                var obj = event.target.parentNode;
                if (obj.className == "list-li") {
                    moveX = event.targetTouches[0].pageX;
                    X = moveX - initX;
                    if (X > 0) {
                        obj.style.WebkitTransform = "translateX(" + 0 + "px)";
                    }
                    else if (X < 0) {
                        var l = Math.abs(X);
                        obj.style.WebkitTransform = "translateX(" + -l + "px)";
                        if(l>88){
                            l=88;
                            obj.style.WebkitTransform = "translateX(" + -l + "px)";
                        }
                    }
                }else if(obj.className == "con"){
                    moveX = event.targetTouches[0].pageX;
                    X = moveX - initX;
                    if (X > 0) {
                        obj.parentNode.style.WebkitTransform = "translateX(" + 0 + "px)";
                    }
                    else if (X < 0) {
                        var l = Math.abs(X);
                        obj.parentNode.style.WebkitTransform = "translateX(" + -l + "px)";
                        if(l>88){
                            l=88;
                            obj.parentNode.style.WebkitTransform = "translateX(" + -l + "px)";
                        }
                    }
                }
            });
        }
        else if(objX<0){
            window.addEventListener('touchmove',function(event) {
                var obj = event.target.parentNode;
                if (obj.className == "list-li") {
                    moveX = event.targetTouches[0].pageX;
                    X = moveX - initX;
                    if (X > 0) {
                        var r = -88 + Math.abs(X);
                        obj.style.WebkitTransform = "translateX(" + r + "px)";
                        if(r>0){
                            r=0;
                            obj.style.WebkitTransform = "translateX(" + r + "px)";
                        }
                    }
                    else {     //向左滑动
                        obj.style.WebkitTransform = "translateX(" + -88 + "px)";
                    }
                }else if(obj.className == "con"){
                    moveX = event.targetTouches[0].pageX;
                    X = moveX - initX;
                    if (X > 0) {
                        var r = -88 + Math.abs(X);
                        obj.parentNode.style.WebkitTransform = "translateX(" + r + "px)";
                        if(r>0){
                            r=0;
                            obj.parentNode.style.WebkitTransform = "translateX(" + r + "px)";
                        }
                    }
                    else {     //向左滑动
                        obj.parentNode.style.WebkitTransform = "translateX(" + -88 + "px)";
                    }
                }
            });
        }

    })
    window.addEventListener('touchend',function(event){
        var obj = event.target.parentNode;
        if(obj.className == "list-li"){
            objX =(obj.style.WebkitTransform.replace(/translateX\(/g,"").replace(/px\)/g,""))*1;
            if(objX>-40){
                obj.style.WebkitTransform = "translateX(" + 0 + "px)";
            }else{
                obj.style.WebkitTransform = "translateX(" + -88 + "px)";
            }
        }else if(obj.className == "con"){
            objX =(obj.parentNode.style.WebkitTransform.replace(/translateX\(/g,"").replace(/px\)/g,""))*1;
            if(objX>-40){
                obj.parentNode.style.WebkitTransform = "translateX(" + 0 + "px)";
            }else{
                obj.parentNode.style.WebkitTransform = "translateX(" + -88 + "px)";
            }
        }
    })
})

function getMineMessage(){
    $('.mc_left .list-ul li').remove();
    //获取我的消息
    var bodyObj = {
        "type":1,
        "pageNo":1,
        "pageSize":1000
    }
    var signObj = md5(JSON.stringify(bodyObj)).toUpperCase();//对body内容进行md5加密
    var obj = {
        "header": {
            "appType": ua.appType,
            "appNo": ua.appNo,
            "appVersion": ua.appVersion,
            "requestId": randomStr,
            "sign":signObj,
            "token":ua.token
        },
        "body":{
            "type":1,
            "pageNo":1,
            "pageSize":1000
        }
    }
    var aseScret = encrypt(JSON.stringify(obj));//aes加密后
    var endObj = {
        "data":aseScret
    }
    endObj = JSON.stringify(endObj);
    $.ajax({
        type: 'POST',
        contentType: "text/html; charset=UTF-8",
        url: '/api/appUser/queryInnerMail/',
        headers:{AESKEY:'H5AesKey'},
        data: endObj,
        dataType: 'json',
        beforeSend: function () {
            loader.showL();
        },
        success: function (data) {
            var data = JSON.parse(decrypt(data.data));
            if(data.header.rspMsg == '成功'){
                loader.hideL();
                var listData = data.body.list;
                if(listData.length > 0){
                    for(x in listData){
                        $('.mc_left .list-ul').append('<li content="'+listData[x].msgContent+'" time="'+listData[x].createTime+'" title="'+listData[x].msgTitle+'" class="list-li mine_message">\n' +
                            '                    <div class="con">\n' +
                            '                        <div class="ml_title">\n' +
                            '                            <span class="mt_title">'+listData[x].msgTitle+'</span>\n' +
                            '                            <span class="mt_date">'+listData[x].createTime+'</span>\n' +
                            '                        </div>\n' +
                            '                        <p class="ml_content">'+listData[x].msgContent+'</p>\n' +
                            '                    </div>\n' +
                            '                    <div id="'+listData[x].id+'" class="btn">\n' +
                            '                        <div class="btn_content">\n' +
                            '                            <img src="./images/delete- xz@iOS_2x.png" alt="">\n' +
                            '                            <p>删除</p>\n' +
                            '                        </div>\n' +
                            '                    </div>\n' +
                            '                </limsgContent>');
                    }
                    $('.list-ul li').each(function(){
                        $(this).children('.btn').css({'height':$(this).height()+24,'line-height':$(this).height()+24+'px'});
                        if($(this).height()+24 <= 68 ){
                            $(this).children('.btn').children('.btn_content').children('img').css('top','11px');
                        }else{
                            $(this).children('.btn').children('.btn_content').children('img').css('top','19px');
                        }
                    })
                }else{
                    $('.mc_left .none_msg').removeClass('hidden');
                }
            }else{
                showMsg($('.error-msg'), data.header.rspMsg);
                loader.hideL();
            }
        },
        error: function (e) {
            loader.hideL();
        }
    });
}

//获取系统通知消息
function genSystemMessage(){
    $('.mc_right .list-ul li').remove();
    //获取通知列表
    var bodyObj = {
        "type":2,
        "pageNo":1,
        "pageSize":1000
    }
    var signObj = md5(JSON.stringify(bodyObj)).toUpperCase();//对body内容进行md5加密
    var obj = {
        "header": {
            "appType": ua.appType,
            "appNo": ua.appNo,
            "appVersion": ua.appVersion,
            "requestId": randomStr,
            "sign":signObj,
            "token":ua.token
        },
        "body":{
            "type":2,
            "pageNo":1,
            "pageSize":1000
        }
    }
    var aseScret = encrypt(JSON.stringify(obj));//aes加密后
    var endObj = {
        "data":aseScret
    }
    endObj = JSON.stringify(endObj);
    $.ajax({
        type: 'POST',
        contentType: "text/html; charset=UTF-8",
        url: '/api/appUser/queryInnerMail/',
        headers:{AESKEY:'H5AesKey'},
        data: endObj,
        dataType: 'json',
        beforeSend: function () {
            loader.showL();
        },
        success: function (data) {
            var data = JSON.parse(decrypt(data.data));
            if(data.header.rspMsg == '成功'){
                loader.hideL();
                var listData = data.body.list;
                if(listData.length > 0){
                    for(x in listData){
                        $('.mc_right .list-ul').append('<li content="'+listData[x].msgContent+'" time="'+listData[x].effectiveTime+'" title="'+listData[x].msgTitle+'" class="list-li system_message">\n' +
                            '                    <div class="conn">\n' +
                            '                        <div class="ml_title">\n' +
                            '                            <span class="mt_title">'+listData[x].msgTitle+'</span>\n' +
                            '                            <span class="mt_date">'+listData[x].effectiveTime+'</span>\n' +
                            '                        </div>\n' +
                            '                        <p class="ml_content">'+listData[x].msgContent+'</p>\n' +
                            '                    </div>\n' +
                            '                </li>');
                    }
                }else{
                    $('.mc_right .none_msg').removeClass('hidden');
                }
            }else{
                showMsg($('.error-msg'), data.header.rspMsg);
                loader.hideL();
            }
        },
        error: function (e) {
            loader.hideL();
        }
    });
}