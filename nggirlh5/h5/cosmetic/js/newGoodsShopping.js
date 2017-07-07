var flag = false;
var page = 0;
$(function(){
	//点击右上角的编辑按钮
	$('.title-btn .edit_btn').live('click',function(e) {
		$('body').addClass('success').removeClass('edit');
        $(this).removeClass('edit_btn').addClass('success_btn').html('完成');
		$('.list-ul li').each(function(index, element) {
            $(this).children('.con_right').addClass('hidden');
			$(this).children('.con_right_modify').removeClass('hidden');
			$(this).children('.con').children('.white_circle').attr('src','images/white_circle.png').removeClass('on');
			$(this).children('.con').children('.white_circle').removeClass('hidden');
			$(this).children('.con').children('.con_fail').addClass('hidden');
			$('.bn_right').html('结算(0)').removeClass('orange_back');
			$('.bc_num .num_left').html('¥0');
			$('.bc_num .num_right').html('.00');
			
			//判断是否有失效商品
			if($(this).attr('status') == 0){
				$(this).children('.con_right_modify').children('.crm_modify_btn').addClass('hidden');
				$(this).children('.con_right_modify').children('.crm_fail_btn').removeClass('hidden');
			}else{
				$(this).children('.con_right_modify').children('.crm_modify_btn').removeClass('hidden');
				$(this).children('.con_right_modify').children('.crm_fail_btn').addClass('hidden');
			}
        });
		$('.bottom_btn .bn_center').addClass('hidden');
		$('.bottom_btn .bn_right').removeClass('bn_right').addClass('bn_del').html('删除(0)').removeClass('orange_back');
		$('.bottom_btn .bn_left').removeClass('on').children('.bl_circle').attr('src','images/white_circle.png');
    });
	
	//点击右上角的完成按钮
	$('.title-btn .success_btn').live('click',function(e) {
		$('body').addClass('edit').removeClass('success');
        $(this).removeClass('success_btn').addClass('edit_btn').html('编辑');
		$('.list-ul li').each(function(index, element) {
			//判断是否有失效商品
			if($(this).attr('status') == 0){//失效
				$(this).children('.con_right_modify').addClass('hidden');
				$(this).children('.con_right').addClass('hidden');
				$(this).children('.con').children('.white_circle').addClass('hidden');
				$(this).children('.con').children('.con_fail').removeClass('hidden');
			}else{
				$(this).children('.con_right_modify').addClass('hidden');
				$(this).children('.con_right').removeClass('hidden');
			}
			if($(this).children('.con').children('.white_circle').hasClass('on')){
				$(this).children('.con').children('.white_circle').attr('src','images/white_circle.png').removeClass('on');
			}
			$('.bottom_btn .bn_left').removeClass('on').children('.bl_circle').attr('src','images/white_circle.png');
        });
		$('.bottom_btn .bn_center').removeClass('hidden');
		$('.bottom_btn .bn_del').removeClass('bn_del').addClass('bn_right').html('结算(0)');
    });
	
	//勾选
	$('.con .white_circle').live('touchstart',function(e) {
        var btn = $(this);
		var quantity = 0;
		var totalNum = 0;
		var allNum = 0;
		if(btn.hasClass('on')){
			btn.attr('src','images/white_circle.png');
			btn.removeClass('on');
			$('.list-ul li').each(function(index, element) {
				if($(this).children('.con').children('.white_circle').hasClass('on')){
					quantity = parseInt($(this).attr('quantity')) - quantity;
					totalNum = $(this).attr('salePrice') * $(this).attr('quantity') + totalNum;
				}
			});
			var arrNum = [];
			if(totalNum.toString().indexOf('.') >= 0){
				arrNum = totalNum.toString().split('.');
			}else{
				arrNum[0] = totalNum;	
				arrNum[1] = '00';	
			}
		}else{
			btn.attr('src','images/orange_circle.png');
			btn.addClass('on');
			$('.list-ul li').each(function(index, element) {
				if($(this).children('.con').children('.white_circle').hasClass('on')){
					quantity = parseInt($(this).attr('quantity')) + quantity;
					totalNum = $(this).attr('salePrice') * $(this).attr('quantity') + totalNum;
				};
			});
			var arrNum = [];
			if(totalNum.toString().indexOf('.') >= 0){
				arrNum = totalNum.toString().split('.');
			}else{
				arrNum[0] = totalNum;	
				arrNum[1] = '00';	
			}
		}
		
		if(totalNum != 0){
			$('.bn_right').html('结算('+quantity+')').addClass('orange_back');
			$('.bc_num .num_left').html('¥'+arrNum[0]);
			$('.bc_num .num_right').html('.'+arrNum[1].substr(0,3));
		}else{
			$('.bn_right').html('结算(0)').removeClass('orange_back');
			$('.bc_num .num_left').html('¥0');
			$('.bc_num .num_right').html('.00');
		}
		$('.bottom_btn .bn_del').html('删除('+quantity+')').addClass('orange_back');
		selectAllBtnStatusFn();
    });
	//点击结算
	$('.bottom_btn .bn_right').live("click",function(e) {
		var data= new Array();
		$(".white_circle").each(function(index, element) {	
            if($(this).hasClass("on")){
				var obj= new Object();
				obj.skuId=$(this).parent().parent().attr("skuid");
				obj.quantity=$(this).parent().siblings(".con_right").children(".num").html();
				data.push(obj);
				return data;
			};	
        });
		var datas = JSON.stringify(data);
		localStorage.setItem("items",datas);
		checkAccessTokenLogin(function(){
			var redirectUrl;
			if(isInWeixin()){
				redirectUrl = getWeixinLinkUrl();
				window.location.href=redirectUrl;
			}else{
				redirectUrl =  getZhifuBaoLinkUrl();
				window.location.href=redirectUrl;
			}
		},'new_goods_pay.html' + window.location.search);
		//window.location.href="new_goods_pay.html";
	})
	//全选
	$('.bottom_btn .bn_left').click(function(e) {
        var btn = $(this);
		var quantity = 0;
		var totalNum = 0;
		if(btn.hasClass('on')){
			btn.children('.bl_circle').attr('src','images/white_circle.png')
			btn.removeClass('on');
			$('.list-ul li').each(function(index, element) {
				$(this).children('.con').children('.white_circle').attr('src','images/white_circle.png').removeClass('on');
			});
			$('.bn_del').html('删除(0)').removeClass('orange_back');
			$('.bn_right').html('结算(0)').removeClass('orange_back');
			$('.bc_num .num_left').html('¥0');
			$('.bc_num .num_right').html('.00');
		}else{
			btn.children('.bl_circle').attr('src','images/orange_circle.png')
			btn.addClass('on');
			$('.list-ul li').each(function(index, element) {
				if(!$(this).children('.con').children('.white_circle').hasClass('hidden')){
					$(this).children('.con').children('.white_circle').attr('src','images/orange_circle.png').addClass('on');
					if($('body').hasClass('success')){
						quantity = parseInt($(this).attr('quantity')) + quantity;
					}else{
						quantity = parseInt($(this).attr('quantity')) + quantity;
						totalNum = $(this).attr('salePrice') * $(this).attr('quantity') + totalNum;
					}
				}
			});
			if(quantity == 0){
				$('.bn_del').html('删除(0)').removeClass('orange_back');
			}else{
				$('.bn_del').html('删除('+quantity+')').addClass('orange_back');
			}
			
			var arrNum = [];
			if(totalNum.toString().indexOf('.') >= 0){
				arrNum = totalNum.toString().split('.');
			}else{
				arrNum[0] = totalNum;	
				arrNum[1] = '00';	
			}
			if(totalNum == 0){
				$('.bn_right').html('结算(0)').removeClass('orange_back');
				$('.bc_num .num_left').html('¥0');
				$('.bc_num .num_right').html('.00');
			}else{
				$('.bn_right').html('结算('+quantity+')').addClass('orange_back');
				$('.bc_num .num_left').html(arrNum[0]);
				$('.bc_num .num_right').html('.'+arrNum[1].substr(0,3));
			}
		}
    });
	
	//num+++++
	//修改购物车中的商品V3.1.0
	$('.con_right .plus').live('click',function(e) {
		btn = $(this);
		if(parseInt(btn.prev().html()) >= parseInt(btn.parent().parent().attr('stockQuantity'))){
			alertGrayWindow('当前商品最大购买数量为'+btn.parent().parent().attr('stockQuantity')+'件');
			$('.btn .kucun_btn').removeClass('hidden');
			$('.btn .sure_btn').addClass('hidden');
		}else{
			btn.prev().html(parseInt(btn.prev().html())+ 1);
			btn.parent().next().children('.crm_modify_num').children('span').html(btn.prev().html());
			$.post('<%= CLI_HOST_API_URL %>/nggirl/app/cli/item/cart/changeItemInCart/3.1.0',getFinalRequestObject({accessToken:getAccessToken(),cartDetailId:btn.parent().parent().attr('cartDetailId'),quantity:btn.prev().html(),skuId:btn.parent().parent().attr('skuId')}),function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					btn.parent().parent().attr('quantity',btn.prev().html());
					updateShopeNumPrice();
				}else{	
					alert(data.data.error);	
				}
			});
		}
    });
	
	//num------  
	$('.con_right .jian').live('click',function(e) {
		btn = $(this);
		if(parseInt(btn.next().html()) > 1){
			btn.next().html(parseInt(btn.next().html())- 1);
			$.post('<%= CLI_HOST_API_URL %>/nggirl/app/cli/item/cart/changeItemInCart/3.1.0',getFinalRequestObject({accessToken:getAccessToken(),cartDetailId:btn.parent().parent().attr('cartDetailId'),quantity:btn.next().html(),skuId:btn.parent().parent().attr('skuId')}),function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					btn.parent().parent().attr('quantity',btn.next().html());
					updateShopeNumPrice();
				}else{	
					alert(data.data.error);	
				}
			});
		}
    });
	
	//获取用户购物车中的全部商品V3.1.0
	getUserCart();
	
	//查看商品详情
	$('.con .cover,.con .con_center').live('click',function(e) {
        window.location.href = "newGoodsDetails.html?itemId="+$(this).parent().parent().attr('itemId');
    });
	$('.recommend_ul li').live('click',function(e) {
        window.location.href = "newGoodsDetails.html?itemId="+$(this).attr('itemId');
    });
	
	//删除购物车中的商品V3.1.0
	$('.list-ul .list-li .btn').live('click',function(e) {
		var btn = $(this);
		$.post('<%= CLI_HOST_API_URL %>/nggirl/app/cli/item/cart/deleteItemFromCart/3.1.0',getFinalRequestObject({accessToken:getAccessToken(),cartDetailIds:btn.parent().attr('cartDetailId')}),function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				btn.parent().remove();
				updateShopeNumPrice();
				if($('.list-ul li').length == 0){
					$('.title-btn .edit_btn,.bottom_btn,.title-btn .success_btn').addClass('hidden');
					$('.shop_car').removeClass('hidden');
					getNextPage(0);
				}else{
					$('.title-btn .edit_btn,.bottom_btn,.title-btn .success_btn').removeClass('hidden');
					$('.shop_car').addClass('hidden');
				}
			}else{	
				alert(data.data.error);	
			}
		});
    });
	
	//删除购物车中的商品V3.1.0
	$('.bottom_btn .bn_del').live('click',function(e) {
		var cartDetailIds = '';
        var btn = $(this);
		$('.list-ul li').each(function(index, element) {
            if($(this).children('.con').children('.white_circle').hasClass('on')){
				cartDetailIds += $(this).attr('cartDetailId')+',';	
			}
        });	
		cartDetailIds = cartDetailIds.substring(0,cartDetailIds.length -1);
		if(btn.hasClass('orange_back')){
			$.post('<%= CLI_HOST_API_URL %>/nggirl/app/cli/item/cart/deleteItemFromCart/3.1.0',getFinalRequestObject({accessToken:getAccessToken(),cartDetailIds:cartDetailIds}),function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					updateShopeNumPrice();
					$('.list-ul li').each(function(index, element) {
						if($(this).children('.con').children('.white_circle').hasClass('on')){
							$(this).remove();
						}
					});
					$('.bottom_btn .bn_del').removeClass('orange_back').html('删除(0)');	
					if($('.list-ul li').length == 0){
						$('.title-btn .edit_btn,.title-btn .success_btn,.bottom_btn').addClass('hidden');
						$('.shop_car').removeClass('hidden');
						getNextPage(0);
					}else{
						$('.title-btn .edit_btn,.bottom_btn,.title-btn .success_btn').removeClass('hidden');
						$('.shop_car').addClass('hidden');
					}
					
				}else{	
					alert(data.data.error);	
				}
			});
		};
    });
	
	//获取商品详情
	$('.con_right_modify .crm_modify_btn').live('click',function(e) {
		$('.list-ul').addClass('gray_hidden');
		$(".list-ul").bind("touchmove",function(event){
			event.preventDefault();
		});

		var btn = $(this);
		$('.gray_content .norm_box').html('');
		$('.nc_bottom .count .num').html(btn.parent().children('.crm_modify_num').children('span').html());
		$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/item/getItemInfo/3.1.0',getFinalRequestObject({accessToken:getAccessToken(),itemId:btn.parent().parent().attr('itemId')}),function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){		
				$('.bc_title_main,.norm_content .nc_top .nt_right .title').html(data.data.mainTitle);
				$('.norm_content .nc_top .nt_right .price').html('¥ '+data.data.itemSku.skus[0].salePrice);
				//获取sku分类
				var specs = data.data.itemSku.specs;
				for(var x = 0; x < specs.length; x ++){
					$('.gray_content .norm_box').append('<div class="nc_center"><p class="type">'+specs[x].name+'</p><ul class="type_kinds">'+getSkuValue(specs[x].values,specs[x].specId,data.data.itemSku.skus)+'</ul></div>');
				}	
				$('body').data('data',data.data.itemSku.skus);//存储所有排列组合数组
				
				//获取小图
				$('.gray_content .norm_content .nc_top .cover').attr('src',data.data.imgUrl);
				$('.gray_box,.gray_box_param').removeClass('hidden').attr('cartDetailId',btn.parent().parent().attr('cartDetailId'));
			}else{
				alert(data.data.error);	
			}
		});
    });
	
	//关闭规格弹框
	$('.gray_box,.close').click(function(e) {
        $('.gray_box,.gray_box_param').addClass('hidden');
		$('.list-ul').removeClass('gray_hidden');
		$(".list-ul").unbind('touchmove');
    });
	
	
	//++++++购买数量
	$('.count .plus').click(function(e) {
		var num = $('.count .num');
        if(num.html()>0  && $('.btn .kucun_btn').hasClass('hidden')){
			num.html(parseInt(num.html()) + 1);
		};
		if(parseInt(num.html()) >= parseInt($('body').attr('stockquantity'))){
			alertGrayWindow('当前商品最大购买数量为'+$('body').attr('stockquantity')+'件');
			$('.btn .kucun_btn').removeClass('hidden');
			$('.btn .sure_btn').addClass('hidden');
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
				$('.btn .kucun_btn').addClass('hidden');
				$('.btn .sure_btn').removeClass('hidden');
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
	
	//修改购物车中的商品V3.1.0
	$('.btn .sure_btn').click(function(e) {
		var btn = $(this);
		$.post('<%= CLI_HOST_API_URL %>/nggirl/app/cli/item/cart/changeItemInCart/3.1.0',getFinalRequestObject({accessToken:getAccessToken(),cartDetailId:btn.parent().parent().attr('cartDetailId'),quantity:$('.count .num').html(),skuId:$('body').attr('skuId')}),function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				$('.gray_box_param,.gray_box').addClass('hidden');
				getUserCart();
				$('.success_btn').html('编辑').removeClass('success_btn').addClass('edit_btn');
				$('.bottom_btn .bn_center').removeClass('hidden');
			}else{	
				alert(data.data.error);	
			}
		});
    });
	
	//后退到上一个页面
	$('.content .title-btn img').click(function(e) {
        window.history.back();
    });
	
	//
	$('.list-ul .list-li').live('touchstart',function(e) {
        $(this).siblings().css('WebkitTransform','translateX(' + 0 + 'px)');
    });
})

//滑动
window.addEventListener('load',function(){
	var initX;
	var moveX;
	var X = 0;
	var objX = 0;
	window.addEventListener('touchstart',function(event){
		//event.preventDefault();
		var obj = event.target.parentNode;
		if(obj.className == "list-li"){
			initX = event.targetTouches[0].pageX;
			objX =(obj.style.WebkitTransform.replace(/translateX\(/g,"").replace(/px\)/g,""))*1;
		}else if(obj.className == "con_center"){
			initX = event.targetTouches[0].pageX;
			objX =(obj.parentNode.parentNode.style.WebkitTransform.replace(/translateX\(/g,"").replace(/px\)/g,""))*1;
		}else if(obj.className == "con"){
			initX = event.targetTouches[0].pageX;
			objX =(obj.parentNode.style.WebkitTransform.replace(/translateX\(/g,"").replace(/px\)/g,""))*1;
		}
		if( objX == 0){
			window.addEventListener('touchmove',function(event) {
				//event.preventDefault();
				var obj = event.target.parentNode;
				if (obj.className == "list-li") {
					moveX = event.targetTouches[0].pageX;
					X = moveX - initX;
					if (X > 0) {
						obj.style.WebkitTransform = "translateX(" + 0 + "px)";
					}
					else if (X < 0) {
						var l = Math.abs(X);
						obj.style.WebkitTransform = "translateX(" + -l + "px)";
						if(l>70){
							l=70;
							obj.style.WebkitTransform = "translateX(" + -l + "px)";
						}
					}
				}else if(obj.className == "con_center"){
					moveX = event.targetTouches[0].pageX;
					X = moveX - initX;
					if (X > 0) {
						obj.parentNode.parentNode.style.WebkitTransform = "translateX(" + 0 + "px)";
					}
					else if (X < 0) {
						var l = Math.abs(X);
						obj.parentNode.parentNode.style.WebkitTransform = "translateX(" + -l + "px)";
						if(l>70){
							l=70;
							obj.parentNode.parentNode.style.WebkitTransform = "translateX(" + -l + "px)";
						}
					}
				}else if(obj.className == "con"){
					moveX = event.targetTouches[0].pageX;
					X = moveX - initX;
					if (X > 0) {
						obj.parentNode.style.WebkitTransform = "translateX(" + 0 + "px)";
					}
					else if (X < 0) {
						var l = Math.abs(X);
						obj.parentNode.style.WebkitTransform = "translateX(" + -l + "px)";
						if(l>70){
							l=70;
							obj.parentNode.style.WebkitTransform = "translateX(" + -l + "px)";
						}
					}
				}
			});
		}
		else if(objX<0){
			window.addEventListener('touchmove',function(event) {
				//event.preventDefault();
				var obj = event.target.parentNode;
				if (obj.className == "list-li") {
					moveX = event.targetTouches[0].pageX;
					X = moveX - initX;
					if (X > 0) {
						var r = -70 + Math.abs(X);
						obj.style.WebkitTransform = "translateX(" + r + "px)";
						if(r>0){
							r=0;
							obj.style.WebkitTransform = "translateX(" + r + "px)";
						}
					}
					else {     //向左滑动
						obj.style.WebkitTransform = "translateX(" + -70 + "px)";
					}
				}else if(obj.className == "con_center"){
					moveX = event.targetTouches[0].pageX;
					X = moveX - initX;
					if (X > 0) {
						var r = -70 + Math.abs(X);
						obj.parentNode.parentNode.style.WebkitTransform = "translateX(" + r + "px)";
						if(r>0){
							r=0;
							obj.parentNode.parentNode.style.WebkitTransform = "translateX(" + r + "px)";
						}
					}
					else {     //向左滑动
						obj.parentNode.parentNode.style.WebkitTransform = "translateX(" + -70 + "px)";
					}
				}else if(obj.className == "con"){
					moveX = event.targetTouches[0].pageX;
					X = moveX - initX;
					if (X > 0) {
						var r = -70 + Math.abs(X);
						obj.parentNode.style.WebkitTransform = "translateX(" + r + "px)";
						if(r>0){
							r=0;
							obj.parentNode.style.WebkitTransform = "translateX(" + r + "px)";
						}
					}
					else {     //向左滑动
						obj.parentNode.style.WebkitTransform = "translateX(" + -70 + "px)";
					}
				}
			});
		}

	})
	window.addEventListener('touchend',function(event){
		//event.preventDefault();
		var obj = event.target.parentNode;
		if(obj.className == "list-li"){
			objX =(obj.style.WebkitTransform.replace(/translateX\(/g,"").replace(/px\)/g,""))*1;
			if(objX>-40){
				obj.style.WebkitTransform = "translateX(" + 0 + "px)";
			}else{
				obj.style.WebkitTransform = "translateX(" + -70 + "px)";
			}
		}else if(obj.className == "con_center"){
			objX =(obj.parentNode.parentNode.style.WebkitTransform.replace(/translateX\(/g,"").replace(/px\)/g,""))*1;
			if(objX>-40){
				obj.parentNode.parentNode.style.WebkitTransform = "translateX(" + 0 + "px)";
			}else{
				obj.parentNode.parentNode.style.WebkitTransform = "translateX(" + -70 + "px)";
			}
		}else if(obj.className == "con"){
			objX =(obj.parentNode.style.WebkitTransform.replace(/translateX\(/g,"").replace(/px\)/g,""))*1;
			if(objX>-40){
				obj.parentNode.style.WebkitTransform = "translateX(" + 0 + "px)";
			}else{
				obj.parentNode.style.WebkitTransform = "translateX(" + -70 + "px)";
			}
		}
	 })
})
//判断全选按钮状态
function selectAllBtnStatusFn(){
	var num = 0;
	var selectNum = 0;
	if($('body').hasClass('success')){
		$('.list-ul li').each(function(index, element) {
            if($(this).children('.con').children('.white_circle').hasClass('on')){
				selectNum += 1;	
			}
        });	
		if(selectNum == $('.list-ul li').length){
			$('.bottom_btn .bn_left').addClass('on').children('.bl_circle').attr('src','images/orange_circle.png');	
		}else{
			$('.bottom_btn .bn_left').removeClass('on').children('.bl_circle').attr('src','images/white_circle.png');	
		}
	}else{
		$('.list-ul li').each(function(index, element) {
            if($(this).attr('status') != 0){
				num += 1;	
			};
            if($(this).children('.con').children('.white_circle').hasClass('on')){
				selectNum += 1;	
			};
        });	
		if(num == selectNum){
			$('.bottom_btn .bn_left').addClass('on').children('.bl_circle').attr('src','images/orange_circle.png');	
		}else{
			$('.bottom_btn .bn_left').removeClass('on').children('.bl_circle').attr('src','images/white_circle.png');	
		}
	}
}


//获取购物车中商品总数V3.1.0
function getGoodsNum(){
	$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/item/cart/getGoodsNum/3.1.0',getFinalRequestObject({accessToken:getAccessToken()}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			$('.fc_pao .qipao').html(data.data.goodsNum);
			$('.fc_pao .qipao').width($('.fc_pao .qipao').height());
		}else{	
			alert(data.data.error);	
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

//获取用户购物车中的全部商品V3.1.0
function getUserCart(){
	$('.list-ul').html('');
	$.post('<%= CLI_HOST_API_URL %>/nggirl/app/cli/item/cart/getUserCart/3.1.0',getFinalRequestObject({accessToken:getAccessToken()}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			if(data.data.length == 0){
				$('.title-btn .edit_btn,.bottom_btn,.title-btn .success_btn').addClass('hidden');
				$('.shop_car').removeClass('hidden');
				//获取为你推荐商品列表V3.1.0
				getNextPage(page);
				
			}else{
				$('.title-btn .edit_btn,.bottom_btn,.title-btn .success_btn').removeClass('hidden');
				$('.shop_car').addClass('hidden');
				for(var x = 0; x < data.data.length ;x ++){
					//判断商品是否有效  商品状态，1有效，0失效
					if(data.data[x].status == 0){
						$('.list-ul').append('<li stockQuantity='+data.data[x].stockQuantity+' salePrice='+data.data[x].salePrice+' quantity='+data.data[x].quantity+' skuId='+data.data[x].skuId+' cartDetailId='+data.data[x].cartDetailId+' status='+data.data[x].status+' itemId = '+data.data[x].itemId+' class="list-li"><div class="con"><img src="images/white_circle.png" class="white_circle hidden" alt="" /><div class="con_fail">失效</div><img src="'+data.data[x].imgUrl+'" class="cover" alt="" /><div class="con_center"><p class="title">'+data.data[x].reamTitle+'</p><p class="type">已选：'+data.data[x].skuName+'</p><p class="price color_gray">¥ '+data.data[x].salePrice+'</p></div></div><div class="btn">删除</div><div class="con_right hidden"><span class="jian">-</span><span class="num">'+data.data[x].quantity+'</span><span class="plus">+</span></div><div class="con_right_modify hidden"><img src="images/modify_btn.png" class="crm_modify_btn" alt="" /><div class="crm_fail_btn hidden">失效</div><p class="crm_modify_num">x<span>'+data.data[x].quantity+'</span></p></div></li>');	
					}else{
						$('.list-ul').append('<li stockQuantity='+data.data[x].stockQuantity+' salePrice='+data.data[x].salePrice+' quantity='+data.data[x].quantity+' skuId='+data.data[x].skuId+' cartDetailId='+data.data[x].cartDetailId+' status='+data.data[x].status+' itemId='+data.data[x].itemId+' class="list-li"><div class="con"><img src="images/white_circle.png" class="white_circle" alt="" /><div class="con_fail hidden">失效</div><img src="'+data.data[x].imgUrl+'" class="cover" alt="" /><div class="con_center"><p class="title">'+data.data[x].reamTitle+'</p><p class="type">已选：'+data.data[x].skuName+'</p><p class="price">¥ '+data.data[x].salePrice+'</p></div></div><div class="btn">删除</div><div class="con_right"><span class="jian">-</span><span class="num">'+data.data[x].quantity+'</span><span class="plus">+</span></div><div class="con_right_modify hidden"><img src="images/modify_btn.png" class="crm_modify_btn" alt="" /><div class="crm_fail_btn hidden">失效</div><p class="crm_modify_num">x<span>'+data.data[x].quantity+'</span></p></div></li>');	
					}
				}
			}
		}else{	
			alert(data.data.error);	
		}
	});
}

function getNextPage(page){
	$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/item/cart/recommendForYou/3.1.0',getFinalRequestObject({accessToken:getAccessToken(),pageNum:page}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			if(data.data.length > 0){
				if( data.data.length == 20 ){
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
			for(var x = 0; x < data.data.length ;x ++){
				$('.recommend_ul').append('<li itemId='+data.data[x].itemId+'><div class="ru_li"><img src="'+data.data[x].imgUrl+'" alt="" /><p class="title">'+data.data[x].mainTitle+'</p><p class="price">¥ '+data.data[x].salePrice+'</p></div></li>');
			}
			$('.recommend_ul li img').height($('.recommend_ul li img').width());
		}else{	
			alert(data.data.error);	
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

//修改购物车商品件数对应更新价格
function updateShopeNumPrice(){
	var quantity = 0;
	var totalNum = 0;
	$('.list-ul li').each(function(index, element) {
		if($(this).children('.con').children('.white_circle').hasClass('on')){
			quantity = parseInt($(this).attr('quantity')) + quantity;
			totalNum = $(this).attr('salePrice') * $(this).attr('quantity') + totalNum;
		}
	});
	if(quantity == 0){
		$('.bn_del').html('删除(0)').removeClass('orange_back');
	}else{
		$('.bn_del').html('删除('+quantity+')').addClass('orange_back');
	}
	
	var arrNum = [];
	if(totalNum.toString().indexOf('.') >= 0){
		arrNum = totalNum.toString().split('.');
	}else{
		arrNum[0] = totalNum;	
		arrNum[1] = '00';	
	}
	if(totalNum == 0){
		$('.bn_right').html('结算(0)').removeClass('orange_back');
		$('.bc_num .num_left').html('¥0');
		$('.bc_num .num_right').html('.00');
	}else{
		$('.bn_right').html('结算('+quantity+')').addClass('orange_back');
		$('.bc_num .num_left').html(arrNum[0]);
		$('.bc_num .num_right').html('.'+arrNum[1].substr(0,3));
	}
}
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
