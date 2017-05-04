// JavaScript Document
$(function(){
	
	getGoodsSaleDetail();
	getGoodsList(0,10);
	
});
function getGoodsSaleDetail(){
    $.ajax({//采用异步
			type: "get",
			url: '<%= UGC_HOST_API_URL %>/nggirl/app/cli/seedProductColumn/getColumnInfo/2.5.4',
			data:getFinalRequestObject({columnId:getParam("columnId")}),
			dataType:"json",
			success: function (data) {
				if(data.code == 0){
					var str='';
					$("title").text(data.data.name);
					str += '<div class="headImg"><img src="'+data.data.headImg+'"></div><p>'+data.data.content+'</p>';
					$(".saletop").append(str);
					$(".headImg").height($(window).width()/2);
					
					//微信分享
					if(isInWeixin()){
						var title = '【南瓜姑娘】'+ data.data.name;
						var desc = data.data.content;
						var link = window.location.href;
						var imgUrl = data.data.headImg;
						var from = getParam('apptype');
						if(!strIsEmpty(from) && from == 'appb'){
							desc = data.data.content;
						}
						weixinConfig(title,desc,link,imgUrl);
					}
					
					//h5,app同步分享内容
					if(isInApp()){
						window.shareTitle ='【南瓜姑娘】'+ data.data.name;
						window.shareContent = data.data.content;
						window.sharePicture = data.data.headImg;
						window.shareUrl = window.location.href;
					};	
					//给安卓传值
					if(typeof(window.ngjsInterface)!="undefined" && typeof(window.ngjsInterface.conFigShareInfo)!="undefined"){
						window.ngjsInterface.conFigShareInfo('【南瓜姑娘】'+ data.data.name, data.data.content,data.data.headImg,window.location.href);
					};
				}else{
					alert(data.data.error);	
				}
			},
		});
};
function getGoodsList(page,size){
	var del=$(this);
    $.ajax({//采用异步
			type: "get",
			url: '<%= UGC_HOST_API_URL %>/nggirl/app/cli/seedProductColumn/getProductList/2.5.4',
			data:getFinalRequestObject({accessToken:getAccessToken(),columnId:getParam("columnId"),pageNum:page,pageSize:size}),
			dataType:"json",
			success: function (data) {
				if(data.code == 0){
					var str='';
					if(data.data.length == 0 && page == 0){
						str += '<div class="noneGoods"><img src="images/cao.png"><p>暂无商品</p></div>';
					}
					$.each(data.data,function(key,val){
						str += '<li><div class="box" seedProductId="'+val.seedProductId+'"><img class="seeProduct" src="'+val.picture+'">';
						str +='<p class="title">'+val.name+'</p>';
						str +='<p class="price">参考价：<span>¥ '+val.price+'</p>';
						if(val.isSeed == "0"){
							str +='<p class="zhongcao zhongcao1">'+val.seedNum+'</p>';
						}else{
							str +='<p class="zhongcao zhongcao2">'+val.seedNum+'</p>';
						}
						if(val.tb_detail_url == ""){
							str +='<p class="goToBuy goToBuy1">去买</p></div>';
						}else{
							str +='<p class="goToBuy goToBuy2" urlStr="'+val.tb_detail_url+'">去买</p></div>';
						}
						str +='</div></li>';	
					});
					if(data.data.length == size){
						 var tur = true;	
						 $(window).scroll(function(){
							 var winH = $(window).height(); //页面可视区域高度  
							 var pageH = $(".goodsList").height();  
							 var scrollT = $(window).scrollTop(); //滚动条top  
							 var aa = (pageH - winH - scrollT) / winH;  
							 if(tur && aa < 0.02){ 
								setTimeout(function(){
								  getMoreGoods();
								  },500);
								  tur = false;
							   } 
					    });
					 }else{
					 	$(".pullUpIcon").hide();
					 }
					$(".goodsList").append(str);
				}else{
					alert(data.data.error);	
				}
			},
		});
};
function getMoreGoods(){
		var page = $('body').data('page');
		if(page == undefined || parseInt(page) == NaN){
			page = 0;
		}
		page = page + 1;
		var size = 10;
		$('body').data('page',page);
		getGoodsList(page,size);
	}	
//点击长草按钮
$(".zhongcao").live('click',function(){
	var del=$(this);
	var seedProductId=$(this).parent().attr("seedProductId");
	if(isInApp() && getAppVersion() >= 2.05){
		checkAccessToken(function(){
		},function(){
			window.location.href = 'nggirl://nggirl/login?backUrl='+window.location.protocol+'//'+window.location.host+'/nggirl/h5/cosmetic/goodsSale.html?columnId='+getParam('columnId')+'&v=<%= VERSION %>';
		});
		
	}else{
		checkAccessTokenLogin(function () {
			 var data = getFinalRequestObject({
				 accessToken: getAccessToken()
			 });
			if(del.hasClass("zhongcao2")){
				$.ajax({//采用异步取消长草
					type: "post",
					url: '<%= UGC_HOST_API_URL %>/nggirl/app/cli/seedproduct/deleteCollectProduct/2.3.0',
					data:getFinalRequestObject({accessToken:getAccessToken(),seedProductIds:seedProductId}),
					timeout:15000,//10s
					dataType:"json",
					success: function (data) {
						if(data.code == 0){
							del.addClass("zhongcao1").removeClass("zhongcao2");
							var delnum=del;
							delnum.text(parseInt(delnum.text())-1);
						}else{
							alert(data.data.error);
						}	
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						//console.log( XMLHttpRequest )
						//$(".main").html("尚未发布任何信息！");
					}
				});
			}else{
				$.ajax({//采用异步长草
					type: "post",
					url:'<%= UGC_HOST_API_URL %>/nggirl/app/cli/seedproduct/collectProduct/2.5.3',
					data:getFinalRequestObject({accessToken:getAccessToken(),seedProductId:seedProductId,targetType:4,targetId:getParam('columnId')}),
					timeout:15000,//10s
					dataType:"json",
					success: function (data) {
						if(data.code == 0){
							if (/iphone|ipad|ipod/.test(ua)) {
								_czc.push(['_trackEvent','nggirl_column_post_seedProduct_collect','phoneType=iOS','商品收藏','seedProductId',$(this).parent().attr("seedProductId")]);	
							} else if (/android/.test(ua)) {
								_czc.push(['_trackEvent','nggirl_column_post_seedProduct_collect','phoneType=and','商品收藏','seedProductId',$(this).parent().attr("seedProductId")]);
							};
							del.addClass("zhongcao2").removeClass("zhongcao1");
							var delnum=del;
							delnum.text(parseInt(delnum.text())+1);
							if(data.data.addScore != "0"){
								alertNewScore("积分 +"+data.data.addScore);
							}
						}else{
							alert(data.data.error);
						}	
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						//console.log( XMLHttpRequest )
						//$(".main").html("尚未发布任何信息！");
					}
				});
			};
		}, 'goodsSale.html' + window.location.search);
		return false;
	}
	
	
	
});
//点击商品跳转到商品详情页
	$(".seeProduct").live('click',function(){
		/*if (/iphone|ipad|ipod/.test(ua)) {
			_czc.push(['_trackEvent','nggirl_column_post_seedProduct_view','phoneType=iOS','帖子商品浏览','seedProductId',$(this).parent().attr("seedProductId")]);	
		} else if (/android/.test(ua)) {
			_czc.push(['_trackEvent','nggirl_column_post_seedProduct_view','phoneType=and','帖子商品浏览','seedProductId',$(this).parent().attr("seedProductId")]);
		};*/
		window.location.href="productDetails.html?seedProductId=" +$(this).parent().attr("seedProductId") +'&targetType='+4+'&targetId='+getParam("columnId")+'&v=<%= VERSION %>';	
			
	});
//点击购买
	$('.goToBuy2').die('click');
	$('.goToBuy2').live('click',function(e) {
		var del = $(this);
		var delId = $(this).parent().attr("seedproductId");
		if(isInApp() && getAppVersion() >= 2.05){
			checkAccessToken(function(){
			},function(){
				window.location.href = 'nggirl://nggirl/login?backUrl='+window.location.protocol+'//'+window.location.host+'/nggirl/h5/cosmetic/goodsSale.html?columnId='+getParam('columnId')+'&v=<%= VERSION %>';
			});
			
		}else{
			checkAccessTokenLogin(function () {
				if (/iphone|ipad|ipod/.test(ua)) {
					_czc.push(['_trackEvent','nggirl_relevant_product_gobuy','phoneType=iOS','去买按钮','seedProductId',delId]);	
				} else if (/android/.test(ua)) {
					_czc.push(['_trackEvent','nggirl_relevant_product_gobuy','phoneType=and','去买按钮','seedProductId',delId]);
				};
				//alert(delId);
				//判断如果是在微信打开
				if(isInWeixin()){
					$('.isWei').show();	
				}else{
					$('.isWei').hide();	
					window.location.href = del.attr('urlStr');
				}
			}, 'goodsSale.html' + window.location.search);
		}
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
