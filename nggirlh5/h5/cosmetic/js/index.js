var page = 0;
var sUserAgent=navigator.userAgent.toLowerCase();
$(function(){
	//获取轮播图
	$.get('<%= UGC_HOST_API_URL %>/nggirl/app/cli/works/listHeadScroll/2.5.6',getFinalRequestObject({accessToken:getAccessToken()}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			var str = '';
			for(var x = 0; x < data.data.length; x ++){
				if(x==0){
					str += ('<li><a href="'+data.data[x].webpageUrl+'" target="_blank"><img src="'+data.data[x].photoUrl+'" ></a></li>');
				}else{
					str +=  ('<li><a href="'+data.data[x].webpageUrl+'" target="_blank"><img data-original="'+data.data[x].photoUrl+'" class="lazys"></a></li>');
				}
			}
			$('.slider ul').append(str);
			$('.slider').yxMobileSlider({during:3000});
			$(window).resize();
		}else{
			alert(data.data.error);	
		}
	});
	
	$('.box_content').width($(window).width());
	
	//获取首页专栏帖子列表
	getNextPage(0);
	$(".workdetail").live("click",function(){
		window.location.href="home_page.html?v=<%= VERSION %>";
	});
	$(".beautylist").live("click",function(){
		window.location.href="beautylist.html?v=<%= VERSION %>";
	});
	//点击专栏对应的查看更多，跳转到查看更多页面
	$('.more').live('click',function(e){
		window.location = "indexLookMore.html?v=<%= VERSION %>&columnId=" + $(this).attr('id');
	});
	$('.box').delegate('div','click',function(e){
		window.location = "indexLookMore.html?v=<%= VERSION %>&columnId=" + $(this).attr('id');
	});
	$('.content').delegate('span','click',function(e){
		window.location = "indexLookMore.html?v=<%= VERSION %>&columnId=" + $(this).attr('id');
	});
	
	//点击不同的帖子类型跳转到对应的详情页面
	$('.swiper-slide').live('click',function(){
		//判断帖子类型
		if($(this).attr('postType') == 1){//文章
			if (/iphone|ipad|ipod/.test(ua)) {
				_czc.push(['_trackEvent','nggirl_column_post_article_view','phoneType=iOS','文章浏览','postId',$(this).attr('postId')]);	
			} else if (/android/.test(ua)) {
				_czc.push(['_trackEvent','nggirl_column_post_article_view','phoneType=and','文章浏览','postId',$(this).attr('postId')]);
			};
			window.location.href="articledetail.html?v=<%= VERSION %>&postType=" + $(this).attr('postType') +'&postId=' +$(this).attr('postId');
		}	
		if($(this).attr('postType') == 2){//视频
			if (/iphone|ipad|ipod/.test(ua)) {
				_czc.push(['_trackEvent','nggirl_column_post_video_view','phoneType=iOS','视频浏览','postId',$(this).attr('postId')]);	
			} else if (/android/.test(ua)) {
				_czc.push(['_trackEvent','nggirl_column_post_video_view','phoneType=and','视频浏览','postId',$(this).attr('postId')]);
			};
			window.location.href="videoDetail.html?v=<%= VERSION %>&postType=" + $(this).attr('postType') +'&postId=' +$(this).attr('postId');
		}	
	});	
	
	//搜索框获得焦点跳转到搜索页面
	$('.search').focus(function(e) {
        window.location.href = "indexSearch.html?v=<%= VERSION %>";
    });
});

//获取专栏图片
function getImgFn(posts){
	var str = '';
	for(var x = 0; x < posts.length; x ++){
		//判断帖子类型
		if(posts[x].postType == 1){//文章
			str += '<div class="swiper-slide" postId="'+posts[x].postId+'" postType="'+posts[x].postType+'"><img data-original="'+posts[x].picture+'" class="posts lazy" alt="" /></div>'
		}
		if(posts[x].postType == 2){//视频
			str += '<div class="swiper-slide" postId="'+posts[x].postId+'" postType="'+posts[x].postType+'"><img src="images/pause.png" class="img_pause" /><img data-original="'+posts[x].picture+'" class="posts lazy" alt="" /></div>'
		}
	}
	//$("img.lazy").lazyload({effect : "show"});
	return str;
}

//获取更多数据
function getNextPage(page){
	$.get('<%= UGC_HOST_API_URL %>/nggirl/app/cli/column/getPostList/2.0.0',getFinalRequestObject({pageNum:page}),function(data){
		var data =$.parseJSON(data);
		if(data.code == 0){
			if(data.data.length > 0){
				if( data.data.length == 4 ){
					$(".pullUpIcon").show();
					var tur = true;	
					$(window).scroll(function(){
						var winH = $(window).height(); //浏览器当前窗口可视区域高度  
						var pageH = $(document.body).height(); //浏览器当前窗口文档body的高度 
						var scrollT = $(window).scrollTop(); //滚动条top  
						var lastPersentH = (pageH - winH - scrollT) / winH;  
						if(tur && lastPersentH < 0.02){ 
						tur = false;
						setTimeout(function(){
						  PageNumPP();
						  },500);
					   } 
				   });
				}else{
					$(".pullUpIcon").hide();
				}
			}else{
				$(".pullUpIcon").hide();
			}
			
			//当加载的数据条目数为0条或者小于五条时则不显示查看更多按钮
			for(var x = 0; x < data.data.length; x ++){
				//判断是否显示查看更多
				if(data.data[x].hasMore == 0){//没有
					$('.box').append('<div class="content" id="'+data.data[x].id+'" style="background:url('+data.data[x].bgimg+'); background-size: 100% 100%;"><span class="content_title" id="'+data.data[x].id+'">'+data.data[x].name+'</span><div class="swiper-container'+x+'" swiper-container-box"><div class="swiper-wrapper">'+getImgFn(data.data[x].posts)+'</div></div></div>');
					$("img.lazy").lazyload({effect : "show"});
				}
				if(data.data[x].hasMore == 1){//有
					$('.box').append('<div class="content" id="'+data.data[x].id+'" style="background:url('+data.data[x].bgimg+'); background-size: 100% 100%;"><span class="content_title" id="'+data.data[x].id+'">'+data.data[x].name+'</span><div class="swiper-container'+x+'" swiper-container-box"><div class="swiper-wrapper">'+getImgFn(data.data[x].posts)+'<div class="swiper-slide swiper-slide-more" style="margin-top: 23%;"><img src="images/blue-more.png" style="border:none; width:80px;  box-shadow:none; margin:0px; padding:0px;" class="more" alt="" id="'+data.data[x].id+'" /></div></div></div></div>');
					$("img.lazy").lazyload({effect : "show"});
				}
				$("img.lazy").lazyload({effect : "show"});
				new Swiper('.swiper-container'+x+'', {
				onSlideChangeEnd: function(swiper,even){
				  $("img.lazy").lazyload({effect : "show"});
				},
				pagination: '.swiper-pagination',
				slidesPerView: 2.1,
				paginationClickable: true,
				spaceBetween: 15,
				slidesOffsetAfter:15,
				runCallbacksOnInit : true,
				freeMode: true});
			}
			$("img.lazy").lazyload({effect : "show"});
			$('.content').height($('.content').width());
		}else{
			alert(data.data.error);
		}
	});
}

//页数++
function PageNumPP(){
	var page = $('body').data('page');//在body里面存储page
	if(page == undefined || parseInt(page) == NaN){
		page = 0;
	}
	page = page + 1;
	$('body').data('page',page);
	getNextPage(page);
}

