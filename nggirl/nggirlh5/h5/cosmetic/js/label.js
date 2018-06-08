// JavaScript Document
$(function(){
	var size=10;
	getLabelInfo(0,10);
	$('.box ul li').live('click',function(e) {
		//判断帖子类型
		if($(this).attr('postType') == 1){//文章
			window.location.href="articledetail.html?postType=" + $(this).attr('postType') +'&postId=' +$(this).attr('postId')+'&v=<%= VERSION %>';	
		}	
		if($(this).attr('postType') == 2){//视频
			window.location.href="videoDetail.html?postType=" + $(this).attr('postType') +'&postId=' +$(this).attr('postId')+'&v=<%= VERSION %>';	
		}	
    });
})

//获取帖子列表
function getLabelInfo(page,size){
	//通过带过来的专栏编号来加载对应的专题数据
	$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/post/getPostListByLabel/3.0.0',getFinalRequestObject({labelName:getParam("labelName"),page:page,num:size}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			$("title").html(getParam("labelName"));
			$(".myartical h3").html(getParam("labelName"));
			if(data.data.length > 0){
					$(".nonelist").hide();
					$(".conlumn_list").show();
					$("body").css("background","#e6eeec");
				}
				if( data.data.length == size ){
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
						$('.box ul').append('<li postType="'+data.data[x].postType+'" postId="'+data.data[x].postId+'" class="page'+page+'"><img data-original="'+data.data[x].detailImg+'" alt="" class="posts lazy" /></li>');	
					}
					if(data.data[x].postType == 2){//视频
						$('.box ul').append('<li postType="'+data.data[x].postType+'" postId="'+data.data[x].postId+'" class="page'+page+'"><img data-original="'+data.data[x].detailImg+'" alt="" class="posts lazy" /><img data-original="images/pause.png" alt="" class="pause lazy" /></li>');	
					}
				}
				$('.box ul li').height($('.box ul li').width()*5/3);
				$(".page"+page+" img.lazy").lazyload({effect : "fadeIn",threshold : 200});
				$(".page"+page+" img.lazy").on("load",function(){
				imgaa();
			});
		}else{
			alert(data.data.error);	
		}
	});	
}
//页数++
function PageNumPP(){
	var size=10;
	var page = $('body').data('page');//在body里面存储page
	if(page == undefined || parseInt(page) == NaN){
		page = 0;
	}
	page = page + 1;
	$('body').data('page',page);
	getLabelInfo(page,size);
	imgaa();
}	
function imgaa(){
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
