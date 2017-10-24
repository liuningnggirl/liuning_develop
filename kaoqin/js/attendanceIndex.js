var getParam = urlParse();
var ua = navigator.userAgent;
var localStr = window.location.href;
var ua = navigator.userAgent;
localStr = localStr.substring(0,localStr.indexOf('kaoqin'));
var imgStr = './images/default_img.png';
$(function(){
    //隐藏客户端标题栏箭头
    var leftIsShow = '{"type": "leftIsShow","data": {"isHide":"1"}}';
    if(ua.indexOf("androidH5App") >= 0){
        window.jsToJava.jsCallbackMethod(leftIsShow);
    };

    //获取地址栏参数，判断是否为第一次登陆
    if(localStorage.getItem('localStorageLoginNum') == 0){//首次登陆
        $('.first_box_shadow').removeClass('hidden');
    }else if(localStorage.getItem('localStorageLoginNum') == undefined){
        localStorage.setItem('localStorageLoginNum',"1");
    };

    //底部导航
    genFooterBar('./images/index_after.png','./images/mine_before.png','index');

    //遮罩层
    genMenuOver();

    //切换导航-->我的
    $('.footer_bar div.fb_right').live('click',function(){
        genFooterBar('./images/index_before.png','./images/mine_after.png','mine');
        window.location.href = "attendanceMine.html?employeeid="+getParam.employeeid;
    });

    //关闭首次登录弹窗
    $('.first_box_shadow').click(function(){
        $('.first_box_shadow').addClass('hidden');
        localStorage.setItem('localStorageLoginNum',"1");
    });

    //获取系统时间
    getSystemTimeFn();

    TouchSlide({slideCell:"#leftTabBox",
        endFun:function(i){ //高度自适应
            var bd = document.getElementById("leftTabBox_db");
            effect:"leftLoop";
            if(i == 0){
                getAllEmployStatus(0,new Date().toString(),$('.tab_all'));//全部
                $('.tab_all').parent().addClass('ons').siblings().removeClass('ons');
                window.scrollTo(0,0);
            }else if(i == 1){
                getAllEmployStatus(1,new Date().toString(),$('.tab_normal'));//正常
                $('.tab_normal').parent().addClass('ons').siblings().removeClass('ons');
                window.scrollTo(0,0);
            }else if(i == 2){
                getAllEmployStatus(2,new Date().toString(),$('.tab_leave'));//休假
                $('.tab_leave').parent().addClass('ons').siblings().removeClass('ons');
                window.scrollTo(0,0);
            }else if(i == 3){
                getAllEmployStatus(3,new Date().toString(),$('.tab_goout'));//外出
                $('.tab_goout').parent().addClass('ons').siblings().removeClass('ons');
                window.scrollTo(0,0);
            }else if(i == 4){
                getAllEmployStatus(4,new Date().toString(),$('.tab_chai'));//出差
                $('.tab_chai').parent().addClass('ons').siblings().removeClass('ons');
                window.scrollTo(0,0);
            }else{
                getAllEmployStatus(99,new Date().toString(),$('.tab_another'));//其他
                $('.tab_another').parent().addClass('ons').siblings().removeClass('ons');
                window.scrollTo(0,0);
            }
            if(i>0)bd.parentNode.style.transition="200ms";//添加动画效果
        }
    });
    $('.con ul').height($(window).height()-100);

    //查看打卡详情
    $('.con ul li').live('click',function(){
       window.location.href = "attendanceDetails.html?employeeid="+$(this).attr('employeeid');
    });

    //重新加载
    $('.no_content_gate_broke div').click(function(){
       window.location.reload();
    });

    //网络检查_跳转到客户端设置
    $('.cb_status_gate_roke').click(function(){
        var jsCallNetWork = '{"type": "requestNetwork","data": {}}';
        if(ua.indexOf("androidH5App") >= 0){
            window.jsToJava.jsCallbackMethod(jsCallNetWork);
        };
    });
    // getAllEmployStatus(0,new Date().toString(),$('.tab_all'));//全部

    mui.init();
    (function($) {
        $.ready(function() {
            //循环初始化所有下拉刷新，上拉加载。
            $("#pullrefresh").pullToRefresh({
                down: {
                    callback: function() {
                        var self = this;
                        setTimeout(function() {
                            self.endPullDownToRefresh();
                            $('#leftTabBox_db>div').each(function(e){
                                if($(this)[0].className.indexOf('ons') >= 0){
                                    if($(this)[0].children[2].className == 'tab_all'){
                                        getAllEmployStatus(0,Date.parse(new Date()),$('.tab_all'));//全部
                                        return false;
                                    }else if($(this)[0].children[2].className == 'tab_normal'){
                                        getAllEmployStatus(1,Date.parse(new Date()),$('.tab_normal'));
                                        return false;
                                    }else if($(this)[0].children[2].className == 'tab_leave'){
                                        getAllEmployStatus(2,Date.parse(new Date()),$('.tab_leave'));
                                        return false;
                                    }else if($(this)[0].children[2].className == 'tab_goout'){
                                        getAllEmployStatus(3,Date.parse(new Date()),$('.tab_goout'));
                                        return false;
                                    }else if($(this)[0].children[2].className == 'tab_chai'){
                                        getAllEmployStatus(4,Date.parse(new Date()),$('.tab_chai'));
                                        return false;
                                    }else if($(this)[0].children[2].className == 'tab_another'){
                                        getAllEmployStatus(99,Date.parse(new Date()),$('.tab_another'));
                                        return false;
                                    }
                                    window.scrollTo(0,0);
                                }
                            });
                        }, 1000);
                    }
                }
            })
        });
    })(mui);
});

//图片路径错误给一张默认图片
function imgError(el) {
    el.src=imgStr;
}
//获取全部员工日程列表
function getAllEmployStatus(state,updatedata,con){
    var objStr = '{"state":'+ '"'+state+'",'+'"updatedata":'+ '"'+updatedata+'"}';
    $.ajax({
        type: 'POST',
        contentType: "text/html; charset=UTF-8",
        url: '/schedule/getAllEmployeesStates',
        data: objStr,
        dataType: 'json',
        beforeSend: function () {
            loader.showL();
        },
        success: function (data) {
            var endData = data.responseBody.result;
            $(con).children('li').remove();
            if(endData.length > 0 && data.retCode == '200'){
                for(x in endData){
                    //员工是否置顶标识  0：不置顶，1：置顶，2：显示在列表最上方
                    if(endData[x].stick == 1 || endData[x].stick == 2){
                        $(con).attr('refreshNum',endData.length).append('<li employeeid="'+endData[x].employeeid+'">\n' +
                            '                        <div class="ta_left">\n' +
                            '                            <img src="'+giveDefaultImgFn(endData[x].imageurl)+'" alt="" onerror="imgError(this)">\n' +
                            '                        </div>\n' +
                            '                        <div class="ta_center">\n' +
                            '                            <p class="tc_name">'+endData[x].name+'</p>\n' +
                            '                            <p class="tc_type">'+endData[x].job+'</p>\n' +
                            '                        </div>\n' +
                            '                        <div class="ta_right">\n' +
                            '                            <p class="tr_day_num">\n' +
                            '                                <span>当月出勤</span>\n' +
                            '                                <span>'+endData[x].outworkday+'天</span>\n' +
                            '                            </p>\n' +
                            '                            <p class="tr_status '+userStatusColorFn(endData[x].state)+'">'+userStatusFn(endData[x].state)+'</p>\n' +
                            '                        </div>\n' +
                            '                        <img src="./images/core.png" alt="" class="ta_core">\n' +
                            '                    </li>');
                    }else{
                        $(con).attr('refreshNum',endData.length).append('<li employeeid="'+endData[x].employeeid+'">\n' +
                            '                        <div class="ta_left">\n' +
                            '                            <img src="'+giveDefaultImgFn(endData[x].imageurl)+'" alt="" onerror="imgError(this)">\n' +
                            '                        </div>\n' +
                            '                        <div class="ta_center">\n' +
                            '                            <p class="tc_name">'+endData[x].name+'</p>\n' +
                            '                            <p class="tc_type">'+endData[x].job+'</p>\n' +
                            '                        </div>\n' +
                            '                        <div class="ta_right">\n' +
                            '                            <p class="tr_day_num">\n' +
                            '                                <span>当月出勤</span>\n' +
                            '                                <span>'+endData[x].outworkday+'天</span>\n' +
                            '                            </p>\n' +
                            '                            <p class="tr_status '+userStatusColorFn(endData[x].state)+'">'+userStatusFn(endData[x].state)+'</p>\n' +
                            '                        </div>\n' +
                            '                    </li>');
                    }
                }
                return;
            }if(endData.length > 0 && data.retCode == '200'  && state!= 0){
                for(x in endData){
                    $(con).attr('refreshNum',endData.length).append('<li employeeid="'+endData[x].employeeid+'">\n' +
                        '                        <div class="ta_left">\n' +
                        '                            <img src="'+giveDefaultImgFn(endData[x].imageurl)+'" alt="" onerror="imgError(this)">\n' +
                        '                        </div>\n' +
                        '                        <div class="ta_center">\n' +
                        '                            <p class="tc_name">'+endData[x].name+'</p>\n' +
                        '                            <p class="tc_type">'+endData[x].job+'</p>\n' +
                        '                        </div>\n' +
                        '                        <div class="ta_right">\n' +
                        '                            <p class="tr_day_num">\n' +
                        '                                <span>当月出勤</span>\n' +
                        '                                <span>'+endData[x].outworkday+'天</span>\n' +
                        '                            </p>\n' +
                        '                            <p class="tr_status '+userStatusColorFn(endData[x].state)+'">'+userStatusFn(endData[x].state)+'</p>\n' +
                        '                        </div>\n' +
                        '                    </li>');
                }
            }else if(endData.length == 0 && data.retCode == '200'){
                con.addClass('hidden').prev().prev().removeClass('hidden');
            }else{
                alert(data.responseBody.returnmessage);
            }
        },
        error: function (e) {
            loader.hideL();
        }
    });
}

//网络状态
var bbNetwork = new BBNetwork(function(status){
    if("online" != status){
        $('.cb_status_gate_roke,.no_content_gate_broke').removeClass('hidden');
        $('.no_content').addClass('hidden');
        $('.con u l li').remove();
    }else{
        $('.cb_status_gate_roke,.no_content_gate_broke').addClass('hidden');
        getAllEmployStatus(0,new Date().toString(),$('.tab_all'));//全部
    }
}) ;
if(!bbNetwork.isOnline()){
    $('.cb_status_gate_roke,.no_content_gate_broke').removeClass('hidden');
    $('.no_content').addClass('hidden');
    $('.con ul li').remove();
}
// else{
//     $('.cb_status_gate_roke,.no_content_gate_broke').addClass('hidden');
//     getAllEmployStatus(0,new Date().toString(),$('.tab_all'));//全部
// }

//判断是否有图片，乜有则给一张默认图片
function giveDefaultImgFn(img){
    var str = '';
    if(img == ''){
        str = "./images/default_img.png";
    }else{
        str = localStr+img;
    }
    return str;
}

//1.1.9获取系统时间
function getSystemTimeFn(){
    var obj_sys_time = {};
    obj_sys_time = JSON.stringify(obj_sys_time,'utf-8');
    $.ajax({
        type: 'POST',
        contentType: "text/html; charset=UTF-8",
        url: '/schedule/selectSysDates',
        data: obj_sys_time,
        dataType: 'json',
        success: function (data) {
            if(data.responseBody!=null  && data.retCode == 200){
                //回调客户端方法  type=loginCallBack  isLogin=true  登录成功
                var endDate = data.responseBody;
                endDate = '今日'+endDate.substring(endDate.indexOf('年')+1,endDate.indexOf('日')+1)
                var getDate = '{"type": "getDate","data": {"time":"'+endDate +'"}}';
                if(ua.indexOf("androidH5App") >= 0){
                    window.jsToJava.jsCallbackMethod(getDate);
                };
            }else{
                errorMessageSlideUpFn(data.errorDesc);
            }
        }
    });
}
