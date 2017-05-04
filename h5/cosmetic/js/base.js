/*====返回顶部===*/
$(document).ready(function(){
	$(".more_top").click(function () {
        var speed=200;//滑动的速度
        $('body,html').animate({ scrollTop: 0 }, speed);
        return false;
 	});

	/*======底部导航栏跳转======*/
	$('.footer .footer-left').on('click',function(){
		window.location.href = "home_page.html?v=<%= VERSION %>";
	});
    $('.footer .footer-center').on('click',function(){
		window.location.href = "beautylist.html?v=<%= VERSION %>";
	});

	$('.footer .footer-right').on('click',function(){
		//点击个人中心,则验证登录
		checkAccessTokenLogin(function(){
			//如果验证通过就进入个人中心
			window.location.href = "mine.html?v=<%= VERSION %>";
		},'mine.html');//登录后也会进入个人中心
	});

	//关注
	if(!isInWeixin()){
		$(".click_follow").remove();
	}else{
		$(".click_follow").on("click",function(){
			window.location.href="follow.html?v=<%= VERSION %>";
		})
	}
})
