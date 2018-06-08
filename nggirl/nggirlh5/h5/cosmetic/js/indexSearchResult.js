/*var pageTie = 0;*/
var pageTag = 0;
var pageUser = 0;
var pageCommodity = 0;

$(function(){
	var sUserAgent=navigator.userAgent.toLowerCase();
	$('.tab_tag_tag,.tab_user,.tab_commodity').height($(window).height()*0.8);
	var uniqueArr ='';
    var value = getParam('search');
	var newArr = '';
    $('.search').val(value);
	if(getParam('search') == ''){
		window.location.href = "indexSearch.html?v=<%= VERSION %>";
	}
	if(localStorage.name !='' && localStorage.name != undefined && localStorage.name != null && value !=''){
		localStorage.name = localStorage.name + value+',';
		//去除重复值
		if(localStorage.name.indexOf(value) > 0 || localStorage.name.indexOf(value) == 0){
			var arr = localStorage.name.substring(0,localStorage.name.length -1).split(',');
			//判断机型
			if(sUserAgent.match(/iphone os/i) == "iphone os"){
				arr = uniqueFn($.unique(arr));
			}else{
				arr = sortFn(uniqueFn($.unique(arr)));
			}
			
			//添加到localStorage
			for(var x = 0; x < arr.length; x ++){
				newArr += arr[x]+',';
			}
			localStorage.name = newArr;
		}
	}else{
		//value为空的处理
		if(value == ''){
			localStorage.name =localStorage.name;
		}else{
			localStorage.name = value+',';
		}
	}
	
	//搜索帖子
	/*getTieNextPage(0);*/
	
	//搜索标签
	getTagsNextPage(0);
	
	//搜索用户
	getUserNextPage(0);
	
	//搜索商品
	getCommodityNextPage(0);
	
	//取消关注用户 
	$('.tab_user').delegate("li .tab_guanzhu","click",function(e) {
		var btn= $(this);
        checkAccessTokenLogin(function () {
			//判断是否关注
			if(btn.hasClass("tab_yi_guanzhu")){//取消关注
				$.post('<%= CLI_HOST_API_URL %>/nggirl/app/cli/personal/cancelFollowUser/2.2.0',getFinalRequestObject({accessToken:getAccessToken(),followedUserId:btn.parent().attr('userId')}),function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						btn.removeClass('tab_yi_guanzhu').html('关注');
					}else{
						alert(data.data.error);	
					}	
				});
			}else{
				$.post('<%= CLI_HOST_API_URL %>/nggirl/app/cli/personal/addFollowUser/2.2.0',getFinalRequestObject({accessToken:getAccessToken(),followedUserId:btn.parent().attr('userId')}),function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						btn.addClass('tab_yi_guanzhu').html('已关注');
					}else{
						alert(data.data.error);	
					}	
				});
			}
        }, 'indexSearchResult.html' + window.location.search);
    });
	
	//点击叉号清空文本并且返回到搜索页面
	$('.sb_del').click(function(e) {
		window.location.href = "indexSearch.html?v=<%= VERSION %>";
    });
	
	//点击箭头返回搜索页面并且保存数据
	$('.sb_left_arr').click(function(e) {
		window.location.href = "indexSearch.html?v=<%= VERSION %>";
    });
	
	//点击帖子到帖子详情页面
	$('.tab_tie').delegate("li","click",function(e) {
		var ok= $(this);
		//判断帖子类型
		if(ok.attr('postType') == 1){//文章
			window.location.href="articledetail.html?postType=" + ok.attr('postType') +'&postId=' +ok.attr('postId')+'&v=<%= VERSION %>';	
		}	
		if(ok.attr('postType') == 2){//视频
			window.location.href="videoDetail.html?postType=" + ok.attr('postType') +'&postId=' +ok.attr('postId')+'&v=<%= VERSION %>';	
		}	
    });
	
	//点击带标签的帖子到帖子详情页
	$('.tab_tag_tag').delegate("li .tt_left","click",function(){
		var ok= $(this);
		//判断帖子类型
		if(ok.attr('postType') == 1){//文章
			window.location.href="articledetail.html?postType=" + ok.attr('postType') +'&postId=' +ok.attr('postId')+'&v=<%= VERSION %>';	
		}	
		if(ok.attr('postType') == 2){//视频
			window.location.href="videoDetail.html?postType=" + ok.attr('postType') +'&postId=' +ok.attr('postId')+'&v=<%= VERSION %>';	
		}	
    });
	
	//到帖子详情页面
	$('.tab_tag_tag').delegate("li .tt_right","click",function(){
		var ok= $(this);
		//判断帖子类型
		if(ok.attr('postType') == 1){//文章
			window.location.href="articledetail.html?postType=" + ok.attr('postType') +'&postId=' +ok.attr('postId')+'&v=<%= VERSION %>';	
		}	
		if(ok.attr('postType') == 2){//视频
			window.location.href="videoDetail.html?postType=" + ok.attr('postType') +'&postId=' +ok.attr('postId')+'&v=<%= VERSION %>';	
		}	
    });
	
	//文本框获得焦点返回到上一页
	$('.search').click(function(e) {
		window.location.href = "indexSearch.html?search="+getParam('search')+'&v=<%= VERSION %>';
    });
	
	//点击用户到用户主页
	$('.tab_user').delegate("li .zu","click",function(e) {
        window.location.href = "myHomePage.html?userId="+$(this).parent().attr('userId')+'&v=<%= VERSION %>';
    });
	
	//跳转到相关商品详情
	$('.tab_commodity').delegate('li','click',function(){
		window.location.href = "productDetails.html?seedProductId="+$(this).attr('seedProductId')+'&targetType=5&targetId=0'+'&v=<%= VERSION %>';	
	});

})

//搜索帖子
/*function getTieNextPage(page){
	$.post('<%= CLI_HOST_API_URL %>/nggirl/app/cli/search/postTitleSearch/2.2.0',getFinalRequestObject({accessToken:getAccessToken(),searchWord:getParam('search'),page:page,num:10}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){			
			if(data.data.length > 0){
				if( data.data.length == 10 ){
					var tur = true;	
					$('.tab_tie').scroll(function(){
						var winH = $('.tab_tie').height(); //浏览器当前窗口可视区域高度  
						var pageH = $(document.body).height(); //浏览器当前窗口文档body的高度 
						var scrollT = $('.tab_tie').scrollTop(); //滚动条top  
						var lastPersentH = (pageH - winH - scrollT) / winH;  
						if(tur && lastPersentH < 0.01){ 
							setTimeout(function(){
							PageNumTie();
							},500);
							tur = false;
						}
				   });
				}
				for(var x = 0; x < data.data.length ; x ++){
						//判断帖子类型
						if(data.data[x].postType == 1){//文章
							$('.tab_tie').append('<li postType="'+data.data[x].postType+'" postId="'+data.data[x].postId+'"><img src="'+data.data[x].picture+'" class="img_tie" /></li>');
						}
						if(data.data[x].postType == 2){//视频
							$('.tab_tie').append('<li postType="'+data.data[x].postType+'"  postId="'+data.data[x].postId+'"><img src="'+data.data[x].picture+'" class="img_tie"  /><img src="images/pause.png" class="img_pause" /></li>');
						}
				}
			}else if(data.data.length == 0 && page==0){
				$('.no_tie').show();	
				$('.tab_tie').hide();
			}
		}else{
			alert(data.data.error);	
		}	
	});
}*/

//搜索用户
function getUserNextPage(page){
	$.post('<%= CLI_HOST_API_URL %>/nggirl/app/cli/search/userSearch/2.5.6',getFinalRequestObject({accessToken:getAccessToken(),searchWord:getParam('search'),page:page,num:20}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			if(data.data.length > 0){
				if( data.data.length == 20 ){
					var tur = true;	
					$('.tab_user').scroll(function(){
						var winH = $('.tab_user').height(); //浏览器当前窗口可视区域高度  
						var pageH = $(document.body).height(); //浏览器当前窗口文档body的高度 
						var scrollT = $('.tab_user').scrollTop(); //滚动条top  
						var lastPersentH = (pageH - winH - scrollT) / winH;  
						if(tur && lastPersentH < 0.01){ 
							setTimeout(function(){
							PageNumUser();
							},500);
							tur = false;
						}
				   });
				}
				for(var x = 0; x < data.data.length ; x ++){
					//判断是否关注
					if(data.data[x].isFollowed == 0){//未关注
						//判断是否有userRole
						if(data.data[x].userRole == ''){
							$('.tab_user').append('<li userId="'+data.data[x].userId+'"><span class="zu"><img src="'+data.data[x].profile+'" class="tu_user_img" alt="" /><b class="tu_user_name" style=" max-width: 70%;">'+splitStrUserFn(getParam('search'),data.data[x].nickName)+'</b><span class="tu_dresser_name"></span></span><div class="tab_guanzhu">关注</div></li>');
						}else{
							$('.tab_user').append('<li userId="'+data.data[x].userId+'"><span class="zu"><img src="'+data.data[x].profile+'" class="tu_user_img" alt="" /><b class="tu_user_name">'+splitStrUserFn(getParam('search'),data.data[x].nickName)+'</b><span class="tu_dresser_name">&nbsp;| '+data.data[x].userRole+' |</span></span><div class="tab_guanzhu">关注</div></li>');
						}
					}
					if(data.data[x].isFollowed == 1){//已关注
						//判断是否有userRole
						if(data.data[x].userRole == ''){
							$('.tab_user').append('<li userId="'+data.data[x].userId+'"><span class="zu"><img src="'+data.data[x].profile+'" class="tu_user_img" alt="" /><b class="tu_user_name" style=" max-width: none;">'+data.data[x].nickName+'</b><span class="tu_dresser_name"></span></span><div class="tab_guanzhu tab_yi_guanzhu">已关注</div></li>');
						}else{
							$('.tab_user').append('<li userId="'+data.data[x].userId+'"><span class="zu"><img src="'+data.data[x].profile+'" class="tu_user_img" alt="" /><b class="tu_user_name">'+splitStrUserFn(getParam('search'),data.data[x].nickName)+'</b><span class="tu_dresser_name">&nbsp;| '+data.data[x].userRole+' |</span></span><div class="tab_guanzhu tab_yi_guanzhu">已关注</div></li>');
						}
					}
				}
			}else if(data.data.length == 0 && page==0){
				$('.no_user').show();
				$('.tab_user').hide();	
			}
		}else{
			alert(data.data.error);	
		}	
	});
}

//搜索标签
function getTagsNextPage(page){
	$.post('<%= CLI_HOST_API_URL %>/nggirl/app/cli/search/postSearch/2.5.6',getFinalRequestObject({accessToken:getAccessToken(),searchWord:getParam('search'),page:page,num:10}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			if(data.data.length > 0){
				if( data.data.length == 10 ){
					var tur = true;	
					$('.tab_tag_tag').scroll(function(){
						var winH = $('.tab_tag_tag').height(); //浏览器当前窗口可视区域高度  
						var pageH = $(document.body).height(); //浏览器当前窗口文档body的高度 
						var scrollT = $('.tab_tag_tag').scrollTop(); //滚动条top  
						var lastPersentH = (pageH - winH - scrollT) / winH;  
						if(tur && lastPersentH < 0.01){ 
							setTimeout(function(){
							PageNumTagFn();
							},500);
							tur = false;
						}
				   });
				}
				
				for(var x = 0; x < data.data.length ; x+=2){
					var str='';
					str+='<li><div class="tt_left" postType="'+data.data[x].postType+'" postId="'+data.data[x].postId+'"><img src="'+data.data[x].picture+'" class="img_tie" />';
					if(data.data[x].postType == 2){//视频
						str+='<img src="images/pause.png" class="img_pause" />';
					};
					if(data.data[x].labels.length > 0){
						str+='<div class="tags"><img src="images/index_tag.png" class="img_tag" alt="" />'+getSearchTagsFn(data.data[x].labels)+'</div>';
					};
					str+='</div>';
					if((x+1) < data.data.length){
						str+='<div class="tt_right" postType="'+data.data[x+1].postType+'" postId="'+data.data[x+1].postId+'"><img src="'+data.data[x+1].picture+'" class="img_tie" />';
						if(data.data[x+1].postType == 2){//视频
							str+='<img src="images/pause.png" class="img_pause" />';
						};
						if(data.data[x+1].labels.length > 0){
							str+='<div class="tags"><img src="images/index_tag.png" class="img_tag" alt="" />'+getSearchTagsFn(data.data[x+1].labels)+'</div>';
						}
						str+='</div>';
					}
					str+='</li>';
					$('.tab_tag_tag').append(str);
					/*if(data.data.length == 1){
						if(data.data[x].postType == 1){//文章
							if(data.data[x].labels.length > 0){
							  $('.tab_tag_tag').append('<li><div class="tt_left" postType="'+data.data[x].postType+'" postId="'+data.data[x].postId+'"><img src="'+data.data[x].picture+'" class="img_tie"  /><div class="tags"><img src="images/index_tag.png" class="img_tag" alt="" />'+getSearchTagsFn(data.data[x].labels)+'</div></div></li>');
							}else{
							  $('.tab_tag_tag').append('<li><div class="tt_left" postType="'+data.data[x].postType+'" postId="'+data.data[x].postId+'"><img src="'+data.data[x].picture+'" class="img_tie"  /></div></li>');
							}
						}
						if(data.data[x].postType == 2){//视频
							if(data.data[x].labels.length > 0){
								$('.tab_tag_tag').append('<li><div class="tt_left" postType="'+data.data[x].postType+'" postId="'+data.data[x].postId+'"><img src="'+data.data[x].picture+'" class="img_tie"  /><img src="images/pause.png" class="img_pause" /><div class="tags"><img src="images/index_tag.png" class="img_tag" alt="" />'+getSearchTagsFn(data.data[x].labels)+'</div></div></li>');
							}else{
								$('.tab_tag_tag').append('<li><div class="tt_left" postType="'+data.data[x].postType+'" postId="'+data.data[x].postId+'"><img src="'+data.data[x].picture+'" class="img_tie"  /><img src="images/pause.png" class="img_pause" /></div></li>');
							}
						}
					}else{
						if((x+1)>= data.data.length){
							if(data.data[x].postType == 1){//文章
								if(data.data[x].labels.length > 0){
									$('.tab_tag_tag').append('<li><div class="tt_left" postType="'+data.data[x].postType+'" postId="'+data.data[x].postId+'"><img src="'+data.data[x].picture+'" class="img_tie"  /><div class="tags"><img src="images/index_tag.png" class="img_tag" alt="" />'+getSearchTagsFn(data.data[x].labels)+'</div></div></div></li>');
								}else{
									$('.tab_tag_tag').append('<li><div class="tt_left" postType="'+data.data[x].postType+'" postId="'+data.data[x].postId+'"><img src="'+data.data[x].picture+'" class="img_tie"  /></div></li>');
								}
							}
							if(data.data[x].postType == 2){//视频
								if(data.data[x].labels.length > 0){
									$('.tab_tag_tag').append('<li><div class="tt_left" postType="'+data.data[x].postType+'" postId="'+data.data[x].postId+'"><img src="'+data.data[x].picture+'" class="img_tie"  /><img src="images/pause.png" class="img_pause" /><div class="tags"><img src="images/index_tag.png" class="img_tag" alt="" />'+getSearchTagsFn(data.data[x].labels)+'</div></div></div></li>');
								}else{
									$('.tab_tag_tag').append('<li><div class="tt_left" postType="'+data.data[x].postType+'" postId="'+data.data[x].postId+'"><img src="'+data.data[x].picture+'" class="img_tie"  /><img src="images/pause.png" class="img_pause" /></div></div></li>');
								}
							}
						}else{
							if(data.data[x].postType == 1){//文章
								if(data.data[x].labels.length > 0){
									$('.tab_tag_tag').append('<li><div class="tt_left" postType="'+data.data[x].postType+'" postId="'+data.data[x].postId+'"><img src="'+data.data[x].picture+'" class="img_tie"  /><div class="tags"><img src="images/index_tag.png" class="img_tag" alt="" />'+getSearchTagsFn(data.data[x].labels)+'</div></div><div class="tt_right" postType="'+data.data[x+1].postType+'" postId="'+data.data[x+1].postId+'"><img src="'+data.data[x+1].picture+'" class="img_tie" /><div class="tags"><img src="images/index_tag.png" class="img_tag" alt="" />'+getSearchTagsFn(data.data[x+1].labels)+'</div></div></li>');
								}else{
									if(data.data[x+1].labels.length > 0){
										$('.tab_tag_tag').append('<li><div class="tt_left" postType="'+data.data[x].postType+'" postId="'+data.data[x].postId+'"><img src="'+data.data[x].picture+'" class="img_tie"  /></div><div class="tt_right" postType="'+data.data[x+1].postType+'" postId="'+data.data[x+1].postId+'"><img src="'+data.data[x+1].picture+'" class="img_tie" /><div class="tags"><img src="images/index_tag.png" class="img_tag" alt="" />'+getSearchTagsFn(data.data[x+1].labels)+'</div></div></li>');
									}else{
										$('.tab_tag_tag').append('<li><div class="tt_left" postType="'+data.data[x].postType+'" postId="'+data.data[x].postId+'"><img src="'+data.data[x].picture+'" class="img_tie"  /></div><div class="tt_right" postType="'+data.data[x+1].postType+'" postId="'+data.data[x+1].postId+'"><img src="'+data.data[x+1].picture+'" class="img_tie" /></div></li>');
									}
								}
							}
							if(data.data[x].postType == 2){//视频
								if(data.data[x].labels.length > 0){
									$('.tab_tag_tag').append('<li><div class="tt_left" postType="'+data.data[x].postType+'" postId="'+data.data[x].postId+'"><img src="'+data.data[x].picture+'" class="img_tie"  /><img src="images/pause.png" class="img_pause" /><div class="tags"><img src="images/index_tag.png" class="img_tag" alt="" />'+getSearchTagsFn(data.data[x].labels)+'</div></div><div class="tt_right" postType="'+data.data[x+1].postType+'" postId="'+data.data[x+1].postId+'"><img src="'+data.data[x+1].picture+'" class="img_tie" postType="'+data.data[x+1].postType+'" postId="'+data.data[x+1].postId+'"  /><img src="images/pause.png" class="img_pause" /><div class="tags"><img src="images/index_tag.png" class="img_tag" alt="" />'+getSearchTagsFn(data.data[x+1].labels)+'</div></div></li>');
								}else{
									if(data.data[x+1].labels>0){
										$('.tab_tag_tag').append('<li><div class="tt_left" postType="'+data.data[x].postType+'" postId="'+data.data[x].postId+'"><img src="'+data.data[x].picture+'" class="img_tie"  /><img src="images/pause.png" class="img_pause" /></div><div class="tt_right" postType="'+data.data[x+1].postType+'" postId="'+data.data[x+1].postId+'"><img src="'+data.data[x+1].picture+'" class="img_tie" postType="'+data.data[x+1].postType+'" postId="'+data.data[x+1].postId+'"  /><img src="images/pause.png" class="img_pause" /><div class="tags"><img src="images/index_tag.png" class="img_tag" alt="" />'+getSearchTagsFn(data.data[x+1].labels)+'</div></div></li>');
									}else{
										$('.tab_tag_tag').append('<li><div class="tt_left" postType="'+data.data[x].postType+'" postId="'+data.data[x].postId+'"><img src="'+data.data[x].picture+'" class="img_tie"  /><img src="images/pause.png" class="img_pause" /></div><div class="tt_right" postType="'+data.data[x+1].postType+'" postId="'+data.data[x+1].postId+'"><img src="'+data.data[x+1].picture+'" class="img_tie" postType="'+data.data[x+1].postType+'" postId="'+data.data[x+1].postId+'"  /><img src="images/pause.png" class="img_pause" /></div></li>');
									}
								}
							}
						}
					}*/
				}
			}else if(data.data.length == 0 && page==0){
				$('.no_tag').show();
				$('.tab_tag_tag').hide();	
			}
		}else{
			alert(data.data.error);	
		}	
	});
}

//搜索商品
function getCommodityNextPage(page){
	$.post('<%= CLI_HOST_API_URL %>/nggirl/app/cli/search/seedProductSearch/2.5.6',getFinalRequestObject({accessToken:getAccessToken(),searchWord:getParam('search'),pageNum:page,pageSize:20}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){			
			if(data.data.length > 0){
				if( data.data.length == 20 ){
					var tur = true;	
					$('.tab_commodity').scroll(function(){
						var winH = $('.tab_commodity').height(); //浏览器当前窗口可视区域高度  
						var pageH = $(document.body).height(); //浏览器当前窗口文档body的高度 
						var scrollT = $('.tab_commodity').scrollTop(); //滚动条top  
						var lastPersentH = (pageH - winH - scrollT) / winH;  
						if(tur && lastPersentH < 0.01){ 
							setTimeout(function(){
							PageNumCommodity();
							},500);
							tur = false;
						}
				   });
				}
				for(var x = 0; x < data.data.length ; x ++){
					//判断该用户是否已经种草
					//是否已种草，0未种草，1已种草
					if(data.data[x].isSeed == 0){
						$('.tab_commodity').append('<li seedProductId="'+data.data[x].seedProductId+'"><div class="box"><div class="box_fanwei"><img class="box_img" src="'+data.data[x].picture+'"></div><p class="box_name">'+splitStrUserFn(getParam('search'),data.data[x].name)+'</p><div class="box_message"><div class="bm_left"><span class="bl_p">参考价：</span><span class="bl_price">¥'+data.data[x].price+'</span></div><div class="bm_right"><img src="images/zhangcao1.png" class="cao_icon" alt="" /><span class="br_num">'+caoNumFn(data.data[x].seedNum)+'</span></div></div></div></li>');	
					}else{
						$('.tab_commodity').append('<li seedProductId="'+data.data[x].seedProductId+'"><div class="box"><div class="box_fanwei"><img class="box_img" src="'+data.data[x].picture+'"></div><p class="box_name">'+splitStrUserFn(getParam('search'),data.data[x].name)+'</p><div class="box_message"><div class="bm_left"><span class="bl_p">参考价：</span><span class="bl_price">¥'+data.data[x].price+'</span></div><div class="bm_right"><img src="images/zhangcao2.png" class="cao_icon" alt="" /><span class="br_num">'+caoNumFn(data.data[x].seedNum)+'</span></div></div></div></li>');	
					}
				}
			}else if(data.data.length == 0 && page==0){
				$('.no_commodity').show();	
				$('.tab_commodity').hide();
			}
		}else{
			alert(data.data.error);	
		}	
	});
}


//获取搜索标签
function getSearchTagsFn(tags){
	var str = '';
	if(tags.length > 0){
		for(var x = 0; x < tags.length && x < 3; x ++){
			str += splitStrTieFn(getParam('search'),tags[x]);
		}
	}
	return ' '+str;
}

//帖子页数++
function PageNumTie(){
	var pageTie = $('body').data('pageTie');//在body里面存储page
	if(pageTie == undefined || parseInt(pageTie) == NaN){
		pageTie = 0;
	}
	pageTie = pageTie + 1;
	$('body').data('pageTie',pageTie);
	getTieNextPage(pageTie);
}	

//标签页数++
function PageNumTagFn(){
	var pageTag = $('body').data('pageTag');//在body里面存储page
	if(pageTag == undefined || parseInt(pageTag) == NaN){
		pageTag = 0;
	}
	pageTag = pageTag + 1;
	$('body').data('pageTag',pageTag);
	getTagsNextPage(pageTag);
}	

//用户页数++
function PageNumUser(){
	var pageUser = $('body').data('pageUser');//在body里面存储page
	if(pageUser == undefined || parseInt(pageUser) == NaN){
		pageUser = 0;
	}
	pageUser = pageUser + 1;
	$('body').data('pageUser',pageUser);
	getUserNextPage(pageUser);
}	

//商品页数++
function PageNumCommodity(){
	var pageCommodity = $('body').data('pageCommodity');//在body里面存储page
	if(pageCommodity == undefined || parseInt(pageCommodity) == NaN){
		pageCommodity = 0;
	}
	pageCommodity = pageCommodity + 1;
	$('body').data('pageCommodity',pageCommodity);
	getCommodityNextPage(pageCommodity);
}	

//去除数组
function uniqueFn(arr) {
    var result = [], hash = {};
    for (var i = 0, elem; (elem = arr[i]) != null; i++) {
        if (!hash[elem]) {
            result.push(elem);
            hash[elem] = true;
        }
    }
    return result;
}

//逆向排序数组
function sortFn(arr){
	var strArr = [];
	for(var x = 0; x < arr.length; x ++){
		strArr.unshift(arr[x]);
	}	
	return strArr;
}

//判断长草数量是否超过999
function caoNumFn(num){
	if(num > 999){
		return '999+';	
	}else{
		return num;	
	}
}

//拆分字符串(帖子)
function splitStrTieFn(str,para){
	var searchStr= new Array();
	var endStr ='';
	searchStr = str.split('');
	searchStr.push(str);
	//console.log(searchStr);
	var startStr = '';
	for(var x = 0; x < searchStr.length; x ++){
		if(para.indexOf(searchStr[x])>=0){
			var regS = new RegExp(searchStr[x],"g");
			endStr = '<b class="blue">'+searchStr[x]+'</b>';
			para = para.replace(regS,endStr)
		}
	}
	if(para.indexOf('</b>') != -1){
		para = '<span style=" border:1px solid #50c8b4;">'+para+'</span> ';
	}else{
		para = '<span>'+para+'</span> ';
	}
	return para;
}

//拆分字符串（用户，商品）
function splitStrUserFn(str,para){
	var regS = new RegExp("<em>","g");
	var regS1 = new RegExp("</em>","g");
	var startStr = '<span style="color:#50c8b4;">';
	var paras = para.replace(regS,startStr).replace(regS1,"</span>");
	/*
	var searchStr= new Array();
	var endStr ='';
	searchStr = str.split('');
	searchStr.push(str);
	for(var x = 0; x < searchStr.length; x ++){
		if(para.indexOf(searchStr[x])>=0){
			var regS = new RegExp(searchStr[x],"g");
			endStr = '<span style=" color:#50c8b4;">'+searchStr[x]+'</span>';
			para = paras.replace(regS,endStr);
		}
	}*/
	return paras;
}
