
	//*********************加载数据并初始化页面**开始*****************************
	$(function(){	
	
		if (isInWeixin()) {
			weixinConfig();
			$('.box-zhifu.zhifu-zfb').hide();
			$('.box-zhifu.zhifu-weixin').show();
		} else {
			$('.box-zhifu.zhifu-weixin').hide();
			$('.box-zhifu.zhifu-zfb').show();
		}
		
		//点击订单详情，返回订单详情页面
		$('.order-details').click(function(e) {
			window.location.href="bookingDetails.html?reservationId="+$(this).attr('reservationId')+'&v=<%= VERSION %>';
        });
		var time = getParam('time');
		var remoteurl = '<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/getWorksDetail';
		// 从地址栏中取得
		var dresserId = getParam('dresserId');
		var coursetypeId = getParam('coursetypeId');
		var workType = getParam('workType');
		var price = getParam('price');
		var workId = getParam('workId');
		var data = getFinalRequestObject({accessToken:getAccessToken(),dresserId:dresserId});
		$('.lei').html(localStorage.getItem('workType'));
		$('.right-data').val(time);
		
		$('.restimeselect .right').append('<option selected>选择预约时段</option>');			
		$('.restimeselect .right').append('<option>08:00 - 09:00</option>');
		$('.restimeselect .right').append('<option>09:00 - 10:00</option>');
		$('.restimeselect .right').append('<option>10:00 - 11:00</option>');
		$('.restimeselect .right').append('<option>11:00 - 12:00</option>');
		$('.restimeselect .right').append('<option>12:00 - 13:00</option>');
		$('.restimeselect .right').append('<option>13:00 - 14:00</option>');
		$('.restimeselect .right').append('<option>14:00 - 15:00</option>');
		$('.restimeselect .right').append('<option>15:00 - 16:00</option>');
		$('.restimeselect .right').append('<option>16:00 - 17:00</option>');
		$('.restimeselect .right').append('<option>17:00 - 18:00</option>');
		$('.restimeselect .right').append('<option>18:00 - 19:00</option>');
		$('.restimeselect .right').append('<option>19:00 - 20:00</option>');
		$('.restimeselect .right').append('<option>20:00 - 21:00</option>');
		
		//加载数据
		$.ajax({
			url : remoteurl,  
			type : 'get',
			data : getFinalRequestObject({accessToken:getAccessToken(),workId:workId}),
			dataType : 'json',  
			success : function(data){
			
			// 存储返回的数据
			$('body').data('data',data);
			
			//初始化页面
			$('.bh-name').html(data.data.dresserName);
			$('.bl-photo').attr('src',data.data.dresserProfile);
			// 是否给化妆师加V
			if(data.data.isVDresser == 0){
				$('.img-vip').hide();
			}
			if(data.data.isVDresser == 1){
				$('.img-vip').show();
			}
			
			// 星级评价
			for(var x = 0; x < data.data.starLevel; x ++){
				$('.bh-start').append('<img src="images/start_03.jpg" alt="" /> ');	
			}
			
			//封面
			$('.hzs-img').attr('src',data.data.cover);
			//装束类型
			$('.work-type').html(data.data.workType);
			//价格
			$('.work-price .cost').html(data.data.cost);
			//标签
			for(var x = 0; x <data.data.tags.length; x++){
				$('.hr-bottom').append('<span>'+data.data.tags[x]+'</span>');	
			}
			
			$('.price').html('¥'+data.data.cost);
		}});
		
		function getResDate(res,timeIndex){
			return res.reservationDate +'&nbsp;'+res.reservationTimes[timeIndex].name;
		}
		
		/* 设置地址选择事件 */	
		
	    $( "#addresscombo" ).autocomplete({
	      source: function( request, response ) {
	        autocom.search(request.term, function(status, result){
	                    response($.map(result.tips,function(item){
	                      return {
	                        label:item.district + item.name,
	                        value:item.district + item.name
	                      }
	                    }));
	                });
	      },
	      minLength: 2,
	      select: function( event, ui ) {

			$('#address').val(ui.item.value);
			if(isIphone()){
				$('body,html').animate({scrollTop:0},260);
			}else{
				$('#addressSelect').hide();
			}
			 
	      },
	      open: function() {
	        $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
	      },
	      close: function() {
	        $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
	      }
		});
	    
		$('#addresscombo').blur(function(){
			 $('#addressSelect').hide();
		});
		
		//预约并支付
		$('.btn-yue').click(function(){
			yueFunc();
		});		
		function yueFunc(e) {
			$(this).unbind('click');
			//微信配置
			if (isInWeixin()) {
				weixinConfig();
			}
	
			//检查accessToken,如果无效就登录
			checkAccessTokenLogin(function(){
				if (/iphone|ipad|ipod/.test(ua)) {
					_czc.push(['_trackEvent','jiaoxue','phoneType=iOS','click','pay-btn']);	
				} else if (/android/.test(ua)) {
					_czc.push(['_trackEvent','jiaoxue','phoneType=and','click','pay-btn']);
				};
				var re=new RegExp("[\\-,\\:, ]","g");
				var coursetypeId = $('body').data('currentCoursetypeId');
				var workType = $('body').data('currentworkType');
				var resurl = '<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/weixin/getReservationDirect';
				if($('.right-data').val() == '' || $('.right-data').val() == '请选择日期'){
					alert('请选择预约日期');
				}else if($('#resTime').val() == '' || $('#resTime').val() == '选择预约时段'){
					alert('请选择预约时段');
				}else if($('#address').val() == ''){
					alert('请输入详细地址');
				}else if($('#phoneNum').val() == ''){
					alert('请输入电话号码');
				}else if(isPhoneNum($('#phoneNum').val())){
					var data = {
						accessToken:getAccessToken(),
						workId:getParam('workId'),
						reservationAddress:$('#address').val(),
						phoneNum:$('#phoneNum').val(),
						reservationTime:$('#resTime').val(),
						reservationDate:$('.right-data').val().replace(re, "")
					};
					data = getFinalRequestObject(data);
	
					$.ajax({
						url : resurl,
						type : 'post',
						data : data,
						dataType : 'json',
						success : function(data){
							if(data.code == 0){
								$('.loadding').show();
								$('.gray-box').show();
								//判断是在微信浏览还是网页浏览
								if (isInWeixin()) {
									weixinPay(data.data.reservationId);
								} else {
									zhifubaoPay(data.data.reservationId);
								}
							}
							if(data.code == 1){
								alert(data.data.error);
							}
						}});
				}else{
					alert('请输入正确的手机号');
				}
			});
        }
		
		function isIphone(){
			var uAgent = navigator.userAgent;
			return uAgent.indexOf('iPhone') > -1 || uAgent.indexOf('Mac') > -1 || uAgent.indexOf('iPad') > -1;
		}
			/*
			 * 预约并支付
			 */
			
		function weixinConfig() {
		    var currenturl = window.location.href;
		    //初始化配置信息
		    $.ajax({
		        url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/weixinjs/config',
		        type: 'post',
		        dataType: 'json',
		        data: getFinalRequestObject({url: currenturl, accessToken: getAccessToken()}),
		        success: function (data) {
		            //初始化配置
		            wx.config({
		                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		                appId: data.data.appId, // 必填，公众号的唯一标识
		                timestamp: data.data.timestamp, // 必填，生成签名的时间戳
		                nonceStr: data.data.noncestr, // 必填，生成签名的随机串
		                signature: data.data.signature,// 必填，签名，见附录1
		                jsApiList: ["chooseWXPay"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
		            });
		        }
		    });
		}

		//发起微信支付
		function weixinPay(reservationId) {

		    //获取openid
		    $.ajax({
		        url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/register/weixin/getOpenId',
		        type: 'get',
		        dataType: 'json',
		        data: getFinalRequestObject({accessToken:getAccessToken(),code: getParam('code')}),
		        success: function (data) {
					
		             $.ajax({
		                url:'<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/payReservation',
		                type: 'post',
		                dataType: 'json',
		                data: getFinalRequestObject({
		                    reservationId: reservationId,
		                    payType: 1,
		                    accessToken: getAccessToken(),
		                    weixinPayType: 2,
		                    weixinOpenId: data.data.openid,
		                }),
		                success: function (data) {
							////
							$('.loadding').hide();
							$('.gray-box').hide();
		                    //未支付完成
		                    if(data.data.order_status == 1){
		                        if (isWeixinLessThan5()) {
		                            alert('微信版本过低!请先升级');
		                        } else {
		                            weixinPayReservation(reservationId);
		                        }
		                    }else{
		                        window.location.href= '<%= CLI_HOST_API_URL %>/nggirl/h5/cosmetic/orderSuccess-xhnh.html?v=<%= VERSION %> ';
		                    }

		                }
		            });

		        }
		    });

		}


		//js调起微信支付
		function weixinPayReservation(reservationId) {
		    $.ajax({
		        url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/weixinjs/getOrder',
		        type: 'post',
		        dataType: 'json',
		        data: getFinalRequestObject({reservationId: reservationId, accessToken: getAccessToken()}),
		        success: function (data) {
		            wx.chooseWXPay({
		                timestamp: data.data.weixin_timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
		                nonceStr: data.data.weixin_noncestr, // 支付签名随机串，不长于 32 位
		                package: data.data.weixin_package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
		                signType: data.data.weixin_signtype, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
		                paySign: data.data.weixin_sign, // 支付签名
		                success: function (res) {
		                    // 支付成功后的回调函数
		                    //alert('支付成功res=' + res.errMsg);
		                	window.location.href= '<%= CLI_HOST_API_URL %>/nggirl/h5/cosmetic/orderSuccess-xhnh.html?v=<%= VERSION %> ';
		                },
		                fail: function (res) {
		                    //alert('支付失败res=' + res.errMsg);
		                	history.go(-1);
		                },
		                cancel: function (res) {
		                    //alert('支付取消res=' + res.errMsg);
		                	history.go(-1);
		                }
		            });
		        }
		    });
		}


		//发起支付宝支付
		function zhifubaoPay(reservationId) {
		    checkAccessTokenLogin(function(){
		        var resData = {
		            reservationId:reservationId,
		            payType:2,
		            accessToken:getAccessToken(),
		        };
		        $.ajax({
		            url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/payReservation',
		            type:'post',
		            dataType:'json',
		            data:getFinalRequestObject(resData),
		            success:function(data){
						////
						$('.loadding').hide();
						$('.gray-box').hide();
		                var payurl = '<%= CLI_HOST_API_URL %>/nggirl/app/charge/alipay/h5/payDirectReservation';
		                var queryStringData = getFinalRequestObject({reservationId:reservationId,accessToken:getAccessToken()});
		                var queryString = '';
		                for(var prop in queryStringData){
		                    queryString += (prop + '=' + queryStringData[prop]+'&');
		                }
		                window.location.href = payurl + '?' +queryString+'&v=<%= VERSION %>';
		            }
		        });
		    });

		    return false;

		}
		
	});
	



