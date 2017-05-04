$(function(){
	//关闭顶部悬浮框
	$('.close').click(function(e) {
		$('.header').slideUp();
	});
	$('.sort span').click(function(e) {
		$('.gray-box').fadeIn();
		$('.sd-content').show();
        $(this).addClass('default').siblings().removeClass('default');
		$('.box-bottom').addClass('animate-top');
		$('.sd-content .sd-select').eq($(this).index()).show().siblings().hide();
    });
	
	//让灰色背景的高度等于当前窗体的高度
	$('.gray-box').height($(window).height());
	
	//让筛选页面的高度等于当前窗体的高度
	$('.shai-select').height($(window).height());
	
	//点击灰色背景让弹框消失
	$('.gray-box').click(function(e) {
        $('.gray-box').fadeOut();
		$('.sd-select').hide();
		$('.box-bottom').removeClass('animate-top');
    });
	
	//默认排序三角切换
	$('.sort-default').click(function(e) {
        $(this).children('img').attr('src','images/arr-up-up.png');
    });
	
	//价格排序三角切换
	$('.sort-price').click(function(e) {
        $(this).children('img').attr('src','images/arr-up-up.png');
    });
	
	//筛选
	$('.sort-filter').click(function(e) {
		$('.sd-content').hide();
		$('.gray-box').hide();
		
		localStorage.setItem('specialId',getParam("specialId"));
		localStorage.setItem('orderby',$('.box').attr('orderby'));
		window.location.href="filter-share.html?lowPrice="+getParam("lowPrice")+'&highPrice='+getParam("highPrice")+'&resDate='+getParam("resDate")+'&resTime='+getParam("resTime")+'&v=<%= VERSION %>' ;
    });
	
	var specialId = getParam("specialId");
	//点击筛选里面的“确定”按钮
	$('.ok-btn').click(function(e) {
		$('.box-content').children('li').remove();
        $('.shai-select').fadeOut();
		$('.box-content').show();
		//存放数据
		$('.box').attr('resdate',$('.od-left option:selected').attr('realdate'));
		$('.box').attr('resTime',$('.od-right option:selected').html());
		$('.box').attr('lowPrice',$('.bb-one').val());
		$('.box').attr('highPrice',$('.bb-two').val());
		
		//生成数据
		loadData(paraFn(specialId,$('.box').attr('orderby'),$('.box').attr('lowprice'),$('.box').attr('highprice'),$('.box').attr('resdate'),$('.box').attr('restime')));
    });
	
	//页面加载获取专题介绍信息
	$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/special/info/1.4.0',getFinalRequestObject({accessToken: getAccessToken(),specialId:specialId}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			$('.top-img').attr('src',data.data.cover);
			if(data.data.portrait == null){
				$('.top-pic').children('img').attr('src','images/mine-default.png');
			}else{
				$('.top-pic').children('img').attr('src',data.data.portrait);
			}
			$('.tt-quan').html(data.data.nickName);
			$('.tt-bottom').html(data.data.descrip);
			
            if(isInWeixin()){
            	var title = '【南瓜姑娘】上门美妆－'+data.data.name;
                var desc = data.data.name;
                var link = window.location.href;
                var imgUrl = data.data.cover;
            	var from = getParam('apptype');
            	if(!strIsEmpty(from) && from == 'appb'){
            		desc = '南瓜粉丝已被我的作品美哭！联系我为你打造专属造型~';
            	}
                weixinConfig(title,desc,link,imgUrl);
            }
			
			//h5,app同步分享内容
			if(isInApp()){
				window.shareTitle ='【南瓜姑娘】上门美妆－'+data.data.name;
				window.shareContent = data.data.name;
				window.sharePicture = data.data.cover;
				window.shareUrl = window.location.href;
			};	
			if(isInApp() && typeof(window.ngjsInterface) != "undefined" && typeof(window.ngjsInterface.conFigShareInfo) != "undefined"){
				window.ngjsInterface.conFigShareInfo('【南瓜姑娘】上门美妆－'+data.data.name, data.data.name, data.data.cover,window.location.href);
			};
		};
		if(data.code == 1){
			alert(data.data.error);	
		}
	});
			
	//生成数据
	if(getParam("resDate") == "undefined"){
		loadData(paraFn(getParam("specialId"),localStorage.getItem('orderby'),getParam("lowPrice"),getParam("highPrice"),'',getParam("resTime")));
		$('.sort-filter').attr('lowPrice',getParam("lowPrice"));
		$('.sort-filter').attr('highPrice',getParam("highPrice"));
		$('.sort-filter').attr('resDate','');
		$('.sort-filter').attr('resTime',getParam("resTime"));
	}else{
		loadData(paraFn(getParam("specialId"),localStorage.getItem('orderby'),getParam("lowPrice"),getParam("highPrice"),getParam("resDate"),getParam("resTime")));
		$('.sort-filter').attr('lowPrice',getParam("lowPrice"));
		$('.sort-filter').attr('highPrice',getParam("highPrice"));
		$('.sort-filter').attr('resDate',getParam("resDate"));
		$('.sort-filter').attr('resTime',getParam("resTime"));
	}
	//判断标签值是否为空
	if($('.sort-filter').attr('lowPrice') == '' && $('.sort-filter').attr('highPrice') == '' && $('.sort-filter').attr('resDate') == '' && $('.sort-filter').attr('resTime') == '不限时间' || $('.sort-filter').attr('resTime') == ''){
		$('.sort-filter').removeClass('default');	
	}else{
		$('.sort-filter').addClass('default');	
	}
	
	//回显数据
	if(localStorage.getItem('orderby') == 1 || localStorage.getItem('orderby') ==2 || localStorage.getItem('orderby') == 3){
		$('.sd-content .sd-select li').each(function(index, element) {
            if($(this).attr('value') == localStorage.getItem('orderby')){
				$('.sort-default').children('font').html($(this).html());	
				$(this).addClass('blue').siblings().removeClass('blue');
			}
        });
		$('.sort-default').addClass('default').siblings().removeClass('default');
	};
	
	if(localStorage.getItem('orderby') == 4 || localStorage.getItem('orderby') ==5){
		$('.sd-content .sd-select li').each(function(index, element) {
            if($(this).attr('value') == localStorage.getItem('orderby')){
				$('.sort-price').children('font').html($(this).html());	
				$(this).addClass('blue').siblings().removeClass('blue');
			}
        });
		$('.sort-price').addClass('default').siblings().removeClass('default');
	};
	
	//默认排序  
	$('.sd-content .sd-select:eq(0)>li').click(function(e) {
		$(this).addClass('blue').siblings().removeClass('blue');
        $('.sort-default').children('font').html($(this).html());
		//收起
		$('.sd-content').hide();
		$('.gray-box').hide();
		$('.box-bottom').removeClass('animate-top');
		//恢复初始状态
        $('.sort-price').children('font').html('价格排序').removeClass('default');
		$('.sd-content>.sd-select:eq(1)>li').removeClass('blue');
		//改变箭头方向
		$('.sort-default').children('img').attr('src','images/Path 16 Copy@640.png');
		
		//清除之前生成的数据
		$('.box-content').children('li').remove();
		//生成数据
		loadData(paraFn(specialId,$(this).attr('value'),$('.sort-filter').attr('lowprice'),$('.sort-filter').attr('highprice'),$('.sort-filter').attr('resdate'),$('.sort-filter').attr('restime')));
    });
	
	//价格排序
	$('.sd-content .sd-select:eq(1) li').click(function(e) {
		$(this).addClass('blue').siblings().removeClass('blue');
        $('.sort-price').children('font').html($(this).html());
		//收起
		$('.sd-content').hide();
		$('.gray-box').hide();
		$('.box-bottom').removeClass('animate-top');
		//恢复初始状态
		$('.sort-default').children('font').html('默认排序').removeClass('default');
		$('.sd-content>.sd-select:eq(0)>li:eq(0)').addClass('blue').siblings().removeClass('blue');
		//改变箭头方向
		$('.sort-price').children('img').attr('src','images/Path 16 Copy@640.png');
		
		//清除之前生成的数据
		$('.box-content').children('li').remove();
		//生成数据
		loadData(paraFn(specialId,$(this).attr('value'),$('.sort-filter').attr('lowprice'),$('.sort-filter').attr('highprice'),$('.sort-filter').attr('resdate'),$('.sort-filter').attr('restime')));
    });	
	
	//点击作品列表的某一作品
	$('.box-content>li').live('click',function(e) {
		window.location.href="workDetails.html?workId="+$(this).attr('workid')+'&v=<%= VERSION %>' ;
    });
	
  });

//获取入参
function paraFn(specialId,orderBy,lowPrice,highPrice,resDate,resTime){
	var genData = getFinalRequestObject({
		specialId:specialId,
		orderBy:orderBy,
		lowPrice:lowPrice,
		highPrice:highPrice,
		resDate:resDate,
		resTime:encodeURI(resTime)});
	return genData;
}

//获取某一专题作品列表
function loadData(genData){
	$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/special/listWorks/1.4.0',genData,function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			for(var x = 0; x < data.data.length; x ++){
				//判断专题是否有折扣(0:没有折扣)
				if(data.data[x].hasDiscount == 0){
					$('.box-content').append('<li workid="'+data.data[x].workId+'"><div class="bc-left"><div class="bl-top"><img data-original="'+data.data[x].cover+'" alt="" class="lazy" /></div><div class="bl-bottom"><div class="bb-left"><img src="images/Rectangle 18 Copy@640.png" class="like-people" alt="" /><span class="num"> '+data.data[x].likeNum+'</span><span class="like">人喜欢 |</span></div><div class="bb-right"><span class="order-num">'+data.data[x].resNum+'</span>人预约</div></div></div><div class="bc-right"><img data-original="'+data.data[x].ornament+'" class="br-img lazy" alt="" /><p class="br-txt">'+data.data[x].content+'</p><del class="yuan-price"></del><span class="xian-price">'+'¥'+data.data[x].cost+'</span></div></li>');
				}
				//有折扣
				if(data.data[x].hasDiscount == 1){
					$('.box-content').append('<li workid="'+data.data[x].workId+'"><div class="bc-left"><div class="bl-top"><img data-original="'+data.data[x].cover+'" alt="" class="lazy" /><img class="half" src="'+data.data[x].discount.icon+'" /></div><div class="bl-bottom"><div class="bb-left"><img src="images/Rectangle 18 Copy@640.png" class="like-people" alt="" /><span class="num"> '+data.data[x].likeNum+'</span><span class="like">人喜欢 |</span></div><div class="bb-right"><span class="order-num">'+data.data[x].resNum+'</span>人预约</div></div></div><div class="bc-right"><img data-original="'+data.data[x].ornament+'" class="br-img lazy" alt="" /><p class="br-txt">'+data.data[x].content+'</p><del class="yuan-price">'+'¥'+data.data[x].cost+'</del><span class="xian-price">'+'¥'+data.data[x].discount.cost+'</span></div></li>');
				}
			}
		$("img.lazy").lazyload({effect : "fadeIn",threshold : 200});
		};
		if(data.code == 1){
			alert(data.data.error);	
		}
	});
}


function weixinConfig(title,desc,link,imgUrl) {

    wx.ready(function(){

        //获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
        wx.onMenuShareTimeline({
            title: title, // 分享标题
            link: link, // 分享链接
            imgUrl: imgUrl, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
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

