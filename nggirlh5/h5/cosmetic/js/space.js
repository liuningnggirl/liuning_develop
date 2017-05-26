$(function(){
	//进入化妆师页的友盟统计
	if (/iphone|ipad|ipod/.test(ua)) {
		_czc.push(['_trackEvent','nggirl_dresser_browse','phoneType=iOS','浏览化妆师主页','true','']);	
	} else if (/android/.test(ua)) {
		_czc.push(['_trackEvent','nggirl_dresser_browse','phoneType=and','浏览化妆师主页','true','']);
	};
	$(".s_main").live('click',function(){
		if (/iphone|ipad|ipod/.test(ua)) {
			_czc.push(['_trackEvent','nggirl_ClickWorks','phoneType=iOS','点击作品','true','']);	
		} else if (/android/.test(ua)) {
			_czc.push(['_trackEvent','nggirl_ClickWorks','phoneType=and','点击作品','true','']);
		};
	});
	getselettopmessage();
	var mnum = 0;
	var pageSize = 20;
	var pageSize1 = 20;
	var pageSize2 = 20;
//加载第一页
	loadDressers(0,20);
	servicephoto(0,20);
	loadDresserslist(0,20);
	//$("img.lazy").lazyload({effect : "fadeIn",threshold : 200});
function getParam(name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r!=null) return unescape(r[2]); return null;
}

function strIsEmpty(str){
	if(str == undefined || str == null || $.trim(str).length == 0){
		return true;
	}
	return false;
}	

// 从地址栏和本地存储中获取accessToken，地址栏参数优先
function getAccessToken(){
	var accessToken = '';
	var appAccessToken = localStorage.accessToken;
	var queryAccessToken = getParam("accessToken");
	if(!strIsEmpty(appAccessToken) || !strIsEmpty(queryAccessToken) ){
		accessToken = !strIsEmpty(queryAccessToken) ? queryAccessToken:appAccessToken;
	}
	
	// localStorage中始终存储最新的accessToken
	localStorage.accessToken = accessToken;
	return accessToken;
}


//化妆师个人信息
function getselettopmessage(){
$.ajax({//采用异步
	type: "get",
	url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/dresser/getDresserInfo/1.5.0',
	data:getFinalRequestObject({accessToken:getAccessToken(),dresserId:getParam("dresserId")}),
	timeout:15000,//10s
	dataType:"json",
	success: function (data) {//<img src="'+data.data.profile+'">
		var str = "";
		str +='<div class="h_top" dresserId="'+data.data.dresserId+'" >';
		if(data.data.followed==0){
		str +='<span class="attention" followid="'+data.data.followed+'">关注</span>';
		}else{
			str +='<span class="attention attention1" followid="'+data.data.followed+'">已关注</span>';
			}
		if(data.data.isVDresser==0){
			}else{
				str +='<img src="images/plusv_03.png" class="addv">';
			}
        str +='<div class="h_photo"><div class="h_photos"><img src="'+data.data.profile+'@80Q'+'"></div></div>';
        str +='</div><div class="detailbox">';
        str +='<p class="d_name">化妆师: <span>';
		if(data.data.dresserName.length>7){
			var strn=data.data.dresserName;
			str += strn.substring(0,7)+"..." ; 
			}else{
		str +=data.data.dresserName;
			}
		str +='</span>';
		if(data.data.sex==0){
			str +='<img src="images/boy.png"></p>';
		}else{
			str +='<img src="images/girl.png"></p>';
			}
		str +='<p class="d_start">';
		for(var i = 1;i <= data.data.starLevel;i++){
			str +='<img src="images/xing.png"/>';
		}
        str +='</p><div class="d_label">';
		if(data.data.specials== null || data.data.specials== ""){
			str +='';
			}else{
				str +=getWorkTags3(data.data.specials);
			}
        str +='</div><div class="d_work clearfix">';
		if(data.data.serviceYear==null){
			str +='<p class="d-left ">从业0年</p>';
			}else{
        	str +='<p class="d-left ">从业'+data.data.serviceYear+'年</p>';
			}
        str +='<p class="d-right">接单量：'+data.data.orderNum+'</p></div>';
        str +='<ul class="h_bot clearfix"><li class="aboutme"><img src="images/self_orange.png"><p>关于我</p></li><li class="userprise"><img src="images/prize_orange.png"><p>用户评价</p></li><li class="servicecircle"><img src="images/adress_orange.png"><p>服务商圈</p></li></ul></div>';
		$(".upheader").append(str);
		$(".head img").attr("src",data.data.cover+'@80Q');
		
		//微信分享
		if(isInWeixin()){
			var title = '【南瓜姑娘】化妆师'+data.data.dresserName+'的主页';
			var desc = '闺蜜越来越美，原来是约了私人化妆师！快来瞅瞅TA的主页吧~';
			var link = window.location.href;
			var imgUrl = data.data.profile;
			var from = getParam('apptype');
			if(!strIsEmpty(from) && from == 'appb'){
				desc = '闺蜜越来越美，原来是约了私人化妆师！快来瞅瞅TA的主页吧~';
			}
			weixinConfig(title,desc,link,imgUrl);
		}
		
		//h5,app同步分享内容
		if(isInApp() && typeof(window.ngjsInterface) != "undefined" && typeof(window.ngjsInterface.conFigShareInfo) != "undefined"){
			window.ngjsInterface.conFigShareInfo('【南瓜姑娘】化妆师'+data.data.dresserName+'的主页','闺蜜越来越美，原来是约了私人化妆师！快来瞅瞅TA的主页吧~',data.data.profile,window.location.href);
		};
		//h5,app同步分享内容
		if(isInApp()){
			window.shareTitle = '【南瓜姑娘】化妆师'+data.data.dresserName+'的主页';
			window.shareContent = '闺蜜越来越美，原来是约了私人化妆师！快来瞅瞅TA的主页吧~';
			window.sharePicture = data.data.profile;
			window.shareUrl = window.location.href;
		};	
	},
	error: function (XMLHttpRequest, textStatus, errorThrown) {
		//console.log( XMLHttpRequest )
		//$(".main").html("尚未发布任何信息！");
	}
});
}

function getWorkTags3(specials){
		var str = ''; 
		var datas=specials;
		var strs= new Array(); //定义一数组 
		strs=datas.split(","); //字符分割 
		for( var t=0;t<strs.length;t++){
			str +='<span>';
			str += strs[t];
			str +='</span>';
		}
		return str;
	}

//化妆师上门美妆作品列表
function loadDresserslist(pageNum1,pageSize1){
$.ajax({//采用异步
	type: "get",
	url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/dresser/listWork/1.5.0',
	data:getFinalRequestObject({dresserId:getParam("dresserId"),pageNum:pageNum1,pageSize:pageSize1}),
	dataType:"json",
	success: function (data) {
		var spacework = data.data;
		console.log(spacework);
		var str2 = '';
		$('.center .s_btn').remove();
		var h1=(parseInt($(window).width())*0.48+59)*spacework.length+(parseInt($(window).width())*0.48+59)*pageSize1*pageNum1+50;
		$(".center").attr("height",h1);
		for(i = 0; i<spacework.length; i++){
			//判断是否为首单五折
			if(spacework[i].hasDiscount == 1){
				str2 = '<li class="s_main s_main'+pageNum1+'"  id="'+ spacework[i].id +'"><a href="workDetails.html?workId='+ spacework[i].discount.workId +'&v=<%= VERSION %>" ><div class="s_left"><div class="imgbox"><img  data-original="'+spacework[i].cover+'@80Q" class="cover lazy"><img src="'+spacework[i].discount.icon+'"class="activecion"></div><span class="forruler"><img src="images/Rectangle 18 Copy@640.png" alt=""/>'+ spacework[i].likeNum+'人喜欢</span><span class="forruler1"><img src="images/people-icon_03.png" alt=""/>'+ spacework[i].resNum+'人预约</span></div><div class="s_right"><img src="'+spacework[i].ornament+'" class="lazy"><p class="s_name">'+spacework[i].content+'</p><p class="oldprizebox">¥ <b >'+spacework[i].cost+'</b></p><p class="s_prise s_prisetop"><b href="#">¥</b>'+spacework[i].discount.cost+'</p></div></a></li>';
				$(".center").append(str2);
			}else{
				str2 = '<li class="s_main s_main'+pageNum1+'"><a href="workDetails.html?workId='+ spacework[i].workId +'&v=<%= VERSION %>"><div class="s_left clearfix"><div class="imgbox"><img  data-original="'+spacework[i].cover+'@80Q" class="cover lazy"></div><span class="forruler"><img src="images/Rectangle 18 Copy@640.png" alt=""/>'+ spacework[i].likeNum+'人喜欢</span><span class="forruler1"><img src="images/people-icon_03.png" alt=""/>'+ spacework[i].resNum+'人预约</span></div><div class="s_right"><img src="'+spacework[i].ornament+'" class="lazy"><p class="s_name">'+spacework[i].content+'</p><p class="s_prise"><b href="#">¥</b>'+spacework[i].cost+'</p></div></a></li>';
				$(".center").append(str2);
			}
		}
		$(".imgbox .cover,.imgbox").css("height",parseInt($(window).width())*0.48);
		$(".s_main"+pageNum1+" img.lazy").lazyload({effect : "fadeIn",threshold : 200});
		
		if(spacework.length==0 && pageNum1 == 0){
			$(".center").append('<div class="nonebeauty"><img src="images/orange_meizhuang.png" class="lazy"><p>暂时没有上门美妆</p></div>');
			}
		if( data.data.length >= pageSize1){
			$('.center').append('<div class="s_btn" id="s_btn1" >查看更多</div>');
		}
		$(".center .s_btn").unbind('click');
		$(".center .s_btn").on("click", getMoreDresserslist);
	},
	

	});
	
}

//化妆师服务实拍作品列表
function servicephoto(pageNum2,pageSize2){
$.ajax({//采用异步
	type: "get",
	url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/dresser/listPost/1.5.0',
	data:getFinalRequestObject({dresserId:getParam("dresserId"),pageNum:pageNum2,pageSize:pageSize2}),
	dataType:"json",
	success: function (data) {
		var postwork = data.data;
		$('.center1 .s_btn').remove();
		for(i = 0; i<postwork.length; i++){
			var str5 = '';
			str5 += '<li class="page'+pageNum2+'"><a  >';
			for(var x = 0;x < postwork[i].photoList.length; x++){
				if(postwork[i].photoList[x].photoUrl != ""){
				str5 +='<img data-original="'+postwork[i].photoList[x].photoUrl+"@80Q"+'" class="lazy imgshow "  />';
				}
			}
			str5 += '<p class="s_descript">'+postwork[i].descrip+'</p>';
			str5 += '<p class="s_detail">'+getLocalTime(postwork[i].publishTime)+'';
			str5 += '<span><b>'+postwork[i].likeNum+'</b>人喜欢';
			if(postwork[i].isLiked== 1){
				str5 +='<img src="images/lnum.png" alt="" postId="'+ postwork[i].postId +'" isLike="'+0+'"/></span></p>';
			}else{
				str5 +='<img src="images/unlike.png" alt="" postId="'+ postwork[i].postId +'" isLike="'+1+'"/></span></p>';
			}
			str5 += '</a></li>';
			$(".center1").append(str5);
		}
		
		$(".page"+pageNum2+" img.lazy").lazyload({effect : "fadeIn",threshold : 200});
		if(postwork.length==0 && pageNum2 == 0){
			$(".center1").append('<div class="nonebeauty"><img src="images/orange_shipai.png"><p>暂时没有服务实拍</p></div>');
			}
		if( data.data.length >= pageSize2){
				$('.center1').append('<div class="s_btn" >查看更多</div>');
				}
			$(".center1 .s_btn").unbind('click');
			$(".center1 .s_btn").on("click", getMorephoto);
	},

});
}
$(".imgshow").width($(window).width());
//化妆师美妆沙龙作品列表

function loadDressers(pageNum,pageSize){
	$.ajax({//采用异步
		type: "get",
		url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/dresser/listSalon/1.5.0',
		data:getFinalRequestObject({dresserId:getParam("dresserId"),pageNum:pageNum,pageSize:pageSize}),
		dataType:"json",
		success: function (data) {
			$(' .center2  .s_btn').remove();
			var salonwork = data.data;
			console.log(salonwork);
			var str2 = '';
			for(var x = 0; x <data.data.length; x ++){
				$('.center2').append('<li class="s_main2 s_main2'+pageNum+'"><a href="beautySalonWorkDetails.html?unionProductId='+data.data[x].unionProductId+'&productType='+data.data[x].productType+'&v=<%= VERSION %>" class="listbox"><img data-original="'+data.data[x].cover+'@80Q'+'" class="lazy imgw " alt=""/><div class="delist"><div class="de-left"><p class="b-title">'+data.data[x].title+'</p><p class="b-desc">'+data.data[x].descr+'</p></div><div class="de-right"><div class="simgbox"><img src="'+data.data[x].dresserProfile+"@80Q"+'" alt=""/></div></div></div><div class="listbot"><p class="timebg">'+data.data[x].holdTime+'</p><p class="adressbg">'+data.data[x].holdPlace+'</p><p class="botright"><b>'+data.data[x].price+'</b>元/位</p></div></a></li>');	
			}
			$(".s_main2"+pageNum+" img.lazy").lazyload({effect : "fadeIn",threshold : 200});
			if(salonwork.length == 0 && pageNum == 0){
				$(".center2").append('<div class="nonebeauty"><img src="images/salon_orange.png"><p>暂时没有美妆沙龙</p></div>');
				}
			if( data.data.length >= pageSize){
				$('.center2').append('<div class="s_btn">查看更多</div>');
				}
			$(".center2 .s_btn").unbind('click');
			$(".center2 .s_btn").on("click", getMoreDressers);

			$(".s_main2").css("width",$("#tabBox1-bd").width()/3);
		},
	
	});
}
function getMoreDresserslist(){
	$(".tempWrap").css("height","auto");
		var pageNum1 = $('body').data('pageNum1');
		if(pageNum1 == undefined || parseInt(pageNum1) == NaN){
			pageNum1 = 0;
		}
		pageNum1 = pageNum1 + 1;
		$('body').data('pageNum1',pageNum1);
		loadDresserslist(pageNum1,pageSize1);
	}	
function getMorephoto(){
		$(".tempWrap").css("height","auto");
		var pageNum2 = $('body').data('pageNum2');
		if(pageNum2 == undefined || parseInt(pageNum2) == NaN){
			pageNum2 = 0;
		}
		pageNum2 = pageNum2+ 1;
		$('body').data('pageNum2',pageNum2);
		servicephoto(pageNum2,pageSize2);
	}	
function getMoreDressers(){
	$(".tempWrap").css("height","auto");
		var pageNum = $('body').data('pageNum');
		if(pageNum == undefined || parseInt(pageNum) == NaN){
			pageNum = 0;
		}
		pageNum = pageNum + 1;
		$('body').data('pageNum',pageNum);
		loadDressers(pageNum,pageSize);
	}	
//关注按钮点击
$(".attention").live('click',function(){
	 checkAccessTokenLogin(function () {
         var data = getFinalRequestObject({
             accessToken: getAccessToken()
         });
		
		if($(".attention").attr("followid")== '1'){
				cancelFollowDresser();
				$(".attention").html("关注");
				$(".attention").attr("followid","0");
				$(".attention").removeClass("attention1");
			}else{
				followDresser();
				$(".attention").html("已关注");
				$(".attention").attr("followid","1");
				$(".attention").addClass("attention1");
				}
	}, 'space.html' + window.location.search);
})
//关注
function followDresser(){
	$.ajax({//采用异步
		type: "post",
		url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/dresser/ followDresser',
		data:getFinalRequestObject({accessToken:getAccessToken(),dresserId:getParam("dresserId")}),
		dataType:"json",
		success: function (data) {
			
		},
	
	});
}
//取消关注
function cancelFollowDresser(){
	$.ajax({//采用异步
		type: "post",
		url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/dresser/ cancelFollowDresser',
		data:getFinalRequestObject({accessToken:getAccessToken(),dresserId:getParam("dresserId")}),
		dataType:"json",
		success: function (data) {
			
		},
	
	});
}
//为服务实拍点赞与取消点赞
$(".s_detail img").live('click',function(){
	var del=$(this);
	 checkAccessTokenLogin(function () {
         var data = getFinalRequestObject({
             accessToken: getAccessToken()
         });
		$.ajax({//采用异步
		type: "post",
		url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/dresser/likePost/2.5.3',
		data:getFinalRequestObject({accessToken:getAccessToken(),postId:del.attr("postid"),isLike:del.attr("isLike")}),
		dataType:"json",
		success: function (data) {
			if(del.attr("isLike")== "0"){
				del.attr("src","images/unlike.png");
				del.attr("isLike","1");
				del.siblings("b").html(parseInt(del.siblings("b").html())-1);
			}else{
				del.attr("src","images/lnum.png");
				del.attr("isLike","0");
				del.siblings("b").html(parseInt(del.siblings("b").html())+1);
				if(data.data.addScore != "0"){
					alertNewScore("积分 +"+data.data.addScore);
				}
			}
		},
	});
	}, 'space.html' + window.location.search);
	
})
$(".aboutme,.aboutme img,.aboutme p").live('click',function(){
	window.location.href = "aboutdresser.html?dresserId="+$('.h_top').attr('dresserId')+'&v=<%= VERSION %>';
	});
$(".userprise,.userprise img,.userprise p").live('click',function(){
	window.location.href="userappraise.html?dresserId="+$('.h_top').attr('dresserId')+'&v=<%= VERSION %>';
	})
$(".servicecircle,.servicecircle img,.servicecircle p").live('click',function(){
	window.location.href="servicecircle.html?dresserId="+$('.h_top').attr('dresserId')+'&v=<%= VERSION %>';
	})
//时间格式化
function getLocalTime(publishTime) {
    var d_minutes, d_hours, d_days;
    var timeNow = parseInt(new Date().getTime() / 1000);
    var d;
    d = timeNow - publishTime;
    d_days = parseInt(d / 86400);
    d_hours = parseInt(d / 3600);
    d_minutes = parseInt(d / 60);
    if (d_days > 0 && d_days < 4) {
        return d_days + "天前";
    } else if (d_days <= 0 && d_hours > 0) {
        return d_hours + "小时前";
    } else if (d_hours <= 0 && d_minutes > 0) {
        return d_minutes + "分钟前";
    } else {
        var s = 0;
        s = new Date(publishTime);
		var m=parseInt(s.getMonth() + 1);
		if(m<10){
			m="0"+m;
			}
		var day=parseInt(s.getDate());
		if(day<10){
			day="0"+day;
			}
		var hours=parseInt(s.getHours());
		if(hours<10){
			hours="0"+hours;
			}
		var minutes=parseInt(s.getMinutes());
		if(minutes<10){
			minutes="0"+minutes;
			}
        return (s.getFullYear() + "-" + m) + "-" +day + "&nbsp;" + hours +  ":"  + minutes +  "";
    }
}

TouchSlide( { slideCell:"#tabBox1",
		endFun:function(i){ //高度自适应
			var bd = document.getElementById("tabBox1-bd");
			effect:"leftLoop";
			if(i == 0){
				$(".center").show();
				$(".center1").hide();
				$(".center2").hide();
				}else if(i == 1){
					$(".center1").show();
					$(".center").hide();
					$(".center2").hide();
					if (/iphone|ipad|ipod/.test(ua)) {
						_czc.push(['_trackEvent','nggirl_dresser_post','phoneType=iOS','浏览化妆师客照','true','']);	
					} else if (/android/.test(ua)) {
						_czc.push(['_trackEvent','nggirl_dresser_post','phoneType=and','浏览化妆师客照','true','']);
					};
				}else{
					$(".center2").show();
					$(".center1").hide();
					$(".center").hide();
					}
			if(i>0)bd.parentNode.style.transition="200ms";//添加动画效果
		}
		});

 });

 //微信分享
function weixinConfig(title,desc,link,imgUrl){
    wx.ready(function(){

        //获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
        wx.onMenuShareTimeline({
            title: title, // 分享标题
            link: link, // 分享链接
            imgUrl: imgUrl, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调
				$.post('<%= CLI_HOST_API_URL %>/nggirl/app/cli/personalInfo/shareSuccess/2.0.0',
				getFinalRequestObject({accessToken: getAccessToken(),
				shareType:1,
				contentType:'dresser',
				contentInfo:getParam("dresserId")
				})
				,function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						
					}else{
						alert(data.data.error);	
					}	
				})
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });


        //获取“分享给朋友”按钮点击状态及自定义分享内容接口
        wx.onMenuShareAppMessage({
            title: title, // 分享标题
            desc: desc, // 分享描述
            link: link, // 分享链接
            imgUrl: imgUrl, // 分享图标
            type: 'link', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                // 用户确认分享后执行的回调函数
				$.post('<%= CLI_HOST_API_URL %>/nggirl/app/cli/personalInfo/shareSuccess/2.0.0',
				getFinalRequestObject({accessToken: getAccessToken(),
				shareType:2,
				contentType:'dresser',
				contentInfo:getParam("dresserId")
				})
				,function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						
					}else{
						alert(data.data.error);	
					}	
				})
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });
    });

    var currenturl = window.location.href;
    //初始化配置信息
    $.ajax({
        url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/weixinjs/config',
        type: 'post',
        dataType: 'json',
        data: getFinalRequestObject({url: currenturl, accessToken: getAccessToken()}),
        success: function (data) {
            //初始化配置
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: data.data.appId, // 必填，公众号的唯一标识
                timestamp: data.data.timestamp, // 必填，生成签名的时间戳
                nonceStr: data.data.noncestr, // 必填，生成签名的随机串
                signature: data.data.signature,// 必填，签名，见附录1
                jsApiList: ["onMenuShareTimeline","onMenuShareAppMessage"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
        }
    });
}