var page = 0;
$(function(){
	//获取关注用户列表
	getNextPage(page);
	
	//获取关注的化妆师
	$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/personalInfo/listInterestDresser/1.5.0',getFinalRequestObject({accessToken:getAccessToken()}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			if(data.data.length > 0){
				for(var x = 0; x < data.data.length; x ++){
					$('.tab_dresser').append('<li dresserId="'+data.data[x].dresserId+'"><div class="td_img"><img src="'+data.data[x].profile+'" alt="" /></div><div class="td_message"><div class="tm_name">'+data.data[x].name+'</div><div class="tm_tag">'+getSpecialFn(data.data[x].specials)+'</div><div class="tm_dan">最近已接<span>'+data.data[x].orderNum+'</span>单</div></div><div class="td_start">'+getStartNumFn(data.data[x].starLevel)+'</div><img src="images/black_right.png" class="td_right_arr" alt="" /></li>');	
				}	
			}else{
				$('.no_dresser').show();	
			}
		}else{
			alert(data.data.erro);	
		}
	});
	
	//到化妆师主页
	$('.tab_dresser').delegate('li','click',function(){
		window.location.href = "space.html?dresserId="+$(this).attr('dresserId')+'&v=<%= VERSION %>' ;
	});
	
	//到上门美妆
	$('.no_dresser_find').click(function(e) {
        window.location.href = "home_page.html?v=<%= VERSION %>";
    });
	
	//到首页
	$('.no_user_find').click(function(e) {
        window.location.href = "index.html?v=<%= VERSION %>";
    });
	
	//到用户主页
	$('.tab_user').delegate('li','click',function(){
        window.location.href = "myHomePage.html?userId="+$(this).attr('userId')+'&v=<%= VERSION %>';
	});
});

//化妆师擅长妆容
function getSpecialFn(tag){
	var arr = tag.split(",");
	var str = '';
	for(var x = 0; x < arr.length; x ++){
		str += '<span>'+arr[x]+'</span>';
	}
	return str;
}

//获取化妆师星级
function getStartNumFn(num){
	var str = '';
	for(var x = 0; x < num; x ++){
		str += '<img src="images/shaidan-star_03.png" alt="" />';
	}
	return str;
}

//获取用户关注列表
function getNextPage(page){
	$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/personal/getFollowedUserList/3.0.0',getFinalRequestObject({accessToken:getAccessToken(),pageSize:20,pageNum:page}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			if(data.data.length > 0){
				if(data.data.length == 20){
					$(".pullUpIcon").show();
					var tur = true;	
					$(window).scroll(function(){
						var winH = $(window).height(); //浏览器当前窗口可视区域高度  
						var pageH = $(document.body).height(); //浏览器当前窗口文档body的高度 
						var scrollT = $(window).scrollTop(); //滚动条top  
						var lastPersentH = (pageH - winH - scrollT) / winH;  
						if(tur && lastPersentH < 1){ 
						tur = false;
						setTimeout(function(){
						  PageNumPP();
						  },500);
					   }
				   });
				}else{
					$(".pullUpIcon").hide();
				}
				for(var x = 0; x < data.data.length; x ++){
					//判断是否有userRole
					if(data.data[x].userRole == undefined){
						$('.tab_user').append('<li userId="'+data.data[x].userId+'"><div class="tu_img"><img src="'+data.data[x].profile+'" alt="" /></div><div class="tu_p"><span class="tp_name">'+data.data[x].nickName+'</span> <span class="tp_dresser"></span></div><img src="images/black_right.png" alt="" class="tp_right_arr" /></li>');	
					}else{
						$('.tab_user').append('<li userId="'+data.data[x].userId+'"><div class="tu_img"><img src="'+data.data[x].profile+'" alt="" /></div><div class="tu_p"><span class="tp_name">'+data.data[x].nickName+'</span> <span class="tp_dresser">| '+data.data[x].userRole+' |</span></div><img src="images/black_right.png" alt="" class="tp_right_arr" /></li>');	
					}
				}	
			}else{
				$('.no_user').show();	
				$(".pullUpIcon").hide();
			}
		}else{
			alert(data.data.erro);	
		}
	});
}

//页数++
function PageNumPP(){
	var pageNum = $('body').data('pageNum');//在body里面存储page
	if(page == undefined || parseInt(page) == NaN){
		page = 0;
	}
	page = page + 1;
	$('body').data('page',page);
	getNextPage(page);
}

