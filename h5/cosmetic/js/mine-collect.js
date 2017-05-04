var zhuangPage = 1;
var tiePage = 1;
var tieNum = 0;		
var zhuangNum = 0;		
var caoNum = 0;		
$(function(){
	TouchSlide({slideCell:"#leftTabBox",
		endFun:function(i){ //高度自适应
			var bd = document.getElementById("leftTabBox_db");
			effect:"leftLoop";
			if(i == 0){
				$('.tab_zhuang,.tab_cao,.zhuang_manage,.cao_manage').hide();
				$('.tab_tie,.tie_manage').show();
				tieStatusLength();
			}else if(i == 1){
				$('.tab_tie,.tab_cao,.tie_manage,.cao_manage').hide();
				$('.tab_zhuang,.zhuang_manage').show();
				zhuangStatusLength();
			}
			if(i>0)bd.parentNode.style.transition="200ms";//添加动画效果
		}
	});
	$('.no_tie ,.no_zhuang').css("min-height",$(window).height()-184);
	//获取收藏的妆容
	zhuangNextPage(0);
	
	//获取收藏的帖子
	tieNextPage(0);
	
	//点击收藏的对应的作品，跳转到相应作品详情页
	$('.tab_zhuang').delegate('li .opecity_box','click',function(){
		window.location.href="workDetails.html?workId=" + $(this).parent().attr('workid')+'&v=<%= VERSION %>';
	});
	
	//点击收藏的对应的帖子，跳转到相应帖子详情页
	$('.tab_tie').delegate('li .img_tie','click',function(e){
		var ok= $(this).parent();
		//判断帖子类型
		if(ok.attr('postType') == 1){//文章
			window.location.href="articledetail.html?postType=" + ok.attr('postType') +'&postId=' +ok.attr('postId')+'&v=<%= VERSION %>';	
		}	
		if(ok.attr('postType') == 2){//视频
			window.location.href="videoDetail.html?postType=" + ok.attr('postType') +'&postId=' +ok.attr('postId')+'&v=<%= VERSION %>';	
		}	
	});
	
	//点击妆容里的查看更多
	$('.zhuang_look_more').click(function(e) {
        zhuangNextPage(zhuangPage ++);
    });
	
	//点击帖子里的查看更多
	$('.tie_look_more').click(function(e) {
        tieNextPage(tiePage ++);
    });
	
	//帖子里的去发现
	$('.no_tie .go_find').click(function(e) {
        window.location.href="index.html?v=<%= VERSION %>";
    });
		
	//妆容里的去发现
	$('.no_zhuang .go_find').click(function(e) {
        window.location.href="home_page.html?v=<%= VERSION %>";
    });
	
	//点击帖子里的“管理”按钮
	$('.tie_manage .manage_btn').click(function(e) {
		$(this).hide();
        $('.tie_manage .manage_double_btn,.tab_tie_opacity_box,.tie_white_sanjiao,.tie_select').show();
    });
	
	//点击妆容里的“管理”按钮
	$('.zhuang_manage .manage_btn').click(function(e) {
		$(this).hide();
        $('.zhuang_manage .manage_double_btn,.tab_zhuang_opacity_box,.zhuang_white_sanjiao,.zhuang_select').show();
    });
	
	//点击帖子里的“取消”按钮
	$('.tie_manage .mdb_cancle').click(function(e) {
        $('.tie_manage .manage_double_btn,.tab_tie_opacity_box,.tie_white_sanjiao,.tie_select,.tab_tie_gray_box').hide();
        $('.tie_manage .manage_btn').show();
		$('.tie_manage .mdb_del').css('background','#b3b3b3');
		$('.tie_select').attr('src','images/collect_no_select.png');
		//遍历所有帖子，把选中的sel标签删掉
		$('.tab_tie li').each(function(index, element) {
            $(this).removeAttr('sel');
        });
    });
	
	//点击妆容里的“取消”按钮
	$('.zhuang_manage .mdb_cancle').click(function(e) {
        $('.zhuang_manage .manage_double_btn,.tab_zhuang_opacity_box,.zhuang_white_sanjiao,.zhuang_select,.tab_zhuang_gray_box').hide();
        $('.zhuang_manage .manage_btn').show();
		$('.zhuang_manage .mdb_del').css('background','#b3b3b3');
		$('.zhuang_select').attr('src','images/collect_no_select.png');
		//遍历所有妆形，把选中的sel标签删掉
		$('.tab_zhuang li').each(function(index, element) {
            $(this).removeAttr('sel');
        });
    });
	
	//选中妆形
	$('.zhuang_select').live('click',function(e) {
		//判断是否选中
		if(typeof($(this).parent().attr('sel')) == "undefined"){
			$(this).attr('src','images/collect_ok_select.png');
			$(this).parent().attr('sel','del');
			$(this).prev().prev().prev.show();
			zhuangNum ++;
		}else{
			$(this).attr('src','images/collect_no_select.png');
			$(this).parent().removeAttr('sel');
			$(this).prev().prev().hide();
			zhuangNum --;
		}
		if(zhuangNum > 0){
			$('.mdb_del').css('background','#50c8b4');	
		}else{
			$('.mdb_del').css('background','#b3b3b3');	
		}
    });
	
	$('.tab_zhuang_opacity_box').live('click',function(e) {
		//判断是否选中
		if(typeof($(this).parent().attr('sel')) == "undefined"){
			$(this).next().next().next().attr('src','images/collect_ok_select.png');
			$(this).parent().attr('sel','del');
			$(this).next().show();
			zhuangNum ++;
		}else{
			$(this).next().next().next().attr('src','images/collect_no_select.png');
			$(this).parent().removeAttr('sel');
			$(this).next().hide();
			zhuangNum --;
		}
		if(zhuangNum > 0){
			$('.mdb_del').css('background','#50c8b4');	
		}else{
			$('.mdb_del').css('background','#b3b3b3');	
		}
    });
	
	//选中种草
	$('.cao_select').live('click',function(e) {
		//判断是否选中
		if(typeof($(this).parent().attr('sel')) == "undefined"){
			$(this).attr('src','images/collect_ok_select.png');
			$(this).parent().attr('sel','del');
			$(this).prev().prev().show();
			caoNum ++;
		}else{
			$(this).attr('src','images/collect_no_select.png');
			$(this).parent().removeAttr('sel');
			$(this).prev().prev().hide();
			caoNum --;
		}
		if(caoNum > 0){
			$('.mdb_del').css('background','#50c8b4');	
		}else{
			$('.mdb_del').css('background','#b3b3b3');	
		}
    });
		
	$('.tab_tie_opacity_box').live('click',function(e) {
		//判断是否选中
		if(typeof($(this).parent().attr('sel')) == "undefined"){
			$(this).next().next().next().attr('src','images/collect_ok_select.png');
			$(this).next().show();
			$(this).parent().attr('sel','del');
			tieNum ++;
		}else{
			$(this).next().next().next().attr('src','images/collect_no_select.png');
			$(this).parent().removeAttr('sel');
			$(this).next().hide();
			tieNum --;
		}
		if(tieNum > 0){
			$('.tie_manage .mdb_del').css('background','#50c8b4');	
		}else{
			$('.tie_manage .mdb_del').css('background','#b3b3b3');	
		}
    });

	//删除收藏的帖子
	$('.tie_manage .mdb_del').click(function(e) {
		var btn = $(this);
		var tieStr = '';
        $('.tab_tie li').each(function(index, element) {
			if(typeof($(this).attr('sel')) != "undefined"){
				tieStr += '{"postType":' + $(this).attr('postType')+','+'"postId":' + $(this).attr('postId')+'},';
			}
        });
		tieStr = '['+tieStr.substring(0,tieStr.length -1)+']';
		//判断按钮可否点击
		if(tieStr != '[]'){
			$.post('<%= CLI_HOST_API_URL %>/nggirl/app/cli/personalInfo/deleteCollectedPosts/2.2.0',getFinalRequestObject({accessToken:getAccessToken(),posts:tieStr}),function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					$('.tab_tie li').each(function(index, element) {
						if(typeof($(this).attr('sel')) != "undefined"){
							$('.tie_manage .mdb_del').css('background','#b3b3b3');
							$(this).remove();
							//当前帖子数量为0的情况
							tieStatusLength();
						}
					});
				}else{
					window.location.href="login_new.html?v=<%= VERSION %>";
				}
			});
		}
    });
	
	//删除收藏的妆容 
	$('.zhuang_manage .mdb_del').click(function(e) {
		var btn = $(this);
		var zhuangStr = '';
        $('.tab_zhuang li').each(function(index, element) {
			if(typeof($(this).attr('sel')) != "undefined"){
				zhuangStr += $(this).attr('workId')+',';
			}
        });
		zhuangStr = zhuangStr.substring(0,zhuangStr.length -1);
		//判断按钮可否点击
		if(zhuangStr != ''){
			$.post('<%= CLI_HOST_API_URL %>/nggirl/app/cli/personalInfo/deleteCollectedWorks/2.2.0',getFinalRequestObject({accessToken:getAccessToken(),workIds:zhuangStr}),function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					$('.tab_zhuang li').each(function(index, element) {
						if(typeof($(this).attr('sel')) != "undefined"){
							$('.zhuang_manage .mdb_del').css('background','#b3b3b3');
							$(this).remove();
							//当前妆容数量为0的情况
							zhuangStatusLength();
						}
					});
				}else{
					window.location.href="login_new.html?v=<%= VERSION %>";
				}
			});
		}
    });
	
	//跳转到商品详情
	$('.tab_cao').delegate(".cao_opcity_box","click",function(e){
		e.stopPropagation();
	});
	
	
});

//查看更多，获取下一页收藏帖子列表
function tieNextPage(tiePage){
	//获取收藏的帖子
	$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/personalInfo/collect/listColumnPost/2.0.0',getFinalRequestObject({accessToken:getAccessToken(),pageNum:tiePage}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			//判断是否收藏了帖子
			if(data.data.length == 0){
				$('.no_tie').show();
				$('.tie_look_more').hide();	
			}else{
				if(data.data.length == 0 || data.data.length < 20){
					$('.tie_look_more').hide();
				}
				for(var x = 0; x < data.data.length; x ++){
					//判断帖子类型
					if(data.data[x].postType == 1){//文章
						$('.tab_tie').append('<li postType="'+data.data[x].postType+'" postId="'+data.data[x].postId+'"><img data-original="'+data.data[x].picture+'" class="lazy img_tie" /><div class="tab_tie_opacity_box"></div><div class="tab_tie_gray_box"></div><img src="images/tie_white_sanjiao.png" class="tie_white_sanjiao"><img src="images/collect_no_select.png" class="tie_select" /></li>');
					}
					if(data.data[x].postType == 2){//视频
						$('.tab_tie').append('<li postType="'+data.data[x].postType+'"  postId="'+data.data[x].postId+'"><img data-original="'+data.data[x].picture+'" class="lazy img_tie"  /><img src="images/pause.png" class="img_pause lazy" /><div class="tab_tie_opacity_box"></div><div class="tab_tie_gray_box"></div><img src="images/white_sanjiao.png" class="tie_white_sanjiao"><img src="images/collect_no_select.png" class="tie_select" /></li>');
					}
					$("img.lazy").lazyload({effect : "fadeIn"});
				}
			}
		}else{
			window.location.href="login_new.html?v=<%= VERSION %>";
		}
	});
}

//查看更多，获取下一页收藏妆容列表
function zhuangNextPage(zhuangPage){
	//获取收藏的妆容
	$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/personalInfo/collect/listWork/2.0.0',getFinalRequestObject({accessToken:getAccessToken(),pageNum:zhuangPage}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			//判断是否收藏了妆容
			if(data.data.length == 0){
				$('.no_zhuang').show();	
				$('.zhuang_look_more').hide();
			}else{
				if(data.data.length == 0 || data.data.length < 20){
					$('.zhuang_look_more').hide();	
				}
				for(var x = 0; x < data.data.length; x ++){
					//判断专题是否有折扣(0:没有折扣)
					if(data.data[x].hasDiscount == 0){
						$('.tab_zhuang').append('<li workid="'+data.data[x].workId+'"><div class="opecity_box"></div><div class="bc-left"><div class="bl-top"><img src="'+data.data[x].cover+'" alt="" class="lazy" /></div><div class="bl-bottom"><div class="bb-left"><img src="images/Rectangle 18 Copy@640.png" class="like-people" alt="" /><span class="num"> '+data.data[x].likeNum+'</span><span class="like">人喜欢 |</span></div><div class="bb-right"><span class="order-num">'+data.data[x].resNum+'</span>人预约</div></div></div><div class="bc-right"><img src="'+data.data[x].ornament+'" class="br-img" alt="" /><p class="br-txt">'+data.data[x].content+'</p><del class="yuan-price"></del><span class="xian-price">'+'¥'+data.data[x].cost+'</span></div><div class="tab_zhuang_opacity_box"></div><div class="tab_zhuang_gray_box"></div><img src="images/white_sanjiao.png" class="zhuang_white_sanjiao"><img src="images/collect_no_select.png" class="zhuang_select" /></li>');
					}
					//有折扣
					if(data.data[x].hasDiscount == 1){
						$('.tab_zhuang').append('<li workid="'+data.data[x].workId+'"><div class="opecity_box"></div><div class="bc-left"><div class="bl-top"><img src="'+data.data[x].cover+'" alt="" class="lazy" /><img class="half" src="'+data.data[x].discount.icon+'" /></div><div class="bl-bottom"><div class="bb-left"><img src="images/Rectangle 18 Copy@640.png" class="like-people" alt="" /><span class="num"> '+data.data[x].likeNum+'</span><span class="like">人喜欢 |</span></div><div class="bb-right"><span class="order-num">'+data.data[x].resNum+'</span>人预约</div></div></div><div class="bc-right"><img src="'+data.data[x].ornament+'" class="br-img" alt="" /><p class="br-txt">'+data.data[x].content+'</p><del class="yuan-price">'+'¥'+data.data[x].cost+'</del><span class="xian-price">'+'¥'+data.data[x].discount.cost+'</span></div><div class="tab_zhuang_opacity_box"></div><div class="tab_zhuang_gray_box"></div><img src="images/white_sanjiao.png" class="zhuang_white_sanjiao"><img src="images/collect_no_select.png" class="zhuang_select" /></li>');
					}
					$("img.lazy").lazyload({effect : "fadeIn",threshold : 200});
				}
			}
		}else{
			window.location.href="login_new.html?v=<%= VERSION %>";
		}
	});
}

//当前帖子数量为0的情况
function tieStatusLength(){
	if($('.tab_tie li').length == 0){
		$('.no_tie').show();
		$('.tie_manage').hide();	
	}else{
		$('.no_tie').hide();
		$('.tie_manage').show();
	}
}

//当前妆容数量为0的情况
function zhuangStatusLength(){
	if($('.tab_zhuang li').length == 0){
		$('.no_zhuang').show();	
		$('.zhuang_manage').hide();
	}else{
		$('.no_zhuang').hide();
		$('.zhuang_manage').show();
	}
}
