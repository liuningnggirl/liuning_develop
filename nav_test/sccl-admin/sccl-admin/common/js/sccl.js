/*左侧菜单点击*/
$(".side-menu").on('click', 'li a', function(e) {
	var animationSpeed = 300;
	var $this = $(this);
	var checkElement = $this.next();

	if (checkElement.is('.menu-item-child') && checkElement.is(':visible')) {
	  checkElement.slideUp(animationSpeed, function() {
		checkElement.removeClass('menu-open');
	  });
	  checkElement.parent("li").removeClass("active");
	}
	//如果菜单是不可见的
	else if ((checkElement.is('.menu-item-child')) && (!checkElement.is(':visible'))) {
	  //获取上级菜单
	  var parent = $this.parents('ul').first();
	  //从父级开始找所有打开的菜单并关闭
	  var ul = parent.find('ul:visible').slideUp(animationSpeed);
	  //在父级中移出menu-open标记
	  ul.removeClass('menu-open');
	  //获取父级li
	  var parent_li = $this.parent("li");
	  //打开菜单时添加menu-open标记
	  checkElement.slideDown(animationSpeed, function() {
		//添加样式active到父级li
		checkElement.addClass('menu-open');
		parent.find('li.active').removeClass('active');
		parent_li.addClass('active');
	  });
	}
	//防止有链接跳转
	e.preventDefault();

	addIframe($this);
});

/*添加iframe*/
function addIframe(cur){
	var $this = cur;
	var h = $this.attr("href"),
		m = $this.data("index"),
		label = $this.find("span").text(),
		isHas = false;
	if (h == "" || $.trim(h).length == 0) {
		return false;
	}
	
	var fullWidth = $(window).width();
	if(fullWidth >= 750){
		$(".layout-side").show();
	}else{
		$(".layout-side").hide();
	}
	
	$(".content-tab").each(function() {
		if ($(this).data("id") == h) {
			if (!$(this).hasClass("active")) {
				$(this).addClass("active").siblings(".content-tab").removeClass("active");
				addTab(this);
			}
			isHas = true;
		}
	});
	if(isHas){
		$(".body-iframe").each(function() {
			if ($(this).data("id") == h) {
				$(this).show().siblings(".body-iframe").hide();
			}
		});
	}
	if (!isHas) {
		var tab = "<a href='javascript:;' class='content-tab active' data-id='"+h+"'>"+ label +" <i class='icon-font'>&#xe617;</i></a>";
		$(".content-tab").removeClass("active");
		$(".tab-nav-content").append(tab);
		var iframe = "<iframe class='body-iframe' name='iframe"+ m +"' width='100%' height='99%' src='"+ h +"' frameborder='0' data-id='"+ h +"' seamless></iframe>";
		$(".layout-main-body").find("iframe.body-iframe").hide().parents(".layout-main-body").append(iframe);
		addTab($(".content-tab.active"));
	}
	return false;
}


/*添加tab*/
function addTab(cur) {
	var prev_all = tabWidth($(cur).prevAll()),
		next_all = tabWidth($(cur).nextAll());
	var other_width =tabWidth($(".layout-main-tab").children().not(".tab-nav"));
	var navWidth = $(".layout-main-tab").outerWidth(true)-other_width;//可视宽度
	var hidewidth = 0;
	if ($(".tab-nav-content").width() < navWidth) {
		hidewidth = 0
	} else {
		if (next_all <= (navWidth - $(cur).outerWidth(true) - $(cur).next().outerWidth(true))) {
			if ((navWidth - $(cur).next().outerWidth(true)) > next_all) {
				hidewidth = prev_all;
				var m = cur;
				while ((hidewidth - $(m).outerWidth()) > ($(".tab-nav-content").outerWidth() - navWidth)) {
					hidewidth -= $(m).prev().outerWidth();
					m = $(m).prev()
				}
			}
		} else {
			if (prev_all > (navWidth - $(cur).outerWidth(true) - $(cur).prev().outerWidth(true))) {
				hidewidth = prev_all - $(cur).prev().outerWidth(true)
			}
		}
	}
	$(".tab-nav-content").animate({
		marginLeft: 0 - hidewidth + "px"
	},
	"fast")
}

/*获取宽度*/
function tabWidth(tabarr) {
	var allwidth = 0;
	$(tabarr).each(function() {
		allwidth += $(this).outerWidth(true)
	});
	return allwidth;
}

/*左按钮事件*/
$(".btn-left").on("click", leftBtnFun);
/*右按钮事件*/
$(".btn-right").on("click", rightBtnFun);
/*选项卡切换事件*/
$(".tab-nav-content").on("click", ".content-tab", navChange);
/*选项卡关闭事件*/
$(".tab-nav-content").on("click", ".content-tab i", closePage);
/*选项卡双击关闭事件*/
$(".tab-nav-content").on("dblclick", ".content-tab", closePage);


/*左按钮方法*/
function leftBtnFun() {
	var ml = Math.abs(parseInt($(".tab-nav-content").css("margin-left")));
	var other_width = tabWidth($(".layout-main-tab").children().not(".tab-nav"));
	var navWidth = $(".layout-main-tab").outerWidth(true)-other_width;//可视宽度
	var hidewidth = 0;
	if ($(".tab-nav-content").width() < navWidth) {
		return false
	} else {
		var tabIndex = $(".content-tab:first");
		var n = 0;
		while ((n + $(tabIndex).outerWidth(true)) <= ml) {
			n += $(tabIndex).outerWidth(true);
			tabIndex = $(tabIndex).next();
		}
		n = 0;
		if (tabWidth($(tabIndex).prevAll()) > navWidth) {
			while ((n + $(tabIndex).outerWidth(true)) < (navWidth) && tabIndex.length > 0) {
				n += $(tabIndex).outerWidth(true);
				tabIndex = $(tabIndex).prev();
			}
			hidewidth = tabWidth($(tabIndex).prevAll());
		}
	}
	$(".tab-nav-content").animate({
		marginLeft: 0 - hidewidth + "px"
	},
	"fast");
}

/*右按钮方法*/
function rightBtnFun() {
	var ml = Math.abs(parseInt($(".tab-nav-content").css("margin-left")));
	var other_width = tabWidth($(".layout-main-tab").children().not(".tab-nav"));
	var navWidth = $(".layout-main-tab").outerWidth(true)-other_width;//可视宽度
	var hidewidth = 0;
	if ($(".tab-nav-content").width() < navWidth) {
		return false
	} else {
		var tabIndex = $(".content-tab:first");
		var n = 0;
		while ((n + $(tabIndex).outerWidth(true)) <= ml) {
			n += $(tabIndex).outerWidth(true);
			tabIndex = $(tabIndex).next();
		}
		n = 0;
		while ((n + $(tabIndex).outerWidth(true)) < (navWidth) && tabIndex.length > 0) {
			n += $(tabIndex).outerWidth(true);
			tabIndex = $(tabIndex).next()
		}
		hidewidth = tabWidth($(tabIndex).prevAll());
		if (hidewidth > 0) {
			$(".tab-nav-content").animate({
				marginLeft: 0 - hidewidth + "px"
			},
			"fast");
		}
	}
}

/*选项卡切换方法*/
function navChange() {
	if (!$(this).hasClass("active")) {
		var k = $(this).data("id");
		$(".body-iframe").each(function() {
			if ($(this).data("id") == k) {
				$(this).show().siblings(".body-iframe").hide();
				return false
			}
		});
		$(this).addClass("active").siblings(".content-tab").removeClass("active");
		addTab(this);
	}
}

/*选项卡关闭方法*/
function closePage() {
	var url = $(this).parents(".content-tab").data("id");
	var cur_width = $(this).parents(".content-tab").width();
	if ($(this).parents(".content-tab").hasClass("active")) {
		if ($(this).parents(".content-tab").next(".content-tab").size()) {
			var next_url = $(this).parents(".content-tab").next(".content-tab:eq(0)").data("id");
			$(this).parents(".content-tab").next(".content-tab:eq(0)").addClass("active");
			$(".body-iframe").each(function() {
				if ($(this).data("id") == next_url) {
					$(this).show().siblings(".body-iframe").hide();
					return false
				}
			});
			var n = parseInt($(".tab-nav-content").css("margin-left"));
			if (n < 0) {
				$(".tab-nav-content").animate({
					marginLeft: (n + cur_width) + "px"
				},
				"fast")
			}
			$(this).parents(".content-tab").remove();
			$(".body-iframe").each(function() {
				if ($(this).data("id") == url) {
					$(this).remove();
					return false
				}
			})
		}
		if ($(this).parents(".content-tab").prev(".content-tab").size()) {
			var prev_url = $(this).parents(".content-tab").prev(".content-tab:last").data("id");
			$(this).parents(".content-tab").prev(".content-tab:last").addClass("active");
			$(".body-iframe").each(function() {
				if ($(this).data("id") == prev_url) {
					$(this).show().siblings(".body-iframe").hide();
					return false
				}
			});
			$(this).parents(".content-tab").remove();
			$(".body-iframe").each(function() {
				if ($(this).data("id") == url) {
					$(this).remove();
					return false
				}
			})
		}
	} else {
		$(this).parents(".content-tab").remove();
		$(".body-iframe").each(function() {
			if ($(this).data("id") == url) {
				$(this).remove();
				return false
			}
		});
		addTab($(".content-tab.active"))
	}
	return false
}


/*循环菜单*/
function initMenu(menu,parent){
	for(var i=0; i<menu.length; i++){   
		var item = menu[i];
		var str = "";
		try{
			if(item.isHeader == "1"){
				//str = "<li class='menu-header'>"+item.name+"</li>";
				$(parent).append(str);
				if(item.childMenus != ""){
					initMenu(item.childMenus,parent);
				}
			}else{
				item.icon == "" ? item.icon = "&#xe610" : item.icon = item.icon;
				if(item.childMenus == ""){
					str = "<li><a href='"+item.url+"'><i class='icon-font'>"+item.icon+"</i><span>"+item.name+"</span></a></li>";
					$(parent).append(str);
				}else{
					str = "<li><a href='"+item.url+"'><i class='icon-font '>"+item.icon+"</i><span>"+item.name+"</span><i class='icon-font icon-right'>&#xe60b;</i></a>";
					str +="<ul class='menu-item-child' id='menu-child-"+item.id+"'></ul></li>";
					$(parent).append(str);
					var childParent = $("#menu-child-"+item.id);
					initMenu(item.childMenus,childParent);
				}
			}
		}catch(e){}
	}
}



/*头部下拉框移入移出*/
$(document).on("mouseenter",".header-bar-nav",function(){
	$(this).addClass("open");
});
$(document).on("mouseleave",".header-bar-nav",function(){
	$(this).removeClass("open");
});

/*左侧菜单展开和关闭按钮事件*/
$(document).on("click",".layout-side-arrow",function(){
	if($(".layout-side").hasClass("close")){
		$(".layout-side").removeClass("close");
		$(".layout-main").removeClass("full-page");
		$(".layout-footer").removeClass("full-page");
		$(this).removeClass("close");
		$(".layout-side-arrow-icon").removeClass("close");
	}else{
		$(".layout-side").addClass("close");
		$(".layout-main").addClass("full-page");
		$(".layout-footer").addClass("full-page");
		$(this).addClass("close");
		$(".layout-side-arrow-icon").addClass("close");
	}
});

/*头部菜单按钮点击事件*/
$(".header-menu-btn").click(function(){
	$(".layout-side").removeClass("close");
	$(".layout-main").removeClass("full-page");
	$(".layout-footer").removeClass("full-page");
	$(".layout-side-arrow").removeClass("close");
	$(".layout-side-arrow-icon").removeClass("close");
	
	$(".layout-side").slideToggle();
});

/*左侧菜单响应式*/
$(window).resize(function() {  
	var width = $(this).width();  
	if(width >= 750){
		$(".layout-side").show();
	}else{
		$(".layout-side").hide();
	}
});

/*皮肤选择*/
$(".dropdown-skin li a").click(function(){
	var v = $(this).attr("data-val");
	var hrefStr=$("#layout-skin").attr("href");
	var hrefRes=hrefStr.substring(0,hrefStr.lastIndexOf('skin/'))+'skin/'+v+'/skin.css';
	$(window.frames.document).contents().find("#layout-skin").attr("href",hrefRes);
	
	setCookie("scclui-skin", v);
});

/*获取cookie中的皮肤*/
function getSkinByCookie(){
	var v = getCookie("scclui-skin");
	var hrefStr=$("#layout-skin").attr("href");
	if(v == null || v == ""){
		v="qingxin";
	}
	if(hrefStr != undefined){
		var hrefRes=hrefStr.substring(0,hrefStr.lastIndexOf('skin/'))+'skin/'+v+'/skin.css';
		$("#skin").attr("href",hrefRes);
	}
}

/*随机颜色*/
function getMathColor(){
	var arr = new Array();
	arr[0] = "#ffac13";
	arr[1] = "#83c44e";
	arr[2] = "#2196f3";
	arr[3] = "#e53935";
	arr[4] = "#00c0a5";
	arr[5] = "#16A085";
	arr[6] = "#ee3768";

	var le = $(".menu-item > a").length;
	for(var i=0;i<le;i++){
		var num = Math.round(Math.random()*5+1);
		var color = arr[num-1];
		$(".menu-item > a").eq(i).find("i:first").css("color",color);
	}
}

/*
  初始化加载
*/
$(function(){
	/*获取皮肤*/
	//getSkinByCookie();

	/*菜单json*/
	/*var menu = [
				{"id":"1","name":"主菜单","parentId":"0","url":"","icon":"","order":"1","isHeader":"0","childMenus":[
					{"id":"3","name":"商品管理","parentId":"1","url":"","icon":"&#xe604;","order":"1","isHeader":"0","childMenus":[
						{"id":"4","name":"品牌管理","parentId":"3","url":"test1.html","icon":"","order":"1","isHeader":"0","childMenus":""},
						{"id":"5","name":"分类管理","parentId":"3","url":"test2.html","icon":"","order":"1","isHeader":"0","childMenus":""}
					]},
					{"id":"6","name":"订单管理","parentId":"1","url":"","icon":"&#xe602;","order":"1","isHeader":"0","childMenus":[
						{"id":"7","name":"已付款","parentId":"6","url":"index2.shtml","icon":"","order":"1","isHeader":"0","childMenus":""},
						{"id":"8","name":"未付款","parentId":"6","url":"test2.html","icon":"","order":"1","isHeader":"0","childMenus":""}
					]}
				]},
				{"id":"2","name":"框架案例","parentId":"0","url":"","icon":"","order":"1","isHeader":"0","childMenus":[
					{"id":"9","name":"新功能","parentId":"2","url":"","icon":"","order":"1","isHeader":"0","childMenus":""},
					{"id":"10","name":"多级","parentId":"2","url":"","icon":"","order":"1","isHeader":"0","childMenus":[
						{"id":"11","name":"一级","parentId":"10","url":"","icon":"","order":"1","isHeader":"0","childMenus":""},
						{"id":"12","name":"一级","parentId":"10","url":"","icon":"","order":"1","isHeader":"0","childMenus":[
							{"id":"13","name":"二级","parentId":"12","url":"","icon":"","order":"1","isHeader":"0","childMenus":""},
							{"id":"14","name":"二级","parentId":"12","url":"","icon":"","order":"1","isHeader":"0","childMenus":[
								{"id":"15","name":"三级","parentId":"14","url":"","icon":"","order":"1","isHeader":"0","childMenus":""},
								{"id":"16","name":"三级","parentId":"14","url":"","icon":"","order":"1","isHeader":"0","childMenus":[
									{"id":"17","name":"四级","parentId":"16","url":"","icon":"","order":"1","isHeader":"0","childMenus":""},
									{"id":"18","name":"四级","parentId":"16","url":"","icon":"","order":"1","isHeader":"0","childMenus":""}
								]}
							]}
						]}
					]}
				]}
			];*/
	var menu = [
				{"id":"user_manage","name":"用户管理","parentId":"0","url":"","icon":"","order":"1","isHeader":"0","childMenus":[
					{"id":"pumpink_user_manage","name":"南瓜用户","parentId":"user_manage","url":"user_detail.html","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""}
				]},
				{"id":"adv_manage","name":"广告投放管理","parentId":"0","url":"","icon":"","order":"1","isHeader":"0","childMenus":[
					{"id":"index_banner_manage","name":"首页banner管理","parentId":"adv_manage","url":"banner_manage.html","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""},
					{"id":"kaiping_banner_manage","name":"开屏广告管理","parentId":"adv_manage","url":"ad_mangement.html","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""}
				]},
				{"id":"index_control_manage","name":"首页控制管理","parentId":"0","url":"","icon":"","order":"1","isHeader":"0","childMenus":[
					{"id":"index_nav_manage","name":"导航控制","parentId":"index_control_manage","url":"index_nav_manage.html","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""},
					{"id":"nav_tag_manage","name":"导航标签管理","parentId":"index_control_manage","url":"index_nav_label.html","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""},
					{"id":"index_list_manage","name":"首页列表控制","parentId":"index_control_manage","url":"index_list_manage.html","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""}
				]},
				{"id":"community_manage","name":"社区管理","parentId":"0","url":"","icon":"","order":"1","isHeader":"0","childMenus":[
					{"id":"post_manage","name":"帖子管理","parentId":"community_manage","url":"post_manage_new.html","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""},
					{"id":"community_commends_manage","name":"社区评论管理","parentId":"community_manage","url":"allCommentsManagement.html","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""},
					{"id":"community_label_manage","name":"发布页面标签管理","parentId":"community_manage","url":"community_label_manage.html","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""},
					{"id":"popular_searches","name":"热门搜索","parentId":"community_manage","url":"test2.html","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""},
					{"id":"post_hot_match","name":"帖子热度匹配","parentId":"community_manage","url":"","icon":"","order":"1","isHeader":"0","childMenus":[
						{"id":"post_hot_match_operators_manage","name":"管理员","parentId":"post_hot_match","url":"tie_hot_admin_manage.html","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""},
						{"id":"post_hot_match_admin_manage","name":"运营人员","parentId":"post_hot_match","url":"tie_hot_operators_manage.html","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""}
					]}
				]},
				{"id":"operation_manage","name":"运营活动管理","parentId":"0","url":"","icon":"","order":"1","isHeader":"0","childMenus":[
					{"id":"lottery_activity_manage","name":"大转盘抽奖活动","parentId":"operation_manage","url":"lottery_activity_manage.html","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""},
					{"id":"free_trial_manage","name":"免费试用活动","parentId":"operation_manage","url":"free_trial_manage.html","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""},
					{"id":"riqian_manage","name":"日签","parentId":"operation_manage","url":"riqian_manage.html","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""},
					{"id":"community_hottopic_manage","name":"话题讨论","parentId":"operation_manage","url":"community_hottopic_manage.html","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""},
					{"id":"points_mall_manage","name":"积分商城","parentId":"operation_manage","url":"points_mall_manage.html","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""},
					{"id":"pumpkin_person_approve_manage","name":"南瓜达人认证","parentId":"operation_manage","url":"pumpkin_person_approve_manage.html","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""},
					{"id":"play_reward_manage","name":"打赏","parentId":"operation_manage","url":"play_reward_manage.html","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""},
					{"id":"community_activities_manage","name":"社团活动排版管理","parentId":"operation_manage","url":"","icon":"","order":"1","isHeader":"0","childMenus":[
						{"id":"community_freetrail_manage","name":"免费试用活动","parentId":"community_activities_manage","url":"community_freetrail_manage.html","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""},
						{"id":"community_activity_manage","name":"有奖活动","parentId":"community_activities_manage","url":"community_activity_manage.html","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""}
					]}
				]},
				{"id":"electricity_supplier_manage","name":"电商商城管理","parentId":"0","url":"","icon":"","order":"1","isHeader":"0","childMenus":[
					{"id":"electricity_supplier_goods_manage","name":"商品管理","parentId":"electricity_supplier_manage","url":"","icon":"","order":"1","isHeader":"0","childMenus":[
						{"id":"electricity_supplier_goods_list_manage","name":"商品列表管理","parentId":"electricity_supplier_goods_manage","url":"electricity_supplier_goods_manage.html","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""},
						{"id":"electricity_supplier_branch_manage","name":"商品品牌管理","parentId":"electricity_supplier_goods_manage","url":"electricity_supplier_branch_manage.html","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""},
						{"id":"electricity_goods_delivery_manage","name":"商品物流管理","parentId":"electricity_supplier_goods_manage","url":"electricity_goods_delivery_manage.html","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""},
						{"id":"electricity_buy_know_manage","name":"购买须知牌管理","parentId":"electricity_supplier_goods_manage","url":"electricity_buy_know_manage.html","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""},
						{"id":"goods_parameter_manage","name":"商品参数管理","parentId":"electricity_supplier_goods_manage","url":"goods_parameter_management.html","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""}
					]},
					{"id":"shope_order_manage","name":"商品订单管理","parentId":"electricity_supplier_manage","url":"shope_order_manage.html","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""},
					{"id":"shope_evaluate_manage","name":"商品评价管理","parentId":"electricity_supplier_manage","url":"shope_evaluate_manage.html","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""},
					{"id":"shope_after_sale_manage","name":"商品售后管理","parentId":"electricity_supplier_manage","url":"shope_after_sale_manage.html","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""},
					{"id":"goods_column_manage","name":"商品促销活动","parentId":"electricity_supplier_manage","url":"goods_column_manage.html","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""}
				]},
				{"id":"official_push_manage","name":"官方推送管理","parentId":"0","url":"","icon":"","order":"1","isHeader":"0","childMenus":[
					{"id":"single_message_manage","name":"个推推送","parentId":"official_push_manage","url":"single_message_push.html","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""},
					{"id":"anyway_message_manage","name":"其他推送","parentId":"official_push_manage","url":"message_push.html","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""}
				]},
				{"id":"beauty_business_manage","name":"美妆业务管理","parentId":"0","url":"","icon":"","order":"1","isHeader":"0","childMenus":[
					{"id":"xwcOrder_manage","name":"美妆下午茶订单","parentId":"beauty_business_manage","url":"","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""},
					{"id":"order_manage","name":"上门美妆服务订单","parentId":"beauty_business_manage","url":"","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""},
					{"id":"dresser_manage","name":"化妆师管理","parentId":"beauty_business_manage","url":"","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""},
					{"id":"work_manage","name":"作品管理","parentId":"beauty_business_manage","url":"","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""},
					{"id":"smmzTopics_manage","name":"上门美妆专题","parentId":"beauty_business_manage","url":"","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""},
					{"id":"xwc_manage","name":"美妆下午茶","parentId":"beauty_business_manage","url":"","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""},
					{"id":"cash_manage","name":"现金提现","parentId":"beauty_business_manage","url":"","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""},
					{"id":"complaint_advisory_manage","name":"美妆投诉/咨询","parentId":"beauty_business_manage","url":"","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""},
					{"id":"beauty_line_service_manage","name":"美妆线下服务管理","parentId":"beauty_business_manage","url":"","icon":"","order":"1","isHeader":"0","childMenus":[
						{"id":"beauty_line_service_company_manage","name":"企业上门美妆服务","parentId":"beauty_line_service_manage","url":"","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""},
						{"id":"beauty_line_service_school_manage","name":"校园美妆课堂","parentId":"beauty_line_service_manage","url":"","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""}
					]}
				]},
				{"id":"other_manage","name":"其他","parentId":"0","url":"","icon":"","order":"1","isHeader":"0","childMenus":[
					{"id":"invitation_code_manage","name":"邀请码管理","parentId":"community_manage","url":"","icon":"","order":"1","isHeader":"0","childMenus":[
						{"id":"normal_manage","name":"普通邀请码","parentId":"post_hot_match","url":"test1.html","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""},
						{"id":"superInvite_manage","name":"超级邀请码","parentId":"post_hot_match","url":"test2.html","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""},
						{"id":"randomInvite_manage","name":"随机邀请码","parentId":"post_hot_match","url":"test2.html","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""}
					]},
					{"id":"anyway_message_manage","name":"资讯管理","parentId":"official_push_manage","url":"","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""},
					{"id":"anyway_message_manage","name":"客座小编帖子录入管理","parentId":"official_push_manage","url":"","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""},
					{"id":"anyway_message_manage","name":"意见反馈","parentId":"official_push_manage","url":"","icon":"&#xe600;","order":"1","isHeader":"0","childMenus":""}
				]}
			];
	initMenu(menu,$(".side-menu"));
	$(".side-menu > li").addClass("menu-item");
	
	/*获取菜单icon随机色*/
	//getMathColor();
}); 