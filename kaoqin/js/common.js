$(function(){
    //打卡正常
    $('.sign-normal').live('touchstart',function(){
        $(this).unbind('touchstart');
        $('.sign-normal img').attr('src','./images/ic_nav_normal_setting@2x.png');
        $('.sign-normal').css({'color':'#999'});
    });
    $('.sign-normal').live('touchend',function(){
        $(this).bind('touchstart');
        $('.sign-normal img').attr('src','./images/ic_nav_normal_setting_hl@2x.png');
        $('.sign-normal').css({'color':'#333'});
        signFn("1");
    });
    //打卡休假
    $('.sign-holiday').live('touchstart',function(){
        $('.sign-holiday img').attr('src','./images/ic_nav_xiujia_setting@2x.png');
        $('.sign-holiday').css({'color':'#999'});
    });
    $('.sign-holiday').live('touchend',function(){
        $('.sign-holiday img').attr('src','./images/ic_nav_xiujia_setting_hl@2x.png');
        $('.sign-holiday').css({'color':'#333'});
        signFn("2");
    });
    //打卡外出
    $('.sign-out').live('touchstart',function(){
        $('.sign-out img').attr('src','./images/ic_nav_out_setting@2x.png');
        $('.sign-out').css({'color':'#999'});
    });
    $('.sign-out').live('touchend',function(){
        $('.sign-out img').attr('src','./images/ic_nav_out_setting_hl@2x.png');
        $('.sign-out').css({'color':'#333'});
        //signFn("3");
        window.location.href = "attendanceLeave.html?employeeid="+getParam.employeeid;
    });
    //打卡其他
    $('.sign-another').live('touchstart',function(){
        $('.sign-another img').attr('src','./images/ic_nav_orther_setting@2x.png');
        $('.sign-another').css({'color':'#999'});
    });
    $('.sign-another').live('touchend',function(){
        $('.sign-another img').attr('src','./images/ic_nav_orther_setting_hl@2x.png');
        $('.sign-another').css({'color':'#333'});
        signFn("99");
    });
    //打卡出差
    $('.sign-chuchai').live('touchstart',function(){
        $('.sign-chuchai img').attr('src','./images/ic_nav_chuchai_setting@2x.png');
        $('.sign-chuchai').css({'color':'#999'});
    });
    $('.sign-chuchai').live('touchend',function(){
        $('.sign-chuchai img').attr('src','./images/ic_nav_chuchai_setting_hl@2x.png');
        $('.sign-chuchai').css({'color':'#333'});
        //signFn("4");
        window.location.href = "attendanceChai.html?employeeid="+getParam.employeeid;
    });

    //关闭
    $('.sign-close').live('click',function(){
        $('.sign-box').addClass('hidden');
    });

    //签到
    $('.fb_center img').click(function(){
        $('.sign-box').removeClass('hidden');
        $('.sign-states ul li').addClass('animated fadeInUp');
        $('.sign-states .sign-normal,.sign-footer .sign-close').addClass('animated fadeInUp');
    });
});

//签到
function signFn(state){
    var obj_qian = {};
    obj_qian.state = state;
    obj_qian.employeeid = getParam.employeeid;
    if($('.ct_content .cb_right').html() != null){
        if($.trim($('.ct_content .cb_right').html()) == ''){
            xiongAlertFn('出差地区不能为空！');
        }else{
            obj_qian.address = $('.ct_content .cb_right').html();
            obj_qian.remarks = $('.cb_bottom textarea').val();
            signAjaxFn(obj_qian);
        }
    }else if($('.cb_bottom textarea').val() != undefined){
        if($.trim($('.cb_bottom textarea').val()) == ''){
            xiongAlertFn('外出事由不能为空！');
        }else{
            obj_qian.remarks = $('.cb_bottom textarea').val();
            signAjaxFn(obj_qian);
        }
    }else{
        signAjaxFn(obj_qian);
    }
}

function signAjaxFn(obj_qian){
    obj_qian = JSON.stringify(obj_qian,'utf-8');
    $.ajax({
        type: 'POST',
        contentType: "text/html; charset=UTF-8",
        url: '/schedule/insertEmployeeStates',
        data: obj_qian,
        dataType: 'json',
        beforeSend: function () {
            loader.showL();
        },
        success: function (data) {
            if(data.responseBody.success  && data.retCode == 200){
                // if(state == 4 || state == 3){
                //     window.location.href = "attendanceIndex.html?employeeid="+getParam.employeeid+'&loginNum='+getParam.loginNum;
                // }else{
                //     window.location.reload();
                // }
                window.location.href = "attendanceIndex.html?employeeid="+getParam.employeeid;
            }else{
                errorMessageSlideUpFn(data.responseBody.returnmessage);
            }
        },
        error: function (e) {
            loader.hideL();
        }
    });
}

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
    $('.sign-box').html('<div class="sign-states">\n' +
        '    <div class="sign-normal">\n' +
        '        <img src="images/ic_nav_normal_setting_hl@2x.png"/>正常\n' +
        '	 </div>'+
        '    <ul class="sign-four">\n' +
        '        <li class="sign-holiday">\n' +
        '			<img src="images/ic_nav_xiujia_setting_hl@2x.png"/>休假\n' +
        '		 </li>\n' +
        '        <li class="sign-out">\n' +
        '			<img src="images/ic_nav_out_setting_hl@2x.png"/>外出\n' +
        '		 </li>\n' +
        '    </ul>\n' +
        '    <ul class="sign-four">\n' +
        '        <li class="sign-another">\n' +
        '			<img src="images/ic_nav_orther_setting_hl@2x.png"/>其他\n' +
        '		 </li>\n' +
        '        <li class="sign-chuchai">\n' +
        '			<img src="images/ic_nav_chuchai_setting_hl@2x.png"/>出差\n' +
        '		 </li>\n' +
        '    </ul>\n' +
        '    <div class="sign-footer">\n'+
        '		<img src="images/close.png" class="sign-close"/>\n'+
        '	 </div>');
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

//用户状态 用户状态：0（默认） 全部，1 正常，2 休假，3 外出，4 出差，99 其他
function userStatusFn(status){
    var str = '';
    if(status == 1){
        str = '正常';
    }else if(status == 2){
        str = '休假';
    }else if(status == 3){
        str = '外出';
    }else if(status == 4){
        str = '出差';
    }else if(status == null || status == undefined || status == ''){
        str = '';
    }else if(status == null || status == undefined || status == ''){
        str = '';
    }else{
        str = '其他';
    }
    return str;
}

//用户状态颜色 用户状态：0（默认） 全部，1 正常，2 休假，3 外出，4 出差，99 其他
function userStatusColorFn(status){
    var str = '';
    if(status == 1){
        str = 'normal';
    }else if(status == 2){
        str = 'leave';
    }else if(status == 3){
        str = 'goout';
    }else if(status == 4){
        str = 'chai';
    }else if(status == null || status == undefined || status == ''){
        str = '';
    }else{
        str = 'another';
    }
    return str;
}

//用户详情状态颜色 用户状态：0（默认） 全部，1 正常，2 休假，3 外出，4 出差，99 其他
function userDetailsStatusColorFn(status){
    var str = '';
    if(status == 1){
        str = 'normal_date';
    }else if(status == 2){
        str = 'leave_date';
    }else if(status == 3){
        str = 'goout_date';
    }else if(status == 4){
        str = 'chai_date';
    }else{
        str = 'another_date';
    }
    return str;
}

//小熊弹框
function xiongAlertFn(msg){
    if($('.chai_box').is(":hidden")){
        $('.chai_box').html('<img src="./images/img_toast_2@2x.png" alt="">\n' +
            '    <p class="cb_msg">'+msg+'</p>');
        $('.chai_box').stop().fadeIn().delay(800).fadeOut();
    }
}

$("img").bind("error",function(){
    this.src="./images/default_img.png";
})
