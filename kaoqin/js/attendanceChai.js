var getParam = urlParse();
var ua = navigator.userAgent;

$(function(){
    //显示客户端标题栏箭头
    var leftIsShow = '{"type": "leftIsShow","data": {"isHide":"0"}}';
    if(ua.indexOf("androidH5App") >= 0){
        window.jsToJava.jsCallbackMethod(leftIsShow);
    };

    $.get('./json/LocList.json',function(data){
        for(var x in data){
            $('body').data('dataMessage', data);
            $('.selectBox .province').append('<p>'+data[x].name+'</p>');
        }
    });

    //选择省
    $('.selectBox .province p').live('click',function(){
        var data = $('body').data('dataMessage');
        var this_= $(this);
        for(x in data){
            if(this_.html() == data[x].name){
                getCity(data[x].children);
            }
        }
        $('.selector p .pro').html(this_.html()).removeClass('wait wait1').next().addClass('wait wait1').removeClass('hidden').attr('province',this_.attr('province'));
        $(this).addClass('selt').siblings().removeClass('selt');
        $('.selectBox .province').hide();
        $('.box .selectBox .cityBox').animate({scrollTop:0},1000);
        $('.selectBox .cityBox').show();
    });

    //更改省
    $('.selector p .pro').click(function(){
        $('.selector p .city,.selector p .area').html('请选择').removeClass('selt');
        $(this).addClass('wait1 wait').siblings().removeClass('wait1 wait');
        $('.selectBox .province').show();
        $('.selectBox .cityBox,.selectBox .areaBox').hide();
    });

    //更改市
    $('.selector p .city').click(function(){
        $('.selectBox .areaBox,.selectBox .province').hide();
        $('.selectBox .cityBox').show();
        $('.selector p .area').html('请选择').removeClass('selt');
        $(this).addClass('wait1 wait').siblings().removeClass('wait1 wait');
    });

    //选择市
    $('.selectBox .cityBox p').live('click',function() {
        $('.selectBox .areaBox').html('');
        $(this).addClass('selt').siblings().removeClass('selt');
        $('.selector p .city').html($(this).html()).removeClass('wait wait1').next().addClass('wait wait1').removeClass('hidden').attr('city',$(this).attr('city')).attr('country',$(this).attr('country'));
        $('.ct_content .cb_right').html($('.selector p .pro').html()+' '+$('.selector p .city').html());
        $('.box, .shadow').addClass('hidden');
    });

    //更改市
    $('.selector p .city').click(function(){
        $('.selectBox .areaBox,.selectBox .province').hide();
        $('.selectBox .cityBox').show();
        $('.selector p .area').html('请选择').removeClass('selt');
        $(this).addClass('wait1 wait').siblings().removeClass('wait1 wait');
    });


    //请选择省市
    $('.tc_content .select_provice').click(function(){
        $('.main .box,.main .shadow').removeClass('hidden');
    });

    //请选择登录类型
    $('.tc_content .select_type').click(function(){
        if($('.select_provice p').html() == '请选择省市' ){
            showMsg($('.error-msg'), '请先选择省市!!');
        }else{
            $('.box_content .nav_tabs,.main .shadow_login_type').removeClass('hidden');
        }
    });

    //选取省市
    $('.cityTit .sure').click(function(){
        var pro = $('.selector p .pro').html();
        var city = $('.selector p .city').html();
        if(pro != '请选择' && city != '请选择' && area != '请选择'){
            $('.ct_content .cb_right').html(pro +' '+ city );
            $('.box,.shadow').removeClass('hidden');
        };
        $(".tab_content li .tc_content div:gt(1)").remove();
        $('.select_type').html('请选择登录类型');
    });

    //点击取消
    $('.cityTit .close_btn').click(function(){
        $('.box,.shadow').addClass('hidden');
    });

    //外出地区
    $('.content_box .cb_top').click(function(){
        $('.box,.shadow').removeClass('hidden');
    });

    //出差打卡
    $('.submit_btn').click(function(){
        //$('.submit_btn').unbind('click');
        signFn("4");
    });

    //限制最大输入字符
    $('.cb_bottom textarea').on('input',function(){
        if($('.chai_box').is(':hidden') && $.trim($('.cb_bottom textarea').val()).length >= 14){
            $('.chai_box').stop().fadeIn().delay(800).fadeOut();
        }
    })
});

//获取市
function getCity(sub){
    var str = '';
    $('.selectBox .cityBox').html('');
    for(x in sub){
        str += $('.selectBox .cityBox').append('<p city='+sub[x].code+' country='+sub[x].fullcode+'>'+sub[x].name+'</p>');
    }
    return str;
}
