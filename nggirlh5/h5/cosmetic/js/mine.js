$(function(){
	//获取上门美妆和美妆沙龙订单数
	$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/salon/reservation/getSumResNum/1.3',getFinalRequestObject({accessToken: getAccessToken()}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			//如果条目数为0
			if(data.data.teachNum == 0){
				$('.zhuang_num').hide();
			}
			if(data.data.salonNum == 0){
				$('.salon_num').hide();
			}
			
			//判断如果条目数大于99
			if(data.data.teachNum > 99){
				$('.zhuang_num').html(data.data.teachNum +'+');
				$('.zhuang_num').width($('.zhuang_num').height());
			}else{
				$('.zhuang_num').html(data.data.teachNum);
				$('.zhuang_num').width($('.zhuang_num').height());
			}
			if(data.data.salonNum > 99){
				$('.salon_num').html(data.data.salonNum +'+');
				$('.salon_num').width($('.salon_num').height());
			}else{
				$('.salon_num').html(data.data.salonNum);
				$('.salon_num').width($('.salon_num').height());
			}
		};
		if(data.code == 1){
			localStorage.redirectUrlAfterLogin = "mine.html?v=<%= VERSION %>";
			window.location.href = "login_new.html?v=<%= VERSION %>";
		};
	});
	$(".workdetail").live("click",function(){
		window.location.href="home_page.html?v=<%= VERSION %>";
	});
	$(".beautylist").live("click",function(){
		window.location.href="beautylist.html?v=<%= VERSION %>";
	});
	//获取个人信息
    $.ajax({
        url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/personalInfo/getUserInfo/2.5.2',
        type: 'get',
        data: getFinalRequestObject({accessToken: getAccessToken()}),
        dataType: 'json',
        success: function (data) {
            if (data.code == 0) {
				if (data.data.sex == 0) {
					$('.mt_sex').attr('src', 'images/mine-boy_03.png');
				}
				if (data.data.sex == 1) {
					$('.mt_sex').attr('src', 'images/mine-girl_03.png');
				}
				$('.mt_lv').html('LV'+data.data.userLevel);
				$('.mb_jyz_num').html('经验值：'+data.data.userValue);
				$('.mb_jyz_score').html('积分：'+data.data.score);
                $('.score').html(data.data.score);
				$('.mt_name').html(data.data.nickName);
				$('.mine').attr('id',data.data.userId);
				if(data.data.profile == ''){
					$('.mine_icon img').attr('src','images/default-title-img.png');
				}else{
					$('.mine_icon img').attr('src',data.data.profile);
				}
            }else{
            	localStorage.redirectUrlAfterLogin = "mine.html?v=<%= VERSION %>";
                window.location.href = "login_new.html?v=<%= VERSION %>";
            }
        }
    });
	
	//点击关注
	$('.mine_kinds .mk_attention').click(function(e) {
        checkAccessTokenLogin(function () {
            window.location.href = "mineAttention.html?v=<%= VERSION %>";
        },'mine.html?v=<%= VERSION %>');
    });
	
	//点击收藏
	$('.mine_kinds .mk_collect').click(function(e) {
        checkAccessTokenLogin(function () {
            window.location.href = "mine-collect.html?v=<%= VERSION %>";
        },'mine.html?v=<%= VERSION %>');
    });
	
	//点击南瓜
	$('.mine_kinds .mk_voucher').click(function(e) {
        checkAccessTokenLogin(function () {
            window.location.href = "vouchers.html?v=<%= VERSION %>";
        },'mine.html?v=<%= VERSION %>');
    });
	
	//点击上门美妆
	$('.mo_kinds .mk_zhuang').click(function(e) {
        checkAccessTokenLogin(function () {
			window.location.href="orderList.html?v=<%= VERSION %>";
        },'mine.html?v=<%= VERSION %>');
    });
	//点击美妆沙龙
	$('.mo_kinds .mk_salon').click(function(e) {
        checkAccessTokenLogin(function () {
			window.location.href="beautySalonOrderList.html?v=<%= VERSION %>";
        },'mine.html?v=<%= VERSION %>');
    });
	
	//点击积分商城
	$('.mine_menu .mm_li_shope').click(function(e) {
        checkAccessTokenLogin(function () {
			if (/iphone|ipad|ipod/.test(ua)) {
				_czc.push(['_trackEvent','nggirl_scoreshop','phoneType=iOS','进入积分商城','true','']);	
			} else if (/android/.test(ua)) {
				_czc.push(['_trackEvent','nggirl_scoreshop','phoneType=and','进入积分商城','true','']);
			};
            window.location.href = "integralMallIndex.html?v=<%= VERSION %>";
        },'mine.html?v=<%= VERSION %>');
    });
	
	//点击长草清单
	$('.mine_menu .mm_li_cao').click(function(e) {
        checkAccessTokenLogin(function () {
            window.location.href="grassListing.html?v=<%= VERSION %>";
        },'mine.html?v=<%= VERSION %>');
    });
	
	//点击设置
	$('.mine_menu .mm_li_setting').click(function(e) {
        checkAccessTokenLogin(function () {
            window.location.href = "settings-mine.html?v=<%= VERSION %>";
        },'mine.html?v=<%= VERSION %>');
    });
	
	//点击联系客服
	$('.mine_menu .mm_li_kefu').click(function(e) {
        checkAccessTokenLogin(function () {
            window.location.href = "customerService.html?v=<%= VERSION %>";
        },'mine.html?v=<%= VERSION %>');
    });
	
	//点击头像进入我的个人资料
	$('.mine_icon').click(function(e) {
        checkAccessTokenLogin(function () {
            window.location.href="mine-message.html?v=<%= VERSION %>";
        },'mine.html?v=<%= VERSION %>');
    });
	
	//点击箭头进入我的个人主页
	$('.mt_arr_right').click(function(e) {
        checkAccessTokenLogin(function () {
            window.location.href="myHomePage.html?userId="+$('.mine').attr('id')+'&v=<%= VERSION %>';
        },'mine.html?v=<%= VERSION %>');
    });
	
	//跳转到经验值页面
	$('.mb_jyz_num').click(function(e) {
		if (/iphone|ipad|ipod/.test(ua)) {
			_czc.push(['_trackEvent','nggirl_scoreshop_see_score','phoneType=iOS','进入南瓜值页面','true','']);	
		} else if (/android/.test(ua)) {
			_czc.push(['_trackEvent','nggirl_scoreshop_see_score','phoneType=and','进入南瓜值页面','true','']);
		};
        window.location.href = "experienceRank.html?v=<%= VERSION %>";
    });
	
	//跳转到积分页面
	$('.mb_jyz_score').click(function(e) {
        checkAccessTokenLogin(function () {
			if (/iphone|ipad|ipod/.test(ua)) {
				_czc.push(['_trackEvent','nggirl_scoreshop','phoneType=iOS','进入积分商城','true','']);	
			} else if (/android/.test(ua)) {
				_czc.push(['_trackEvent','nggirl_scoreshop','phoneType=and','进入积分商城','true','']);
			};
            window.location.href = "integralMallIndex.html?v=<%= VERSION %>";
        },'mine.html?v=<%= VERSION %>');
    });
});