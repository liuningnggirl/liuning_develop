// JavaScript Document
$(function(){
	getGoodsList(0,10);
	$(".back").live('click',function(){
		if(getParam('postType') == 1){//文章
			if (/iphone|ipad|ipod/.test(ua)) {
				_czc.push(['_trackEvent','nggirl_column_post_article_view','phoneType=iOS','文章浏览','postId',getParam('postId')]);	
			} else if (/android/.test(ua)) {
				_czc.push(['_trackEvent','nggirl_column_post_article_view','phoneType=and','文章浏览','postId',getParam('postId')]);
			};
			window.location.href="articledetail.html?postType=" + getParam('postType') +'&postId=' +getParam('postId')+'&v=<%= VERSION %>';	
		}	
		if(getParam('postType') == 2){//视频
			if (/iphone|ipad|ipod/.test(ua)) {
				_czc.push(['_trackEvent','nggirl_column_post_video_view','phoneType=iOS','视频浏览','postId',getParam('postId')]);	
			} else if (/android/.test(ua)) {
				_czc.push(['_trackEvent','nggirl_column_post_video_view','phoneType=and','视频浏览','postId',getParam('postId')]);
			};
			window.location.href="videoDetail.html?postType=" + getParam('postType') +'&postId=' +getParam('postId')+'&v=<%= VERSION %>';	
		}	
	});
});
function getGoodsList(page,size){
	var del=$(this);
    $.ajax({//采用异步
			type: "get",
			url: '<%= UGC_HOST_API_URL %>/nggirl/app/cli/post/getSeedProductList/2.5.3',
			data:getFinalRequestObject({accessToken:getAccessToken(),postId:getParam("postId"),postType:getParam("postType"),pageNum:page,pageSize:size}),
			dataType:"json",
			success: function (data) {
				if(data.code == 0){
					var str='';
					if(data.data.length == 0 && page == 0){
						str += '<div class="noneGoods"><img src="images/waitzhangcao.png"><p>等待商品长草中...</p><p class="back">再看看</p></div>';
					}else if(data.data.length == 0 && page != 0){
						alertFn("没有更多了~");
					}
					$.each(data.data,function(key,val){
						str += '<li ><div class="box" seedProductId="'+val.seedProductId+'"><img class="seeProduct" src="'+val.picture+'">';
						str +='<p class="title">'+val.name+'</p>';
						str +='<p class="price">参考价：<span>¥ '+val.price+'</p>';
						if(val.isSeed == "0"){
							str +='<p class="zhongcao zhongcao1">'+val.seedNum+'</p>';
						}else{
							str +='<p class="zhongcao zhongcao2">'+val.seedNum+'</p>';
						}
						if(val.isAllowBuy == "0"){
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
				url: '<%= UGC_HOST_API_URL %>/nggirl/app/cli/seedproduct/collectProduct/2.5.3',
				data:getFinalRequestObject({accessToken:getAccessToken(),seedProductId:seedProductId,targetType:1,targetId:getParam('postId')}),
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
	}, 'goodsList.html' + window.location.search);
	return false;
});
//点击商品跳转到商品详情页
	$(".seeProduct").live('click',function(){
		if (/iphone|ipad|ipod/.test(ua)) {
			_czc.push(['_trackEvent','nggirl_column_post_seedProduct_view','phoneType=iOS','帖子商品浏览','seedProductId',$(this).parent().attr("seedProductId")]);	
		} else if (/android/.test(ua)) {
			_czc.push(['_trackEvent','nggirl_column_post_seedProduct_view','phoneType=and','帖子商品浏览','seedProductId',$(this).parent().attr("seedProductId")]);
		};
		if(getParam('postType') == 1){//文章
			window.location.href="productDetails.html?seedProductId=" +$(this).parent().attr("seedProductId") +'&targetType='+1+'&targetId='+getParam("postId")+'&v=<%= VERSION %>';	
		}	
		if(getParam('postType') == 2){//视频
			window.location.href="productDetails.html?seedProductId=" +$(this).parent().attr("seedProductId") +'&targetType='+2+'&targetId='+getParam("postId")+'&v=<%= VERSION %>';	
		}	
	});
//点击购买
	$('.goToBuy2').die('click');
	$('.goToBuy2').live('click',function(e) {
		var del = $(this);
		var delId = $(this).parent().attr("seedproductId");
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
		}, 'goodsList.html' + window.location.search);
    });