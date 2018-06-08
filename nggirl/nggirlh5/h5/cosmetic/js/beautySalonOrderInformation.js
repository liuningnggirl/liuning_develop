$(function(){
	//上传图片
	var strImg = '';
	var filechooser = document.getElementById("choose");
	//    用于压缩图片的canvas
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext('2d');
	//    瓦片canvas
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
	//          获取图片大小
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
	//    使用canvas对大图片进行压缩
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
		okSuccessFn();
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
		
	//点击beautySalonOrderInformation页面里面的作品名称
	$('.hzs-cover').click(function(e) {
		//判断当前作品在线状态
		if($('.box').attr('deleted') == 0){//在线
			window.location.href="beautySalonWorkDetails.html?unionProductId="+$('.box').attr('unionProductId')+'&productType='+$('.box').attr('resType')+'&v=<%= VERSION %>';
		};
		if($('.box').attr('deleted') == 1){//下线
			//不做任何操作
		};
    });
	
	//点击“评价”按钮
	$('.ping').click(function(e) {
		$('.box').hide();
		$('.btn').hide();
        $('.box-ping').slideDown();
		//判断是否评价过
		if(typeof($(this).attr('ping')) != "undefined"){//评价过
			$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/salon/reservation/praiseDetails/1.3',getFinalRequestObject({accessToken: getAccessToken(),unionResId: getParam('unionResId'),resType: getParam('resType')}),function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					$('.complain_con .complain textarea').val(data.data.content).attr('disabled','disabled');
					//获取评价图片
					$('#dd').html(getPingImgFn(data.data.photos));
					$('.complain_btm1').hide();
					
					//显示星星遮罩层
					$('.white-box').show();
					
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
		
	//下面用于多图片上传预览功能
	function setImagePreviews(avalue) {
		var docObj = document.getElementById("doc");
		var dd = document.getElementById("dd");
		dd.innerHTML = "";
		var fileList = docObj.files;
		for (var i = 0; i < fileList.length; i++) {
			console.info(fileList[i]);
			if (docObj.files && docObj.files[i]) {
				var str = '<div style="float:left;margin-top:10px;"> <img id="img'+i+'" src="'+
				window.URL.createObjectURL(docObj.files[i])+'" /></div>';
				$('#dd').prepend(str);
			}
		}
		$('#dd').parent().append($('.complain_btm1'));
		return true;
	}
	
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
				url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/salon/reservation/evaluation/1.5.0',
				data:getFinalRequestObject({accessToken: getAccessToken(), 
					unionResId: getParam('unionResId'),
					resType: getParam('resType'),
					onTimeEvaluation: onTimeE,
					descriptionEvaluation: descriptionE,
					tecniqueEvaluation: tecniqueE,
					serviceEvaluation: serviceE,
					content: content,
					photos: imgs}),
					dataType:"json",
					success: function(data){
					if(data.code == 0){
						//判断是否领取了优惠券
						if(data.data.hasReceivedCoupon == 0){//未领取
							window.location.reload();
						};
						if(data.data.hasReceivedCoupon == 1){//已领取
							window.location.href = "beautySalonShareCouponSuccess.html?money="+data.data.receivedCoupon.money +'&type=' + encodeURI(data.data.receivedCoupon.productType)+'&v=<%= VERSION %>';
						};
					};
					if(data.code == 1){
						alert(data.data.error);
					};
				},
			});
		}
	});	
	
	//点击“活动完成”按钮
	$('.btn-content').click(function(e) {
		if($(this).attr('status') == 3){
			$('.hz-alert-box').show();
		};
		if($(this).attr('status') == 4){
			okSuccessFn();
		};
    });
	
	//点击“体验其他活动”按钮
	$('.btn-content-another').click(function(e) {
        window.location.href="beautylist.html?v=<%= VERSION %>";
    });
	
	//点击“评价”按钮
	$('.btn .btn-content-ping').click(function(e) {
		$('.box').hide();
		$('.btn').hide();
        $('.box-ping').slideDown();
    });
});

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
	$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/salon/reservation/orderFlow/1.4.2',getFinalRequestObject({accessToken:getAccessToken(),unionResId:getParam('unionResId'),resType:getParam('resType')}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			for(var x = 0; x < data.data.resFlowsByDate.length ; x ++){
				$('.time-line ul').append('<p class="lb-date">'+data.data.resFlowsByDate[x].recordDate+'</p>'+stepsFn(data.data.resFlowsByDate[x].reservationFlows)+'');	
			}
			
			//排除没有一条流程的问题
			if(data.data.resFlowsByDate.length != 0){
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
			}
			$('.time-line ul li:eq(0)').css({'background':'url(images/get.png) no-repeat left center','background-size':'4%'});
			$('.time-line ul li:eq(0) .left-status').css('color','#50C8B4');
			//存储联合id 
			$('.box').attr('unionProductId',data.data.unionProductId);
			//存储作品类型 
			$('.box').attr('resType',data.data.resType);
			//存储化妆师头像
			$('.box').attr('profile',data.data.dresserCover);
			$('.comolain_title p img').attr('src',data.data.dresserCover);
			//存储作品在线状态
			$('.box').attr('deleted',data.data.deleted);
			$('.btn-content').attr('status',data.data.resStatus);
			//判断订单状态			
			showOneProcessBtn(data.data.resStatus);
		};
		if(data.code == 1){
			alert(data.data.error);	
		}
	});
}

//切换底部按钮，使仅保留1个
function showOneProcessBtn(status){
	$('.btn-content').hide();
	$('.ping').hide();
	$('.btn-content-another').hide();
	$('.btn-content-ping').hide();
	
	if(status == 4 || status == 3){
		$('.btn-content').show();	
	}else if(status == 5 ){
		$('.ping').show();	
		$('.btn-content-ping').show();
	}else if(status == 6){
		$('.ping').show();		
		$('.btn-content-another').show();
	}else if(status == 7 || status == 8){
		$('.btn-content-another').show();
	}
}

//详情页面
function orderMessageFn(){
	$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/salon/reservation/orderDetails/1.4.2',getFinalRequestObject({accessToken:getAccessToken(),unionResId:getParam('unionResId'),resType:getParam('resType')}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			//判断活动是否在线
			if(data.data.deleted == 1){//不在线
				$('.hzs-cover').css('background','#fff');
			};
			if(data.data.deleted == 0){//在线
				$('.hzs-cover').css({'background':'#fff url(images/back_right_l.png) no-repeat 96% center','background-size':'3.4%'});
			};
			
			//判断用户是否已评价活动
			if(data.data.praised == 1){//已评价
				var str = '';
				for(var x = 0; x < data.data.praiseStar; x ++){
					str +='<img src="images/shaidan-star_03.png" alt="" style=" width:1.2rem;" /> ';
				}
				$('.ping .ping-right').html(str);
				$('.ping').attr('ping','ping');
				$('.box-ping').attr('ping','ping');
			}
			
			//存储联合id 
			$('.box').attr('unionProductId',data.data.unionProductId);
			//存储作品类型 
			$('.box').attr('resType',data.data.resType);
			//存储化妆师头像
			$('.box').attr('profile',data.data.profile);
			//存储作品在线状态
			$('.box').attr('deleted',data.data.deleted);
			
			$('.hc-left .hzs-img').attr('src',data.data.productCover);  //封面图
			$('.hc-right .hr-top').html(data.data.productTitle);     //作品名称
			$('.hr-bottom .hb-num ').html(data.data.price);  //获取价格	
			if(data.data.name.length>7){
				var strn=data.data.name;
				strn= strn.substring(0,7)+"..." ; 
				$('.bh-right .bh-name').html(strn);  //化妆师姓名
				}else{
				$('.bh-right .bh-name').html(data.data.name);  //化妆师姓名
				}
			$('.bh-left .bl-photo').attr('src',data.data.profile);
			$('.comolain_title p img').attr('src',data.data.profile);
			//判断化妆师性别
			if(data.data.sex == 0){
				$('.bh-right .sex').attr('src','images/boy.png');	
			}else if(data.data.sex == 1){
				$('.bh-right .sex').attr('src','images/girl.png');		
			}
			$('.bh-start').html(getStarLevel(data.data.starLevel));    //星级等级
			$('.content-cost .content-price .cp-price').html('¥'+data.data.price);//单价			
			$('.content-cost .content-price .cp-num').html(' x '+data.data.peopleNum);//人数			
			$('.content-cost .content-price .cp-cost').html('¥'+data.data.cost);//总金额			
			$('.content-cost .content-vouchers').html('-¥'+data.data.couponMoney);//优惠券减
			//判断当前总金额减去优惠金额为负数\
			if(data.data.cost - data.data.couponMoney < 0){
				$('.content-cost .content-act-cost').html('¥'+ 0);//实际支付			
			}else{
				$('.content-cost .content-act-cost').html('¥'+ (data.data.cost - data.data.couponMoney));//实际支付		
			}	
			$('.content-order .content-orderid').html(data.data.unionResId);
			$('.content-order .content-time').html(data.data.resTime);
			$('.content-order .content-address').html(data.data.resPlace);
			
			//判断是否使用了优惠券
			if(data.data.couponMoney ==0){
				$('.pay-vouchers').hide()	
			}else{
				$('.pay-vouchers').show()	
			}
			
			//判断订单状态
			var status = data.data.resStatus;
			$('.btn-content').attr('status',status);
			if(status == 1){
				$('.btc-right .orderInfo-title').html('谢小主的赏金，请等待活动成团');
				$('.btc-right .orderInfo-title').css('background','#50c8b4');
			}else if(status == 2){
				$('.btc-right .orderInfo-title').html('活动已成团，请小主准时参加活动');
				$('.btc-right .orderInfo-title').css('background','#6ed7c8');
			}else if(status == 3){
				$('.btc-right .orderInfo-title').html('活动中，小主要记得拍照留念');
				$('.btc-right .orderInfo-title').css('background','#6ed7c8');
			}else if(status == 4){
				$('.btc-right .orderInfo-title').html('活动结束，请小主确认完成');
				$('.btc-right .orderInfo-title').css('background','#6ed7c8');
			}else if(status == 5){
				$('.btc-right .orderInfo-title').html('请美丽的小主为本次活动点评');
				$('.btc-right .orderInfo-title').css('background','#6ed7c8');
			}else if(status == 6){
				$('.btc-right .orderInfo-title').html('谢小主评价，期待与小主再次相遇');
				$('.btc-right .orderInfo-title').css('background','#6ed7c8');
			}else if(status == 7){
				$('.btc-right .orderInfo-title').html('本次活动未成团，正在为小主退款');
				$('.btc-right .orderInfo-title').css('background','#B3B3B3');
			}else if(status == 8){
				$('.btc-right .orderInfo-title').html('退款成功，南瓜姑娘会不断努力');
				$('.btc-right .orderInfo-title').css('background','#b3b3b3');
			}
			
			//判断当前状态显示的按钮
			showOneProcessBtn(status);
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

//活动完成请求数据
function okSuccessFn(){
	$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/salon/reservation/setCompleted/1.3',getFinalRequestObject({accessToken: getAccessToken(),unionResId:getParam('unionResId')}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			window.location.reload();
		};
		if(data.code == 1){
			alert(data.data.error);	
		};
	});
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
