$(function(){	
	//灰色背景高度
	$('.gray,.isWei,.gray_window').height($(window).height());
	
	//商品头图高度为4:3 
	$('.pd_box_img').height($('.pd_box_img').width() * 3/4);
	
	//收起商品详情
	$('.pd_box_ul li').delegate('.pub_li_on','click',function(e){
        $(this).html('展开').css('background','url(../images/order-arr-down_03_03.png) no-repeat right center;').addClass('pbu_li_off').removeClass('pub_li_on');
		$(this).parent().next().slideUp();
	});
	
	//展开商品查看详情
	$('.pd_box_ul li').delegate('.pbu_li_off','click',function(e){
        $(this).html('收起').css('background','url(../images/order-arr-up_03_03.png) no-repeat right center;').addClass('pub_li_on').removeClass('pbu_li_off');
		$(this).parent().next().slideDown();
		var h = $(document).height()-$(window).height();
		$('html,body').animate({scrollTop:h+$(window).height()});
	});
	
	//获取商品详情V2.4.2
	$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/post/getSeedProductDetail/2.5.0',getFinalRequestObject({seedProductId:getParam('seedProductId'),targetType:getParam('targetType'),targetId:getParam('targetId')}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			$('.pd_box_img').attr('src',data.data.detailImg);//商品图
			//如果商品名为空
			if(data.data.name == ''){
				$('.pbc_title').hide();
				$('title').html('商品详情');
			}else{
				$('.pbc_title').html(data.data.name).show();//商品名
				$('title').html(data.data.name);
			}
			$('.price_txt').html('¥ '+ data.data.price);//参考价
			//判断是佛已采集
			if(data.data.isSeed == 0){//未采集
				$('.pp_cao').removeClass('pp_cao_ji').addClass('pp_cao').html('长草');
			}
			if(data.data.isSeed == 1){//已采集
				$('.pp_cao').addClass('pp_cao_ji').removeClass('pp_cao').html('已采集');
			}
			$('.pp_num span').html(data.data.seedNum);//收藏人数
			$('.pd_box_content_txt').html(data.data.productDesc);//商品介绍
			//商品介绍为空
			if(data.data.productDesc == ''){
				$('.pd_box_content_txt').hide();
			}else{
				$('.pd_box_content_txt').show();
				$('.pd_box_content_txt').html(data.data.productDesc);//商品介绍
			}
			//如果商品配图为空
			if(data.data.brandImg == ''){
				$('.pbu_li_img').attr('src','images/product_none_img.png');//商品配图
			}else{
				$('.pbu_li_img').attr('src',data.data.brandImg);//商品配图
			}
			$('.pbu_li_brand').html(data.data.brand);//商品品牌
			$('.pbu_li_country').html(data.data.country);//商品所属国家
			//如果品牌描述是空的
			if(data.data.brandDesc == ''){
				$('.pbu_li_content').html('暂无');//品牌描述
			}else{
				$('.pbu_li_content').html(data.data.brandDesc);//品牌描述
			}
			//推荐度
			var recommendation= data.data.recommendation;
			var startNum = Math.floor(recommendation/2);
			if(recommendation%2 == 0){
				for(var x = 0; x < startNum; x ++){
					$('.recom_start').append('<img src="images/product_start.png" alt="" />');	
				}
				for(var x = 0; x < (5-startNum); x ++){
					$('.recom_start').append('<img src="images/product_white_start.png" alt="" />');	
				}	
			}else{
				for(var x = 0; x < startNum; x ++){
					$('.recom_start').append('<img src="images/product_start.png" alt="" />');	
				}
				$('.recom_start').append('<img src="images/product_half_start.png" alt="" />');	
				for(var x = 0; x < (5-1-startNum);x ++){
					$('.recom_start').append('<img src="images/product_white_start.png" alt="" />');	
				}
			}
			
			//判断是否可购买
			if(data.data.isAllowBuy == 0){//不可购买
				$('.go_shopping').addClass('go_shopping_gray');
			}
			if(data.data.isAllowBuy == 1){//可购买
				$('.go_shopping').removeClass('go_shopping_gray');
			}
			$('.go_shopping').attr('urlStr',data.data.tb_detail_url);
			
			//微信分享
            if(isInWeixin()){
            	var title = '【南瓜姑娘】'+ data.data.name;
                var desc = data.data.productDesc;
                var link = window.location.href;
				var imgUrl = data.data.picture;
            	var from = getParam('apptype');
            	if(!strIsEmpty(from) && from == 'appb'){
            		desc = '我在南瓜姑娘，用积分换好礼，心动了嘛~？';
            	}
                weixinConfig(title,desc,link,imgUrl);
            }
			
			//h5,app同步分享内容
			if(isInApp()){
				window.shareTitle = '【南瓜姑娘】'+ data.data.name;
				window.shareContent = '我在南瓜姑娘，用积分换好礼，心动了嘛~？';
				window.sharePicture = data.data.picture;
				window.shareUrl = window.location.href;
			};
			//给安卓传值
			if(typeof(window.ngjsInterface)!="undefined" && typeof(window.ngjsInterface.conFigShareInfo)!="undefined"){
				window.ngjsInterface.conFigShareInfo('【南瓜姑娘】'+ data.data.name, '我在南瓜姑娘，用积分换好礼，心动了嘛~？',data.data.picture,window.location.href);
			};
		}else{
			alert(data.data.error);	
		}
	});
	
	//取消长草
	$('.pbc_part01').delegate('.pp_cao_ji','click',function(){
		$('.gray').show();
		var btn = $(this);
		if(isInApp() && getAppVersion() >= 2.05){
			checkAccessToken(function(){
			},function(){
				window.location.href = 'nggirl://nggirl/login?backUrl='+window.location.protocol+'//'+window.location.host+'/nggirl/h5/cosmetic/productDetails.html?seedProductId='+getParam('seedProductId')+'&targetType= '+getParam("targetType") +'&targetId='+getParam('targetId')+'&v=<%= VERSION %>';
			});
			
		}else{
			checkAccessTokenLogin(function () {
				$.post('<%= UGC_HOST_API_URL %>/nggirl/app/cli/seedproduct/deleteCollectProduct/2.3.0',getFinalRequestObject({accessToken:getAccessToken(),seedProductIds:getParam('seedProductId')}),function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						btn.html('长草').removeClass('pp_cao_ji').addClass('pp_cao');
						$('.pp_num span').html(parseInt($('.pp_num span').html())-1);
						$('.gray').hide();
					}else{
						alert(data.data.error);
					}
				});
			},'productDetails.html?seedProductId='+getParam('seedProductId'));
		}
	});
	
	//长草
	$('.pbc_part01').delegate('.pp_cao','click',function(){
		$('.gray').show();
		var btn = $(this);
		if(isInApp() && getAppVersion() >= 2.05){
			checkAccessToken(function(){
			},function(){
				window.location.href = 'nggirl://nggirl/login?backUrl='+window.location.protocol+'//'+window.location.host+'/nggirl/h5/cosmetic/productDetails.html?seedProductId='+getParam('seedProductId')+'&targetType= '+getParam("targetType") +'&targetId='+getParam('targetId')+'&v=<%= VERSION %>';
			});
		}else{
			checkAccessTokenLogin(function () {
				$.post('<%= UGC_HOST_API_URL %>/nggirl/app/cli/seedproduct/collectProduct/2.5.3',getFinalRequestObject({accessToken:getAccessToken(),seedProductId:getParam('seedProductId'),targetType:getParam('targetType'),targetId:getParam('targetId')}),function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						btn.html('已采集').addClass('pp_cao_ji').removeClass('pp_cao');
						$('.pp_num span').html(parseInt($('.pp_num span').html())+1);
						$('.gray').hide();
						if(data.data.addScore != "0"){
							alertNewScore("积分 +"+data.data.addScore);
						}
						if (/iphone|ipad|ipod/.test(ua)) {
							_czc.push(['_trackEvent','nggirl_seedproduct_collect','phoneType=iOS','商品详情页商品收藏','seedProductId',getParam('seedProductId')]);	
						} else if (/android/.test(ua)) {
							_czc.push(['_trackEvent','nggirl_seedproduct_collect','phoneType=and','商品详情页商品收藏','seedProductId',getParam('seedProductId')]);
						};
					}else{
						alert(data.data.error);
					}
				});
			},'productDetails.html?seedProductId='+getParam('seedProductId')+'&targetType= '+getParam("targetType") +'&targetId='+getParam('targetId')+'&v=<%= VERSION %>');
		}
	});
	
	//点击购买
	$('.go_shopping').click(function(e) {
        opennApp();
    });
	
	//查看大图
	$('.pd_box_img').click(function(e) {
        $('.gray_window img').attr('src',$(this).attr('src'));
		$('.gray_window').show();
		$('.gray_window img').css('margin-top',($(window).height() - $('.pd_box_img').height())/2);
    });
	
	//点击弹框消失
	$('.gray_window').click(function(e) {
        $(this).hide();
		$(this).children('img').removeAttr('src');
    });
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
                jsApiList: ["onMenuShareTimeline","onMenuShareAppMessage"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
        }
    });
}

function opennApp(){  
    var ua = window.navigator.userAgent.toLowerCase();  
    //微信  
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){  
        $('body').html('<div class="guide"><img src="<%=WEIXIN_GUIDE_BROWER_IMG%>" ></div>');
    }else{//非微信浏览器  
        if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {  
            var loadDateTime = new Date();  
            window.setTimeout(function() {  
                var timeOutDateTime = new Date();  
                if (timeOutDateTime - loadDateTime < 5) { 
                    wap_url = "https://itunes.apple.com/cn/app/nan-gua-gu-niang-yi-jian-xia/id1014850829?l=en&mt=8";//ios下载地址  
                }else{
					window.location.href="/nggirl/h5/mobile/loadProductDeatils.html?seedProductId="+getParam('seedProductId')+'&v=<%= VERSION %>';
				}
            },25);  
          }else if (navigator.userAgent.match(/android/i)) {  
            var state = null;  
            try {  
				window.location.href="/nggirl/h5/mobile/loadProductDeatils.html?seedProductId="+getParam('seedProductId')+'&v=<%= VERSION %>';
                setTimeout(function(){  
                    window.location.href= "http://a.app.qq.com/o/simple.jsp?pkgname=cn.com.nggirl.nguser"; //android下载地址  
  
                },500);  
            } catch(e) {}  
        }  
    }  
}  