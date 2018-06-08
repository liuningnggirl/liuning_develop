$(function(){		
	$('.cp_address').css('width',$(window).width() - 105);
	//从地址栏拿到需要的参数
	$('.cg_img').attr('src',getParam('headImg'));//获取商品图
	$('.cr_name').html(getParam('name'));//获取商品名
	$('.cb.xiaoji .right').html(getParam('costScore')+'积分');//积分
	$('.btn .btn_num').html('总计：'+getParam('costScore')+'积分');
	//判断邮费
	if(getParam('freight') == 0){
		$('.cb.yunfei .right').html('包邮');
	}else{
		$('.cb.yunfei .right').html(getParam('freight')+'元');
	}
	$('.cn_points').html(getParam('costScore'));
	
	//跳转到填写地址页面
	$('.content_tel,.content_address').click(function(e) {
        $('.content_part01').show();
		$('.content').hide();
		if($('.content_tel .right').html() != '请填写收货人电话'){
			$('.content_txt .cp_tel').val($('.content_tel .right').html());	
		}else{
			$('.content_txt .cp_tel').val('');
		}
		if($('.content_address .right').html() != '请填写收货人地址'){
			$('.content_txt .cp_address').val($('.content_address .right').html());	
		}else{
			$('.content_txt .cp_address').val('');
		}
		adjFn();
    });
	
	//点击确认地址按钮
	$('.btn_ok_address').click(function(e) {
			if($.trim($('.cp_name').val()) == ''){
				alertFn('请填写收货人姓名！');
			}else if(isPhoneNum($('.cp_tel').val()) == false){
				alertFn('请输入正确的手机号！');
			}else if($.trim($('.cp_address').val()) == ''){
				alertFn('请填写收货地址信息！');	
			}else{
				$.post('<%= UGC_HOST_API_URL %>/nggirl/app/cli/scoreshop/confirmAddress/2.5.2',getFinalRequestObject({accessToken:getAccessToken(),realName:$('.cp_name').val(),phoneNum:$('.cp_tel').val(),address:$('.cp_address').val()}),function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						$('.content_part01').hide();
						$('.content').show();
						$('.btn').addClass('blue');
						//获取用户收货地址V2.5.2
						getUserAddress();
					}else{
						alert(data.data.error);	
					}
				});
			}
    });
	
	//输入电话，姓名，地址
	$('.cp_name,.cp_tel,.cp_address').keyup(function(){
		adjFn();
	});
	
	//隐藏弹框
	$('.gray,.close,.success').click(function(e) {
        window.location.href = "integralMallIndex.html?v=<%= VERSION %>";
    });
	
	//提交订单
	$('.btn').click(function(e) {		
        if($(this).hasClass('blue')){
			var remark= '';
			if($('.beizhu .remark').html() == '如果有衣服，妆品型号的需求可以备注下（但库存短缺时，我们也只好随机发放了~)'){
				remark = '';
			}else{
				remark =$('.beizhu .remark').html().replace(/[ ]|[ &nbsp;]/g, '');
			}
			var param = getFinalRequestObject({
				accessToken:getAccessToken(),
				unionGoodsId:getParam('unionGoodsId'),//商品联合id
				goodsId:getParam('goodsId'),//商品编号
				goodsType:getParam('goodsType'),//商品类型：0普通商品，1补签卡
				costScore:getParam('costScore'),
				freight:getParam('freight'),
				exchangeTime:getParam('exchangeTime'),//每人允许兑换次数
				realName:$('.cp_name').val(),
				address:$('.cp_address').val(),
				phoneNum:$('.cp_tel').val(),
				remark:remark
			});
			$.post('<%= UGC_HOST_API_URL %>/nggirl/app/cli/scoreshop/commitExchange/2.5.3',param,function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					_czc.push(['_trackEvent','nggirl_scoreshop_change','兑换商品成功','goodId ',getParam('goodsId'),'']);
					$('.gray').show();
					//弹框高度
					$('.gray .success').css('margin-top',($(window).height() - $('.gray .success').height())/2);
					$('.gray .close').css('margin-top',($(window).height() - $('.gray .success').height())/2+20);
					$('.gray .success_message').css('bottom',($(window).height() - $('.gray .success').height())/2+ $(window).height()*0.009);
					$('.gray .success_message .gray_gift_name').html(getParam('name'));
				}else{
					alert(data.data.error);	
				}
			});	
		};
    });
	
	//获取用户收货地址V2.5.2
	getUserAddress();
	
	//当文本框获得焦点时
	$('.right.remark').click(function(){
		if($(this).html() == '如果有衣服，妆品型号的需求可以备注下（但库存短缺时，我们也只好随机发放了~)'){
			$(this).html('').css('color','#4c4c4c');
			$('.right.remark').focus();
		}else{
			$(this).css('color','#4c4c4c');
			$('.right.remark').focus();
		}
	});
	
	//失去焦点时
	$('.right.remark').blur(function(){
		if($(this).html() == ''){
			$('.right.remark').html('如果有衣服，妆品型号的需求可以备注下（但库存短缺时，我们也只好随机发放了~)').css('color','#9a9a9a');
		};
	});
})


//判断确认地址按钮状态
function adjFn(){
	if($.trim($('.content_txt .cp_name').val()) != ''){
		$('.btn_ok_address').addClass('blue');
	}else{
		$('.btn_ok_address').removeClass('blue');
		return;
	}
	if($.trim($('.content_txt .cp_tel').val()) != ''){
		$('.btn_ok_address').addClass('blue');
	}else{
		$('.btn_ok_address').removeClass('blue');
		return;
	}
	if($.trim($('.content_txt .cp_address').val()) != ''){
		$('.btn_ok_address').addClass('blue');
	}else{
		$('.btn_ok_address').removeClass('blue');
		return;
	}
}

//获取用户收货地址V2.5.2
function getUserAddress(){
	$.get('<%= UGC_HOST_API_URL %>/nggirl/app/cli/scoreshop/getUserReciveAddess/2.5.2',getFinalRequestObject({accessToken:getAccessToken()}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			//如果用户没有默认电话
			if(data.data.phoneNum == ''){
				$('.content_tel .right').html('请填写收货人电话').css('color','#9a9a9a');
			}else{
				$('.content_tel .right').html(data.data.phoneNum).css('color','#4c4c4c');
			}
			
			//如果用户没有默认地址
			if(data.data.address == ''){
				$('.content_address .right').html('请填写收货人地址').css('color','#9a9a9a');
			}else{
				$('.content_address .right').html(data.data.address).css('color','#4c4c4c');
			}
			$('.cp_name').val(data.data.realName);
			$('.cp_address').val(data.data.address);
			$('.cp_tel').val(data.data.phoneNum);
			
			//判断是否可以提交订单
			if($('.content_tel .right').html() != '请填写收货人电话' && $('.content_address .right').html() != '请填写收货人地址'){
				$('.btn').addClass('blue');
			}else{
				$('.btn').removeClass('blue');		
			}
		}else{
			alert(data.data.error);	
		}
	});
}

//验证手机号
function isPhoneNum(phoneNum){
	var reg = /^1[3|8|7|5|4]\d{9}$/;
	return reg.test(phoneNum);		
}

