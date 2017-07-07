var flag = false;
var newStrArr = '';
$(function(){
	localStorage.setItem("source",getParam('source'));
	$('.content').height($('body').height()+64);
	if (/iphone|ipad|ipod/.test(ua)) {
		_czc.push(['_trackEvent','phoneType=iOS','新版商品详情页']);	
	} else if (/android/.test(ua)) {
		_czc.push(['_trackEvent','phoneType=and','新版商品详情页']);
	};
	
	//关闭悬浮条
	$(".downLoad .closeTip").click(function(){
		$(".downLoad").hide();
		$(".content").css("margin-top","0");
	})
	
	//悬浮条打开
	$('.downLoad .gtload').click(function(e) {
		APPCommon.openApp();
		return false;
    });
	
	//返回顶部
	$('.content').scroll(function(){
		if($('.content').scrollTop() > $(window).height()){
			$('.back_top').removeClass('hidden');
		}else{
			$('.back_top').addClass('hidden');
		}
	 });
	$('.back_top').live('click',function(){
		$('html,body,.content').animate({scrollTop: '0px'}, 100);
		return false;
	});
	 
	
	//获取商品详情
	$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/item/getItemInfo/3.1.0',getFinalRequestObject({accessToken:getAccessToken(),itemId:getParam('itemId')}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			for(var x = 0; x < data.data.headImgs.length; x ++){
				$('.top .imgw').append('<li><div><img src="'+data.data.headImgs[x].url+'" /></div></li>');
				$('.banner>.clear').append("<li>" + x + "<li>");
			}
			var lilength=data.data.headImgs.length;
			$(".bot ul").css("width",22*lilength);
			
			//banner切换
			TouchSlide({
				slideCell: "#slideBox",
				titCell: ".hd ul", //开启自动分页 autoPage:true ,此时设置 titCell 为导航元素包裹层
				mainCell: ".bd ul",
				effect: "left",
				autoPage: true, //自动分页
				autoPlay: true, //自动播放
				interTime: 5000
			});
			
			//微信分享
			if(isInWeixin()){
				var title = '【南瓜姑娘】'+ data.data.mainTitle;
				var desc = data.data.reamTitle;
				var link = window.location.href;
				var imgUrl = data.data.imgUrl;
				var from = getParam('apptype');
				if(!strIsEmpty(from) && from == 'appb'){
					desc = data.data.reamTitle;
				}
				weixinConfig(title,desc,link,imgUrl);
			}
			
			$('.bc_title_main,.norm_content .nc_top .nt_right .title').html(data.data.mainTitle);
			$('.bc_title_fu').html(data.data.reamTitle);
			$('.bc_title_price,.norm_content .nc_top .nt_right .price').html('¥ '+data.data.itemSku.skus[0].salePrice);
			
			//规格参数
			var properties = data.data.properties;
			if(properties.length > 0){
				$('.bc_norm.canshu').removeClass('hidden');
				for(var x = 0; x < data.data.properties.length; x ++){
					$('.bc_norm ul').append('<li><div>'+properties[x].name+'</div><div>'+properties[x].value+'</div></li>');	
				}
			}else{
				$('.bc_norm.canshu').addClass('hidden');
			}
			//购物须知大于三条隐藏
			if(data.data.properties.length > 3){
				$('.bc_norm ul li:gt(2)').hide();
				$('.bc_norm .norm_details').removeClass('hidden');
			}else{
				$('.bc_norm .norm_details').addClass('hidden');
			}
			
			
			//产品介绍
			var itemDetail = data.data.itemDetail;
			for(var x = 0;x < data.data.itemDetail.length; x ++){
				if(itemDetail[x].type == 3){//图片
					$('.bc_norm .bn_content').append('<img src="'+itemDetail[x].content+'" alt="" />');	
				}else{
					$('.bc_norm .bn_content').append('<p>'+itemDetail[x].content+'</p>');	
				}
			}
			
			//商品标签
			var itemLabel = data.data.itemLabel;
			for(var x = 0; x < data.data.itemLabel.length; x ++){
				$('.bn_notice .tags').append('<div class="bn_free"><img src="'+itemLabel[x].imgUrl+'" alt="" /><span>'+itemLabel[x].shortWord+'</span></div>');
			}
			
			//购物须知
			var buyerReading = data.data.buyerReading;
			for(var x = 0;x < data.data.buyerReading.length; x ++){
				$('.padding_none .bn_notice .bn_p').append('<p>'+buyerReading[x].content+'</p>');
			}
			//购物须知大于三条隐藏
			if(data.data.buyerReading.length > 3){
				$('.bn_notice .bn_p p:gt(2)').hide();
				$('.padding_none .bn_details').removeClass('hidden');
			}else{
				$('.padding_none .bn_details').addClass('hidden');
			}
			
			//获取sku分类
			var specs = data.data.itemSku.specs;
			for(var x = 0; x < specs.length; x ++){
				$('.gray_content .norm_box').append('<div class="nc_center"><p class="type">'+specs[x].name+'</p><ul class="type_kinds">'+getSkuValue(specs[x].values,specs[x].specId,data.data.itemSku.skus)+'</ul></div>');
			}	
			$('body').data('data',data.data.itemSku.skus);//存储所有排列组合数组
			
			//获取小图
			$('.gray_content .norm_content .nc_top .cover').attr('src',data.data.imgUrl);
			
		}else{
			alert(data.data.error);	
		}
	});
	
	//获取购物车中商品总数V3.1.0
	getGoodsNum();
		
	//查看规格
	$('.bc_title_property').click(function(e) {
		var thisNum = 0;
		$('.count .num').html(1);
		$('.gray_box_param').addClass('two').removeClass('one');
		
		$('.type_kinds li').each(function(index, element) {
            if(!$(this).children('span').hasClass('gray_no')){
				thisNum += 1;	
			}
        });
		if(thisNum > 0){
			$('.gray_box,.gray_box_param,.gray_box_param .btn .double_btn').removeClass('hidden');
		}else{
			$('.btn .double_btn').addClass('hidden');
			$('.gray_box,.gray_box_param,.gray_box_param .btn .kucun_btn').removeClass('hidden');
		}
		$('.content').addClass('gray_hidden');
		$('.content').bind("touchmove",function(event){
			event.preventDefault();
		});
    });
	
	//关闭规格弹框
	$('.gray_box,.close').click(function(e) {
        $('.gray_box,.gray_box_param,.gray_box_param .btn .double_btn').addClass('hidden');
		$('.content').removeClass('gray_hidden');
		$(".content").unbind('touchmove');
    });
	
	//++++++购买数量
	$('.count .plus').click(function(e) {
		var num = $('.count .num');
        if(num.html()>0 && $('.btn .kucun_btn').hasClass('hidden')){
			num.html(parseInt(num.html()) + 1);
		};
		if(parseInt(num.html()) >= parseInt($('body').attr('stockquantity'))){
			alertGrayWindow('当前商品最大购买数量为'+$('body').attr('stockquantity')+'件');
			if($('.gray_box_param').hasClass('two')){
				$('.btn .kucun_btn').removeClass('hidden');
				$('.btn .double_btn').addClass('hidden');
			}else{
				$('.btn .kucun_btn').removeClass('hidden');
				$('.btn .sure_btn').addClass('hidden');
			}	
		};
    });
	
	//-------购买数量
	$('.count .subtract').click(function(e) {
		var num = $('.count .num');
        if(num.html()>1){
			num.html(parseInt(num.html()) - 1);
		}else if(num.html() == 1){
			
		}else{
			if(num.html() <= $('body').attr('stockquantity')){
				if($('.gray_box_param').hasClass('two')){
					$('.btn .kucun_btn').addClass('hidden');
					$('.btn .double_btn').removeClass('hidden');
				}else{
					$('.btn .kucun_btn').removeClass('hidden');
					$('.btn .sure_btn').addClass('hidden');
				}	
			};
		}
    });
	
	//选择规格
	$('.nc_center .type_kinds li').live('click',function(e) {
		var str = '';
		var btn = $(this);
		if(!btn.children('span').hasClass('gray_no')){
			btn.children('span').addClass('on').parent().siblings().children('span').removeClass('on');
			$('.type_kinds li').each(function(index, element) {
                if($(this).children('span').hasClass('on')){
					str += $(this).attr('specgroup')+';';
				};
            });
			str = str.substring(0,str.length -1);
			console.log(str);
			var data = $('body').data('data')
			for(var x = 0; x < data.length ; x++){
				if(str == data[x].specGroup){
					$('body').attr('skuId',data[x].skuId);
					$('body').attr('stockQuantity',data[x].stockQuantity);
					$('.bc_title_property .title').html(data[x].skuName);	
					$('.nc_top .nt_right .select').html('已选：'+data[x].skuName);
					$('.gray_content .norm_content .nc_top .cover').attr('src',data[x].imgUrl);
					$('.bc_title_main,.norm_content .nc_top .nt_right .title').html(data[x].mainTitle);
					//如果价格是个整数那么在整数后面加上.00
					if(data[x].salePrice.toString().indexOf('.') >= 0){
						$('.bc_title_price,.norm_content .nc_top .nt_right .price').html('¥ '+data[x].salePrice);
					}else{
						$('.bc_title_price,.norm_content .nc_top .nt_right .price').html('¥ '+data[x].salePrice+'.00');
					}
					if($('.gray_box_param').hasClass('two')){
						$('.btn .double_btn').removeClass('hidden');
						$('.btn .kucun_btn').addClass('hidden');
					}else{
						$('.btn .sure_btn').removeClass('hidden');	
						$('.btn .kucun_btn').addClass('hidden');
					}
					return;
				}else{//没有库存
					$('.btn .kucun_btn').removeClass('hidden').siblings().addClass('hidden');
					//$('.norm_content .nc_top .nt_right .price').html('¥ 0.00');
				}
			}
			return;
		}
    });
	
	//购物须知-查看更多说明
	$('.padding_none .bn_details').click(function(e) {
        $('.bn_notice .bn_p p:gt(2)').show();
		$('.padding_none .bn_details').addClass('hidden');
    });
	
	//规格参数--查看详细信息
	$('.bc_norm .norm_details').click(function(e) {
		window.location.href = "newGoodsNorm.html?itemId="+getParam('itemId')+'&v=<%= VERSION %>';
    });
	
	//点击加入购物车
	$('.footer_content .fc_join').click(function(e) {
		var thisNum = 0;
        checkAccessTokenLogin(function () {
			$('.type_kinds li').each(function(index, element) {
				if(!$(this).children('span').hasClass('gray_no')){
					thisNum += 1;	
				}
			});
			if(thisNum > 0){
				$('.gray_box,.gray_box_param,.btn .sure_btn').removeClass('hidden');
				$('.gray_box_param').addClass('one').removeClass('two').removeClass('buy');
			}else{
				$('.gray_box,.gray_box_param,.btn .kucun_btn').removeClass('hidden');
				$('.gray_box_param').addClass('one').removeClass('two').removeClass('buy');
			}
			$('.content').addClass('gray_hidden');
			$('.content').bind("touchmove",function(event){
				event.preventDefault();
			});
        },'newGoodsDetails.html' + window.location.search + '&v=<%= VERSION %>');
    });
	$('.footer_content .fc_buy').click(function(e) {
		var thisNum = 0;
        checkAccessTokenLogin(function () {
			$('.type_kinds li').each(function(index, element) {
				if(!$(this).children('span').hasClass('gray_no')){
					thisNum += 1;	
				}
			});
			if(thisNum > 0){
				$('.gray_box_param,.btn .sure_btn,.gray_box').removeClass('hidden');
				$('.gray_box_param').addClass('one').removeClass('two').addClass('buy');
			}else{
				$('.gray_box_param,.btn .kucun_btn,.gray_box').removeClass('hidden');
				$('.gray_box_param').addClass('one').removeClass('two').addClass('buy');
			}
			$('.content').addClass('gray_hidden');
			$('.content').bind("touchmove",function(event){
				event.preventDefault();
			});
			
        },'newGoodsDetails.html' + window.location.search + '&v=<%= VERSION %>');
    });
	
	//点击立即购买
	$('.btn .double_btn .right').click(function(e) {
		var thisNum = 0;
        checkAccessTokenLogin(function () {
			$('.type_kinds li').each(function(index, element) {
				if(!$(this).children('span').hasClass('gray_no')){
					thisNum += 1;	
				}
			});
			if(thisNum > 0){
				$('.gray_box,.gray_box_param,.btn .sure_btn').removeClass('hidden');
				//alert('购买');
				var data= new Array();
				var obj= new Object();
				obj.skuId=$('body').attr('skuId');
				obj.quantity=$(".nc_bottom .count .num").html();
				data.push(obj);
				var datas = JSON.stringify(data);
				localStorage.setItem("items",datas);
				var redirectUrl;
				if(isInWeixin()){
					
					redirectUrl = getWeixinLinkUrl();
					window.location.href=redirectUrl;
				}else{
					redirectUrl =  getZhifuBaoLinkUrl();
					window.location.href=redirectUrl;
				}
				//window.location.href="new_goods_pay.html";
			}else{
				$('.gray_box,.gray_box_param,.btn .kucun_btn').removeClass('hidden');
			}
			
        },'newGoodsDetails.html' + window.location.search + '&v=<%= VERSION %>');
    });
	
	
	//添加商品到购物车V3.1.0---确认按钮
	$('.btn .double_btn .left,.btn .sure_btn').click(function(e) {	
        checkAccessTokenLogin(function () {
			if($('.gray_box_param').hasClass('buy') && !$('.gray_box_param').hasClass('two')){
				//alert('购买');
				var data= new Array();
				var obj= new Object();
				obj.skuId=$('body').attr('skuId');
				obj.quantity=$(".nc_bottom .count .num").html();
				data.push(obj);
				var datas = JSON.stringify(data);
				localStorage.setItem("items",datas);
				var redirectUrl;
				if(isInWeixin()){
					redirectUrl = getWeixinLinkUrl();
					window.location.href=redirectUrl;
				}else{
					redirectUrl =  getZhifuBaoLinkUrl();
					window.location.href=redirectUrl;
				}
					//window.location.href="new_goods_pay.html";
			}else{
				var paramData = getFinalRequestObject({
					accessToken:getAccessToken(),
					skuId:$('body').attr('skuId'),
					quantity:$('.nc_bottom .count .num').html()
				})
				$.post('<%= CLI_HOST_API_URL %>/nggirl/app/cli/item/cart/addItemsToCart/3.1.0',paramData,function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						alertGrayWindow('成功加入购物车');
						getGoodsNum();
					}else{	
						alert(data.data.error);	
					}
				});
			}
        },'newGoodsDetails.html' + window.location.search + '&v=<%= VERSION %>');		
    });
	
	//跳转购物车
	$('.footer_content .fc_pao').click(function(e) {
        checkAccessTokenLogin(function () {
            window.location.href = "newGoodsShopping.html?v=<%= VERSION %>";
        },'newGoodsDetails.html' + window.location.search + '&v=<%= VERSION %>');
    });
	
})

//获取购物车中商品总数V3.1.0
function getGoodsNum(){
	$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/item/cart/getGoodsNum/3.1.0',getFinalRequestObject({accessToken:getAccessToken()}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			if(data.data.goodsNum == 0){
				$('.fc_pao .qipao').addClass('hidden');
			}else{
				$('.fc_pao .qipao').html(data.data.goodsNum).removeClass('hidden');
				$('.fc_pao .qipao').width($('.fc_pao .qipao').height());
			}
		}else{	
			//alert(data.data.error);	
			$('.fc_pao .qipao').addClass('hidden');
		}
	});
}

//获取sku分类对应的参数
function getSkuValue(arr,specId,skus){
	flag = false;
	var str = '';
	for(var x = 0; x < arr.length; x ++){
		str += getSkuNum(arr[x].valueId,specId,skus,specId+':'+arr[x].valueId,arr[x].value);
	}	
	return str;
} 

//判断sku是否有库存
function getSkuNum(arrType,specId,skus,specGroup,value){
	var str = '';
	var num = 0; 
	for(var x = 0; x < skus.length; x ++){
		if(skus[x].specGroup.indexOf(specGroup)>= 0 && x==0){
			//判断库存
			if(skus[x].stockQuantity != 0){
				//判断是否已开售
				if(skus[x].isSales != 0){
					if(flag == false){
						str += '<li stockQuantity='+skus[x].stockQuantity+' isSales='+skus[x].isSales+' specGroup='+specId+':'+arrType+' specId='+specId+' valueId='+arrType+'><span class="on">'+value+'</span></li>';
						num++;
						flag = true;
						$('.bc_title_property .title').html(skus[x].skuName);	
						$('body').attr('skuId',skus[x].skuId);
						$('body').attr('stockQuantity',skus[x].stockQuantity);
						$('.nc_top .nt_right .select').html('已选：'+skus[x].skuName);
						return str;	
					}else{
						str += '<li stockQuantity='+skus[x].stockQuantity+' isSales='+skus[x].isSales+' specGroup='+specId+':'+arrType+' specId='+specId+' valueId='+arrType+'><span>'+value+'</span></li>';
						num++;
						return str;	
					}
				}
			}else{
				str += '<li isSales='+skus[x].isSales+' specGroup='+specId+':'+arrType+' specId='+specId+' valueId='+arrType+'><span class="gray_no">'+value+'</span></li>';	
				num++;
				return str;	
			}
		}else if(skus[x].specGroup.indexOf(specGroup)>= 0 && skus[x].stockQuantity != 0){
			//判断库存
			if(skus[x].stockQuantity != 0){
				//判断是否已开售
				if(skus[x].isSales != 0){
					str += '<li stockQuantity='+skus[x].stockQuantity+' isSales='+skus[x].isSales+' specGroup='+specId+':'+arrType+' specId='+specId+' valueId='+arrType+'><span>'+value+'</span></li>';
					return str;
				}
			}else{
				str += '<li isSales='+skus[x].isSales+' specGroup='+specId+':'+arrType+' specId='+specId+' valueId='+arrType+'><span class="gray_no">'+value+'</span></li>';	
				num++;
				return str;	
			}
		}else if(skus[x].specGroup.indexOf(specGroup)>= 0 && skus[x].stockQuantity == 0){
			//判断是否已开售
			if(skus[x].isSales != 0){
				str += '<li stockQuantity='+skus[x].stockQuantity+' isSales='+skus[x].isSales+' specGroup='+specId+':'+arrType+' specId='+specId+' valueId='+arrType+'><span>'+value+'</span></li>';
				return str;
			}else{
				str += '<li isSales='+skus[x].isSales+' specGroup='+specId+':'+arrType+' specId='+specId+' valueId='+arrType+'><span class="gray_no">'+value+'</span></li>';	
				num++;
				return str;	
			}
		}
	}
	if(num == 0){
		str += '<li specGroup='+specId+':'+arrType+' specId='+specId+' valueId='+arrType+'><span class="gray_no">'+value+'</span></li>';
		return str;	
	}
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
function getWeixinLinkUrl(){
    var redirectUri = encodeURIComponent(getZhifuBaoLinkUrl());
    var scope = 'snsapi_base';
    var state = "weixinpay";
    var appid = getFwhAppId();//由param.js初始化
    return "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appid+"&redirect_uri="
        +redirectUri+"&response_type=code&scope="+scope+"&state="+state+"#wechat_redirect";
}

function getZhifuBaoLinkUrl(){
    var str = "<%= WEIXIN_BOUND_DOMAIN_URL %>/nggirl/h5/cosmetic/new_goods_pay.html?v=<%= VERSION %>";
	if(window.location.protocol == 'https:'){
		return str;
	}else{
		return 'http:' + str.substring(6)
	}
}

//微信分享
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
    var currenturl =window.location.href;
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
