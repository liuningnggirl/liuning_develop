var getParam = urlParse();
var localStr = window.location.href;
localStr = localStr.substring(0,localStr.indexOf('kaoqin'));
var ua = navigator.userAgent;
var count = 1;
var hasEnd = false;
$(function(){
    //隐藏客户端标题栏箭头
    var leftIsShow = '{"type": "leftIsShow","data": {"isHide":"1"}}';
    if(ua.indexOf("androidH5App") >= 0){
        window.jsToJava.jsCallbackMethod(leftIsShow);
    };

    //底部导航
    genFooterBar('./images/index_before.png','./images/mine_after.png','mine');

    //遮罩层
    genMenuOver();

    //切换导航-->首页
    $('.footer_bar div.fb_left').live('click',function(){
        genFooterBar('./images/index_before.png','./images/mine_after.png','mine');
        window.location.href = "attendanceIndex.html?employeeid="+getParam.employeeid;
    });

    //设置
    $('.cb_message').click(function(){
        window.location.href = "attendanceSetting.html";
    })

    //获取个人头部信息
    getMineTitleMessageFn();

    //重新加载
    $('.no_content_gate_broke div').click(function(){
        window.location.reload();
    });

    //网络检查
    $('.cb_status_gate_roke').click(function(){
        var jsCallNetWork = '{"type": "requestNetwork","data": {}}';
        if(ua.indexOf("androidH5App") >= 0){
            window.jsToJava.jsCallbackMethod(jsCallNetWork);
        };
    });

    //删除状态
    $('.list-li .btn').live('click',function(){
        var del_obj = {};
        del_obj.employeeid = getParam.employeeid;
        del_obj.cid = $(this).parent().attr('cid');
        del_obj = JSON.stringify(del_obj,'utf-8');
        $.ajax({
            type: 'POST',
            contentType: "text/html; charset=UTF-8",
            url: '/schedule/deleteChecks',
            data: del_obj,
            dataType: 'json',
            beforeSend: function () {
                loader.showL();
            },
            success: function (data) {
                if(data.responseBody == null  && data.retCode == 200){
                    $('.cb_ul').html('');
                    $('.del_success_box').fadeIn().delay(1500).fadeOut();
                    getMineTitleMessageFn();
                    firstLoad();
                }else{
                    errorMessageSlideUpFn(data.responseBody.returnmessage);
                }
            },
            error: function (e) {
                loader.hideL();
            }
        });
    });

    mui.init();
    (function($) {
        $.ready(function() {
            //循环初始化所有下拉刷新，上拉加载。
            $("#pullrefresh").pullToRefresh({
                down: {
                    callback: function() {
                        var self = this;
                        setTimeout(function() {
                            $(".mui-table-view")[0].innerHTML="";
                            firstLoad();
                            self.endPullDownToRefresh();
                        }, 1000);
                    }
                },
                up: {
                    auto: false,
                    offset: 100, //距离底部高度(到达该高度即触发)
                    show: true,
                    contentinit: '上拉显示更多',
                    contentdown: '上拉显示更多',
                    contentrefresh: '正在加载...',
                    contentnomore: '已经加载完全部数据',
                    callback: function() {
                        count++;
                        var self = this;
                        setTimeout(function() {
                            var ul = self.element.querySelector('.mui-table-view');
                            ul.appendChild(createFragment(ul));
                            self.endPullUpToRefresh(hasEnd);
                        }, 1000);
                    }
                }
            })
            var createFragment = function(ul) {
                var obj_mine_li = {};
                obj_mine_li.employeeid = getParam.employeeid;
                obj_mine_li.page = count.toString();
                obj_mine_li = JSON.stringify(obj_mine_li,'utf-8');
                var fragment =document.createDocumentFragment();
                $.ajax({
                    type: 'POST',
                    contentType: "text/html; charset=UTF-8",
                    url: '/schedule/getEmployeesSchedules',
                    data: obj_mine_li,
                    dataType: 'json',
                    async:false,
                    beforeSend: function () {
                        loader.showL();
                    },
                    success: function (data) {
                        if(data.retCode=="200"){
                            if(data.responseBody.statelist.length > 0){
                                li = document.createElement('li');
                                var li;
                                for(var key in data.responseBody.statelist){
                                    li = document.createElement('li');
                                    li.className = 'mui-table-view-cell';
                                    li.innerHTML = getXingChengFn(data.responseBody.statelist[key]);
                                    fragment.appendChild(li);
                                }
                            }else{
                                hasEnd = true;
                            }
                        }else{
                            errorMessageSlideUpFn(data.responseBody.returnmessage);
                        }
                    }
                });
                genLineHeight();
                return fragment;
            };
            firstLoad();
            var li;
        });
    })(mui);
});

function firstLoad() {
    var fragment = document.createDocumentFragment();
    var li;
    var obj_mine_li = {};
    obj_mine_li.employeeid = getParam.employeeid;
    obj_mine_li.page = "1";
    obj_mine_li = JSON.stringify(obj_mine_li,'utf-8');
    $.ajax({
        type: 'POST',
        contentType: "text/html; charset=UTF-8",
        url: '/schedule/getEmployeesSchedules',
        data: obj_mine_li,
        dataType: 'json',
        beforeSend: function () {
            loader.showL();
        },
        success: function (data) {
            if(data.responseBody.statelist.length > 0  && data.retCode == 200){
                $('#pullrefresh').removeClass('hidden');
                li = document.createElement('li');
                var fragment = document.createDocumentFragment();
                var li;
                for(var key in data.responseBody.statelist){
                    li = document.createElement('li');
                    li.className = 'mui-table-view-cell';
                    li.innerHTML = getXingChengFn(data.responseBody.statelist[key]);
                    fragment.appendChild(li);
                }
                $(".mui-table-view")[0].appendChild(fragment);
                genLineHeight();
            }else if(data.responseBody.statelist.length == 0 && count == 1){
                $('.none_message').removeClass('hidden');
                $('#pullrefresh').addClass('hidden');
            }else{
                errorMessageSlideUpFn(data.responseBody.returnmessage);
            }
        }
    });
}

//网络状态
var bbNetwork = new BBNetwork(function(status){
    if("online" != status){
        $('.no_content_gate_broke').removeClass('hidden');
        $('.ta_left img').attr('src','./images/default_img.png');
        $('.tr_day_num,.ta_center,.ta_right').addClass('hidden');
        $('.cb_ul').html('');
    }else{
        $('.no_content_gate_broke').addClass('hidden');
        $('.tr_day_num,.ta_center,.ta_right').removeClass('hidden');
        getMineTitleMessageFn();
    }
}) ;
if(!bbNetwork.isOnline()){
    $('.no_content_gate_broke').removeClass('hidden');
    $('.ta_left img').attr('src','./images/default_img.png');
    $('.tr_day_num,.ta_center,.ta_right').addClass('hidden');
    $('.cb_ul').html('');
}else{
    $('.no_content_gate_broke').addClass('hidden');
    $('.tr_day_num,.ta_center,.ta_right').removeClass('hidden');
    getMineTitleMessageFn();
}


var li_item;
//滑动
window.addEventListener('load',function(){
    var initX;
    var initY;
    var moveX;
    var X = 0;
    var objX = 0;
    window.addEventListener('touchstart',function(event){
        initX = event.targetTouches[0].pageX;
        initY = event.targetTouches[0].pageY;
        var obj = event.target.parentNode;
        if (obj.className == "list-li" || $(obj).closest(".list-li").length>0) {
            if(!$(obj).hasClass("list-li")){
                obj = $(obj).closest(".list-li")[0];
            }
        }else{
            return;
        }
        li_item = $(obj);
        window.addEventListener('touchmove',function(event) {
            moveX = event.targetTouches[0].pageX;
            moveY = event.targetTouches[0].pageY;
            X = moveX - initX;
            Y = moveY - initY;
            var absX = Math.abs(X);
            var absY = Math.abs(Y);
            if(absY>absX){
                return;
            }
            if(X<-110){
                $(".li-translateX").removeClass("li-translateX");
                if($(li_item).attr('delflag') == 1){
                    li_item.addClass("li-translateX");
                }
            }else if(X>40){
                li_item.removeClass("li-translateX");
            }
        });
    })
})

//获取行程
function getXingChengFn(obj){
    var str = '';
    for(var key in obj){
        str +='<div class="cu_content">\n' +
            '            <p class="cc_p_date">'+key+'</p>\n' +
            '            <ul class="list-ul">'+getXingChengTimeFn(obj[key])+'</ul>\n' +
            '        </div>';
    }
    return '<div class="cb_ul">'+str+'</div>'
}


//获取行程时间
function getXingChengTimeFn(obj){
    var str = '';
    for(var x in obj){
        if(parseInt(x)+1 == obj.length){
            str += '<li class="list-li" delflag="'+obj[x].delflag+'" cid="'+obj[x].cid+'">\n' +
                '                    <div class="ul_li_content">\n' +
                '                        <div class="cc_status '+userDetailsStatusColorFn(obj[x].state)+'">'+userStatusFn(obj[x].state)+'</div>\n' +
                '                        <div class="cc_date">'+obj[x].time+'</div>\n' +
                '                        <div class="cc_box">\n' +
                '                        '+isAddressEmptyFn(obj[x].address,obj[x].state) +
                '                        '+isRemarksEmptyFn(obj[x].remarks,obj[x].state)+
                '                    </div>\n' +
                '                    </div>\n' +
                isDelBtnFn(obj[x].delflag)+
                '                </li>'
        }else{
            str += '<li class="list-li" delflag="'+obj[x].delflag+'" cid="'+obj[x].cid+'">\n' +
                '                    <div class="ul_li_content border">\n' +
                '                        <div class="cc_status '+userDetailsStatusColorFn(obj[x].state)+'">'+userStatusFn(obj[x].state)+'</div>\n' +
                '                        <div class="cc_date">'+obj[x].time+'</div>\n' +
                '                        <div class="cc_box">\n' +
                '                        '+isAddressEmptyFn(obj[x].address,obj[x].state) +
                '                        '+isRemarksEmptyFn(obj[x].remarks,obj[x].state)+
                '                    </div>\n' +
                '                    </div>\n' +
                isDelBtnFn(obj[x].delflag)+
                '                </li>'
        }
    }
    return str;
}

//判断是否有删除按钮
function isDelBtnFn(delflag){
    var str = '';
    if(delflag == 1){
        str = '<div class="btn">删除</div>';
    }
    return str;
}

//获取行高
function genLineHeight(){
    $('.list-ul li').each(function(){
        $(this).children('.btn').css('height',$(this).height());
        $(this).children('.btn').css('line-height',$(this).height()+'px');
    });
}

//判断出差信息是否为空
function isRemarksEmptyFn(remarks,state){
    var str = '';
    if(remarks!=null && remarks!='' && remarks!=undefined && (state == 3 || state == 4)){
        str = '<div class="cc_reason"><span>'+remarks+'</span></div>'
    }else if(remarks!=null && remarks!='' && remarks!=undefined){
        str = '<div class="cc_reason"><span></span></div>'
    }else{
        str = '';
    }
    return str;
}

//判断出差地址是否为空
function isAddressEmptyFn(address,state){
    var str = '';
    if(address!=null && address!='' && address!=undefined && (state == 3 || state == 4)){
        str = '<div class="cc_where"><span>'+address+'</span></div>'
    }else if(address!=null && address!='' && address!=undefined){
        str = '<div class="cc_where"><span></span></div>'
    }else{
        str = '';
    }
    return str;
}

//获取头部个人信息
function getMineTitleMessageFn(){
    var obj_mine_msg = {};
    obj_mine_msg.employeeid = getParam.employeeid;
    obj_mine_msg = JSON.stringify(obj_mine_msg,'utf-8');
    //获取头部个人信息
    $.ajax({
        type: 'POST',
        contentType: "text/html; charset=UTF-8",
        url: '/schedule/getEmployeesStates',
        data: obj_mine_msg,
        dataType: 'json',
        beforeSend: function () {
            loader.showL();
        },
        success: function (data) {
            if(data.responseBody.length!=0 && data.responseBody!=null  && data.retCode == 200){
                if(data.responseBody.imageurl == '' || data.responseBody.imageurl == null){
                    $('.ta_left img').attr('src','./images/default_img.png');
                }else{
                    $('.ta_left img').attr('src',localStr+data.responseBody.imageurl);
                }
                $('.ta_center .tc_name').html(data.responseBody.name);
                $('.ta_center .tc_type').html(data.responseBody.job);
                if(data.responseBody.state == null || data.responseBody.state == undefined){
                    $('.ta_right').html('<p class="tr_status"></p>');
                }else{
                    $('.ta_right .tr_status').attr('class','tr_status');
                    $('.ta_right .tr_status').html(userStatusFn(data.responseBody.state)).addClass(userStatusColorFn(data.responseBody.state));
                }
                $('.ta_right .tr_day_num span:eq(1)').html(data.responseBody.outworkday+'天');
            }else{
                errorMessageSlideUpFn(data.responseBody.returnmessage);
            }
        },
        error: function (e) {
            loader.hideL();
        }
    });
}