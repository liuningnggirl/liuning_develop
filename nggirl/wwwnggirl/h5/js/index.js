// JavaScript Document
$(function(){	
	$(".row .report a,.row .report1 a").on("mouseover",function(){
		$(this).addClass("hoverOn");
	})
	$(".row .report a,.row .report1 a").on("mouseout",function(){
		$(this).removeClass("hoverOn");
	})

	$(".btn").on("click",function(){
		if (navigator.userAgent.match(/android/i)) { 
			var ua = navigator.userAgent.toLowerCase();
   		    if (ua.match(/MicroMessenger/i) == "micromessenger") {
				downloadImg();
			}else{
				window.location.href="loadAppHome.html";
				return false;
			}
		}else{
			window.location.href="loadAppHome.html";
			return false;
		}
		
	})
	$(".winheight").height($(window).height());
	$(".nav-right .span1").on("click",function(){
		window.location.href="index.html";
	})
	$(".nav-right .span2").on("click",function(){
		window.location.href="media.html";
	})
	$(".nav-right .span3").on("click",function(){
		window.location.href="aboutUs.html";
	})
	$('#myCarousel').carousel({
		interval: 2000
	})
	$("#myCarousel").carousel('cycle');
	$('#myCarousel').hammer().on('swipeleft', function(){
		$(this).carousel('next');
	});
	$('#myCarousel').hammer().on('swiperight', function(){
		$(this).carousel('prev');
	});
	
})
function downloadImg(){
	var gray_boxs = document.createElement('div');
	gray_boxs.setAttribute('class','isWei');
	var ab_title = document.createElement('img');
	ab_title.src="<%=WEIXIN_GUIDE_BROWER_IMG%>";
	gray_boxs.appendChild(ab_title);
	document.body.appendChild(gray_boxs);
	
	//弹框样式
	gray_boxs.style.zIndex=10000;
	gray_boxs.style.position = 'fixed';
	gray_boxs.style.top = '0';
	gray_boxs.style.left = '0';
	gray_boxs.style.width = '100%';
	gray_boxs.style.color = '#fff';
	ab_title.style.position = 'absolute';
	ab_title.style.top = '0';
	ab_title.style.left = '0';
	ab_title.style.width = '100%';
	document.body.style.height = '100%';
}