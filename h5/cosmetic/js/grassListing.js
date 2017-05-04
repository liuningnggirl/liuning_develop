var pageShou = 0;
var pageNoshou = 0;
$(function(){
	getShouNextPage(pageShou);
	getNoshouNextPage(pageNoshou);
	TouchSlide({slideCell:"#leftTabBox",
		endFun:function(i){ //高度自适应
			var bd = document.getElementById("leftTabBox_db");
			effect:"leftLoop";
			if(i == 0){
				$('.tab_no_shou').hide();
				$('.tab_ok_shou').show();
			}else if(i == 1){
				$('.tab_no_shou').show();
				$('.tab_ok_shou').hide();
			}
			if(i>0)bd.parentNode.style.transition="200ms";//添加动画效果
		}
	});
	$('.con').height($(window).height()-50);
	
	//点击去逛逛
	$('.tab_shou_ok,.tab_shou_no').click(function(e) {
        window.location.href="index.html?v=<%= VERSION %>";
    });
	
	//打开详情
	$('.con .tab_ok_shou').delegate("li","click",function(){
		window.location.href = "productDetails.html?seedProductId="+ $(this).attr('seedProductId')+'&targetType='+$(this).attr('targetType')+'&targetId='+$(this).attr('targetId')+'&v=<%= VERSION %>';
	});
	$('.con .tab_no_shou').delegate("li","click",function(){
		window.location.href = "goodsShareCatenate.html?itemId="+ $(this).attr('seedProductId')+'&targetType='+$(this).attr('targetType')+'&v=<%= VERSION %>';
	});
});

//获取推荐度
function getRecommendationFn(recommendation){
	var startNum = Math.floor(recommendation/2);
	var str = '';
	if(recommendation%2 == 0){
		for(var x = 0; x < startNum; x ++){
			str +='<img src="images/product_start.png" alt="" />';	
		}
		for(var x = 0; x < (5-startNum); x ++){
			str += '<img src="images/product_white_start.png" alt="" />';	
		}	
	}else{
		for(var x = 0; x < startNum; x ++){
			str += '<img src="images/product_start.png" alt="" />';	
		}
		str += '<img src="images/product_half_start.png" alt="" />';	
		for(var x = 0; x < (5-1-startNum);x ++){
			str += '<img src="images/product_white_start.png" alt="" />';	
		}
	}
	return str;
}

//已开售页数++
function PageNumShou(){
	var pageShou = $('body').data('pageShou');//在body里面存储page
	if(pageShou == undefined || parseInt(pageShou) == NaN){
		pageShou = 0;
	}
	pageShou = pageShou + 1;
	$('body').data('pageShou',pageShou);
	getShouNextPage(pageShou);
}	

//未开售页数++
function PageNumNoshou(){
	var pageNoshou = $('body').data('pageNoshou');//在body里面存储page
	if(pageNoshou == undefined || parseInt(pageNoshou) == NaN){
		pageNoshou = 0;
	}
	pageNoshou = pageNoshou + 1;
	$('body').data('pageNoshou',pageNoshou);
	getNoshouNextPage(pageNoshou);
}	

function getShouNextPage(page){
	//获取长草清单
	$.get('<%= UGC_HOST_API_URL %>/nggirl/app/cli/seedproduct/ListCollectProduct/2.5.0',
	getFinalRequestObject({accessToken:getAccessToken(),isStartSell:'1',pageNum:page,pageSize:20}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			if(data.data.length > 0){
				if( data.data.length == 20){
					var tur = true;	
					$(window).scroll(function(){
						var winH = $(window).height(); //浏览器当前窗口可视区域高度  
						var pageH = $(document.body).height(); //浏览器当前窗口文档body的高度 
						var scrollT = $(window).scrollTop(); //滚动条top  
						var lastPersentH = (pageH - winH - scrollT) / winH;  
						if(tur && lastPersentH < 0.01){ 
							setTimeout(function(){
							PageNumShou();
							},500);
							tur = false;
						}
				   });
				}
				$('.tab_ok_shou').prev().hide();
				for(var x = 0; x < data.data.length; x ++){
					$('.tab_ok_shou').append('<li targetId="'+data.data[x].targetId+'" targetType="'+data.data[x].targetType+'" seedProductId="'+data.data[x].seedProductId+'"><img class="cao_img" src="'+data.data[x].picture+'" alt="" /><div class="tc_left"><p class="tl_kinds_name">'+data.data[x].name+'</p><p class="tl_kinds_price">参考价<span>：¥'+data.data[x].price+'</span></p><p class="tl_kinds_start">推荐度：<span>'+getRecommendationFn(data.data[x].recommendation)+'</span></p></div><div class="tc_num"><span>'+data.data[x].seedNum+'</span>人已采集</div></li>');	
				}
			}else if(data.data.length == 0 && page!=0){
				$('.tab_ok_shou').prev().hide();
			}else{
				$('.tab_ok_shou').prev().show();	
			}
		}else{
			alert(data.data.error);	
		}
		$('.tl_kinds_name').width($(window).width()* 93 /160);
	});
}


function getNoshouNextPage(page){
	//获取长草清单
	$.get('<%= UGC_HOST_API_URL %>/nggirl/app/cli/seedproduct/ListCollectProduct/2.5.0',
	getFinalRequestObject({accessToken:getAccessToken(),isStartSell:'0',pageNum:page,pageSize:20}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			if(data.data.length > 0){
				if( data.data.length == 20 ){
					var tur = true;	
					$(window).scroll(function(){
						var winH = $(window).height(); //浏览器当前窗口可视区域高度  
						var pageH = $(document.body).height(); //浏览器当前窗口文档body的高度 
						var scrollT = $(window).scrollTop(); //滚动条top  
						var lastPersentH = (pageH - winH - scrollT) / winH;  
						if(tur && lastPersentH < 0.01){ 
							setTimeout(function(){
							PageNumShou();
							},500);
							tur = false;
						}
				   });
				}
				$('.tab_no_shou').prev().hide();
				for(var x = 0; x < data.data.length; x ++){
					$('.tab_no_shou').append('<li targetId="'+data.data[x].targetId+'" targetType="'+data.data[x].targetType+'" seedProductId="'+data.data[x].seedProductId+'"><img class="cao_img" src="'+data.data[x].picture+'" alt="" /><div class="tc_left"><p class="tl_kinds_name">'+data.data[x].name+'</p><p class="tl_kinds_price">参考价<span>：¥'+data.data[x].price+'</span></p><p class="tl_kinds_start">推荐度：<span>'+getRecommendationFn(data.data[x].recommendation)+'</span></p></div><div class="tc_num"><span>'+data.data[x].seedNum+'</span>人已采集</div></li>');	
				}
			}else if(data.data.length == 0 && page!=0){
				$('.tab_no_shou').prev().hide();
			}else{
				$('.tab_no_shou').prev().show();	
			}
		}else{
			alert(data.data.error);	
		}
	});
	$('.tl_kinds_name').width($(window).width()* 93 /160);
}


