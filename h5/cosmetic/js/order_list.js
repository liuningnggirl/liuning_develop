
function loadData(reservationType) {
    $('body').data("reservationType", reservationType);


    $.ajax({//采用异步
        type: "get",
        url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/listReservation/1.4.2',
        data: getFinalRequestObject({
            workType: "职业妆",
            dresserCity: "北京",
            accessToken: getAccessToken(),
            page: 0,
            num: 200,
            reservationType: reservationType
        }),
        timeout: 15000,//10s
        dataType: "json",
        success: res,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //console.log( XMLHttpRequest )
            //$(".main").html("尚未发布任何信息！");
        }
    });

    $.ajax({//采用异步
        type: "get",
        url: '<%= CLI_HOST_API_URL %>/nggirl/app//cli/works/getReservationNum/1.0',
        data: getFinalRequestObject({accessToken: getAccessToken()}),
        timeout: 15000,//10s
        dataType: "json",
        success: addResNum,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //console.log( XMLHttpRequest )
            //$(".main").html("尚未发布任何信息！");
        }
    });

}

function res(data) {

     if (data.data.reservations.length == null || data.data.reservations.length == 0 || data.data.reservations== undefined) {
        var reservationType = $('body').data("reservationType");
         $(".content-slide.order_main" + reservationType).html("&nbsp;");
         //$(".swiper-container").html('');
         $(".me_order").show();

     }else{
        $(".me_order").hide();

        var str = '';
        for (var i = 0, j = data.data.reservations; i < j.length; i++) {
            str += getReservationBlock(j[i]);
        }

        var reservationType = $('body').data("reservationType");
        $(".content-slide.order_main" + reservationType).html(str);


        /*页面跳转*/
        $('.order_main').each(function(){
            if($(this).attr('status') == 0){
               
                /*$(this).find('a.d_queren').attr('href',getZhifuBaoLinkUrl($(this).attr('reservationId')));*/
            	$(this).find('a.d_queren').attr('href','orderInformation.html?reservationId='+$(this).attr('reservationId')+'&v=<%= VERSION %>');
            }else if($(this).attr('status') == 1){
               
//                $(this).find('a.btn_t_q1').attr('href',getZhifuBaoLinkUrl($(this).attr('reservationId')));
                $(this).find('a.btn_t_q1').attr('href','orderInformation.html?reservationId='+$(this).attr('reservationId')+'&v=<%= VERSION %>');
            }else if($(this).attr('status') == 2){
               
//                $(this).find('a.btn_t_q2').attr('href',getZhifuBaoLinkUrl($(this).attr('reservationId')));
                $(this).find('a.btn_t_q2').attr('href','orderInformation.html?reservationId='+$(this).attr('reservationId')+'&v=<%= VERSION %>');
            }else if($(this).attr('status') == 3){
               
//                $(this).find('a.btn_t_q3').attr('href',getZhifuBaoLinkUrl($(this).attr('reservationId')));
                $(this).find('a.btn_t_q3').attr('href','orderInformation.html?reservationId='+$(this).attr('reservationId')+'&v=<%= VERSION %>');
            }else if($(this).attr('status') == 4){
            	var redirectUrl;
            	 if(isInWeixin()){
            		 redirectUrl = getWeixinLinkUrl($(this).attr('reservationId'));
                 }else{
                	 redirectUrl =  getZhifuBaoLinkUrl($(this).attr('reservationId'));
                 }
            	$(this).find('a.btn_t_waitpay').attr('href',redirectUrl);
            }else if($(this).attr('status') == 5){
//                $(this).find('a.btn_t_q4').attr('href',getZhifuBaoLinkUrl($(this).attr('reservationId')));
                $(this).find('a.btn_t_q4').attr('href','orderInformation.html?reservationId='+$(this).attr('reservationId')+'&v=<%= VERSION %>');
            }else if($(this).attr('status') == 6){
//                $(this).find('a.btn_t_q5').attr('href',getZhifuBaoLinkUrl($(this).attr('reservationId')));
                $(this).find('a.btn_t_q5').attr('href','orderInformation.html?reservationId='+$(this).attr('reservationId')+'&v=<%= VERSION %>');
            }else if($(this).attr('status') == 7){
//                $(this).find('a.btn_t_q6').attr('href',getZhifuBaoLinkUrl($(this).attr('reservationId')));
                $(this).find('a.btn_t_q6').attr('href','orderInformation.html?reservationId='+$(this).attr('reservationId')+'&v=<%= VERSION %>');
            }else if($(this).attr('status') == 8){
//                $(this).find('a.btn_t_q7').attr('href',getZhifuBaoLinkUrl($(this).attr('reservationId')));
                $(this).find('a.btn_t_q7').attr('href','orderInformation.html?reservationId='+$(this).attr('reservationId')+'&v=<%= VERSION %>');
            }else if($(this).attr('status') == 9){
//                $(this).find('a.btn_t_q8').attr('href',getZhifuBaoLinkUrl($(this).attr('reservationId')));
                $(this).find('a.btn_t_q8').attr('href','orderInformation.html?reservationId='+$(this).attr('reservationId')+'&v=<%= VERSION %>');
                $(this).find('a.btn_t_q10').attr('href','orderInformation.html?reservationId='+$(this).attr('reservationId')+'&v=<%= VERSION %>');
            }else if($(this).attr('status') == 10){
//                $(this).find('a.btn_t_q9').attr('href',getZhifuBaoLinkUrl($(this).attr('reservationId')));
                $(this).find('a.btn_t_q9').attr('href','orderInformation.html?reservationId='+$(this).attr('reservationId')+'&v=<%= VERSION %>');
                $(this).find('a.btn_t_q11').attr('href','orderInformation.html?reservationId='+$(this).attr('reservationId')+'&v=<%= VERSION %>');
            }else if($(this).attr('status') == 11){
//                $(this).find('a.btn_t_q10').attr('href',getZhifuBaoLinkUrl($(this).attr('reservationId')));
                $(this).find('a.btn_t_q12').attr('href','orderInformation.html?reservationId='+$(this).attr('reservationId')+'&v=<%= VERSION %>');
            }else if($(this).attr('status') == 12){
//                $(this).find('a.btn_t_q10').attr('href',getZhifuBaoLinkUrl($(this).attr('reservationId')));
                $(this).find('a.btn_t_q12').attr('href','orderInformation.html?reservationId='+$(this).attr('reservationId')+'&v=<%= VERSION %>');
            }
        });
     }



var parentOrderContent = $('.order_main'+reservationType).parent();
    parentOrderContent.removeClass('hide');
    parentOrderContent.siblings().addClass('hide');

}

function getWeixinLinkUrl(reservationId){
    var redirectUri = encodeURIComponent(getZhifuBaoLinkUrl(reservationId));
    var scope = 'snsapi_base';
    var state = "weixinpay";
    var appid = getFwhAppId();//由param.js初始化
    return "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appid+"&redirect_uri="
        +redirectUri+"&response_type=code&scope="+scope+"&state="+state+"#wechat_redirect";
}

function getZhifuBaoLinkUrl(reservationId){
    var str = "<%= WEIXIN_BOUND_DOMAIN_URL %>/nggirl/h5/cosmetic/orderInformation.html?reservationId="
    + reservationId+'&v=<%= VERSION %>';
    if(window.location.protocol == 'https:'){
        return str;
    }else{
        return 'http:' + str.substring(6)
    }
}

function getReservationBlock(reservation) {
    var str = '';
    if (reservation.status == 0) {
        str += '<div class="order_main" reservationId="'+reservation.reservationId+'" status="' + reservation.status + '"><a href="javascript:void(0);" style="display: inline-block;" class="d_queren aa"><div class="head02"><div class="order_head02_nav nav_active">' + getStatusDesc(reservation.status,reservation.praised) + '</div><div class="center_img"><img src="' + reservation.cover + '">'+ '</div><div class="center_text"><ul><li>预约<b>' + reservation.name + '</b>化妆师的 <b>' + reservation.workType + '</b></li><li class="search_main_ctwo">化妆费用：<span>¥&nbsp;' + reservation.cost + '</span></li><li><i class="text1">' + reservation.reservationTime + '</i></li></ul></div></div></a></div>';

    } else if (reservation.status == 1) {
        /*===订单已取消===*/
        str += '<div class="order_main" reservationId="'+reservation.reservationId+'" status="' + reservation.status + '"><a href="javascript:void(0);" style="display: inline-block;" class="btn_t_q1 aa"><div class="head02"><div class="order_head02_nav nav_active1">' + getStatusDesc(reservation.status,reservation.praised) + '</div><div class="center_img"><img src="' + reservation.cover + '"> ' + '</div><div class="center_text"><ul><li>预约<b>' + reservation.name + '</b>化妆师的 <b>' + reservation.workType + '</b></li><li class="search_main_ctwo">化妆费用：<span>¥&nbsp;' + reservation.cost + '</span></li><li><i class="text1">' + reservation.reservationTime + '</i></li></ul></div></div><div class="order_bottom"><img src="images/order_img03.png"></div></a></div>';

    } else if (reservation.status == 2) {
        /*===订单已取消===*/
        str += '<div class="order_main" reservationId="'+reservation.reservationId+'" status="' + reservation.status + '"><a href="javascript:void(0);" style="display: inline-block;" class="btn_t_q2 aa"><div class="head02"><div class="order_head02_nav nav_active1">' + getStatusDesc(reservation.status,reservation.praised) + '</div><div class="center_img"><img src="' + reservation.cover + '">' + '</div><div class="center_text"><ul><li>预约<b>' + reservation.name + '</b>化妆师的 <b>' + reservation.workType + '</b></li><li class="search_main_ctwo">化妆费用：<span>¥&nbsp;' + reservation.cost + '</span></li><li><i class="text1">' + reservation.reservationTime + '</i></li></ul></div></div><div class="order_bottom"><img src="images/order_img03.png"></div></a></div>';

    } else if (reservation.status == 3) {
        /*===订单已取消===*/
        str += '<div class="order_main" reservationId="'+reservation.reservationId+'" status="' + reservation.status + '"><a href="javascript:void(0);" class="btn_t_q3"><div class="head02 aa"><div class="order_head02_nav nav_active1">' + getStatusDesc(reservation.status,reservation.praised) + '</div><div class="center_img"><img src="' + reservation.cover + '">' + '</div><div class="center_text"><ul><li>预约<b>' + reservation.name + '</b>化妆师的 <b>' + reservation.workType + '</b></li><li class="search_main_ctwo">化妆费用：<span>¥&nbsp;' + reservation.cost + '</span></li><li><i class="text1">' + reservation.reservationTime + '</i></li></ul></div></div><div class="order_bottom"><img src="images/order_img02.png"></div></a></div>';

    } else if (reservation.status == 4) {
        /*====已确认，等待用户支付===*/
        str += '<div class="order_main" reservationId="'+reservation.reservationId+'" status="' + reservation.status + '"><a href="javascript:void(0);" style="display: inline-block;" class="btn_t_waitpay aa"><div class="head02"><div class="order_head02_nav">' + getStatusDesc(reservation.status,reservation.praised) + '</div><div class="center_img"><img src="' + reservation.cover + '"> ' + '</div><div class="center_text"><ul><li>预约<b>' + reservation.name + '</b>化妆师的 <b>' + reservation.workType + '</b></li><li class="search_main_ctwo">化妆费用：<span>¥&nbsp;' + reservation.cost + '</span></li><li><i class="text1">' + reservation.reservationTime + '</i></li></ul></div></div></a></div>';
    } else if (reservation.status == 5) {
        /*====订单已取消===*/
        str += '<div class="order_main"  reservationId="'+reservation.reservationId+'" status="' + reservation.status + '"><a href="javascript:void(0);" style="display: inline-block;" class="btn_t_q4 aa"><div class="head02"><div class="order_head02_nav nav_active1">' + getStatusDesc(reservation.status,reservation.praised) + '</div><div class="center_img"><img src="' + reservation.cover + '">' + '</div><div class="center_text"><ul><li>预约<b>' + reservation.name + '</b>化妆师的 <b>' + reservation.workType + '</b></li><li class="search_main_ctwo">化妆费用：<span>¥&nbsp;' + reservation.cost + '</span></li><li><i class="text1">' + reservation.reservationTime + '</i></li></ul></div></div><div class="order_bottom"><img src="images/order_img03.png"></div></a></div>';

    } else if (reservation.status == 6) {
        /*====用户已支付===*/
        str += '<div class="order_main"  reservationId="'+reservation.reservationId+'" status="' + reservation.status + '"><a href="javascript:void(0);" style="display: inline-block;" class="btn_t_q5 aa"><div class="head02"><div class="order_head02_nav">' + getStatusDesc(reservation.status,reservation.praised) + '</div><div class="center_img"><img src="' + reservation.cover + '">' + '</div><div class="center_text"><ul><li>预约<b>' + reservation.name + '</b>化妆师的 <b>' + reservation.workType + '</b></li><li class="search_main_ctwo">化妆费用：<span>¥&nbsp;' + reservation.cost + '</span></li><li><i class="text1">' + reservation.reservationTime + '</i></li></ul></div></div></a></div>';

    } else if (reservation.status == 7) {
        /*====已到化妆时间===*/
        str += '<div class="order_main"  reservationId="'+reservation.reservationId+'" status="' + reservation.status + '"><a href="javascript:void(0);" style="display: inline-block;" class="btn_t_q6 aa"><div class="head02"><div class="order_head02_nav">' + getStatusDesc(reservation.status,reservation.praised) + '</div><div class="center_img"><img src="' + reservation.cover + '"> ' + '</div><div class="center_text"><ul><li>预约<b>' + reservation.name + '</b>化妆师的 <b>' + reservation.workType + '</b></li><li class="search_main_ctwo">化妆费用：<span>¥&nbsp;' + reservation.cost + '</span></li><li><i class="text1">' + reservation.reservationTime + '</i></li></ul></div></div></div>';

    } else if (reservation.status == 8) {
        /*====化妆时间已过===*/
        str += '<div class="order_main"  reservationId="'+reservation.reservationId+'" status="' + reservation.status + '"><a href="javascript:void(0);" style="display: inline-block;" class="btn_t_q7 aa"><div class="head02"><div class="order_head02_nav">' + getStatusDesc(reservation.status,reservation.praised) + '</div><div class="center_img"><img src="' + reservation.cover + '">' + '</div><div class="center_text"><ul><li>预约<b>' + reservation.name + '</b>化妆师的 <b>' + reservation.workType + '</b></li><li class="search_main_ctwo">化妆费用：<span>¥&nbsp;' + reservation.cost + '</span></li><li><i class="text1">' + reservation.reservationTime + '</i></li></ul></div></div></div>';

    } else if (reservation.status == 9 && reservation.praised == 0) {
        /*===已完成===*/
        str += '<div class="order_main"  reservationId="'+reservation.reservationId+'" status="' + reservation.status + '"><a href="javascript:void(0);" style="display: inline-block;" class="btn_t_q8 aa"><div class="head02"><div class="order_head02_nav">' + getStatusDesc(reservation.status,reservation.praised) + '</div><div class="center_img"><img src="' + reservation.cover + '"> ' + '</div><div class="center_text"><ul><li>预约<b>' + reservation.name + '</b>化妆师的 <b>' + reservation.workType + '</b></li><li class="search_main_ctwo">化妆费用：<span>¥&nbsp;' + reservation.cost + '</span></li><li><i class="text1">' + reservation.reservationTime + '</i></li></ul></div></div><a href="javascript:void(0);" class="btn_t_q7 aa"><a href="javascript:void(0);" style="display: inline-block;" class="btn_t_q8 aa"></div></div>';

    } else if (reservation.status == 10 && reservation.praised == 0) {
        /*====自动结束。美丽行程，圆满结束===*/
        str += '<div class="order_main"  reservationId="'+reservation.reservationId+'" status="' + reservation.status + '"><a href="javascript:void(0);" class="btn_t_q9"><div class="head02"><div class="order_head02_nav">' + getStatusDesc(reservation.status,reservation.praised) + '</div><div class="center_img"><img src="' + reservation.cover + '"> ' + '</div><div class="center_text"><ul><li>预约<b>' + reservation.name + '</b>化妆师的 <b>' + reservation.workType + '</b></li><li class="search_main_ctwo">化妆费用：<span>¥&nbsp;' + reservation.cost + '</span></li><li><a class="text1">' + reservation.reservationTime + '</i></li></ul></div></div></div>';
    } else if (reservation.status == 9 && reservation.praised == 1) {
        /*===已完成===*/
        str += '<div class="order_main"  reservationId="'+reservation.reservationId+'" status="' + reservation.status + '"><a href="javascript:void(0);" style="display: inline-block;" class="btn_t_q10 aa"><div class="head02"><div class="order_head02_nav">' + getStatusDesc(reservation.status,reservation.praised) + '</div><div class="center_img"><img src="' + reservation.cover + '"> ' + '</div><div class="center_text"><ul><li>预约<b>' + reservation.name + '</b>化妆师的 <b>' + reservation.workType + '</b></li><li class="search_main_ctwo">化妆费用：<span>¥&nbsp;' + reservation.cost + '</span></li><li><i class="text1">' + reservation.reservationTime + '</i></li></ul></div></div><div class="order_bottom"><img src="images/order_img01.png"></div></div>';

    } else if (reservation.status == 10 && reservation.praised == 1) {
        /*====自动结束。美丽行程，圆满结束===*/
        str += '<div class="order_main"  reservationId="'+reservation.reservationId+'" status="' + reservation.status + '"><a href="javascript:void(0);" class="btn_t_q11"><div class="head02"><div class="order_head02_nav">' + getStatusDesc(reservation.status,reservation.praised) + '</div><div class="center_img"><img src="' + reservation.cover + '"> ' + '</div><div class="center_text"><ul><li>预约<b>' + reservation.name + '</b>化妆师的 <b>' + reservation.workType + '</b></li><li class="search_main_ctwo">化妆费用：<span>¥&nbsp;' + reservation.cost + '</span></li><li><a class="text1">' + reservation.reservationTime + '</i><div class="order_bottom"><img src="images/order_img01.png"></div></li></ul></div></div></div>';
    }else if (reservation.status == 11) {
        /*====退款中===*/
        str += '<div class="order_main"  reservationId="'+reservation.reservationId+'" status="' + reservation.status + '"><a href="javascript:void(0);" style="display: inline-block;" class="btn_t_q12 aa"><div class="head02"><div class="order_head02_nav nav_active1">' + getStatusDesc(reservation.status,reservation.praised) + '</div><div class="center_img"><img src="' + reservation.cover + '"> ' + '</div><div class="center_text"><ul><li>预约<b>' + reservation.name + '</b>化妆师的 <b>' + reservation.workType + '</b></li><li class="search_main_ctwo">化妆费用：<span>¥&nbsp;' + reservation.cost + '</span></li><li><i class="text1">' + reservation.reservationTime + '</i></li></ul></div></div></a></div>';
    }else if (reservation.status == 12) {
        /*====退款完成===*/
        str += '<div class="order_main"  reservationId="'+reservation.reservationId+'" status="' + reservation.status + '"><a href="javascript:void(0);" style="display: inline-block;" class="btn_t_q12 aa"><div class="head02"><div class="order_head02_nav nav_active1">' + getStatusDesc(reservation.status,reservation.praised) + '</div><div class="center_img"><img src="' + reservation.cover + '"> ' + '</div><div class="center_text"><ul><li>预约<b>' + reservation.name + '</b>化妆师的 <b>' + reservation.workType + '</b></li><li class="search_main_ctwo">化妆费用：<span>¥&nbsp;' + reservation.cost + '</span></li><li><i class="text1">' + reservation.reservationTime + '</i></li></ul></div></div><div class="order_bottom"><img src="images/order_img03.png"></div></a></div>';
    }
    return str;
}

function getStatusDesc(status,praised){
	var desc = '';
	if(status == 0){
		desc = '化妆师确认中，请小主耐心等待';
	}else if(status == 1 || status == 5){
		desc = '小主已取消订单，不再看看了么？';
	}else if(status == 2 || status == 3){
		desc = '化妆师未能接单，请小主重新挑选';
	}else if(status == 4){
		desc = '化妆师已接单，请小主付费打赏';	
	}else if(status == 6){
		desc = '谢小主的赏金，请等待化妆师上门';	
	}else if(status == 7){
		desc = '请小主安心享用美丽服务';	
	}else if(status == 8){
		desc = '服务结束，请小主确认完成';	
	}else if(status == 9){
		if(praised == 0)
		desc = '请美丽的小主为本次服务点评';
		else
		desc = '谢小主评价，期待与小主再次相遇';
	}else if(status == 10){
		if(praised == 0)
		desc = '请美丽的小主为本次服务点评';
		else
		desc = '谢小主评价，期待与小主再次相遇';
	}else if(status == 11){
		desc = '退款中，请小主耐心等待';	
	}else if(status == 12){
		desc = '退款成功，南瓜姑娘会不断努力';	
	}
	
	return desc;
}

//设置订单提示数量
function addResNum(data) {
    $('.tabs a').children('b').remove();
    if (data.data.reservationNum.running > 0) {
        $('.tabs a').eq(0).append('<b>' + data.data.reservationNum.running + '</b>');
    }
    if (data.data.reservationNum.notEvaluated > 0) {
        $('.tabs a').eq(1).append('<b>' + data.data.reservationNum.notEvaluated + '</b>');
    }
}


$(function () {

     var contn1 = $(".content-slide.order_main1");
     var contn2 = $(".content-slide.order_main2");
     var contn3 = $(".content-slide.order_main3");
     var order = getParam('order');
     
    $(".content-slide.order_main1").html("<div style='width:100%;height:100%;'></div>");
    $(".content-slide.order_main2").html("<div style='width:100%;height:100%;'></div>");
    $(".content-slide.order_main3").html("<div style='width:100%;height:100%;'></div>");
   

    
    $(".tabs a").on('mousedown', function (e) {
        e.preventDefault()
        $(".tabs .active").removeClass('active');
        $(this).addClass('active');
        var restype = $(this).attr('restype');
        loadData(restype);
    });

    /*===order.html切换结束====*/
  //判断传过来的值是3那么就跳转到已完成tab
    if(order == 3){
    	$('.tabs a:eq(2)').mousedown();
    }else{
    	$(".tabs a:eq(0)").mousedown();
    }
    


})