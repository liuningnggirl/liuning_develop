var getParam = urlParse();
$(function(){
    //获取地址栏参数，判断是否为第一次登陆
    if(getParam.loginNum == 0){//首次登陆
        $('.first_box_shadow').removeClass('hidden');
    };

    //底部导航
    genFooterBar('./images/index_after.png','./images/mine_before.png','index');

    //遮罩层
    //genMenuOver();

    //切换导航-->我的
    $('.footer_bar div.fb_right').live('click',function(){
        genFooterBar('./images/index_before.png','./images/mine_after.png','mine');
        window.location.href = "attendanceMine.html";
    });

    $('.first_box_shadow .fs_center .fs_circle').click(function(){
        $('.first_box_shadow').addClass('hidden');
    });

    //打卡
    // $('.fb_center img').click(function(){
    //    $('.content_box_alert').removeClass('hidden');
    //    $('.content_box').addClass('filter');
    // });

    TouchSlide({slideCell:"#leftTabBox",
        endFun:function(i){ //高度自适应
            var bd = document.getElementById("leftTabBox_db");
            effect:"leftLoop";
            if(i == 0){
                $('.tab_no_shou').hide();
                $('.tab_ok_shou').show();
            }else if(i == 1){
                $('.tab_no_shou').show();
                $('.tab_ok_shou').hide();
            }
            if(i>0)bd.parentNode.style.transition="200ms";//添加动画效果
        }
    });
    $('.con').height($(window).height()-50);

    //查看打卡详情
    $('.con ul li').live('click',function(){
       window.location.href = "attendanceDetails.html";
    });

    //获取全部员工日程列表
    getAllEmployStatus(0,Date.parse(new Date()));

});

//获取全部员工日程列表
function getAllEmployStatus(state,updatedata){
    var obj = {};
    obj.state = state;
    obj.updatedata = updatedata;
    $.ajax({
        type: 'POST',
        contentType: "text/html; charset=UTF-8",
        url: '/schedule/getAllEmployeesState',
        data: obj,
        dataType: 'json',
        beforeSend: function () {
            loader.showL();
        },
        success: function (data) {

        },
        error: function (e) {
            loader.hideL();
        }
    });
}


var bbNetwork = new BBNetwork(function(status){
    var tipMsg = "" ;
    if("online" != status){
        errorMessageFixFn('网络不给力，请检查网络设置');
        $('.login_btn').addClass('login_btn_gray');
    }else{
        $('.login_btn').removeClass('login_btn_gray');
    }
}) ;
if(!bbNetwork.isOnline()){
    errorMessageFixFn('网络不给力，请检查网络设置');
    $('.login_btn').addClass('login_btn_gray');
}else{
    $('.login_btn').removeClass('login_btn_gray');
}
