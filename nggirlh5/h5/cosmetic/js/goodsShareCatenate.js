$(function(){
	if (/iphone|ipad|ipod/.test(ua)) {
		_czc.push(['_trackEvent','phoneType=iOS','新版商品详情页']);	
	} else if (/android/.test(ua)) {
		_czc.push(['_trackEvent','phoneType=and','新版商品详情页']);
	};
	
	$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/item/getItemInfo/3.1.0',getFinalRequestObject({itemId:getParam('itemId'),accessToken:getAccessToken()}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			var imgArry=data.data.headImgs;
			for(var i in imgArry){
				$('.swiper-wrapper').append('<div class="swiper-slide"><img src="'+imgArry[i].url+'">')
			}
			$('header').append('<div class="header_goodsName" style="text-align: center">'+data.data.name+'</div>');
			$('.firstTitle').html(data.data.mainTitle);
			$('.secondTitle').html(data.data.reamTitle);
			$('.price_money').html(data.data.salePrice);
			$('title').html(data.data.mainTitle);
			//$(".goodsPictureChild").children().eq(0).attr("src",data.data.imgUrl);
			var itemDetails='';
			var itemDetail = data.data.itemDetail;
			for(var x = 0; x < itemDetail.length; x ++){
				if(itemDetail[x].type == 1){//1标题，2段落，3图片，4图片描述
					itemDetails += '<div class="content_color">'+itemDetail[x].content+'</div>';
				}else if(itemDetail[x].type == 2){
					itemDetails += '<div class="content_color">'+itemDetail[x].content+'</div>';
				}else if(itemDetail[x].type == 3){
					itemDetails += '<img src="'+itemDetail[x].content+'">';
				}else{
					itemDetails += '<div class="content_color">'+itemDetail[x].content+'</div>';
				}
			}
			$(".goodsPictureChild").html(itemDetails);
			if(data.data.comment != null){
				$(".goodsIntroducePicAndPara_child").html(data.data.comment.content);
			};
			var key_value=data.data.properties;
			for(var i=0;i<key_value.length-1;i++){
				$(".goodsParameterChild").append('<li><span class="goodsParameterChild_nature">'+key_value[i].name+'</span><span class="goodsParameterChild_value first_value">'+key_value[i].value+'</span></li>')
			}
			var name_value=data.data.properties;
			for(var i in name_value){
				$('.goodsParameterChild').append('<li><span class="goodsParameterChild_nature">'+name_value[i].name+'</span><span class="goodsParameterChild_value first_value">'+name_value[i].value+'</span><li/>')
			}
			
			//微信分享
			if(isInWeixin()){
				var title = '【南瓜姑娘】'+ data.data.mainTitle;
				var desc = data.data.reamTitle;
				var link = window.location.href;
				var imgUrl = data.data.imgUrl;
				var from = getParam('apptype');
				if(!strIsEmpty(from) && from == 'appb'){
					desc = data.data.reamTitle;
				}
				weixinConfig(title,desc,link,imgUrl);
			}
		}else{
			alert(data.data.error);
		}
	});

	var goodsParameterChirld_number=$('.goodsParameterChild').children('li').size()
	var goodsParameterChirld_number_height=goodsParameterChirld_number*0.8;
	$('.goodsPicture').click(function(){
		$('.goodsPictureChild').css('display','block').siblings().css('display','none')
		$(this).css({'border-bottom':'1px solid #EE750D','color':'#F39A4C'}).siblings().css({'border-bottom':'1px solid #eee','color':'#5E5E5E'})
	});
	$('.goodsParameter').click(function(){
		var li_number=$('.goodsParameterChild li');
		for(var i=0;i<li_number.length;i++){
			if($(li_number[i]).html()==""){
				$(li_number[i]).remove()
			}
		}
		$('.goodsParameterChild').css('display','block').siblings().css('display','none')
		$(this).css({'border-bottom':'1px solid #EE750D','color':'#F39A4C'}).siblings().css({'border-bottom':'1px solid #eee','color':'#5E5E5E'})
		var goodsIntroducePicAndPara_height=$('.goodsParameterChild li').size()*0.8;
	});
	$('.backUrl').click(function(){
		window.history.go(-1)
	});
	$('.openApp').click(function(){
		//opennApp();
		APPCommon.openApp();
		return false;
	});
var APPCommon = {
    iphoneSchema: 'nggirl://nggirl/itemDetail?'+'type=1'+'&itemId='+getParam('itemId')+'&v=<%= VERSION %>',
    iphoneDownUrl: 'https://itunes.apple.com/cn/app/nan-gua-gu-niang-yi-jian-xia/id1014850829?l=en&mt=8',
    androidSchema: 'nggirl://nggirl/itemDetail?'+'type=1'+'&itemId='+getParam('itemId')+'&v=<%= VERSION %>',
    androidDownUrl: 'https://photosd.nggirl.com.cn/apks/3.1.0/nguser_v3.1.0_yingyongbao_release.apk',
    openApp: function(){
        var this_  =  this;
		if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
			if(this_.isWeixin()){
				 window.location = "http://a.app.qq.com/o/simple.jsp?pkgname=cn.com.nggirl.nguser";
	 
			}else{
			var loadDateTime = new Date();
			window.setTimeout(function() {
				var timeOutDateTime = new Date();
				if (timeOutDateTime - loadDateTime < 5000) {
					window.location = this_.iphoneDownUrl;//ios下载地址
				} else {
					window.close();
				}
			},1500);
			window.location = this.iphoneSchema;
			}
			
		}else if (navigator.userAgent.match(/android/i)) {
			if(this_.isWeixin()){
				$(".isWei").css("height",$(window).height());
				$(".isWei").show();
				$('.isWei').on('touchstart', function () {
					$(".isWei").hide();
				});
	 
			}else{
				try {
					window.location = this_.androidSchema;
					setTimeout(function(){
						window.location=this_.androidDownUrl; //android下载地址
 
					},1500);
				} catch(e) {}
			}
		}
    },
    isWeixin: function(){ //判断是否是微信
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            return true;
        } else {
            return false;
        }
    }
 
};	
});



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

/*function opennApp(){  
    var ua = window.navigator.userAgent.toLowerCase();  
    //微信 
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){  
        $('body').html('<div class="guide"><img src="<%=WEIXIN_GUIDE_BROWER_IMG%>" ></div>');
    }else{//非微信浏览器
        if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) { 
			if(this_.isWeixin()){
				 window.location = "http://a.app.qq.com/o/simple.jsp?pkgname=cn.com.nggirl.nguser";
	 
			}else{ 
				var loadDateTime = new Date();  
				window.setTimeout(function() {  
					var timeOutDateTime = new Date();  
					if (timeOutDateTime - loadDateTime < 5000) { 
						window.location.href = "https://itunes.apple.com/cn/app/nan-gua-gu-niang-yi-jian-xia/id1014850829?l=en&mt=8";//ios下载地址  
					}else{
						window.location.href="/nggirl/h5/mobile/loadGoodsShareCatenate.html?itemId="+getParam('itemId')+'&v=<%= VERSION %>';	
					}
				},25); 
			}
          }else if (navigator.userAgent.match(/android/i)) {  
		   if(ua.match(/MicroMessenger/i) == 'micromessenger'){  
				$('body').html('<div class="guide"><img src="<%=WEIXIN_GUIDE_BROWER_IMG%>" ></div>');
			}else{
				var state = null;  
				try {  
					window.location.href="/nggirl/h5/mobile/loadGoodsShareCatenate.html?itemId="+getParam('itemId')+'&v=<%= VERSION %>';	
					setTimeout(function(){ 
					   // window.location.href= "http://a.app.qq.com/o/simple.jsp?pkgname=cn.com.nggirl.nguser"; //android下载地址  
	  
					},500);  
				} catch(e) {} 
			} 
        }  
    }  
}  */
