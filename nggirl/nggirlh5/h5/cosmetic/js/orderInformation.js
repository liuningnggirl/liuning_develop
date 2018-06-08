$(function(){
	//微信配置
	if (isInWeixin()){
		weixinConfig();
	};
	
	//评价上传图片
	var strImg = '';
	var filechooser = document.getElementById("choose");
	
	//用于压缩图片的canvas
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext('2d');
	
	//瓦片canvas
	var tCanvas = document.createElement("canvas");
	var tctx = tCanvas.getContext("2d");
	var maxsize = 100 * 1024;
	$("#upload").on("click", function() {
		filechooser.click();
	})
	.on("touchstart", function() {
		$(this).addClass("touch")
	})
	.on("touchend", function() {
		$(this).removeClass("touch")
	});
	filechooser.onchange = function() {
		if (!this.files.length) return;
		var files = Array.prototype.slice.call(this.files);
		if (files.length > 9) {
		  alert("最多同时只可上传9张图片");
		  return;
		}
	files.forEach(function(file, i) {
	  if (!/\/(?:jpeg|png|gif)/i.test(file.type)) return;
	  var reader = new FileReader();
	  var li = document.createElement("li");
	  
	//获取图片大小
	  var size = file.size / 1024 > 1024 ? (~~(10 * file.size / 1024 / 1024)) / 10 + "MB" : ~~(file.size / 1024) + "KB";
	  li.innerHTML = '<div class="progress"><span></span></div>';
	  $(".img-list").append($(li));
	  reader.onload = function() {
		var result = this.result;
		var img = new Image();
		img.src = result;
		$(li).css("background-image", "url(" + result + ")");
	
		//如果图片大小小于100kb，则直接上传
		if (result.length <= maxsize) {
		  img = null;
		  upload(result, file.type, $(li));
		  return;
		}
	//      图片加载完毕之后进行压缩，然后上传
		if (img.complete) {
		  callback();
		} else {
		  img.onload = callback;
		}
		function callback() {
		  var data = compress(img);
		  upload(data, file.type, $(li));
		  img = null;
		}
	  };
	  reader.readAsDataURL(file);
	})
	};
	//使用canvas对大图片进行压缩
	function compress(img) {
	var initSize = img.src.length;
	var width = img.width;
	var height = img.height;
	//如果图片大于四百万像素，计算压缩比并将大小压至400万以下
	var ratio;
	if ((ratio = width * height / 1000000) > 1) {
	  ratio = Math.sqrt(ratio);
	  width /= ratio;
	  height /= ratio;
	} else {
	  ratio = 1;
	}
	canvas.width = width;
	canvas.height = height;
	//        铺底色
	ctx.fillStyle = "#fff";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	//如果图片像素大于100万则使用瓦片绘制
	var count;
	if ((count = width * height / 1000000) > 1) {
	  count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
	//            计算每块瓦片的宽和高
	  var nw = ~~(width / count);
	  var nh = ~~(height / count);
	  tCanvas.width = nw;
	  tCanvas.height = nh;
	  for (var i = 0; i < count; i++) {
		for (var j = 0; j < count; j++) {
		  tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
		  ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
		}
	  }
	} else {
	  ctx.drawImage(img, 0, 0, width, height);
	}
	//进行最小压缩
	var ndata = canvas.toDataURL('image/jpeg', 0.7);
	console.log('压缩前：' + initSize);
	console.log('压缩后：' + ndata.length);
	console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
	tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
	return ndata;
	}
	//    图片上传，将base64的图片转成二进制对象，塞进formdata上传
	function upload(basestr, type, $li) {
	var text = window.atob(basestr.split(",")[1]);
	var buffer = new Uint8Array(text.length);
	var pecent = 0, loop = null;
	for (var i = 0; i < text.length; i++) {
	  buffer[i] = text.charCodeAt(i);
	}
	var blob = getBlob([buffer], type);
	var xhr = new XMLHttpRequest();
	var formdata = getFormData();
	
	//formdata.append('base64img', blob);
	formdata.append('base64img', basestr);
	xhr.open('post', '<%= PHOTOS_HOST_API_URL %>/uploadserver/app/image/uploads/base64img/3.0.0');
	xhr.onreadystatechange = function() {
	  if (xhr.readyState == 4 && xhr.status == 200) {
		var jsonData = JSON.parse(xhr.responseText);
		var text = jsonData.code == 0 ? '上传成功' : '上传失败';
		//alert(jsonData.data.url);
		strImg += "'" + jsonData.data.url +"',";
		console.log(jsonData.data.url);
		clearInterval(loop);
		//当收到该消息时上传完毕
		$li.find(".progress span").animate({'width': "100%"}, pecent < 95 ? 200 : 0, function() {
		  $(this).html(text);
		});
	  }
	};
	//数据发送进度，前50%展示该进度
	xhr.upload.addEventListener('progress', function(e) {
	  if (loop) return;
	  pecent = ~~(100 * e.loaded / e.total) / 2;
	  $li.find(".progress span").css('width', pecent + "%");
	  if (pecent == 50) {
		mockProgress();
	  }
	}, false);
	//数据后50%用模拟进度
	function mockProgress() {
	  if (loop) return;
	  loop = setInterval(function() {
		pecent++;
		$li.find(".progress span").css('width', pecent + "%");
		if (pecent == 99) {
		  clearInterval(loop);
		}
	  }, 100)
	}
	xhr.send(formdata);
	}
	/**
	* 获取blob对象的兼容性写法
	* @param buffer
	* @param format
	* @returns {*}
	*/
	function getBlob(buffer, format) {
	try {
	  return new Blob(buffer, {type: format});
	} catch (e) {
	  var bb = new (window.BlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder);
	  buffer.forEach(function(buf) {
		bb.append(buf);
	  });
	  return bb.getBlob(format);
	}
	}
	/**
	* 获取formdata
	*/
	function getFormData() {
	var isNeedShim = ~navigator.userAgent.indexOf('Android')
		&& ~navigator.vendor.indexOf('Google')
		&& !~navigator.userAgent.indexOf('Chrome')
		&& navigator.userAgent.match(/AppleWebKit\/(\d+)/).pop() <= 534;
	return isNeedShim ? new FormDataShim() : new FormData()
	}
	/**
	* formdata 补丁, 给不支持formdata上传blob的android机打补丁
	* @constructor
	*/
	function FormDataShim() {
	console.warn('using formdata shim');
	var o = this,
		parts = [],
		boundary = Array(21).join('-') + (+new Date() * (1e16 * Math.random())).toString(36),
		oldSend = XMLHttpRequest.prototype.send;
	this.append = function(name, value, filename) {
	  parts.push('--' + boundary + '\r\nContent-Disposition: form-data; name="' + name + '"');
	  if (value instanceof Blob) {
		parts.push('; filename="' + (filename || 'blob') + '"\r\nContent-Type: ' + value.type + '\r\n\r\n');
		parts.push(value);
	  }
	  else {
		parts.push('\r\n\r\n' + value);
	  }
	  parts.push('\r\n');
	};
	// Override XHR send()
	XMLHttpRequest.prototype.send = function(val) {
	  var fr,
		  data,
		  oXHR = this;
	  if (val === o) {
		// Append the final boundary string
		parts.push('--' + boundary + '--\r\n');
		// Create the blob
		data = getBlob(parts);
		// Set up and read the blob into an array to be sent
		fr = new FileReader();
		fr.onload = function() {
		  oldSend.call(oXHR, fr.result);
		};
		fr.onerror = function(err) {
		  throw err;
		};
		fr.readAsArrayBuffer(data);
		// Set the multipart content type and boudary
		this.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
		XMLHttpRequest.prototype.send = oldSend;
	  }
	  else {
		oldSend.call(this, val);
	  }
	};
	}
	//获取灰色弹框高度
	$('.loading').height($(window).height());
	
	//获取优惠券
    $.ajax({
        url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/personalInfo/listCouponUse/1.3.2',
        type: 'get',
        data: getFinalRequestObject({accessToken: getAccessToken(), reservationId: getParam('reservationId')}),
        dataType: 'json',
        success: function (data) {
            if (data.code == 0) {
				//判断优惠券张数
				if(data.data.length == 0){
					$('.no-vouchers').show();	
				}else{
					//生成优惠券
					for(var x = 0; x <data.data.length; x ++){
						//优惠券状态，0（未使用）
						if(data.data[x].useStatus == 0){																			
							$('.box-vouchers').append('<div cutcost="'+data.data[x].cutCost+'" money='+data.data[x].saleInfo+' couponId='+data.data[x].couponId+' class="voucher"><div class="voucher-top"><div class="vt-left"><p class="vl-top">'+(data.data[x].saleInfo).substring(0,data.data[x].saleInfo.length-1)+'</p><p class="vl-bottom">满'+data.data[x].lowPrice+'元可用</p></div><div class="vt-right"><p class="vr-top">'+data.data[x].fromChannel+'</p><p class="vr-bottom">'+data.data[x].fitProductName+'</p></div></div><div class="voucher-bottom"><p class="use-status">未使用</p><p class="use-date">'+data.data[x].deadLine+'</p></div></div>');
						}
					}
				}
            }else{
				alert(data.data.error);	
			}
        }
    });
	
    /*点击使用南瓜券 */
    $('.use-voucherss').click(function (e) {
		$('.btn').hide();
        $('.box').hide();
        $('.box-vouchers').slideDown();
    });
	
    /*点击优惠券返回价钱和优惠券ID*/	
	$('.box-vouchers').delegate(".voucher","click",function(){ 
		var couponId = $(this).attr('couponId');
        var money = $(this).attr('money')
        var cutcost = $(this).attr('cutCost')
        $('.box-vouchers').hide();
        $('.box').slideDown();
		$('.btn').show();
        $('.use-voucherss').attr('couponId', couponId);
        $('.use-voucherss').attr('cutcost', cutcost);
        $('.uv-right').html('优惠' + money);
		
		//判断使用优惠券后的价格
		if(($('.content-payment .cp-content').html() -$('.use-voucherss').attr('cutcost')) < 0){
			$('.content-payment .cp-content').html('0');	
		}else{
			$('.content-payment .cp-content').html($('.content-payment .cp-content').html() -$('.use-voucherss').attr('cutcost'));
		}
	});
	
	//获取灰色弹框高度
	$('.alert-box').height($(window).height());
	$('.hz-alert-box').height($(window).height());
	
	//点击提示框里面的“确定“按钮
	$('.alert-box .btn-ok').click(function(e) {
        $('.alert-box').fadeOut();
    });
	
	//点击作品是否在线的灰色背景
	$('.alert-box').click(function(e) {
        $('.alert-box').fadeOut();
    });
	
	//点击化妆完成的灰色背景
	$('.hz-alert-box').click(function(e) {
        $('.hz-alert-box').fadeOut();
    });
	
	//点击“还未完成”按钮
	$('.hz-alert-box .btn-left').click(function(e) {
        $('.hz-alert-box').fadeOut();
    });
	
	//点击“确认完成”按钮
	$('.hz-alert-box .btn-right').click(function(e) {
		hzSuccessFn();
    });
	
	//tab切换
	$('.box-tab>div').click(function(e) {
		$(this).attr('act','act').siblings().removeAttr("act");
		$(this).addClass('bt-current').siblings().removeClass('bt-current');
		$('.box-tab-content>div').eq($(this).index()).show().siblings().hide();
    });
	
	//页面加载时获取“订单流程信息”
	orderMessage();
	
	//点击“订单流程”按钮
	$('.bt-left').click(function(e) {
		//清除之前加载的数据
		$('.time-line ul').children().remove();
        orderMessage();
    });
	
	//点击“订单详情”按钮
	$('.bt-right').click(orderMessageFn);
	
	//0:点击“取消预约”按钮
	$('.btn .btn-cancle').click(function(e) {
		if (/iphone|ipad|ipod/.test(ua)) {
			_czc.push(['_trackEvent','nggirl_cancellation','phoneType=iOS','取消预约','true','']);	
		} else if (/android/.test(ua)) {
			_czc.push(['_trackEvent','nggirl_cancellation','phoneType=and','取消预约','true','']);
		};
        window.location.href="cancleOrder.html?reservationId="+$('.box').attr('id')+'&v=<%= VERSION %>'
    });
	
	//4:点击“取消预约”按钮
	$('.btn .btn-four .bf-cancle').click(function(e) {
        window.location.href="cancleOrder.html?reservationId="+$('.box').attr('id')+"&status1="+4+'&v=<%= VERSION %>';
    });
	
	//4:点击“立即支付”按钮
	$('.btn .btn-four .bf-pay').click(function(e) {
		//判断标签存在否
		if(typeof($('.box-tab .bt-left').attr('act')) != "undefined"){
			$('.box-tab .bt-right').addClass('bt-current');
			$('.box-tab .bt-right').attr('act','act');
			$('.box-tab .bt-left').removeClass('bt-current');
			$('.box-tab .bt-left').removeAttr('act');
			$('.btc-right').show();
			$('.btc-left').hide();
			orderMessageFn();
		}else{
			if (isInWeixin()) {
				$('.loading').show();
				if (/iphone|ipad|ipod/.test(ua)) {
					_czc.push(['_trackEvent','nggirl_Method_of_payment','phoneType=iOS','支付方式','payType','微信支付']);	
				} else if (/android/.test(ua)) {
					_czc.push(['_trackEvent','nggirl_Method_of_payment','phoneType=and','支付方式','payType','微信支付']);
				};
				weixinPay();
			}else{
				$('.loading').show();
				if (/iphone|ipad|ipod/.test(ua)) {
					_czc.push(['_trackEvent','nggirl_Method_of_payment','phoneType=iOS','支付方式','payType','支付宝']);	
				} else if (/android/.test(ua)) {
					_czc.push(['_trackEvent','nggirl_Method_of_payment','phoneType=and','支付方式','payType','支付宝']);
				};
				zhifubaoPay();	
			}
		}
    });
	
	//1,2,3,5：点击“选择其他妆容”按钮
	$('.btn .btn-five .bf-another').click(function(e) {
        window.location.href="home_page.html?v=<%= VERSION %>";
    });
	
	//1,2,3,5：点击“再次预约”按钮
	$('.btn .btn-five .bf-again').click(function(e) {
		//判断当前作品在线状态
		if($('.box').attr('deleted') == 0){//在线
			window.location.href="workDetails.html?workId="+$('.box').attr('workId')+'&v=<%= VERSION %>';
		};
		if($('.box').attr('deleted') == 1){//下线
			$('.alert-box').show();
		};
    });
	
	//11,12：点击“选择其他妆容”按钮
	$('.btn .btn-another').click(function(e) {
        window.location.href="home_page.html?v=<%= VERSION %>";
    });
	
	//6：点击“申请退款”按钮
	$('.btn .btn-six').click(function(e) {
        window.location.href="refund.html?reservationId="+$('.box').attr('id')+'&v=<%= VERSION %>';
    });
	
	//7,8：点击”化妆完成“按钮
	$('.btn .btn-seven').click(function(e) {
		if($(this).attr('status') == 7){
			$('.hz-alert-box').show();
		};
		if($(this).attr('status') == 8){
			hzSuccessFn();
		};
    });
	
	//9,10(未评价):点击”评价“按钮
	$('.btn .btn-ten').click(function(e) {
		$('.box').hide();
		$('.btn').hide();
        $('.box-ping').show();
		//获取化妆师头像
		$('.comolain_title p img').attr('src',$('.box').attr('profile'));
    });
	$('.ping').click(function(e) {
		$('.box').hide();
		$('.btn').hide();
        $('.box-ping').show();
		//获取化妆师头像
		$('.comolain_title p img').attr('src',$('.box').attr('profile'));
    });
	
	//9,10（已评价）：点击”再次预约"按钮
	$('.btn .btn-again').click(function(e) {
		//判断当前作品在线状态
		if($('.box').attr('deleted') == 0){//在线
			window.location.href="workDetails.html?workId="+$('.box').attr('workId')+'&v=<%= VERSION %>';
		};
		if($('.box').attr('deleted') == 1){//下线
			$('.alert-box').show();
		};
    });
	
	//点击orderInformation页面里面的作品名称
	$('.hzs-cover').click(function(e) {
		//判断当前作品在线状态
		if($('.box').attr('deleted') == 0){//在线
			window.location.href="workDetails.html?workId="+$('.box').attr('workId')+'&v=<%= VERSION %>';
		};
		if($('.box').attr('deleted') == 1){//下线
			//不做任何操作
		};
    });	
	
	//上传评价图片
	$('#doc').fileupload({
		dataType: 'json',
		done: function (e, data) {
		var str = '<div style="float:left;margin-top:10px;"> <img class="imgs" src="';
		str += data.result.data.url;
		str += '" /></div>';
		$('#dd').prepend(str); 
		$('#dd').parent().append($('.complain_btm1'));
			return true;
		}
	});
		
	//评价后点击“评价”按钮
	$('.ping').click(function(e) {
		$('.box').hide();
		$('.btn').hide();
        $('.box-ping').slideDown();
		//判断是否评价过
		if(typeof($(this).attr('ping')) != "undefined"){//评价过
			$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/getReservationEvaluate',getFinalRequestObject({accessToken: getAccessToken(),reservationId: getParam('reservationId')}),function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					$('.complain_con .complain textarea').val(data.data.evaluation).attr('disabled','disabled');
					//获取评价图片
					$('#dd').html(getPingImgFn(data.data.photos));
					$('.complain_btm1').hide();
					
					//显示星星遮罩层
					$('.li_workDetails .white-box').show();
					
					//准时到达
					for(var x = 0; x < data.data.onTimeEvaluation; x ++){
						$('.onTimeEvaluation #star1>img:eq('+x+')').attr('src','css/img/star-on-big.png');
					}
					//描述一致
					for(var x = 0; x < data.data.descriptionEvaluation; x ++){
						$('.descriptionEvaluation #star2>img:eq('+x+')').attr('src','css/img/star-on-big.png');
					}
					//技法娴熟
					for(var x = 0; x < data.data.tecniqueEvaluation; x ++){
						$('.tecniqueEvaluation #star3>img:eq('+x+')').attr('src','css/img/star-on-big.png');
					}
					//服务周到
					for(var x = 0; x < data.data.serviceEvaluation; x ++){
						$('.serviceEvaluation #star4>img:eq('+x+')').attr('src','css/img/star-on-big.png');
					}
					$('.evaluate input').unbind('click');
					$('.complain_footer1').hide();
				};
				if(data.code == 1){
					alert(data.data.error);
				};
			});
		}
    });

	//完成评价按钮
	$(".complain_footer1").on('click',function(){
		var imgs = '';
		if(strImg.length > 0){
			imgs = '['+strImg.substring(0, strImg.length-1)+']';
		}
		console.log('imgs=' + imgs);
		
		var onTimeE = $('.onTimeEvaluation #star1 input').val();
		var descriptionE = $('.descriptionEvaluation #star2 input').val();
		var tecniqueE = $('.tecniqueEvaluation #star3 input').val();
		var serviceE = $('.serviceEvaluation #star4 input').val();
		var content = $('.complain textarea').val();
		//评价限制内容
		if($('.complain textarea').val() == ''){
			alert('请填写评价内容!!');	
		}else if($('#star1 input').val() == '' || $('#star2 input').val() == '' || $('#star3 input').val() == '' || $('#star4 input').val() == '' ){
			alert('您还未对所有评价项进行评分哦~');	
		}else{
			$.ajax({//采用异步
				type: "post",
				url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/evaluate/1.5.0',
				data:getFinalRequestObject({accessToken: getAccessToken(), 
					reservationId: getParam('reservationId'),
					onTimeEvaluation: onTimeE,
					descriptionEvaluation: descriptionE,
					tecniqueEvaluation: tecniqueE,
					serviceEvaluation: serviceE,
					evaluation: content,
					photos: imgs}),
					dataType:"json",
					success: function(data){
					if(data.code == 0){
						console.log(data);
						var reservationId = getParam('reservationId');
						//判断是否领取了优惠券
						if(data.data.hasReceivedCoupon == 0){//未领取
							window.location.reload();
						};
						if(data.data.hasReceivedCoupon == 1){//已领取
							window.location.href = "normalShareCouponSuccess.html?money="+data.data.receivedCoupon.money +'&type=' + encodeURI(data.data.receivedCoupon.productType)+'&v=<%= VERSION %>';
						};
					};
					if(data.code == 1){
						alert(data.data.error);
					};
				},
			});
		}
	});	
});

//化妆完成后台发送请求
function hzSuccessFn(){
	$.post('<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/finishReservation',getFinalRequestObject({reservationId:$('.box').attr('id'),accessToken: getAccessToken()}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			window.location.reload();
		};
		if(data.code == 1){
			alert(data.data.error);	
		}
	});
}

//获取订单完成步骤
function stepsFn(steps){
	var str = '';
	for(var x = 0; x < steps.length; x ++){
		str += '<li><div class="line-box"><div class="lb-box"><div class="left"><p class="left-status">'+steps[x].majorDesc+'</p></div><div class="right">'+new Date(steps[x].recordTime).format("hh:mm")+'</div><div class="lb-dresser">'+steps[x].minorDesc+'</div></div></div></li>';
	}
	return str;
}

//时间格式化
Date.prototype.format = function(format) {
    var o = {
        "M+" :this.getMonth() + 1, // month
        "d+" :this.getDate(), // day
        "h+" :this.getHours(), // hour
        "m+" :this.getMinutes(), // minute
        "s+" :this.getSeconds(), // second
        "q+" :Math.floor((this.getMonth() + 3) / 3), // quarter
        "S" :this.getMilliseconds()
    }

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "")
                .substr(4 - RegExp.$1.length));
    }

    for ( var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
                    : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}

//获取订单流程信息
function orderMessage(){
	$('.time-line ul').children().remove();
	$.post('<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/reservationFlowsIos/1.4.2',getFinalRequestObject({accessToken:getAccessToken(),reservationId:getParam('reservationId')}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			//判断当前订单状态
			if(data.data.status == 0){   //支付成功，等待化妆师上门  
				$('.three-steps').show();	
			}else if(data.data.status == 4){  //化妆师已确认，等待支付
				$('.ts-img').attr('src','images/steps-two.png');
				$('.three-steps').show();	
			}
			for(var x = 0; x < data.data.resFlowsByDate.length ; x ++){
				$('.time-line ul').append('<p class="lb-date">'+data.data.resFlowsByDate[x].recordDate+'</p>'+stepsFn(data.data.resFlowsByDate[x].reservationFlows)+'');	
			}
			//获取线的高度
			var firtChileEle = $('.time-line ul li:eq(0)');
			var lastChileEle = $('.time-line ul li:last-child');
			var halfHeightOfFirst = firtChileEle.height()/2;     
			var halfHeightOfLast = lastChileEle.height()/2;
			var topOfFirst = firtChileEle[0].offsetTop;
			var lineTop = halfHeightOfFirst+topOfFirst+4;
			var lineLength = $('.time-line').height()-halfHeightOfFirst-halfHeightOfLast-topOfFirst-8;
			$('.line').css('top',lineTop);
			$('.line').height(lineLength);
			$('.time-line ul li:eq(0)').css({'background':'url(images/get.png) no-repeat left center','background-size':'4%'});
			$('.time-line ul li:eq(0) .left-status').css('color','#50C8B4');
			//存储订单id
			$('.box').attr('id',data.data.reservationId);
			//存储作品id 
			$('.box').attr('workId',data.data.workId);
			//存储化妆师头像
			$('.box').attr('profile',data.data.profile);
			//存储作品在线状态
			$('.box').attr('deleted',data.data.deleted);
			
			//判断订单状态			
			showOneProcessBtn(data.data.status, data.data.praised,data.data.isRefundable);
		}else{
			alert(data.data.error);	
		}
	});
}

//切换底部按钮，使仅保留1个
function showOneProcessBtn(status,praised,isrefundable){
	//隐藏所有按钮
	$('.btn .btn-cancle').hide();
	$('.btn .btn-five').hide();
	$('.btn .btn-another').hide();
	$('.btn .btn-four').hide();
	$('.btn .btn-six').hide();
	$('.btn .btn-seven').hide();
	$('.btn .btn-ten').hide();
	$('.btn .btn-again').hide();
	//显示当前指定按钮
	if(status == 0){
		$('.btn .btn-cancle').show();
	}else if(status == 1 || status == 5 || status == 2 || status == 3){
		$('.btn .btn-five').show();
	}else if(status == 11 || status == 12){
		$('.btn .btn-another').show();
	}else if(status == 4){
		$('.btn .btn-four').show();
		$('.use-act-pay').show();
	}else if(status == 6){
		if(isrefundable == 0){//不可以退款
			$('.btn .btn-six').hide();
		};
		if(isrefundable == 1){//可以退款
			$('.btn .btn-six').show();
		};
	}else if(status == 7 || status == 8){
		$('.btn .btn-seven').attr('status',status);
		$('.btn .btn-seven').show();
	}else if(status == 9 || status == 10){
		if(praised == 0){//未评价
			$('.btn .btn-ten').show();
		};
		if(praised == 1){//已评价
			$('.btn .btn-again').show();
		};
	}
}

//获取装束标签
function getTags(tag){
	var str = '';
	//判断标签是否存在
	if(tag.length != 0){
		for(var x = 0; x < tag.length; x ++){
			str +='<span>'+tag[x]+'</span>';	
		}
	}
	return str;
}

//详情页面
function orderMessageFn(){
	$.post('<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/reservationDetailsIos/1.4.2',getFinalRequestObject({accessToken:getAccessToken(),reservationId:getParam('reservationId')}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			//存储订单id 
			$('.box').attr('id',data.data.reservationId);
			//存储作品id 
			$('.box').attr('workId',data.data.workId);
			//存储化妆师头像
			$('.box').attr('profile',data.data.profile);
			//存储作品在线状态
			$('.box').attr('deleted',data.data.deleted);
			
			$('.hc-left .hzs-img').attr('src',data.data.cover);  //封面图
			$('.hc-right .hr-top').html(data.data.workName);     //作品名称
			$('.hr-middle .work-type').html(data.data.workType); //装束类型
			$('.hr-middle .work-price ').html(data.data.cost+'<span class="money">¥</span>');  //获取价格
			$('.hr-bottom').html(getTags(data.data.tags));   //获取装束标签
			
			//判断作品在线否
			//不显示右侧箭头
			if(data.data.deleted == 1){
				$('.hzs-cover').css({'background':'#fff'});
			};
			if(data.data.deleted == 0){
				$('.hzs-cover').css({'background':'#fff url(images/back_right_l.png) no-repeat 96% center','background-size':'4.3%'});
			};
			
			//判断用户是否已评价活动
			if(data.data.praised == 1){//已评价
				var str = '';
				for(var x = 0; x < data.data.sumEvaluation; x ++){
					str +='<img src="images/shaidan-star_03.png" alt="" style=" width:1.2rem;" /> ';
				}
				$('.ping .ping-right').html(str);
				$('.ping').attr('ping','ping');
				$('.box-ping').attr('ping','ping');
				$('.ping').show();
			}
			
			//获取化妆师信息
			$('.box-hzs .bl-photo').attr('src',data.data.profile);  //化妆师头像
			//判断化妆师是否加V
			if(data.data.isVDresser == 1){
				$('.bh-left .img-vip').show();	
			};
			if(data.data.name.length>7){
				var strn=data.data.name;
				strn= strn.substring(0,7)+"..." ; 
				$('.bh-right .bh-name').html(strn);  //化妆师姓名
				}else{
				$('.bh-right .bh-name').html(data.data.name);  //化妆师姓名
				}
			//判断化妆师性别
			if(data.data.sex == 0){
				$('.bh-right .sex').attr('src','images/boy.png');	
			}else if(data.data.sex == 1){
				$('.bh-right .sex').attr('src','images/girl.png');		
			}
			$('.bh-start').html(getStarLevel(data.data.starLevel));    //星级等级
			$('.content-cost li .content-count').html('¥'+data.data.cost);
			
			//判断是否使用了折扣
			if(data.data.isUsePromotion == 0){//未使用折扣
				$('.use-discount').hide();	
			};
			if(data.data.isUsePromotion == 1){//使用折扣
				$('.use-discount').show();	
				$('.content-cost .content-half').html('-¥'+data.data.promotionCutMoney);
			};
			
			//判断是否使用优惠券
			if(data.data.isUseCoupon == 0){//未使用
				$('.use-vouchers').hide();	
			};
			if(data.data.isUseCoupon == 1){//已使用
				$('.use-vouchers').show();	
				$('.content-cost .content-vouchers').html('-¥'+data.data.couponCutMoney);//优惠券抵消的金额
			};
			
			$('.content-cost .content-payment .cp-content').html(data.data.actualCost);  //实际支付金额
			$('.content-order .content-orderid').html(data.data.reservationId);   //预约编号
			$('.content-order .content-time').html(data.data.reservationTime);   //预约时间
			$('.content-order .content-address').html(data.data.reservationAddress);   //预约地址
			$('.content-order .content-chargeback').html(data.data.reason);   //退单理由
			
			//判断订单状态
			var status = data.data.status;
			if(status == 0){
				$('.btc-right .orderInfo-title').html('化妆师确认中，请小主耐心等待');
				$('.btc-right .orderInfo-title').css('background','#fa6e64');
				$('.use-act-pay').hide();
				$('.use-vouchers').hide();	
			}else if(status == 1 || status == 5){
				$('.use-vouchers').hide();	
				$('.btc-right .orderInfo-title').html('小主已取消订单，不再看看了么？');
				$('.btc-right .orderInfo-title').css('background','#b3b3b3');
			}else if(status == 2 || status == 3){
				$('.use-vouchers').hide();	
				$('.btc-right .orderInfo-title').html('化妆师未能接单，请小主重新挑选');
				$('.btc-right .orderInfo-title').css('background','#b3b3b3');
			}else if(status == 11){
				$('.use-act-pay').show();
				$('.use-act-pay .left').html('实际支付');
				$('.btc-right .orderInfo-title').html('退款中，请小主耐心等待');
				$('.btc-right .orderInfo-title').css('background','#50c8b4');
			}else if(status == 4){
				$('.use-vouchers').hide();	
				//判断是否是在微信内打开时显示的图标
				if (isInWeixin()) {
					$('.box-zhifu.zhifu-zfb').hide();
					$('.box-zhifu.zhifu-weixin').show();
					$('.use-voucherss').show();
					$('.pay-btn').unbind('click');
					$('.pay-btn').click(function(){
						$('.loading').show();
						weixinPay();
					});
					weixinConfig();
				}else{
					$('.box-zhifu.zhifu-weixin').hide();
					$('.box-zhifu.zhifu-zfb').show();
					$('.box-zhifu').css('margin-bottom','0rem');
					$('.use-voucherss').show();
					$('.pay-btn').unbind('click');
					$('.pay-btn').click(function(){
						$('.loading').show();
						zhifubaoPay();	
					});
				}
				$('.btc-right .orderInfo-title').html('化妆师已接单，请小主付费打赏');
				$('.btc-right .orderInfo-title').css('background','#50c8b4');
			}else if(status == 6){
				$('.use-act-pay').show();
				$('.btc-right .orderInfo-title').html('谢小主的赏金，请等待化妆师上门');
				$('.btc-right .orderInfo-title').css('background','#50c8b4');
				$('.use-act-pay .left').html('实际支付');
			}else if(status == 7){
				$('.use-act-pay').show();
				$('.btc-right .orderInfo-title').html('请小主安心享用美丽服务');
				$('.btc-right .orderInfo-title').css('background','#50c8b4');
			}else if(status == 8){
				$('.use-act-pay').show();
				$('.btc-right .orderInfo-title').html('服务结束，请小主确认完成');
				$('.btc-right .orderInfo-title').css('background','#50c8b4');
			}else if(status == 9 || status == 10){
				$('.btc-right .orderInfo-title').css('background','#50c8b4');
				if(data.data.praised == 0){//未评价
					$('.use-act-pay').show();
					$('.use-act-pay .left').html('实际支付');
					$('.btc-right .orderInfo-title').html('请美丽的小主为本次服务点评');
				};
				if(data.data.praised == 1){//已评价
					$('.use-act-pay').show();
					$('.btc-right .orderInfo-title').html('谢小主评价，期待与小主再次相遇');
				};
			}else if(status == 12){
				$('.btc-right .orderInfo-title').html('退款成功，南瓜姑娘会不断努力');
				$('.btc-right .orderInfo-title').css('background','#b3b3b3');
				$('.use-act-pay').show();
				$('.use-act-pay .left').html('实际支付');
			}
			
			//根据订单状态显示文案
			if(status == 1 || status == 11 || status == 12){
				$('.reason .left').html('退单理由');	
			};
			if(status == 3){
				$('.reason .left').html('拒单理由');	
			};
			//判断原因显示问题
			if(status == 1 || status == 3 || status == 2 || status == 5 || status == 11 || status == 12){
				$('.reason').show();
			};
			
			//判断当前状态显示的按钮
			showOneProcessBtn(status, data.data.praised,data.data.isRefundable);
		};
		if(data.code == 1){
			alert(data.data.error);	
		}
	});
}

//获取化妆师星级等级
function getStarLevel(num){
	var str = '';
	for(var x = 0; x < num; x ++){
		str += '<img src="images/start_03.jpg" /> ';
	}
	return str;
}


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
function weixinPay() {

    //获取openid
    $.ajax({
        url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/register/weixin/getOpenId',
        type: 'get',
        dataType: 'json',
        data: getFinalRequestObject({accessToken:getAccessToken(),code: getParam('code')}),
        success: function (data) {
            if(data.code == 0){
                $.ajax({
                    url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/payReservation',
                    type: 'post',
                    dataType: 'json',
                    data: getFinalRequestObject({
                        reservationId: getParam('reservationId'),
                        payType: 1,
                        accessToken: getAccessToken(),
                        couponId:toString($('.use-voucherss').attr('couponId')),
                        weixinPayType: 2,
                        weixinOpenId: data.data.openid
                    }),
                    success: function (data) {
						$('.loading').hide();
                        //未支付完成
                        if(data.data.order_status == 1){
                            if (isWeixinLessThan5()) {
                                alert('微信版本过低!请先升级');
                            } else {
                                weixinPayReservation(getParam('reservationId'));
                            }
                        }else{
                            window.location.href= '/nggirl/h5/cosmetic/orderInformation.html?reservationId='+getParam('reservationId')+'&v=<%= VERSION %>';
                        }

                    }
                });
            }else{
                //获取openid出错
                refreshWeixinPage(getParam('reservationId'));
            }
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
            if(data.code == 0){
                wx.chooseWXPay({
                    timestamp: data.data.weixin_timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                    nonceStr: data.data.weixin_noncestr, // 支付签名随机串，不长于 32 位
                    package: data.data.weixin_package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                    signType: data.data.weixin_signtype, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                    paySign: data.data.weixin_sign, // 支付签名
                    success: function (res) {
                        // 支付成功后的回调函数
                        //alert('支付成功res=' + res.errMsg);
                        window.location.href= '/nggirl/h5/cosmetic/orderInformation.html?reservationId='+reservationId+'&v=<%= VERSION %>';
                    },
                    fail: function (res) {
                        //alert('支付失败res=' + res.errMsg);
                        refreshWeixinPage(reservationId);
                    },
                    cancel: function (res) {
                        //alert('支付取消res=' + res.errMsg);
                        refreshWeixinPage(reservationId);
                    }
                });
            }else{
                //获取订单信息出错
                refreshWeixinPage(getParam('reservationId'));
            }

        }
    });
}


//发起支付宝支付
function zhifubaoPay() {
    checkAccessTokenLogin(function(){
        var resData = {
            reservationId:getParam('reservationId'),
            payType:2,
            couponId:toString($('.use-voucherss').attr('couponId')),
            accessToken:getAccessToken()
        };
        $.ajax({
            url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/payReservation',
            type:'post',
            dataType:'json',
            data:getFinalRequestObject(resData),
            success:function(data){
				if(data.code == 0){
					$('.loading').hide();
					var order_status = data.data.order_status;
					if(order_status == 1){//吊起支付
						var payurl = '/nggirl/app/charge/alipay/h5/payReservation';
						var queryStringData = getFinalRequestObject({reservationId:getParam('reservationId'),accessToken:getAccessToken()});
						var queryString = '';
						for(var prop in queryStringData){
							queryString += (prop + '=' + queryStringData[prop]+'&');
						}
						window.location.href = payurl + '?' +queryString+'&v=<%= VERSION %>';
					}else{
						window.location.href = "orderInformation.html?reservationId="+getParam('reservationId')+'&v=<%= VERSION %>';
					}	
				};
				if(data.code == 1){
					$('.loading').hide();
					alert(data.data.error);
				};
            }
        });
    });
    return false;
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

function refreshWeixinPage(reservationId){
    window.location.href = getWeixinLinkUrl(reservationId);
}


//获取评价图片
function getPingImgFn(photos){
	var str = '';
	if(photos.length == 0){
		str = '';
	}else{
		for(var x = 0; x < photos.length ; x ++){
			str += '<div style="float:left;margin-top:10px;"><img class="imgs" src = "'+photos[x]+'" /></div>'	
		}
	}
	return str;
}
	
