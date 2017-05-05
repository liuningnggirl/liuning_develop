$(function(){
    	$("#tabBox1-bd .con ul .selfmessage .message input.type").width($(window).width()-133);
		$(".company").width($(window).width());
		
    	TouchSlide( { slideCell:"#tabBox1",
			endFun:function(i){ //高度自适应
				var bd = document.getElementById("tabBox1-bd");
				effect:"left";
			/*	if(i == 0){
					$(".company").show();
					$(".scholl").hide();
				}else if(i == 1){
					$(".company").hide();
					$(".scholl").show();
				}*/
				if(i>0)bd.parentNode.style.transition="200ms";//添加动画效果
				}
			});
		//banner切换
		TouchSlide({
			slideCell: "#slideBox",
			titCell: ".bd1 ul", //开启自动分页 autoPage:true ,此时设置 titCell 为导航元素包裹层
			mainCell: ".hd1 ul",
			effect: "leftLoop",
			autoPage: true, //自动分页
			autoPlay: true, //自动播放
			interTime: 2000,
			
		});
		$(".type").live("keyup",function(){
			if($(this).val().length ==100){
				alert("此处字数不能超过100");
			}
		});
		$(".beizhu").live("keyup",function(){
			if($(this).val().length == 500){
				alert("此处字数不能超过500");
			}
		});
    	$(".bc_address").live("click",function(){
    		$('.box_area').show();
			$('#tabBox1').hide();
    	})
		$(".opbgbox").height($(window).height());
		$(".opbgbox").width($(window).width());
		$(".company ,.scholl").css("min-height",$(window).height()-64);
		$(".comApplyType").live('click',function(){
			$(".opbg,.companyType").show();
			$("body").height($(window).height())
			$("body").css("overflow","hidden");
			$("body").bind('touchmove',function(event){
				event.preventDefault();
			});
			
		});
		$(".companyType ul li").live('click',function(){
			$(".opbg,.typeBottom").hide();
			$("body").css("overflow","auto");
			$("body").unbind('touchmove');
			$(".comApplyType i").html($(this).text()).attr("applyType",$(this).attr("applyType"));
			$(this).css("color","#EE750c");
			$(this).siblings().css("color","#3a3a3a")
		});
		$(".schApplyType").live('click',function(){
			$(".opbg,.schollType").show();
			$("body").height($(window).height())
			$("body").css("overflow","hidden");
			$("body").bind('touchmove',function(event){
				event.preventDefault();
			});
			
		});
		$(".schollType ul li").live('click',function(){
			$(".opbg,.typeBottom").hide();
			$("body").css("overflow","auto");
			$("body").unbind('touchmove');
			$(".schApplyType i").html($(this).text()).attr("applyType",$(this).attr("applyType"));
			$(this).css("color","#EE750c");
			$(this).siblings().css("color","#3a3a3a")
		});
		$(".opbg").live('click',function(){
			$(".opbg,.typeBottom").hide();
			$("body").css("overflow","auto");
			$("body").unbind('touchmove');
		});
		$(".companySub").live('click',function(){
			if($.trim($(".companyname").val()) == ""){
				alert("企业名称不能为空");
			}else if($.trim($(".companyaddress").val()) == ""){
				alert("企业地址不能为空");
			}else if($.trim($(".ordername").val()) == ""){
				alert("申请人姓名不能为空");
			}else if($.trim($(".orderphone").val()) == ""){
				alert("申请人电话不能为空");
			}else if(!isPhoneNum($.trim($(".orderphone").val()))){
				alert('手机号格式不正确');
			}else if($("#USER_AGE1").val() == ""){
				alert("预约日期不能为空");
			}else{
				enterpriseApply();
			}

		});
		$(".schollSub").live('click',function(){
			if($.trim($(".schollname").val()) == ""){
				alert("学校名称不能为空");
			}else if($.trim($(".scholladdress").val()) == ""){
				alert("学校地址不能为空");
			}else if($.trim($(".applyname").val()) == ""){
				alert("申请人姓名不能为空");
			}else if($.trim($(".applyphone").val()) == ""){
				alert("申请人电话不能为空");
			}else if(!isPhoneNum($.trim($(".applyphone").val()))){
				alert('手机号格式不正确');
			}else if($("#USER_AGE2").val() == ""){
				alert("预约日期不能为空");
			}else{
				universityApply();
			}

		});
function enterpriseApply(){
	$.ajax({//采用异步
		type: "post",
		url:'<%= UGC_HOST_API_URL %>/nggirl/app/cli/activity/cosmeticOfflineServer/enterpriseApply/3.0.3',
		data:getFinalRequestObject({cityId:$(".bc_address i").attr("cityId"),cityName:$(".bc_address i").attr("shi"),enterpriseName:$(".companyname").val(),address:$(".companyaddress").val(),applicantName:$(".ordername").val(),applicantPhone:$(".orderphone").val(),applyType:$(".comApplyType i").attr("applyType"),serverTime:$("#USER_AGE1").val(),remarks:$(".companybeizhu").val()}),
		timeout:15000,//10s
		dataType:"json",
		success: function (data) {
			if(data.code == 0){
				$("#tabBox1").hide();
				$(".success,.tushiBox").show();
				$(".tushiBox").fadeOut(2000);
			}else{
	            alert(data.data.error);	
	        }			
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			//console.log( XMLHttpRequest )
			//$(".main").html("尚未发布任何信息！");
		}
	});
}
function universityApply(){
	$.ajax({//采用异步
		type: "post",
		url:'<%= UGC_HOST_API_URL %>/nggirl/app/cli/activity/cosmeticOfflineServer/universityApply/3.0.3',
		data:getFinalRequestObject({cityId:$(".bc_address i").attr("cityId"),cityName:$(".bc_address i").attr("shi"),universityName:$(".schollname").val(),address:$(".scholladdress").val(),applicantName:$(".applyname").val(),applicantPhone:$(".applyphone").val(),applyType:$(".schApplyType i").attr("applyType"),serverTime:$("#USER_AGE2").val(),remarks:$(".schollbeizhu").val()}),
		timeout:15000,//10s
		dataType:"json",
		success: function (data) {
			if(data.code == 0){
				$("#tabBox1").hide();
				$(".success,.tushiBox").show();
				$(".tushiBox").fadeOut(2000);
			}else{
	            alert(data.data.error);	
	        }			
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			//console.log( XMLHttpRequest )
			//$(".main").html("尚未发布任何信息！");
		}
	});
}
//验证手机号
function isPhoneNum(phoneNum){
	var reg = /^1[3|8|7|5|4]\d{9}$/;
	return reg.test(phoneNum);		
}
//微信分享
		if(isInWeixin()){
			var str = window.location.href;
			var title = '【南瓜姑娘】美妆报名活动';
			var desc = '明星御用化妆师现在开课啦~';
			var link = window.location.protocol+"//"+window.location.host+"/nggirl/h5/mobile/welfareActivities.html?v=<%= VERSION %>";
			var imgUrl = 'https://photosd.nggirl.com.cn/work/b9ed4036310e4fb8b21e2b83d8c5b275.jpg';
			var from = getParam('apptype');
			if(!strIsEmpty(from) && from == 'appb'){
				desc = '明星御用化妆师现在开课啦~';
			}
			weixinConfig(title,desc,link,imgUrl);
		}			
		//h5,app同步分享内容
		if(isInApp()){
			window.shareTitle = '美妆报名活动';
			window.shareContent = '明星御用化妆师现在开课啦~';
			window.sharePicture =  'https://photosd.nggirl.com.cn/work/b9ed4036310e4fb8b21e2b83d8c5b275.jpg';
			window.shareUrl = window.location.protocol+"//"+window.location.host+"/nggirl/h5/mobile/welfareActivities.html?v=<%= VERSION %>";
		};
		//给安卓传值
		if(typeof(window.ngjsInterface)!="undefined" && typeof(window.ngjsInterface.conFigShareInfo)!="undefined"){
			window.ngjsInterface.conFigShareInfo('美妆报名活动','明星御用化妆师现在开课啦~','https://photosd.nggirl.com.cn/work/b9ed4036310e4fb8b21e2b83d8c5b275.jpg',window.location.protocol+"//"+window.location.host+"/nggirl/h5/mobile/welfareActivities.html?v=<%= VERSION %>");
		};
		//微信分享
		function weixinConfig(title,desc,link,imgUrl) {
			wx.ready(function(){
				//获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
				wx.onMenuShareTimeline({
					title: title, // 分享标题
					link: link, // 分享链接
					imgUrl: imgUrl, // 分享图标
					success: function () {
						// 用户确认分享后执行的回调函数
					},
					cancel: function () {
						// 用户取消分享后执行的回调函数
					}
				});
		
		
				//获取“分享给朋友”按钮点击状态及自定义分享内容接口
				wx.onMenuShareAppMessage({
					title: title, // 分享标题
					desc: desc, // 分享描述
					link: link, // 分享链接
					imgUrl: imgUrl, // 分享图标
					type: 'link', // 分享类型,music、video或link，不填默认为link
					dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
					success: function () {
						// 用户确认分享后执行的回调函数
					},
					cancel: function () {
						// 用户取消分享后执行的回调函数
					}
				});
			});
			var currenturl =window.location.href;
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
						jsApiList: ["onMenuShareTimeline","onMenuShareAppMessage"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
					});
				}
			});
		}	
});
