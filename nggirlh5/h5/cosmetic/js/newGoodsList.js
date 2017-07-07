var page = 0;
var flag = true;
$(function(){
	localStorage.setItem("source",getParam('source'));
	localStorage.setItem('appid', getParam('appid'));
	//美物V4.0.0
	getNextPage(page);
	
	//关闭悬浮条
	$(".downLoad .closeTip").click(function(){
		$(".downLoad").hide();
		$(".content").css("margin-top","0");
	})
	
	//悬浮条打开
	$('.downLoad .gtload,.btn_box .btn').click(function(e) {
		APPCommon.openApp();
		return false;
    });
	
	//打开商品详情
	$('.content li').live('click',function(e) {
        window.location.href = "newGoodsDetails.html?itemId="+$(this).attr('itemId');
    });
})

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

function getNextPage(page){
	$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/homePage/itemList/4.0.0',getFinalRequestObject({accessToken:getAccessToken(),pageNum:page}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			if(flag){
				for(var x = 0; x < data.data.newItems.length ;x ++){
					$('.tui_ul').append('<li itemId='+data.data.newItems[x].itemId+'><img src="'+data.data.newItems[x].imgUrl+'" class="img" alt="" /><p>'+data.data.newItems[x].reamTitle+'</p><div class="tag"><span>¥'+data.data.newItems[x].salePrice+'</span></div></li>');	
				}
				$('.tui_ul li .img').height($('.tui_ul li .img').width());
				flag = false;
			}
			var recommendItems = data.data.recommendItems;
			if(recommendItems.length > 0){
				if( recommendItems.length == 20 ){
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
			}else{
				$(".pullUpIcon").hide();
			}
			for(var x = 0; x < recommendItems.length; x ++){
				$('.goods_list_ul').append('<li itemId='+data.data.recommendItems[x].itemId+'><img class="glu_left" src="'+recommendItems[x].imgUrl+'" alt="" /><div class="glu_right"><p class="gr_zhu">'+recommendItems[x].mainTitle+'</p><p class="gr_fu">'+recommendItems[x].reamTitle+'</p></div>'+splitNum(recommendItems[x].salePrice)+'</li>');		
			}
			$('.goods_list_ul li .glu_left').height($('.goods_list_ul li .glu_left').width());
		}else{	
			alert(data.data.error);	
		}
	});
}

//拆分小输掉
function splitNum(num){
	var str = num.toString();
	var arr = [];
	var endStr = '';
	if(str.indexOf('.')>=0){
		arr=str.split('.');
		endStr = '<div class="gr_price">¥'+arr[0]+'<span>.'+arr[1]+'</span>'
	}else{
		endStr = '<div class="gr_price">¥'+str+'<span>.00</span>'	
	}
	return endStr;
}

var APPCommon = {
    iphoneSchema: 'nggirl://nggirl/itemDetail?'+'type=1'+'&itemId='+getParam('itemId')+'&v=<%= VERSION %>',
    iphoneDownUrl: 'https://itunes.apple.com/cn/app/nan-gua-gu-niang-yi-jian-xia/id1014850829?l=en&mt=8',
    androidSchema: 'nggirl://nggirl/itemDetail?'+'type=1'+'&itemId='+getParam('itemId')+'&v=<%= VERSION %>',
    androidDownUrl: '<%= CLI_HOST_API_URL %>/nggirl/app/getapp/downloadAndroidApk/byChannel?channel=yingyongbao',
    openApp: function(){
        var this_  =  this;
		if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
			if(this_.isWeixin()){
				 //window.location = "http://a.app.qq.com/o/simple.jsp?pkgname=cn.com.nggirl.nguser";
				$(".isWei").css("height",$(window).height());
				$(".isWei").show();
				$('.isWei').on('click', function () {
					$(".isWei").hide();
				});
			}else{
			var loadDateTime = new Date();
			window.setTimeout(function() {
				var timeOutDateTime = new Date();
				if (timeOutDateTime - loadDateTime < 5000) {
					window.location = this_.iphoneDownUrl;//ios下载地址
				} else {
					window.close();
				}
			},1500);
			window.location = this.iphoneSchema;
			}
			
		}else if (navigator.userAgent.match(/android/i)) {
			if(this_.isWeixin()){
				$(".isWei").css("height",$(window).height());
				$(".isWei").show();
				$('.isWei').on('click', function () {
					$(".isWei").hide();
				});
	 
			}else{
				try {
					window.location = this_.androidSchema;
					setTimeout(function(){
						window.location=this_.androidDownUrl; //android下载地址
 
					},1500);
				} catch(e) {}
			}
		}
    },
    isWeixin: function(){ //判断是否是微信
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            return true;
        } else {
            return false;
        }
    }
 
};	
