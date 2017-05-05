var page = 0;
$(function(e){
	getNextPage(0);
	//点击不同的帖子类型跳转到对应的详情页面
	$('.box').delegate('li','click',function(){
		//判断帖子类型
		if($(this).attr('postType') == 1){//文章
			if (/iphone|ipad|ipod/.test(ua)) {
				_czc.push(['_trackEvent','nggirl_column_post_article_view','phoneType=iOS','文章浏览','postId',$(this).attr('postId')]);	
			} else if (/android/.test(ua)) {
				_czc.push(['_trackEvent','nggirl_column_post_article_view','phoneType=and','文章浏览','postId',$(this).attr('postId')]);
			};
			window.location.href="articledetail.html?postType=" + $(this).attr('postType') +'&postId=' +$(this).attr('postId')+'&v=<%= VERSION %>';	
		}	
		if($(this).attr('postType') == 2){//视频
			if (/iphone|ipad|ipod/.test(ua)) {
				_czc.push(['_trackEvent','nggirl_column_post_video_view','phoneType=iOS','视频浏览','postId',$(this).attr('postId')]);	
			} else if (/android/.test(ua)) {
				_czc.push(['_trackEvent','nggirl_column_post_video_view','phoneType=and','视频浏览','postId',$(this).attr('postId')]);
			};
			window.location.href="videoDetail.html?postType=" + $(this).attr('postType') +'&postId=' +$(this).attr('postId')+'&v=<%= VERSION %>';	
		}	
	});
})

function getNextPage(page){
	//通过带过来的专栏编号来加载对应的专题数据
	$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/homePage/getPostListByColumn/3.0.0',getFinalRequestObject({columnId:getParam('columnId'),pageNum:page}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			if( data.data.length == 10 ){
				var tur = true;	
				$(window).scroll(function(){
					var winH = $(window).height(); //浏览器当前窗口可视区域高度  
					var pageH = $(document.body).height(); //浏览器当前窗口文档body的高度 
					var scrollT = $(window).scrollTop(); //滚动条top  
					var lastPersentH = (pageH - winH - scrollT) / winH;  
					if(tur && lastPersentH < 0.001){ 
					setTimeout(function(){
					PageNumPP();
					},500);
					tur = false;
				   } 
			   });
			}
			
			for(var x = 0; x < data.data.length; x ++){
				//判断帖子类型
				if(data.data[x].postType == 1){//文章
					$('.box ul').append('<li postType="'+data.data[x].postType+'" postId="'+data.data[x].postId+'"><img data-original="'+data.data[x].detailImg+'" alt="" class="posts lazy" /></li>');	
				}
				if(data.data[x].postType == 2){//视频
					$('.box ul').append('<li postType="'+data.data[x].postType+'" postId="'+data.data[x].postId+'"><img data-original="'+data.data[x].detailImg+'" alt="" class="posts lazy" /><img data-original="images/pause.png" alt="" class="pause lazy" /></li>');	
				}
			}
			$("img.lazy").lazyload({threshold :180});
			$("img.lazy").on("load",function(){
				setImgHeightFn();
				$('.box ul li').height($('.box ul li').width()*5/3);
			});
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

//设置图片高度
function setImgHeightFn(){
	$(".box ul li img.posts").each(function() {
		var del=$(this);
		var img_url =$(this).attr("data-original");
		// 创建对象
		var img = new Image();
		var imgwidth=img.width;
		var imgheight=img.height;
		// 改变图片的src
		img.src = img_url;
		var width1=$(".box ul li").width();
		var height1=$(".box ul li").height();
		if(img.width*5/3 > img.height ){
			del.css({"height":"100%","width":"auto"});
			var ht=(width1-height1*img.width/img.height)/2;
			del.css("margin-left",ht+"px");
		}else{
			del.css({"width":"100%","height":"auto"});
			var wl=(height1-width1*img.height/img.width)/2;
			del.css("margin-top",wl+"px");
		}
	});
};
