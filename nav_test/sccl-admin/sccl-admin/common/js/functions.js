
var prevurl = '/nggirl-web';

//加载统计数据
function loadStat(){
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/stat/detail',
		type : 'get',
		dataType : 'json',
		data: {},
		success : function(data){
			$('.total-message>li:eq(0) .total-page .f32').html(data.data.todayReservationNum);//今日订单
			$('.total-message>li:eq(1) .total-page .f32').html(data.data.todayWorkNum);		  //今日作品
			$('.total-message>li:eq(2) .total-page .f32').html(data.data.reservationNum);     //总订单数
			$('.total-message>li:eq(3) .total-page .f32').html(data.data.dresserNum);         //化妆师总数
			$('.total-message>li:eq(4) .total-page .f32').html(data.data.userNum);            //总注册用户数
			$('.total-message>li:eq(5) .total-page .f32').html(data.data.amount);             //总交易金额

			$('.content-right ul>li>.total-page').eq(0).css('background','#08c');
			$('.content-right ul>li>.total-page').eq(1).css('background','#ffb848');
			$('.content-right ul>li>.total-page').eq(2).css('background','#28b779');
			$('.content-right ul>li>.total-page').eq(3).css('background','#da542e');
			$('.content-right ul>li>.total-page').eq(4).css('background','#f74d4d');
			$('.content-right ul>li>.total-page').eq(5).css('background','#2255a4');

			$('.content-right ul>li>.total-page').hover(function(){
				$(this).css('background','#2E363F');
			},function(){
				$('.content-right ul>li>.total-page').eq(0).css('background','#08c');
				$('.content-right ul>li>.total-page').eq(1).css('background','#ffb848');
				$('.content-right ul>li>.total-page').eq(2).css('background','#28b779');
				$('.content-right ul>li>.total-page').eq(3).css('background','#da542e');
				$('.content-right ul>li>.total-page').eq(4).css('background','#f74d4d');
				$('.content-right ul>li>.total-page').eq(5).css('background','#2255a4');
			});
		},
	});
}

//加载用户菜单
function loadMenu(){
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/getMenus',
		type : 'get',
		dataType : 'json',
		data: {},
		success : function(data){
			$('.content .content-left ul li').each(function(){
				var url = $(this).attr('url');
				if(!isInMenu(url,data)){
					$(this).hide();
				}
			});


			$('.content .content-left ul li').eq(0).css('background','#08c url(images/menu-active.png) no-repeat right').siblings().css('background','#2E363F');
			$('.content .content-left ul>li').click(function(e) {
				$(this).css({'background':'#08c url(images/menu-active.png) no-repeat right'}).siblings().css('background','#2E363F');
				$('.wb>.weight-box').eq($(this).index()).show().siblings().hide();
				$('.order-magement').children('span').html($(this).children('a').children('span').html());
			});

			$('.wb>.weight-box:eq(0)>.page-num>a').click(function(e) {
				$(this).addClass('blue').siblings().removeClass('blue');
			});

		},
	});
}

//获取url和对应的数据
function isInMenu(url,data){
	for(var i=0;i<data.data.length;i++){
		if(url == data.data[i].url){
			return true;
		}
	}
	return false;
}


//创建用户列表分页
function createUserPage(data){
	$(".yhxqq .tcdPageCode").createPage({
		pageCount:parseInt(data.data.totalPageNum),
		current:parseInt(data.data.currnetPageNum),
		backFn:loadUserPage
	});
}

//初始化用户分页
function initUserPage(data){
	createUserPage(data);
	for(var x = 0; x < data.data.pageData.length ; x ++){
		$('.yhxq').append('<tr><td>'+data.data.pageData[x].userId+'</td><td>'+data.data.pageData[x].registerTime+'</td><td>'+data.data.pageData[x].nickName+'</td><td>'+data.data.pageData[x].phoneNum+'</td><td>'+data.data.pageData[x].reservationNum+'</td><td>'+data.data.pageData[x].consumeFee+'</td><td>'+data.data.pageData[x].address+'</td></tr>');
	}
}

//获取查询参数
function getUserSearchParams(page){
	var params = new Object();
	if(page == undefined){
		page =1;
	}
	params.page = page;
	params.nickName = $('.yhxqq .search').val();
	return params;
}

//加载用户分页数据
function loadUserPage(){
	$('.yhxq>tbody>tr:gt(0)').remove();
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/user/listUsers',
		type : 'get',
		dataType : 'json',
		data: getUserSearchParams(1),
		success : initUserPage,
	});
}



//创建化妆师列表分页
function  createDresserPage(data){
	$(".hzsxqq .tcdPageCode").createPage({
		pageCount:data.data.totalPageNum,
		current:data.data.currnetPageNum,
		backFn:function(p){
			var params = getDresserSearchParams();
			params.page = p;
			$('.hzsxq tr:gt(0)').remove(); //清除原来的表格信息
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/dresser/listDressers',
				type : 'get',
				dataType : 'json',
				data: params,
				success : initDresserPage
			});
			
			//<!--  点击“用户管理”--》全部取消按钮 -->
			$('.yhxqq .cancle-btn').click(function(e) {
				$('.yhxqq .search').val('');
			});
		}
	});

}

//初始化化妆师列表页面
function initDresserPage(data){
	for(var x = 0; x < data.data.pageData.length ; x ++){
		$('.hzsxq').append('<tr><td dresserId='+data.data.pageData[x].dresserId+'>'+data.data.pageData[x].dresserId+'</td><td>'+data.data.pageData[x].name+'</td><td>'+data.data.pageData[x].phoneNum+'</td><td>'+data.data.pageData[x].cardId+'</td><td>'+data.data.pageData[x].city+'</td><td>'+data.data.pageData[x].county+'</td><td><div class=\'double-btn\'><input  type="button" value="认证" class="renzheng" style="display:none;" /><input type="button" value="取消" class="cancle"  /></div></td><td><div class=\'jiav\'><input type="button" value="加V" class="plusv" /><input type="button" value="取消" class="plusv-cancle" /></div></td><td><input type="button" value="查看" class="look" /></td></tr>');
		//判断化妆师是否已通过认证，0未通过，1已通过
		if(data.data.pageData[x].isCert == 0){
			$('.hzsxq tbody>tr:eq('+(x+1)+') td:eq(6) .double-btn>.renzheng').show();
			$('.hzsxq tbody>tr:eq('+(x+1)+') td:eq(6) .double-btn>.cancle').hide();
			$('.hzsxq tbody>tr:eq('+(x+1)+') td:eq(7) .jiav>.plusv-cancle').hide();
			$('.hzsxq tbody>tr:eq('+(x+1)+') td:eq(7) .jiav>.plusv').hide();
		}else{
			$('.hzsxq tbody>tr:eq('+(x+1)+') td:eq(6) .double-btn>.renzheng').hide();
			$('.hzsxq tbody>tr:eq('+(x+1)+') td:eq(6) .double-btn>.cancle').show();

			//判断化妆师是否加V化妆师，0未加V，1已加V
			if(data.data.pageData[x].isVDresser == 1){
				$('.hzsxq tbody>tr:eq('+(x+1)+') td:eq(7) .jiav>.plusv-cancle').show();
				$('.hzsxq tbody>tr:eq('+(x+1)+') td:eq(7) .jiav>.plusv').hide();
			}else{
				$('.hzsxq tbody>tr:eq('+(x+1)+') td:eq(7) .jiav>.plusv-cancle').hide();
				$('.hzsxq tbody>tr:eq('+(x+1)+') td:eq(7) .jiav>.plusv').show();
			}
		}

	}
}
//化妆师管理参数
function getDresserSearchParams(){
	var params = new Object();
	params.page = 1;
	params.isCert = $('.hzsxqq .on-select option:selected').attr('value');
	params.dresserName = $('.hzsxqq .search').val();
	return params;
}
//化妆师管理加载页面
function  loadDresserPage(){
	var params = getDresserSearchParams();
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/dresser/listDressers',
		type : 'get',
		dataType : 'json',
		data: params,
		success : function(data){
			$('.hzsxq tr:gt(0)').remove(); //清除原来的表格信息
			createDresserPage(data);
			initDresserPage(data);
		},
	});
}





	$(function(){

		//加载统计信息
		loadStat();

		//获取用户权限菜单(左侧列表)
		loadMenu();

		//清理订单管理的搜索框
		clearListReservationSearchText();

		//加载订单管理列表页面
		loadListReservationsPage();
		

		//点击左侧用户管理菜单
		$('.content-left ul>li:eq(1)').click(loadUserPage);

		// 点击“用户管理”--》搜索按钮
		$('.yhxqq .search-btn').click(loadUserPage);

		//点击“用户管理”--》全部取消按钮 
		$('.yhxqq .cancle-btn').click(function(e) {
            $('.yhxqq .search').val('');
        });

		//点击左侧化妆师管理列表
		$('.content-left ul>li:eq(2)').click(loadDresserPage);

		// 点击“化妆师管理”--》搜索按钮
		$('.hzsxqq .search-btn').click(loadDresserPage);

		//资讯管理
		$('.content-left ul>li:eq(10)').click(loadZiXunPage);

		//资讯管理--》搜索按钮
		$('.zxgll .search-btn').click(loadZiXunPage);
		
		//发布资讯
		$('.zxgl .zxgl-status-btn0').live('click',function(e){
			var r = confirm('确定要发布资讯？？');
			if(r == true){
				var fabu = $(this);
				$.ajax({
					url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/focuscontent/publish',
					type : 'post',
					dataType : 'json',
					data: {contentId:$(this).parent().parent().children('td:eq(0)').html()},
					success : function(data){
						if(data.code == 0){
							fabu.hide();
							var cancle = fabu.next();
							cancle.show();
						}
					}
				});
			}
		});
		
		//取消发布资讯
		$('.zxgl .zxgl-status-btn1').live('click',function(e){
			var r = confirm('确定要取消发布？？');
			if(r == true){
				var cancle = $(this);
				$.ajax({
					url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/focuscontent/depublish',
					type : 'post',
					dataType : 'json',
					data: {contentId:$(this).parent().parent().children('td:eq(0)').html()},
					success : function(data){
						if(data.code == 0){
							cancle.hide();
							var fabu= cancle.prev();
							fabu.show();
						}
					}
				});
			}
		});
	
//<!-- 化妆师认证 -->
		$('.hzsxq tbody>tr>td>.double-btn>.renzheng').live('click',function(e) {
			var r = confirm("确定要认证？？");
			if(r == true){
				var dresserId = $('.hzsxq tbody>tr:eq('+$(this).parent().parent().parent().index()+') td:eq(0)').html();
				var renzheng = $(this);
				$.ajax({
					url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/dresser/certification',
					type : 'post',
					dataType : 'json',
					data: {dresserId:dresserId},
					success : function(data){
						renzheng.hide();
						var qxrenzheng = renzheng.next();
						qxrenzheng.show();

						//<!--  当点击“认证”的时候显示“加V” -->
						renzheng.parent().parent().next().children('.jiav').children('.plusv').show();
					}
				});
			}
        });
		
//<!-- 取消化妆师认证 -->
		$('.hzsxq tbody>tr>td>.double-btn>.cancle').live('click',function(e) {
			var r = confirm("确定要取消认证？？");
			if(r == true){
				var dresserId = $('.hzsxq tbody>tr:eq('+$(this).parent().parent().parent().index()+') td:eq(0)').html();
				var qxrenzheng = $(this);
				$.ajax({
					url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/dresser/cancelCertification',
					type : 'post',
					dataType : 'json',
					data: {dresserId:dresserId},
					success : function(data){
						console.log(qxrenzheng);
						qxrenzheng.hide();
						var renzheng = qxrenzheng.prev();
						renzheng.show();
						//<!--  当点击“取消认证”的时候隐藏“加V” -->
						renzheng.parent().parent().next().children('.jiav').children('.plusv').hide();
					}
				});
			}
        });

//<!--  取消化妆师加V -->
		$('.hzsxq tbody>tr>td>.jiav>.plusv-cancle').live('click',function(e){
			var r = confirm("确定取消加V？？");
			if(r == true){
				var dresserId = $('.hzsxq tbody>tr:eq('+$(this).parent().parent().parent().index()+') td:eq(0)').html();
				var qxplusv = $(this);
				$.ajax({
					url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/dresser/subv',
					type : 'post',
					dataType : 'json',
					data: {dresserId:dresserId},
					success : function(data){
						qxplusv.hide();
						var plusv = qxplusv.prev();
						plusv.show();
					}
				});
			}
		});

//<!--  给化妆师加Ｖ -->
		$('.hzsxq tbody>tr>td>.jiav>.plusv').live('click',function(e){
			var r = confirm("确定加V？？");
			if(r == true){
				var dresserId = $('.hzsxq tbody>tr:eq('+$(this).parent().parent().parent().index()+') td:eq(0)').html();
				var plusv = $(this);
				$.ajax({
					url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/dresser/addv',
					type : 'post',
					dataType : 'json',
					data: {dresserId:dresserId},
					success : function(data){
						plusv.hide();
						var qxplusv = plusv.next();
						qxplusv.show();
					}
				});
			}
		});
	
//用户查询--》搜索
	$('.user-select .us-btn-search').click(loadUserQueryPage);	
	
//用户查询--》全部取消
	$('.user-select .us-cancle-btn').click(function(e) {
		$('.user-select .us-name').val('');
		$('.user-select .us-tel').val('');
    });	

//用户查询--》"选中"某个用户的信息
	$('.slected-btn').live('click',function(e) {
	   $('.order-create .order-user').val($(this).parent().parent().children('td:eq(1)').html() + ',' + $(this).parent().parent().children('td:eq(2)').html());
	   $('.order-create .order-user').attr('userId',$(this).parent().parent().children('td:eq(0)').html());
	   $('.user-select').hide();
	   $('.order-create').show();
    });

		
//获取作品查询--》作品类型
		$.ajax({
			url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/invitecode/getSysWorkType',
			type : 'get',
			dataType : 'json',
			data: {},
			success : function(data){
				for(var x = 0 ; x < data.data.length; x ++){
					$('.ws-search .ws-kinds').append('<option>'+data.data[x].typeName+'</option>');
				}
			},
		});

//作品查询--》搜索
	$('.ws-search .ws-btn-search').click(loadWorksQueryPage);
	
//作品查询--》全部取消按钮
	$('.ws-search .ws-cancle-btn').click(function(e) {
        $('.ws-search .ws-name').val('');
    });

//作品查询--》"选中"某个作品的信息
	$('.works-slected-btn').live('click',function(e) {
	   $('.order-create .order-pro').attr('workId',$(this).parent().parent().children('td:eq(3)').html());
	   $('.works-select').hide();
	   $('.order-create').show();
	   $('.order-create .order-pro').val($(this).parent().parent().children('td:eq(1)').html()+ ','+ $(this).parent().parent().children('td:eq(4)').html() + ',' + $(this).parent().parent().children('td:eq(5)').html()+'元');
	   
	   //预约时间查询
		$.ajax({
			url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/reservation/resDateAndTimes',
			type : 'get',
			dataType : 'json',
			data: {dresserId:$(this).parent().parent().children('td:eq(0)').html()},
			success : function(data){
				for(var x = 0 ; x <data.data.length; x ++){
					for(var timeIndex in data.data[x].resTimes){
						$('.order-create .order-year').append('<option resDate="'+data.data[x].resDate+'" resTimes="'+data.data[x].resTimes[timeIndex]+'">'+data.data[x].resDate +'&nbsp;'+ data.data[x].resTimes[timeIndex]+'</option>');	
					}
				}
			},
		});		
    });



//"下单用户"文本框获得焦点请求，拿到“用户名”，“手机号”
$('.order-create .order-user').focus(function(e) {
	$('.order-create').hide();
    loadUserQueryPage();
	$('.user-select').show();
});

//"作品"文本框获得焦点请求，拿到“化妆师名称”，“作品类型”，“作品单价”
$('.order-create .order-pro').focus(function(e) {
	$('.order-create').hide();
    loadWorksQueryPage();
	$('.works-select').show();
});

//点击“订单管理”--》“创建订单”按钮--》打开“创建订单”页面
	$('.order-num .create-order').click(function(e) {
		//清空“创建订单”页面数据
		$('.order-create .order-user').val('');
		$('.order-create .order-pro').val('');
		$('.order-create .order-year').html('');
		$('.order-create .order-area').val('');
		$('.order-create .order-user-tel').val('');
		$('.order-create .order-price').val('');
		//隐藏订单详情页面
        $('.ddxq-list').hide();
		//显示创建订单页面
		$('.order-create').show();
    });

//点击“创建订单”按钮,发送请求，生成订单
	$('.order-create .create-order').click(function(e) {
		if($('.order-create .order-user').val() == ''){
			alert('请选择下单用户');	
		}else if($('.order-create .order-pro').val() == ''){
			alert('请选择作品');	
		}else if($('.order-create .order-area').val() == ''){
			alert('请输入预约地点');	
		}else if($('.order-create .order-user-tel').val() == ''){
			alert('请输入用户手机号');	
		}else if($('.order-create .order-price').val() == ''){
			alert('请输入预约价格');	
		}else{
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/reservation/createReservation',
				type : 'post',
				dataType : 'json',
				data: {userId:$('.order-create .order-user').attr('userId'),workId:$('.order-create .order-pro').attr('workId'),resDate:$('.order-year option:selected').attr('resDate'),resTime:$('.order-year option:selected').attr('resTimes'),resAddress:$('.order-create .order-area').val(),userPhoneNum:$('.order-create .order-user-tel').val(),price:$('.order-create .order-price').val()},
				success : function(data){
					$('.order-create').hide();
					$('.order-txt .dd-num').html(data.data.reservationId);
					$('.order-txt .dd-name').html(data.data.userName);
					$('.order-txt .dd-user-tel').html(data.data.userPhoneNum);
					$('.order-txt .dd-hzs').html(data.data.dresserName);
					$('.order-txt .dd-hzs-tel').html(data.data.dresserPhoneNum);
					$('.order-txt .dd-dresstype').html(data.data.workType);
					$('.order-txt .dd-price').html(data.data.price);
					$('.order-txt .dd-time').html(data.data.resDate+'&nbsp;'+data.data.resTime);
					$('.order-success').show();
				},
			});		
		}
    });
	
//点击“订单管理”--》创建订单--》“返回”按钮
	$('.return-order').click(function(e) {
		returnSuccessFn();
//		<!--  显示订单管理列表 -->
		$('.ddxq-list').show();
    });

//创建订单成功之后--》点击“继续创建”--》页面转到“创建订单”
	$('.osbtn-create').click(function(e) {
        returnSuccessFn();
//		<!--  显示创建订单页面 -->
		$('.order-create').show();
    });

//订单创建成功之后返回页面可复用部分
	function returnSuccessFn(){
        $('.order-success').hide();
//		<!--  清空订单成功页面信息 -->
		$('.order-txt .dd-num').html('');
		$('.order-txt .dd-name').html('');
		$('.order-txt .dd-user-tel').html('');
		$('.order-txt .dd-hzs').html('');
		$('.order-txt .dd-hzs-tel').html('');
		$('.order-txt .dd-dresstype').html('');
		$('.order-txt .dd-price').html('');
		$('.order-txt .dd-time').html('');
	}	
	
//创建订单成功之后--》点击“返回列表”--》返回到“订单管理”列表
	$('.osbtn-return').click(function(e) {
        returnSuccessFn();
//		<!--  显示订单管理列表 -->
		$('.ddxq-list').show();
    });

//复制订单
	$('.copy-order').live('click',function(e){
		$('.ddxq-list').hide();
		$.ajax({
			url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/reservation/reservationDetail',
			type : 'get',
			dataType : 'json',
			data: {reservationId:$(this).parent().parent().children('td:eq(0)').html()},
			success : function(data){
				$('.order-create .order-user').val(data.data.userName+','+data.data.userPhoneNum);
				$('.order-create .order-pro').val(data.data.dresserName+','+data.data.workType+','+data.data.price+'元');
				$('.order-create .order-year').append('<option resDate="'+data.data.resDate+'" resTimes="'+data.data.resTime+'">'+data.data.resDate +'&nbsp;'+ data.data.resTime+'</option>');
				$('.order-create .order-area').val(data.data.resAddress);
				$('.order-create .order-user-tel').val(data.data.userPhoneNum);
				$('.order-create .order-price').val(data.data.price);
				$('.order-create .order-user').attr('userId',data.data.userId);
				$('.order-create .order-pro').attr('workId',data.data.workId);
			},
		});	
		$('.order-create').show();
	});
	
//作品管理
		$('.content-left ul>li:eq(3)').click(function(e) {
					$('.zpxqq .search').val('');
					$('.zpxqq .qian').val('');
					$('.zpxqq .hou').val('');
					$.ajax({
						url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/work/listWorks',
						type : 'get',
						dataType : 'json',
						data: {dresserName:$('.zpxqq .search').val(),page:1},
						success : function(data){
							$('.zpxq>tbody>tr:gt(0)').remove();
							$(".zpxqq .tcdPageCode").createPage({
								pageCount:parseInt(data.data.totalPageNum),
								current:parseInt(data.data.currnetPageNum),
								backFn:function(p){
									$.ajax({
										url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/work/listWorks',
										type : 'get',
										dataType : 'json',
										data: {dresserName:$('.zpxqq .search').val(),page:p},
										success : function(data){
											$('.zpxq>tbody>tr:gt(0)').remove();
											for(var x = 0; x < data.data.pageData.length ; x ++){
												var contentImgTag = '<td class="left">';
												for(var imgIndex = 0; imgIndex < data.data.pageData[x].workContentPhotos.length; imgIndex++){
													//for(var img in data.data.pageData[x].workContentPhotos){
													contentImgTag +=  '<img width="25px" src="' + data.data.pageData[x].workContentPhotos[imgIndex].photoPath+'"/>&nbsp;';
												}
												contentImgTag += '</td>';
												//var contentImg = $('<td>');
												//for(var img in data.data.pageData[x].workContentPhotos){
												//	$('<img>').attr('src', img.photoPath).append(contentImg);
												//}
												$('.zpxq').append('<tr><td>'+data.data.pageData[x].workId+'</td><td>'+data.data.pageData[x].publishTime+'</td><td>'+data.data.pageData[x].dresserName+'</td><td>'+data.data.pageData[x].phoneNum+'</td>'+contentImgTag+'<td>'+data.data.pageData[x].workType+'</td><td>'+data.data.pageData[x].cost+'</td><td>'+data.data.pageData[x].desc+'</td><td><input type="button" value="小图"  class="small-img" /> <input type="button" value="大图" class="big-img" /><input type="button" value="取消小图推荐" style=" display:none;" class="cancle-btn-small" /><input type="button" style=" display:none;" value="取消大图推荐" class="cancle-btn-big" /></td><td><input type="button" value="删除" class="del-btn" /></td></tr>');
												if(data.data.pageData[x].recommendType == null){
													$('.zpxq tbody>tr:eq('+(x+1)+') td .small-img').parent().children('.cancle-btn-small').hide();
													$('.zpxq tbody>tr:eq('+(x+1)+') td .small-img').parent().children('.cancle-btn-big').hide();
													$('.zpxq tbody>tr:eq('+(x+1)+') td .small-img').parent().children('.small-img').show();
													$('.zpxq tbody>tr:eq('+(x+1)+') td .small-img').parent().children('.big-img').show();
												}
												if(data.data.pageData[x].recommendType == 1){
													$('.zpxq tbody>tr:eq('+(x+1)+') td .small-img').parent().children('.cancle-btn-big').show().siblings().hide();
												}
												if(data.data.pageData[x].recommendType == 2){
													$('.zpxq tbody>tr:eq('+(x+1)+') td .big-img').parent().children('.cancle-btn-small').show().siblings().hide();
												}
											}
										},
									});
								}
							});
							for(var x = 0; x < data.data.pageData.length ; x ++){
								var contentImgTag = '<td class="left">';
								for(var imgIndex = 0; imgIndex < data.data.pageData[x].workContentPhotos.length; imgIndex++){
									//for(var img in data.data.pageData[x].workContentPhotos){
									contentImgTag +=  '<img width="25px" src="' + data.data.pageData[x].workContentPhotos[imgIndex].photoPath+'"/>';
								}
								contentImgTag += '</td>';
								//var contentImg = $('<td>');
								//for(var img in data.data.pageData[x].workContentPhotos){
								//	$('<img>').attr('src', img.photoPath).append(contentImg);
								//}
								$('.zpxq').append('<tr><td>'+data.data.pageData[x].workId+'</td><td>'+data.data.pageData[x].publishTime+'</td><td>'+data.data.pageData[x].dresserName+'</td><td>'+data.data.pageData[x].phoneNum+'</td>'+contentImgTag+'<td>'+data.data.pageData[x].workType+'</td><td>'+data.data.pageData[x].cost+'</td><td>'+data.data.pageData[x].desc+'</td><td><input type="button" value="小图"  class="small-img" /> <input type="button" value="大图" class="big-img" /><input type="button" value="取消小图推荐" style=" display:none;" class="cancle-btn-small" /><input type="button" style=" display:none;" value="取消大图推荐" class="cancle-btn-big" /></td><td><input type="button" value="删除" class="del-btn" /></td></tr>');
								if(data.data.pageData[x].recommendType == null){
									$('.zpxq tbody>tr:eq('+(x+1)+') td .small-img').parent().children('.cancle-btn-small').hide();
									$('.zpxq tbody>tr:eq('+(x+1)+') td .small-img').parent().children('.cancle-btn-big').hide();
									$('.zpxq tbody>tr:eq('+(x+1)+') td .small-img').parent().children('.small-img').show();
									$('.zpxq tbody>tr:eq('+(x+1)+') td .small-img').parent().children('.big-img').show();
								}
								if(data.data.pageData[x].recommendType == 1){
									$('.zpxq tbody>tr:eq('+(x+1)+') td .small-img').parent().children('.cancle-btn-big').show().siblings().hide();
								}
								if(data.data.pageData[x].recommendType == 2){
									$('.zpxq tbody>tr:eq('+(x+1)+') td .big-img').parent().children('.cancle-btn-small').show().siblings().hide();
								}
							}
						},
					});
				});

//<!--  作品管理--》删除按钮 -->
				$('.zpxq tbody>tr td .del-btn').live('click',function(e) {
					var par = $(this).parent().parent().index();
					var r = confirm('确定删除？？？');
					if(r == true){
						$.ajax({
							url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/work/deleteWork',
							type : 'post',
							dataType : 'json',
							data: {num:20,workId:$('.zpxq tbody>tr:eq('+par+') td:eq(0)').html()},
							success : function(data){
								if(data.code == 0){
									$('.zpxq tbody>tr:eq('+par+')').remove();
								}
							}
						});
					}
				});

//<!-- 点击作品管理--》“搜索”按钮  -->
				$('.zpxqq .search-btn').click(function(e) {
					var re=new RegExp("[\\-,\\:, ]","g");  //正则格式化字符，解释：re=new RegExp("l","g")中的第一个参数是你要替换的字符串，第二个参数指替换所有的。
					var startPublishTimestr = $('.zpxqq .qian').val().replace(re, "");
					var endPublishTimestr = $('.zpxqq .hou').val().replace(re, "");
					$.ajax({
						url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/work/listWorks',
						type : 'get',
						dataType : 'json',
						data: {num:20,workId:$('.zpxq tbody>tr:eq('+$(this).parent().parent().index()+') td:eq(0)').html(),dresserName:$('.zpxqq .search').val(),startPublishTime:startPublishTimestr,endPublishTime:endPublishTimestr},
						success : function(data){
							$('.zpxq>tbody>tr:gt(0)').remove();
							$(".zpxqq .tcdPageCode").createPage({
								pageCount:parseInt(data.data.totalPageNum),
								current:parseInt(data.data.currnetPageNum),
								backFn:function(p){
										for(var x = 0; x < data.data.pageData.length ; x ++){
											var contentImgTag = '<td class="left">';
											for(var imgIndex = 0; imgIndex < data.data.pageData[x].workContentPhotos.length; imgIndex++){
												contentImgTag +=  '<img width="25px" src="' + data.data.pageData[x].workContentPhotos[imgIndex].photoPath+'"/>&nbsp;';
											}
											contentImgTag += '</td>';
											$('.zpxq').append('<tr><td>'+data.data.pageData[x].workId+'</td><td>'+data.data.pageData[x].publishTime+'</td><td>'+data.data.pageData[x].dresserName+'</td><td>'+data.data.pageData[x].phoneNum+'</td>'+contentImgTag+'<td>'+data.data.pageData[x].workType+'</td><td>'+data.data.pageData[x].cost+'</td><td>'+data.data.pageData[x].desc+'</td><td><input type="button" value="小图"  class="small-img" /> <input type="button" value="大图" class="big-img" /><input type="button" value="取消小图推荐" class="cancle-btn-small" /><input type="button" value="取消大图推荐" class="cancle-btn-big" /></td><td><input type="button" value="删除" class="del-btn" /></td></tr>');
											if(data.data.pageData[x].recommendType == 1){
												$('.zpxq tbody>tr:eq('+x+') td .small-img').parent().children('.cancle-btn-small').show().siblings().hide();
												$('.zpxq tbody>tr:eq('+x+') td .cancle-btn-small').click(function(e) {
													var r = confirm('确定取消小图推荐??');
													if(r == true){
														$.ajax({
															url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/work/cancelWorkRecommend',
															type : 'post',
															dataType : 'json',
															data: {num:20,workId:$('.zpxq tbody>tr:eq('+$(this).parent().parent().index()+') td:eq(0)').html()},
															success : function(data){
																if(data.code == 0){
			
																}
															}
														});
													}
												});
											}
											if(data.data.pageData[x].recommendType == 2){
												$('.zpxq tbody>tr:eq('+x+') td .big-img').parent().children('.cancle-btn-big').show().siblings().hide();
												$('.zpxq tbody>tr:eq('+x+') td .cancle-btn-big').click(function(e) {
													var r = confirm('确定取消大图推荐??');
													if(r == true){
														$.ajax({
															url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/work/cancelWorkRecommend',
															type : 'post',
															dataType : 'json',
															data: {num:20,workId:$('.zpxq tbody>tr:eq('+$(this).parent().parent().index()+') td:eq(0)').html()},
															success : function(data){
																if(data.code == 0){
			
																}
															}
														});
													}
												});
											}
										}
									}
								});
							for(var x = 0; x < data.data.pageData.length ; x ++){
								var contentImgTag = '<td class="left">';
								for(var imgIndex = 0; imgIndex < data.data.pageData[x].workContentPhotos.length; imgIndex++){
									contentImgTag +=  '<img width="25px" src="' + data.data.pageData[x].workContentPhotos[imgIndex].photoPath+'"/>&nbsp;';
								}
								contentImgTag += '</td>';
								$('.zpxq').append('<tr><td>'+data.data.pageData[x].workId+'</td><td>'+data.data.pageData[x].publishTime+'</td><td>'+data.data.pageData[x].dresserName+'</td><td>'+data.data.pageData[x].phoneNum+'</td>'+contentImgTag+'<td>'+data.data.pageData[x].workType+'</td><td>'+data.data.pageData[x].cost+'</td><td>'+data.data.pageData[x].desc+'</td><td><input type="button" value="小图"  class="small-img" /> <input type="button" value="大图" class="big-img" /><input type="button" value="取消小图推荐" class="cancle-btn-small" /><input type="button" value="取消大图推荐" class="cancle-btn-big" /></td><td><input type="button" value="删除" class="del-btn" /></td></tr>');
								if(data.data.pageData[x].recommendType == 1){
									$('.zpxq tbody>tr:eq('+x+') td .small-img').parent().children('.cancle-btn-small').show().siblings().hide();
									$('.zpxq tbody>tr:eq('+x+') td .cancle-btn-small').click(function(e) {
										var r = confirm('确定取消小图推荐??');
										if(r == true){
											$.ajax({
												url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/work/cancelWorkRecommend',
												type : 'post',
												dataType : 'json',
												data: {num:20,workId:$('.zpxq tbody>tr:eq('+$(this).parent().parent().index()+') td:eq(0)').html()},
												success : function(data){
													if(data.code == 0){

													}
												}
											});
										}
									});
								}
								if(data.data.pageData[x].recommendType == 2){
									$('.zpxq tbody>tr:eq('+x+') td .big-img').parent().children('.cancle-btn-big').show().siblings().hide();
									$('.zpxq tbody>tr:eq('+x+') td .cancle-btn-big').click(function(e) {
										var r = confirm('确定取消大图推荐??');
										if(r == true){
											$.ajax({
												url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/work/cancelWorkRecommend',
												type : 'post',
												dataType : 'json',
												data: {num:20,workId:$('.zpxq tbody>tr:eq('+$(this).parent().parent().index()+') td:eq(0)').html()},
												success : function(data){
													if(data.code == 0){

													}
												}
											});
										}
									});
								}
							}
						}
					});
				});

//<!-- 点击作品管理--》“取消全部”按钮--》清空文本框  -->
				$('.zpxqq .cancle-btn').click(function(e) {
                   $('.zpxqq .search').val('');
				   $('.zpxqq .qian').val('');
				   $('.zpxqq .hou').val('');
                });

//<!--  点击“作品管理“小图” -->
				$('.zpxq tbody>tr>td>.small-img').live('click',function(e) {
					var r = confirm('确定推荐小图？？');
					var smallImg = $(this);
					if(r == true){
						$.ajax({
							url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/work/workRecommend',
							type : 'post',
							dataType : 'json',
							data: {workId:$('.zpxq tbody>tr:eq('+$(this).parent().parent().index()+') td:eq(0)').html(),recommendType:2},
							success : function(data){
								smallImg.hide();
								smallImg.parent().children('input:eq(1)').hide();
								smallImg.parent().children('input:eq(2)').show();
								smallImg.parent().children('input:eq(3)').hide();
							}
						});
					}
                });

//<!--  点击“作品管理“大图” -->
				$('.zpxq tbody>tr>td>.big-img').live('click',function(e) {
					var r = confirm('确定推荐大图？？');
					var smallImg = $(this);
					if(r == true){
						$.ajax({
							url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/work/workRecommend',
							type : 'post',
							dataType : 'json',
							data: {workId:$('.zpxq tbody>tr:eq('+$(this).parent().parent().index()+') td:eq(0)').html(),recommendType:1},
							success : function(data){
								smallImg.hide();
								smallImg.parent().children('input:eq(0)').hide();
								smallImg.parent().children('input:eq(3)').show();
								smallImg.parent().children('input:eq(2)').hide();
							}
						});
					}
                });

//<!--  点击"作品管理"--》取消小图推荐 -->
				$('.zpxq tbody>tr>td>.cancle-btn-small').live('click',function(e) {
					var r = confirm('确定取消小图推荐？？');
					var qxsmallImg = $(this);
					if(r == true){
						$.ajax({
							url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/work/cancelWorkRecommend',
							type : 'post',
							dataType : 'json',
							data: {workId:$('.zpxq tbody>tr:eq('+$(this).parent().parent().index()+') td:eq(0)').html()},
							success : function(data){
								qxsmallImg.hide();
								qxsmallImg.parent().children('input:eq(0)').show();
								qxsmallImg.parent().children('input:eq(3)').hide();
								qxsmallImg.parent().children('input:eq(1)').show();
							}
						});
					}
                });

//<!--  点击"作品管理"--》取消大图推荐 -->
				$('.zpxq tbody>tr>td>.cancle-btn-big').live('click',function(e) {
					var r = confirm('确定取消大图推荐？？');
					var qxsmallImg = $(this);
					if(r == true){
						$.ajax({
							url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/work/cancelWorkRecommend',
							type : 'post',
							dataType : 'json',
							data: {workId:$('.zpxq tbody>tr:eq('+$(this).parent().parent().index()+') td:eq(0)').html()},
							success : function(data){
								qxsmallImg.hide();
								qxsmallImg.parent().children('input:eq(0)').show();
								qxsmallImg.parent().children('input:eq(2)').hide();
								qxsmallImg.parent().children('input:eq(1)').show();
							}
						});
					}
                });

//Banner管理
		$('.content-left ul>li:eq(4)').click(function(e) {
			$('.banner tr:gt(0)').remove();
			//<!--  获取banner列表 --> 
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/banner/getBanners',
				type : 'get',
				dataType : 'json',
				data: {},
				success : function(data){
					initBannerData(data);
				},
			});			
		});
		
		
		//banner加载数据
		function initBannerData(data){
			var tdMaxNum = 4;
			for(var i=0;i< 12;i++){
				if(i%tdMaxNum == 0){
					$('.banner').append("<tr></tr>")
				}
			}
			for(var i=0;i< 12;i++){
				var trIndex = parseInt(i/tdMaxNum + 1);
				var tdIndex = parseInt(i%tdMaxNum);
				var x = getSeqIndex(i + 1,data);
				//console.info(i+'>>>>');
				//console.info($('.banner tr:eq('+trIndex+')'));
				if(x >= 0){
					$('body').data('banner' + (i+1),data.data[x]);
					$('.banner tr:eq('+trIndex+')').append('<td><div class="td-banner"><img scrollHeadId=\"'+data.data[x].scrollHeadId+'\" src=\"'+data.data[x].photoUrl+'\" alt="" /><input type="button" value="添加" class="add-btn" /></div><div class="two-btn" style="display:block;"><input type="button" value="编辑" class="edit-btn" />  <input type="button" value="删除" class="delete-btn" /></div></td>');
				}else{
					$('.banner tr:eq('+trIndex+')').append('<td><div class="td-banner"><img src="images/default.png" alt="" /><input type="button" value="添加" class="add-btn" style="display:block;" /></div><div class="two-btn"><input type="button" value="编辑" class="edit-btn" />  <input type="button" value="删除" class="delete-btn" /></div></td>');
				}
				$('.banner tr:eq('+trIndex+') td:eq('+tdIndex+')').attr('seq',i+1);	  //把seq添加到td中
			}
		}
		
		function getSeqIndex(seq,data){
			for(var x=0;x<data.data.length;x++){
				if(seq == data.data[x].seq){
					return x;
				}
			}
			return -1;
		}
		
		
		//<!--  点击“banner”--》“添加”--》“添加banner”-->
		$('.add-btn').live('click',function(e) {
			$('.banner-submit-edit').hide();
			$('.banner-submit').show();
			$('#file0').fileupload({
				dataType: 'json',
				done: function (e, data) {
					$('#img0').attr('src',data.result.data.url);
						
				}
			});
			
            $('.add-box-hide').show();
			
			//把当前的seq值放在弹框中
			$('.add-box-hide').attr('seq',$(this).parent().parent().attr('seq'));
        });
		
		//<!-- “添加banner"-->
		$('.banner-submit').live('click',function(e) {
			if($("#img0").attr("src") == null || $("#img0").attr("src") == ''){
				alert('请先选择图片路径！！');	
			}else if($('.tz-address').val() == null || $('.tz-address').val() == ''){
				alert('请选填写转地址!!');
			}else if($('.fx-content').val() == null || $('.fx-content').val() == ''){
				alert('请选填写享内容!!');	
			}else{
				
				var seq = $('.add-box-hide').attr('seq');
				$.ajax({
					url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/banner/addBanner',
					type : 'post',
					dataType : 'json',
					data: {photoUrl:$("#img0").attr("src"),webPageUrl:$('.tz-address').val(),shareContent:$('.fx-content').val(),seq:$('.add-box-hide').attr('seq')},
					success : function(data){
						$('.add-box-hide').hide();
						$('.banner tr:gt(0)').remove();
						//<!--  获取banner列表 --> 
						$.ajax({
							url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/banner/getBanners',
							type : 'get',
							dataType : 'json',
							data: {},
							success : function(data){
								initBannerData(data);
							},
						});			
					},
				});
			}
        });
		
		
		//<!--  删除banner图片 -->
		$('.delete-btn').live('click',function(e) {
			var r = confirm('确认要删除？？');
			if(r == true){
				//<!--  删除banner图片 -->
				$.ajax({
					url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/banner/deleteBanner',
					type : 'post',
					dataType : 'json',
					data: {scrollHeadId:$(this).parent().prev().children('img').attr('scrollheadid')},
					success : function(data){
						$('.banner tr:gt(0)').remove();
						//<!--  获取banner列表 --> 
						$.ajax({
							url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/banner/getBanners',
							type : 'get',
							dataType : 'json',
							data: {},
							success : function(data){
								initBannerData(data);
							},
						});			
					},
				});
			}
        });
		
		//<!--  修改banner -->
		$('.edit-btn').live('click',function(e) {
			$('.banner-submit-edit').show();
			$('.banner-submit').hide();
			var seq = $(this).parent().parent().attr('seq');
			var banner = $('body').data('banner' + seq);
			if(banner){
				$('.tz-address').val(banner.webPageUrl);
				$('.fx-content').val(banner.shareContent);
				$("#img0").attr("src",banner.photoUrl);
			}
			
			$('#file0').fileupload({
				dataType: 'json',
				done: function (e, data) {
					$('#img0').attr('src',data.result.data.url);
						
				}
			});
			
            $('.add-box-hide').show();
			//把当前的scrollHeadId值放在弹框中
			$('.add-box-hide').attr('scrollHeadId',$(this).parent().prev().children('img').attr('scrollHeadId'));
			//把当前的seq值放在弹框中
			$('.add-box-hide').attr('seq',$(this).parent().parent().attr('seq'));
        });
				
		//<!-- “修改banner"-->
		$('.banner-submit-edit').live('click',function(e) {
			if($("#img0").attr("src") == null || $("#img0").attr("src") == ''){
				alert('请先选择图片路径！！');	
			}else if($('.tz-address').val() == null || $('.tz-address').val() == ''){
				alert('请选填写转地址!!');
			}else if($('.fx-content').val() == null || $('.fx-content').val() == ''){
				alert('请选填写享内容!!');	
			}else{
				$.ajax({
					url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/banner/updateBanner',
					type : 'post',
					dataType : 'json',
					data: {photoUrl:$("#img0").attr("src"),webPageUrl:$('.tz-address').val(),shareContent:$('.fx-content').val(),scrollHeadId:$('.add-box-hide').attr('scrollHeadId'),seq:$('.add-box-hide').attr('seq')},
					success : function(data){
						$('.add-box-hide').hide();
						$('.banner tr:eq(1)').children('td').remove();
						//<!--  获取banner列表 --> 
						$.ajax({
							url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/banner/getBanners',
							type : 'get',
							dataType : 'json',
							data: {},
							success : function(data){
								$('.banner tr:gt(0)').remove();
								initBannerData(data);
							},
						});			
					},
				});
			}
        });
		
	//<!--  banner详情弹窗关闭按钮 -->
		$('.close-btn').live('click',function(e) {
            $('.add-box-hide').hide();
        });
		$('.banner-cancle').live('click',function(e) {
            $('.add-box-hide').hide();
        });
		
//官方推送
		var utype;
		$('.content-left ul>li:eq(5)').click(function(e) {
			$('.text-area').val('');
			var aaa = $('.txgl .on-select  option:selected').index();
			if($("input[name='usertype']:checked").val() == 1){
				utype ='用户端';
			}
			if($("input[name='usertype']:checked").val() == 2){
				utype ='化妆师';
			}
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/sysmessage/listMessages',
				type : 'get',
				dataType : 'json',
				data: {userType:$("input[name='usertype']:checked").val(),page:1},
				success : function(data){
					for(var x = 0; x < data.data.pageData.length; x ++){
						$('.recent-posts ul').append('<li><p style="color:#666;">'+data.data.pageData[x].content+'</p><p style="color: #a2a2a2">'+utype+'</p><p style="color: #a2a2a2">'+data.data.pageData[x].sendTime+'</p></li>');
					}
					$(".tcdPageCode").createPage({
						pageCount:parseInt(data.data.totalPageNum),
						current:parseInt(data.data.currnetPageNum),
						backFn:function(p){
							$.ajax({
								url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/sysmessage/listMessages',
								type : 'get',
								dataType : 'json',
								data: {userType:$("input[name='usertype']:checked").val(),page:p},
								success : function(data){
									for(var x = 0; x < data.data.pageData.length; x ++){
										$('.recent-posts ul').append('<li><p style="color:#666;">'+data.data.pageData[x].content+'</p><p style="color: #a2a2a2">'+utype+'</p><p style="color: #a2a2a2">'+data.data.pageData[x].sendTime+'</p></li>');

									}
								},
							});
						}
					});
				},
			});
        });

	//<!--  选择不同的userType请求数据 -->
		$('.radiobtn>input').click(function(e) {
			$('.recent-posts ul li').remove();
			var aaa = $('.txgl .on-select  option:selected').index();
			var utype;
			if($("input[name='usertype']:checked").val() == 1){
				utype ='用户端';
			}
			if($("input[name='usertype']:checked").val() == 2){
				utype ='化妆师';
			}
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/sysmessage/listMessages',
				type : 'get',
				dataType : 'json',
				data: {userType:$("input[name='usertype']:checked").val()},
				success : function(data){
					for(var x = 0; x < data.data.pageData.length; x ++){
						$('.recent-posts ul').append('<li><p style="color:#666;">'+data.data.pageData[x].content+'</p><p style="color: #a2a2a2">'+utype+'</p><p style="color: #a2a2a2">'+data.data.pageData[x].sendTime+'</p></li>');

					}
				},
			});
        });

		//<!--  推送消息 -->
		$('.weight-box .submit-btn').click(function(e) {
			if($('.text-area').val() == ''){
				alert('请填入推送消息');	
			}else if($('.sel-option option:selected').attr('value') == ''){
				alert('请选择推送类型');	
			}else if($('.messagetype option:selected').attr('value') == ''){
				alert('请选择通知类型');	
			}else{
				if($('.messagetype option:selected').attr('value') == 'marketingactivity' && $('.forwardkey').val() == ''){
					alert('当通知类型为营销活动通知时，跳转地址必须填写哟亲！！');	
				}else{
					var r = confirm('确认要提交？？');
					if(r == true){
						$.ajax({
							url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/sysmessage/sendMessage',
							type : 'post',
							dataType : 'json',
							data: {userType:$("input[name='usertype']:checked").val(),content:$('.text-area').val(),sendType:$('.sel-option option:selected').attr('value'),messagetype:$('.messagetype option:selected').attr('value'),forwardkey:$('.forwardkey').val()},
							success : function(data){
								if(data.code == 0){
									$.ajax({
										url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/sysmessage/listMessages',
										type : 'get',
										dataType : 'json',
										data: {userType:$("input[name='usertype']:checked").val()},
										success : function(data){
											for(var x = 0; x < data.data.pageData.length; x ++){
												$('.recent-posts ul').append('<li><p style="color:#666;">'+data.data.pageData[x].content+'</p><p style="color: #a2a2a2">'+utype+'</p><p style="color: #a2a2a2">'+data.data.pageData[x].sendTime+'</p></li>');
			
											}
										},
									});
								}
							},
						});
					}
				}
			}
        });

//提现管理
		$('.content-left ul>li:eq(6)').click(function(e) {
            $('.txgl .search').val('');
            $('.txgl .qian').val('');
            $('.txgl .hou').val('');
			$('.txgl tr:gt(0)').remove(); //清除原来的表格信息
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/withdraw/listWithdrawRequires',
				type : 'get',
				dataType : 'json',
				data: {page:1},
				success : function(data){
					$('.txgl tr:gt(0)').remove(); //清除原来的表格信息
					$(".txgl .tcdPageCode").createPage({
						pageCount:parseInt(data.data.totalPageNum),
						current:parseInt(data.data.currnetPageNum),
						backFn:function(p){
							$.ajax({
								url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/withdraw/listWithdrawRequires',
								type : 'get',
								dataType : 'json',
								data: {page:p},
								success : function(data){
									$('.txgl tr:gt(0)').remove(); //清除原来的表格信息
									for(var x = 0; x < data.data.pageData.length; x ++){
										$('.txgl .table-message tbody').append('<tr><td requireId='+data.data.pageData[x].requireId+'>'+data.data.pageData[x].dresserId+'</td><td>'+data.data.pageData[x].name+'</td><td>'+data.data.pageData[x].phoneNum+'</td><td>'+data.data.pageData[x].balance+'</td><td>'+data.data.pageData[x].amount+'</td><td>'+data.data.pageData[x].bankName+'</td><td>'+data.data.pageData[x].account+'</td><td>'+data.data.pageData[x].time+'</td><td>'+data.data.pageData[x].processTime+'</td><td><input type="button" value="提现" class="tixian" style="display:none;" /><p class="yitixian" style="display:none;" >已提现</p></td></tr>');
										//判断是否提现
										if(data.data.pageData[x].status == 0 && data.data.pageData[x].status != null){
											$('.txgl tbody>tr:eq('+(x+1)+') td:eq(9)').children('.tixian').show();
											$('.txgl tbody>tr:eq('+(x+1)+') td:eq(9)').children('.yitixian').hide();
											$('.txgl tbody>tr:eq('+(x+1)+') td:eq(9)').children('.tixian').click(function(e) {
											   //点击“提现按钮”向后台发送请求
											   var r = confirm('确认提现？？');
											   var btnTixian = $(this);
											   if(r == true){
												   var requireId = $('.txgl table tbody>tr:eq('+$(this).parent().parent().index()+') td:eq(0)').attr('requireId');
												   $.ajax({
														url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/withdraw/processWithdrawRequire',
														type : 'post',
														dataType : 'json',
														data: {requireId:requireId},
														success : function(data){
															if(data.code == 0){
																btnTixian.hide();
																var yitixian = btnTixian.next();
																yitixian.show();
															}
														}
												   });
											   }
											});
										}else{
											$('.txgl tbody>tr:eq('+(x+1)+') td:eq(9)').children('.tixian').hide();
											$('.txgl tbody>tr:eq('+(x+1)+') td:eq(9)').children('.yitixian').show();
										}
									}
								},
							});
						}
					});
					for(var x = 0; x < data.data.pageData.length; x ++){
						$('.txgl .table-message tbody').append('<tr><td requireId='+data.data.pageData[x].requireId+'>'+data.data.pageData[x].dresserId+'</td><td>'+data.data.pageData[x].name+'</td><td>'+data.data.pageData[x].phoneNum+'</td><td>'+data.data.pageData[x].balance+'</td><td>'+data.data.pageData[x].amount+'</td><td>'+data.data.pageData[x].bankName+'</td><td>'+data.data.pageData[x].account+'</td><td>'+data.data.pageData[x].time+'</td><td>'+data.data.pageData[x].processTime+'</td><td><input type="button" value="提现" class="tixian" style="display:none;" /><p class="yitixian" style="display:none;" >已提现</p></td></tr>');
						//判断是否提现
						if(data.data.pageData[x].status == 0 && data.data.pageData[x].status != null){
							$('.txgl tbody>tr:eq('+(x+1)+') td:eq(9)').children('.tixian').show();
							$('.txgl tbody>tr:eq('+(x+1)+') td:eq(9)').children('.yitixian').hide();
							$('.txgl tbody>tr:eq('+(x+1)+') td:eq(9)').children('.tixian').click(function(e) {
                               //点击“提现按钮”向后台发送请求
							   var r = confirm('确认提现？？');
							   var btnTixian = $(this);
							   if(r == true){
								   var requireId = $('.txgl table tbody>tr:eq('+$(this).parent().parent().index()+') td:eq(0)').attr('requireId');
								   $.ajax({
										url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/withdraw/processWithdrawRequire',
										type : 'post',
										dataType : 'json',
										data: {requireId:requireId},
										success : function(data){
											if(data.code == 0){
												btnTixian.hide();
												var yitixian = btnTixian.next();
												yitixian.show();
											}
										}
								   });
							   }
                            });
						}else{
							$('.txgl tbody>tr:eq('+(x+1)+') td:eq(9)').children('.tixian').hide();
							$('.txgl tbody>tr:eq('+(x+1)+') td:eq(9)').children('.yitixian').show();
						}
					}
				},
			});
        });

//<!--  提现管理--》搜索按钮 -->
		$('.txgl .search-btn').click(function(e) {
			$('.txgll>tbody>tr:gt(0)').remove();
			var re=new RegExp("[\\-,\\:, ]","g");  //正则格式化字符，解释：re=new RegExp("l","g")中的第一个参数是你要替换的字符串，第二个参数指替换所有的。
			var startTime = $('.txgl .qian').val().replace(re, "");
			var endTime = $('.txgl .hou').val().replace(re, "");
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/withdraw/listWithdrawRequires',
				type : 'get',
				dataType : 'json',
				data: {dresserName:$('.txgl .search').val(),startTime:startTime,endTime:endTime,status:$('.txgl .on-select option:selected').attr('value'),page:1},
				success : function(data){
					$(".txgl .tcdPageCode").createPage({
						pageCount:parseInt(data.data.totalPageNum),
						current:parseInt(data.data.currnetPageNum),
						backFn:function(p){
							$.ajax({
								url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/withdraw/listWithdrawRequires',
								type : 'get',
								dataType : 'json',
								data: {dresserName:$('.txgl .search').val(),startTime:startTime,endTime:endTime,status:$('.txgl .on-select option:selected').attr('value'),page:p},
								success : function(data){
									$('.txgl tr:gt(0)').remove(); //清除原来的表格信息
									for(var x = 0; x < data.data.pageData.length ; x ++){
										$('.txgl .table-message tbody').append('<tr><td requireId='+data.data.pageData[x].requireId+'>'+data.data.pageData[x].dresserId+'</td><td>'+data.data.pageData[x].name+'</td><td>'+data.data.pageData[x].phoneNum+'</td><td>'+data.data.pageData[x].balance+'</td><td>'+data.data.pageData[x].amount+'</td><td>'+data.data.pageData[x].bankName+'</td><td>'+data.data.pageData[x].account+'</td><td>'+data.data.pageData[x].time+'</td><td>'+data.data.pageData[x].processTime+'</td><td><input type="button" value="提现" class="tixian" style="display:none;" /><p class="yitixian" style="display:none;" >已提现</p></td></tr>');
										//判断是否提现
										if(data.data.pageData[x].status == 0 && data.data.pageData[x].status != null){
											$('.txgl tbody>tr:eq('+(x+1)+') td:eq(9)').children('.tixian').show();
											$('.txgl tbody>tr:eq('+(x+1)+') td:eq(9)').children('.yitixian').hide();
											$('.txgl tbody>tr:eq('+(x+1)+') td:eq(9)').children('.tixian').click(function(e) {
											   //点击“提现按钮”向后台发送请求
											   var r = confirm('确认提现？？');
											   var btnTixian = $(this);
											   if(r == true){
												   var requireId = $('.txgl table tbody>tr:eq('+$(this).parent().parent().index()+') td:eq(0)').attr('requireId');
												   $.ajax({
														url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/withdraw/processWithdrawRequire',
														type : 'post',
														dataType : 'json',
														data: {requireId:requireId},
														success : function(data){
															if(data.code == 0){
																btnTixian.hide();
																var yitixian = btnTixian.next();
																yitixian.show();
															}
														}
												   });
											   }
											});
										}else{
											$('.txgl tbody>tr:eq('+(x+1)+') td:eq(9)').children('.tixian').hide();
											$('.txgl tbody>tr:eq('+(x+1)+') td:eq(9)').children('.yitixian').show();
										}
									}
								},
							});
						}
					});
					for(var x = 0; x < data.data.pageData.length ; x ++){
						$('.txgl .table-message tbody').append('<tr><td requireId='+data.data.pageData[x].requireId+'>'+data.data.pageData[x].dresserId+'</td><td>'+data.data.pageData[x].name+'</td><td>'+data.data.pageData[x].phoneNum+'</td><td>'+data.data.pageData[x].balance+'</td><td>'+data.data.pageData[x].amount+'</td><td>'+data.data.pageData[x].bankName+'</td><td>'+data.data.pageData[x].account+'</td><td>'+data.data.pageData[x].time+'</td><td>'+data.data.pageData[x].processTime+'</td><td><input type="button" value="提现" class="tixian" style="display:none;" /><p class="yitixian" style="display:none;" >已提现</p></td></tr>');
						//判断是否提现
						if(data.data.pageData[x].status == 0 && data.data.pageData[x].status != null){
							$('.txgl tbody>tr:eq('+(x+1)+') td:eq(9)').children('.tixian').show();
							$('.txgl tbody>tr:eq('+(x+1)+') td:eq(9)').children('.yitixian').hide();
							$('.txgl tbody>tr:eq('+(x+1)+') td:eq(9)').children('.tixian').click(function(e) {
                               //点击“提现按钮”向后台发送请求
							   var r = confirm('确认提现？？');
							   var btnTixian = $(this);
							   if(r == true){
								   var requireId = $('.txgl table tbody>tr:eq('+$(this).parent().parent().index()+') td:eq(0)').attr('requireId');
								   $.ajax({
										url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/withdraw/processWithdrawRequire',
										type : 'post',
										dataType : 'json',
										data: {requireId:requireId},
										success : function(data){
											if(data.code == 0){
												btnTixian.hide();
												var yitixian = btnTixian.next();
												yitixian.show();
											}
										}
								   });
							   }
                            });
						}else{
							$('.txgl tbody>tr:eq('+(x+1)+') td:eq(9)').children('.tixian').hide();
							$('.txgl tbody>tr:eq('+(x+1)+') td:eq(9)').children('.yitixian').show();
						}
					}
				},
			});
        });



//<!--  清空‘订单管理’文本框内容 -->
		$('.txgl .all-cancle').click(function(e) {
            $('.txgl .search').val('');
            $('.txgl .qian').val('');
            $('.txgl .hou').val('');
        });

//订单投诉
		$('.content-left ul>li:eq(7)').click(function(e) {
			var url = '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/reservationComplaint/listComplaints';
			loadData(url,1);
		});

		function loadData(url,page){
			$('.tsxqq tr:gt(0)').remove(); //清除原来的表格信息
			$.ajax({
				url : url,
				type : 'get',
				dataType : 'json',
				data: {status:$('.tsxq .on-select option:selected').attr('value'),page:page},
				success : function(data){
					genTable(data);
					loadPager(data.data.totalPageNum,data.data.currnetPageNum);
				},
			});
		}

		function loadPager(pageCount,current){
			$(".tcdPageCode").createPage({
				pageCount:pageCount,
				current:current,
				backFn:function(p){
					var url = '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/reservationComplaint/listComplaints';
					loadData(url,p);
				}
			});
		}

//<!--  订单投诉--》‘搜索’按钮 -->
		$('.tsxq .search-btn').click(function(e) {
			$('.tsxqq tr:gt(0)').remove();
			var a = 0;
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/reservationComplaint/listComplaints',
				type : 'get',
				dataType : 'json',
				data: {reservationId:$('.tsxq .search').val(),status:$('.tsxq .on-select option:selected').attr('value')},
				success : function(data){
					genTable(data);
					$(".tsxqq .tcdPageCode").createPage({
						pageCount:data.data.totalPageNum,
						current:data.data.currnetPageNum,
						backFn:function(p){
							var url = '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/reservationComplaint/listComplaints';
							loadData(url,p);
						}
					});
				},
			});
        });

		//把数据渲染到页面上
		function genTable(data){
			$('.tsxqq tr:gt(0)').remove(); //清除原来的表格信息
			genTableBody(data);
			initProcessButton(data);
		}

		//表格的主体部分
		function genTableBody(data){
			for(var x = 0; x < data.data.pageData.length; x ++){
				$('.tsxqq tbody').append('<tr><td>'+data.data.pageData[x].reservationId+'</td><td>'+data.data.pageData[x].userName+'</td><td>'+data.data.pageData[x].userPhoneNum+'</td><td>'+data.data.pageData[x].dresserName+'</td><td>'+data.data.pageData[x].reservationAddress+'</td><td>'+data.data.pageData[x].reservationTime+'</td><td>'+data.data.pageData[x].chargeFee+'</td><td>'+data.data.pageData[x].content+'</td><td><input type="button" value="处理" class="chuli" style="display:none;" /><p class="yichuli" style="display:none;" >已处理</p></td></tr>');
			}
		}

		//判断返回的值是什么
		function strIsEmpty(str){
			if(str == null || str == undefined || $.trim(str).length == 0 || $.trim(str) == 'null'){
				return true;
			}
			return false;
		}

		//点击“处理按钮”所以做的反馈
		function initProcessButton(data){
			for(var x = 0; x < data.data.pageData.length; x ++){
				var $td = $('.tsxqq tbody>tr:eq('+(x + 1)+') td:eq(8)');
				$td.data('processRecord',data.data.pageData[x].processRecord);
				$td.data('complaintId',data.data.pageData[x].complaintId);
				if(data.data.pageData[x].status == 1){
					$td.children('.chuli').hide();
					$td.children('.yichuli').text(strIsEmpty(data.data.pageData[x].processRecord)?'已处理':data.data.pageData[x].processRecord);
					$td.children('.yichuli').show();
				}else{
					$td.children('.chuli').show();
					$td.children('.yichuli').hide();
				}
			}
			$('.tsxqq tbody>tr td').children('.chuli').click(onClickChuliButton);
		}

		 //点击“处理按钮”向后台发送请求
		function onClickChuliButton(){
		   var r = confirm('确认处理问题？？');
		   var chuli = $(this);
		   if(r == true){
			  var complaintId = $(this).parent().data('complaintId');
			  var processRecord = $(this).data('processRecord');
			   $.ajax({
					url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/reservationComplaint/process',
					type : 'post',
					dataType : 'json',
					data: {complaintId:complaintId,pageSize:20},
					success : function(data){
						if(data.code == 0 && processRecord == null){
							chuli.hide();
							var yichuli = chuli.next();
							yichuli.show();
						}
						if(data.code == 0 && processRecord != null){
							chuli.hide();
							var yichuli = chuli.next();
							yichuli.text();
							yichuli.show(processRecord);
						}
					}
			   });
		   }
		}


//<!--  清空‘订单投诉’文本框内容 -->
		$('.tsxq .all-cancle').click(function(e) {
            $('.tsxq .search').val('');
        });

//反馈意见管理
		$('.content-left ul>li:eq(8)').click(function(e) {
			$('.fkxqq tbody tr:gt(0)').remove();
			$('.fkxq .search').val('');
			var listnum = $('.fkxq .on-select  option:selected').index();
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/feedback/listFeedbacks',
				type : 'get',
				dataType : 'json',
				data: {phoneNum:$('.fkxq .search').val(),userType:$('.fkxq .on-select option:selected').index()+1,page:1},
				success : function(data){
					$('.fkxqq tbody tr:gt(0)').remove();
					$(".fkxq .tcdPageCode").createPage({
						pageCount:parseInt(data.data.totalPageNum),
						current:parseInt(data.data.currnetPageNum),
						backFn:function(p){
							$.ajax({
								url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/feedback/listFeedbacks',
								type : 'get',
								dataType : 'json',
								data: {phoneNum:$('.fkxq .search').val(),userType:$('.fkxq .on-select option:selected').index()+1,page:p},
								success : function(data){
									$('.fkxqq tbody tr:gt(0)').remove();
									for(var x = 0; x < data.data.pageData.length; x ++){
										$('.fkxqq tbody').append('<tr><td feedbackId='+data.data.pageData[x].feedbackId+'>'+data.data.pageData[x].userName+'</td><td>'+data.data.pageData[x].phoneNum+'</td><td>'+data.data.pageData[x].feebackType+'</td><td>'+data.data.pageData[x].content+'</td><td><input type="button" value="处理" class="chuli" /><p class="yichuli" >已处理</p></td><td>'+data.data.pageData[x].processorName+'</td><td>'+getLocalTime(data.data.pageData[x].processTime)+'</td></tr>');
										//判断“意见反馈类型”
										if(data.data.pageData[x].feebackType == 0){
											$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(2)').html('用户体验性建议');
										}
										if(data.data.pageData[x].feebackType == 1){
											$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(2)').html('功能性建议');
										}
										if(data.data.pageData[x].feebackType == 2){
											$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(2)').html('用户洽谈');
										}
										if(data.data.pageData[x].feebackType == 3){
											$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(2)').html('其他');
										}
										//判断"反馈处理"状态
										if(data.data.pageData[x].status == 0){
											$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(4)').children('.chuli').show();
											$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(4)').children('.yichuli').hide();
											//点击“处理”按钮向后台发送处理问题请求
											$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(4)').children('.chuli').click(function(e) {
												var r = confirm("确定要处理？？");
												if(r == true){
													var feedbackId = $('.fkxqq tbody>tr:eq('+$(this).parent().parent().index()+') td:eq(0)').attr('feedbackId');
													var chuli = $(this);
													$.ajax({
														url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/feedback/processFeedback',
														type : 'post',
														dataType : 'json',
														data: {userType:listnum+1,feedbackId:feedbackId},
														success : function(data){
															chuli.hide();
															var yichuli = chuli.next();
															yichuli.show();
														}
													});
												}
											});
										}else{
											$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(4)').children('.chuli').hide();
											$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(4)').children('.yichuli').show();
										}
									}
								},
							});
						}
					});
					for(var x = 0; x < data.data.pageData.length; x ++){
						$('.fkxqq tbody').append('<tr><td feedbackId='+data.data.pageData[x].feedbackId+'>'+data.data.pageData[x].userName+'</td><td>'+data.data.pageData[x].phoneNum+'</td><td>'+data.data.pageData[x].feebackType+'</td><td>'+data.data.pageData[x].content+'</td><td><input type="button" value="处理" class="chuli" /><p class="yichuli" >已处理</p></td><td>'+data.data.pageData[x].processorName+'</td><td>'+getLocalTime(data.data.pageData[x].processTime)+'</td></tr>');
						//判断“意见反馈类型”
						if(data.data.pageData[x].feebackType == 0){
							$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(2)').html('用户体验性建议');
						}
						if(data.data.pageData[x].feebackType == 1){
							$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(2)').html('功能性建议');
						}
						if(data.data.pageData[x].feebackType == 2){
							$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(2)').html('用户洽谈');
						}
						if(data.data.pageData[x].feebackType == 3){
							$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(2)').html('其他');
						}
						//判断"反馈处理"状态
						if(data.data.pageData[x].status == 0){
							$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(4)').children('.chuli').show();
							$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(4)').children('.yichuli').hide();
							//点击“处理”按钮向后台发送处理问题请求
							$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(4)').children('.chuli').click(function(e) {
								var r = confirm("确定要处理？？");
								if(r == true){
									var feedbackId = $('.fkxqq tbody>tr:eq('+$(this).parent().parent().index()+') td:eq(0)').attr('feedbackId');
									var chuli = $(this);
									$.ajax({
										url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/feedback/processFeedback',
										type : 'post',
										dataType : 'json',
										data: {userType:listnum+1,feedbackId:feedbackId},
										success : function(data){
											chuli.hide();
											var yichuli = chuli.next();
											yichuli.show();
										}
									});
								}
							});
						}else{
							$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(4)').children('.chuli').hide();
							$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(4)').children('.yichuli').show();
						}
					}
				},
			});
	//<!--  “反馈意见”--》搜索按钮 -->
			$('.fkxq .search-btn').click(function(e) {
			$('.fkxqq tbody tr:gt(0)').remove();
				$.ajax({
					url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/feedback/listFeedbacks',
					type : 'get',
					dataType : 'json',
					data: {phoneNum:$('.fkxq .search').val(),userType:$('.fkxq .on-select option:selected').index()+1},
					success : function(data){
						$('.fkxqq tbody tr:gt(0)').remove();
						$(".fkxq .tcdPageCode").createPage({
							pageCount:parseInt(data.data.totalPageNum),
							current:parseInt(data.data.currnetPageNum),
							backFn:function(p){
								$.ajax({
									url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/feedback/listFeedbacks',
									type : 'get',
									dataType : 'json',
									data: {phoneNum:$('.fkxq .search').val(),userType:$('.fkxq .on-select option:selected').index()+1,page:p},
									success : function(data){
										$('.fkxqq tbody tr:gt(0)').remove();
										for(var x = 0; x < data.data.pageData.length; x ++){
											$('.fkxqq tbody').append('<tr><td feedbackId='+data.data.pageData[x].feedbackId+'>'+data.data.pageData[x].userName+'</td><td>'+data.data.pageData[x].phoneNum+'</td><td>'+data.data.pageData[x].feebackType+'</td><td>'+data.data.pageData[x].content+'</td><td><input type="button" value="处理" class="chuli" /><p class="yichuli" >已处理</p></td><td>'+data.data.pageData[x].processorName+'</td><td>'+getLocalTime(data.data.pageData[x].processTime)+'</td></tr>');
											//判断“意见反馈类型”
											if(data.data.pageData[x].feebackType == 0){
												$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(2)').html('用户体验性建议');
											}
											if(data.data.pageData[x].feebackType == 1){
												$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(2)').html('功能性建议');
											}
											if(data.data.pageData[x].feebackType == 2){
												$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(2)').html('用户洽谈');
											}
											if(data.data.pageData[x].feebackType == 3){
												$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(2)').html('其他');
											}
											//判断"反馈处理"状态
											if(data.data.pageData[x].status == 0){
												$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(4)').children('.chuli').show();
												$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(4)').children('.yichuli').hide();
												//点击“处理”按钮向后台发送处理问题请求
												$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(4)').children('.chuli').click(function(e) {
													var r = confirm("确定要处理？？");
													if(r == true){
														var feedbackId = $('.fkxqq tbody>tr:eq('+$(this).parent().parent().index()+') td:eq(0)').attr('feedbackId');
														var chuli = $(this);
														$('.fkxqq tbody tr:gt(0)').remove();
														$.ajax({
															url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/feedback/processFeedback',
															type : 'post',
															dataType : 'json',
															data: {userType:listnum+1,feedbackId:feedbackId},
															success : function(data){
																chuli.hide();
																var yichuli = chuli.next();
																yichuli.show();
															}
														});
													}
												});
											}else{
												$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(4)').children('.chuli').hide();
												$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(4)').children('.yichuli').show();
											}
										}
									},
								});
							}
						});
						for(var x = 0; x < data.data.pageData.length; x ++){
							$('.fkxqq tbody').append('<tr><td feedbackId='+data.data.pageData[x].feedbackId+'>'+data.data.pageData[x].userName+'</td><td>'+data.data.pageData[x].phoneNum+'</td><td>'+data.data.pageData[x].feebackType+'</td><td>'+data.data.pageData[x].content+'</td><td><input type="button" value="处理" class="chuli" /><p class="yichuli" >已处理</p></td><td>'+data.data.pageData[x].processorName+'</td><td>'+getLocalTime(data.data.pageData[x].processTime)+'</td></tr>');
							//判断“意见反馈类型”
							if(data.data.pageData[x].feebackType == 0){
								$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(2)').html('用户体验性建议');
							}
							if(data.data.pageData[x].feebackType == 1){
								$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(2)').html('功能性建议');
							}
							if(data.data.pageData[x].feebackType == 2){
								$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(2)').html('用户洽谈');
							}
							if(data.data.pageData[x].feebackType == 3){
								$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(2)').html('其他');
							}
							//判断"反馈处理"状态
							if(data.data.pageData[x].status == 0){
								$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(4)').children('.chuli').show();
								$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(4)').children('.yichuli').hide();
								//点击“处理”按钮向后台发送处理问题请求
								$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(4)').children('.chuli').click(function(e) {
									var r = confirm("确定要处理？？");
									if(r == true){
										var feedbackId = $('.fkxqq tbody>tr:eq('+$(this).parent().parent().index()+') td:eq(0)').attr('feedbackId');
										var chuli = $(this);
										$('.fkxqq tbody tr:gt(0)').remove();
										$.ajax({
											url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/feedback/processFeedback',
											type : 'post',
											dataType : 'json',
											data: {userType:listnum+1,feedbackId:feedbackId},
											success : function(data){
												chuli.hide();
												var yichuli = chuli.next();
												yichuli.show();
											}
										});
									}
								});
							}else{
								$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(4)').children('.chuli').hide();
								$('.fkxqq tbody>tr:eq('+(x+1)+') td:eq(4)').children('.yichuli').show();
							}
						}
					}
				});
			});
        });

//<!--  点击“反馈意见”--》取消全部--》清空文本框 -->
		$('.fkxq .cancle-btn').click(function(e) {
            $('.fkxq .search').val('');
        });

//时间格式化
			function getLocalTime(publishTime) {
				 var d_minutes,d_hours,d_days;       
				    var timeNow = parseInt(new Date().getTime()/1000);       
				    var d;       
				    d = timeNow - publishTime;       
				    d_days = parseInt(d/86400);       
				    d_hours = parseInt(d/3600);       
				    d_minutes = parseInt(d/60);       
				    if(d_days>0 && d_days<4){       
				        return d_days+"天前";       
				    }else if(d_days<=0 && d_hours>0){       
				        return d_hours+"小时前";       
				    }else if(d_hours<=0 && d_minutes>0){       
				        return d_minutes+"分钟前";       
				    }else{       
				        var s = 0;
						s = new Date(publishTime);       
				        return (s.getFullYear()+"年"+parseInt(s.getMonth()+1))+"月"+parseInt(s.getDate())+"日";       
				    }  
			}


//邀请码管理
		//页面加载时加载的数据
		$('.content-left ul>li:eq(9)').click(listInviteCodes);
		function  getData(page,code,employeeName,isForever){
			var data = new Object();
			data.page = page;
			data.code = code;
			data.employeeName = employeeName;
			data.isForever = isForever;
			return data;	
		}
		
		//搜索的数据
		function genData(){
			return getData(
			1,$('.yhqgl .search.yhq').val(),
			$('.yhqgl .search.creater').val(),$('.yhqgl .on-select option:selected').attr('value')
			);
		}
		
		//渲染数据
		function resolvePage(data){
			$('.yhqgll tr:gt(0)').remove();
			for(var x = 0; x < data.data.pageData.length ; x ++){
				$('.yhqgll').append('<tr><td codeId='+data.data.pageData[x].codeId+'>'+data.data.pageData[x].productName+'</td><td>'+data.data.pageData[x].code+'</td><td>'+data.data.pageData[x].faceValue+'</td><td>'+data.data.pageData[x].allowedTimes+'</td><td>'+data.data.pageData[x].usedTimes+'</td><td>'+data.data.pageData[x].isForever+'</td><td>'+data.data.pageData[x].startDate+'</td><td>'+data.data.pageData[x].endDate+'</td><td>'+data.data.pageData[x].comment+'</td><td>'+data.data.pageData[x].employeeName+'</td><td>'+data.data.pageData[x].isDiscount+'</td><td>'+data.data.pageData[x].discount+'</td><td><input type="button" value="删除" class="yqm-btn-del" /></td></tr>');
				//当返回值为0时，优惠券非永久有效
				if(data.data.pageData[x].isForever == 0){
					$('.yhqgll tbody>tr:eq('+(x+1)+') td:eq(5)').html('否');	
				}
				//当返回值为1时，优惠券永久有效
				if(data.data.pageData[x].isForever == 1){
					$('.yhqgll tbody>tr:eq('+(x+1)+') td:eq(5)').html('是');	
				}
				
				
				//当返回值是0时，不是折扣券
				if(data.data.pageData[x].isDiscount == 0){
					$('.yhqgll tbody>tr:eq('+(x+1)+') td:eq(10)').html('否');	
				}
				//当返回值是1时，是折扣券
				if(data.data.pageData[x].isDiscount == 1){
					$('.yhqgll tbody>tr:eq('+(x+1)+') td:eq(10)').html('是');	
				}
			}
		}
		
		//根据不同的页码来渲染页面
		function onClickPageNum(p){
			var data = genData();
			data.page = p;
			
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/invitecode/listInviteCodes',
				type : 'get',
				dataType : 'json',
				data: data,
				success : function(data){
					resolvePage(data);
				},
			});
		}
		
		//获取入参，渲染页面
		function listInviteCodes(){
			//获取入参
			var data = genData();
			//$('.yhqgll>tbody>tr:gt(0)').remove();
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/invitecode/listInviteCodes',
				type : 'get',
				dataType : 'json',
				data: data,
				success : function(data){
					//创建分页
					$(".yhqgl .tcdPageCode").createPage({
						pageCount:parseInt(data.data.totalPageNum),
						current:parseInt(data.data.currnetPageNum),
						backFn:onClickPageNum
					});
					
					//渲染页面
					resolvePage(data);
				},
			});
		}
		

//邀请管理
//<!--  点击“邀请码管理”--》搜索按钮 -->
		$('.yhqgl .search-btn').click(listInviteCodes);
		
//<!--  点击“邀请码管理”--》全部取消按钮 -->
		$('.yhqgl .cancle-btn').click(function(e) {
			$('.yhqgl .search.yhq').val('');
			$('.yhqgl .search.creater').val('');
			$('.yhqgl .on-select option:eq(0)').attr('selected','selected');
		});
		
//创建邀请码
		$('.create-yhq').click(function(e) {
			if($('.yhq-create .qian').val() == ''){
				alert('请选择有效开始时间');	
			}else if($('.yhq-create .hou').val() == ''){
				alert('请选择有效结束时间');	
			}else if($('.yhq-create .quan-name').val() == ''){
				alert('请输入券名');	
			}else if($('.yhq-create .quan-money').val() == ''){
				alert('请输入面值');	
			}else if($('.yhq-create .quan-pro option:selected').val() == ''){
				alert('请输入适用产品');	
			}else if($('.yhq-create .quan-low-money').val() == ''){
				alert('请输入使用时最低限额');	
			}else if($('.yhq-create .quan-use-num').val() == ''){
				alert('请输入单张可适用次数');	
			}else if($('.yhq-create .quan-create-num').val() == ''){
				alert('请输入生成优惠码个数');	
			}else if($('.yhq-create .quan-create-dis').val() == ''){
				alert('请输入折扣数');	
			}else{
				var re=new RegExp("[\\-,\\:, ]","g");  //正则格式化字符，解释：re=new RegExp("l","g")中的第一个参数是你要替换的字符串，第二个参数指替换所有的。
				var startDate = $('.yhq-create .qian').val().replace(re, "");
				var endDate = $('.yhq-create .hou').val().replace(re, "");
				if($('.is-select option:selected').attr('value') == 0){
					$('.yhq-create .quan-create-dis').val('');	
				}else{
					$('.yhq-create .quan-create-dis').val();
				}
				$.ajax({
					url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/invitecode/createInviteCode',
					type : 'post',
					dataType : 'json',
					data: {isForever:$('.yhq-create .on-select option:selected').attr('value'),startDate:startDate,endDate:endDate,productName:$('.yhq-create .quan-name').val(),faceValue:$('.yhq-create .quan-money').val(),type:$('.yhq-create .quan-pro option:selected').attr('value'),limitPrice:$('.yhq-create .quan-low-money').val(),allowedTimes:$('.yhq-create .quan-use-num').val(),nums:$('.yhq-create .quan-create-num').val(),isDiscount:$('.yhq-create .is-select option:selected').attr('value'),discount:$('.yhq-create .quan-create-dis').val(),comment:$('.yhq-create .quan-content').val()},
					success : function(data){
						$('.yhq-create').hide();
						$('.yhq-success').show();
						$('.yhq-success .ys-num').html(data.data.length);
						for(var x = 0 ; x < data.data.length; x ++){
							$('.yhq-success .ys-code').append('<b>'+data.data[x]+'</b>,');	
						}
					},
				});
			}
        });
		
//<!--  创建邀请码信息 -->
		$('.create-btn').click(function(e) {
			$('.yhq-create .qian').val('');
			$('.yhq-create .hou').val('');
			$('.yhq-create .quan-name').val('');
			$('.yhq-create .quan-money').val('');
			$('.yhq-create .quan-low-money').val('');
			$('.yhq-create .quan-use-num').val('');
			$('.yhq-create .quan-create-num').val('');
			$('.yhq-create .quan-content').val('');
			$('.yhq-list').hide();
	        $('.yhq-create').show();
	    });	
		
//<!--  点击--》返回--》返回到邀请码列表 -->	
		$('.return-yhq').click(function(e) {
			$('.yhq-success .ys-num').html('');
			$('.yhq-success .ys-code').children('b').remove();
			$('.yhq-success .ys-code').html('');
			$('.yhq-list').show();
	        $('.yhq-create').hide();
	    });	
		
//<!--  返回列表 -->
		$('.ysbtn-return').click(function(e) {
			$('.yhq-success .ys-num').html('');
			$('.yhq-success .ys-code').children('b').remove();
			$('.yhq-success .ys-code').html('');
			$('.yhq-success').hide();
	        $('.yhq-create').hide();
	        $('.yhq-list').show();
	    });
		
//<!--  继续创建 -->
		$('.ysbtn-create').click(function(e) {
			$('.yhq-success .ys-num').html('');
			$('.yhq-success .ys-code').children('b').remove();
			$('.yhq-success .ys-code').html('');
			$('.yhq-success').hide();
	        $('.yhq-list').hide();
	        $('.yhq-create').show();
	    });
	
//删除邀请码
		$('.yqm-btn-del').live('click',function(e) {
			var r = confirm('确定要删除？？');
			if(r == true){
				var del= $(this);
				$.ajax({
					url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/invitecode/deleteInviteCode',
					type : 'get',
					dataType : 'json',
					data: {codeId:$(this).parent().parent().children('td:eq(0)').attr('codeId')},
					success : function(data){
						del.parent().parent().remove();
					},
				});
			}
        });
		
//资讯管理--》删除按钮
		$('.zxgl-del-btn').live('click',function(e){
			var r = confirm('确定要删除？？');
			if(r == true){
				var del = $(this);
				$.ajax({
					url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/focuscontent/delete',
					type : 'post',
					dataType : 'json',
					data: {contentId:$(this).parent().parent().children('td:eq(0)').html()},
					success : function(data){
						del.parent().parent().remove();
					},
				});	
			}
		});
//资讯管理--》取消全部按钮--》清空文本框
	$('.zxgll .cancle-btn').click(function(e) {
        $('.zxgll .qian').val('');
        $('.zxgll .hou').val('');
    });
	
//资讯管理--》新建按钮
	$('.new-zx-btn').click(function(e) {
		window.open ("focusimagemanage.html");
    });

//化妆师管理，查看
		$('.hzsxq tbody>tr td .look').live('click',function(e) {
			var dresserId = $('.hzsxq tbody>tr:eq('+$(this).parent().parent().index()+') td:eq(0)').html();
			var dresserName = $('.hzsxq tbody>tr:eq('+$(this).parent().parent().index()+') td:eq(1)').html();
            $('.ckxq').show().siblings().hide();
			//<!--  显示化妆师详细信息 -->
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/dresser/dresserDetail',
				type : 'get',
				dataType : 'json',
				data: {dresserId:dresserId},
				success : function(data){
					$('.cb-left .ckxq-name .ct-name').val(data.data.name);
					$('.cb-left .ckxq-name .ct-tel').val(data.data.phoneNum);
					$('.cb-left .ckxq-name .ct-id').val(data.data.cardId);
					$('.ckxq-name .qian').attr('src',data.data.cardUpside);
					$('.ckxq-name .hou').attr('src',data.data.cardDownside);
					$('.ckxq-name .cityid').children('option').html(data.data.city);  //拿到城市
					var currentcounty = data.data.county;                             //拿到城市对应的区镇
					//城市列表
					//<!--  北京 -->
					if($('.ckxq-name .cityid').children('option').html() == '北京'){
						//<!--  显示化妆师所在城市 -->
						$.ajax({
							url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/dresser/getCountys',
							type : 'get',
							dataType : 'json',
							data: {cityId:1},
							success : function(data){
								for(var x = 0; x < data.data.length; x++ ){
									$('.cn-city .city').append('<option>'+data.data[x].countyName+'</option>');
								}
								$('.ckxq-name .city').children('option:eq(0)').attr('selected','selected').html(currentcounty);
							},
						});
					}

					//<!--  重庆 -->
					if($('.ckxq-name .cityid').children('option').html() == '重庆'){
						//<!--  显示化妆师所在城市 -->
						$.ajax({
							url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/dresser/getCountys',
							type : 'get',
							dataType : 'json',
							data: {cityId:2},
							success : function(data){
								for(var x = 0; x < data.data.length; x++ ){
									$('.cn-city .city').append('<option>'+data.data[x].countyName+'</option>');
								}
								$('.ckxq-name .city').children('option:eq(0)').attr('selected','selected').html(currentcounty);
							},
						});
					}

					//<!--  成都 -->
					if($('.ckxq-name .cityid').children('option').html() == '成都'){
						//<!--  显示化妆师所在城市 -->
						$.ajax({
							url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/dresser/getCountys',
							type : 'get',
							dataType : 'json',
							data: {cityId:3},
							success : function(data){
								for(var x = 0; x < data.data.length; x++ ){
									$('.cn-city .city').append('<option>'+data.data[x].countyName+'</option>');
								}
								$('.ckxq-name .city').children('option:eq(0)').attr('selected','selected').html(currentcounty);
							},
						});
					}

					//<!--  上海 -->
					if($('.ckxq-name .cityid').children('option').html() == '上海'){
						//<!--  显示化妆师所在城市 -->
						$.ajax({
							url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/dresser/getCountys',
							type : 'get',
							dataType : 'json',
							data: {cityId:4},
							success : function(data){
								for(var x = 0; x < data.data.length; x++ ){
									$('.cn-city .city').append('<option>'+data.data[x].countyName+'</option>');
								}
								$('.ckxq-name .city').children('option:eq(0)').attr('selected','selected').html(currentcounty);
							},
						});
					}

					//<!--  广州 -->
					if($('.ckxq-name .cityid').children('option').html() == '广州'){
						//<!--  显示化妆师所在城市 -->
						$.ajax({
							url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/dresser/getCountys',
							type : 'get',
							dataType : 'json',
							data: {cityId:5},
							success : function(data){
								for(var x = 0; x < data.data.length; x++ ){
									$('.cn-city .city').append('<option>'+data.data[x].countyName+'</option>');
								}
								$('.ckxq-name .city').children('option:eq(0)').attr('selected','selected').html(currentcounty);
							},
						});
					}

					//<!--  大连 -->
					if($('.ckxq-name .cityid').children('option').html() == '大连'){
						//<!--  显示化妆师所在城市 -->
						$.ajax({
							url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/dresser/getCountys',
							type : 'get',
							dataType : 'json',
							data: {cityId:6},
							success : function(data){
								for(var x = 0; x < data.data.length; x++ ){
									$('.cn-city .city').append('<option>'+data.data[x].countyName+'</option>');
								}
								$('.ckxq-name .city').children('option:eq(0)').attr('selected','selected').html(currentcounty);
							},
						});
					}

					//<!--  南京 -->
					if($('.ckxq-name .cityid').children('option').html() == '南京'){
						//<!--  显示化妆师所在城市 -->
						$.ajax({
							url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/dresser/getCountys',
							type : 'get',
							dataType : 'json',
							data: {cityId:7},
							success : function(data){
								for(var x = 0; x < data.data.length; x++ ){
									$('.cn-city .city').append('<option>'+data.data[x].countyName+'</option>');
								}
								$('.ckxq-name .city').children('option:eq(0)').attr('selected','selected').html(currentcounty);
							},
						});
					}

					//<!--  深圳 -->
					if($('.ckxq-name .cityid').children('option').html() == '深圳'){
						//<!--  显示化妆师所在城市 -->
						$.ajax({
							url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/dresser/getCountys',
							type : 'get',
							dataType : 'json',
							data: {cityId:8},
							success : function(data){
								for(var x = 0; x < data.data.length; x++ ){
									$('.cn-city .city').append('<option>'+data.data[x].countyName+'</option>');
								}
								$('.ckxq-name .city').children('option:eq(0)').attr('selected','selected').html(currentcounty);
							},
						});
					}
				},
			});

//<!---  点击“化妆师管理”--》“查看”--》“详细信息”--》“确定”-->
		$('.city-btn').live('click',function(e) {
			var r = confirm('确认要修改？？');
			if(r == true){
				$.ajax({
					url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/dresser/updateDresser',
					type : 'post',
					dataType : 'json',
					data: {dresserId:dresserId,name:$('.cb-left .ckxq-name .ct-name').val(),phoneNum:$('.cb-left .ckxq-name .ct-tel').val(),cardId:$('.cb-left .ckxq-name .ct-id').val(),city:$('.ckxq-name .cityid').children('option').html(),county:$('.ckxq-name .city').children('option:selected').html()},
					success : function(data){
						alert('修改成功!!');
					}
				});
			}
        });

//<!--  显示"化妆师管理“--》”作品管理“ -->
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/dresser/listDresserWorks',
				type : 'get',
				dataType : 'json',
				data: {dresserId:dresserId,page:1},
				success : function(data){
					$(".ckxq .tcdPageCode").createPage({
						pageCount:parseInt(data.data.totalPageNum),
						current:parseInt(data.data.currnetPageNum),
						backFn:function(p){
							$.ajax({
								url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/dresser/listDresserWorks',
								type : 'get',
								dataType : 'json',
								data: {page:p},
								success : function(data){
									$('.tm-zpgl tr:gt(0)').remove();
									for(var x = 0; x < data.data.pageData.length ; x ++){
										var contentImgTag = '<td class="left">';
										for(var imgIndex = 0; imgIndex < data.data.pageData[x].workContentPhotos.length; imgIndex++){
											contentImgTag +=  '<img width="25px" src="' + data.data.pageData[x].workContentPhotos[imgIndex].photoPath+'"/>&nbsp;';
										}
										contentImgTag += '</td>';
										$('.tm-zpgl').append('<tr><td>'+data.data.pageData[x].workId+'</td><td>'+data.data.pageData[x].publishTime+'</td>'+contentImgTag+'</td><td>'+data.data.pageData[x].workType+'</td><td>'+data.data.pageData[x].cost+'</td><td>'+data.data.pageData[x].desc+'</td><td><input type="button" value="小图"  class="small-img" /> <input type="button" value="大图" class="big-img" /><input type="button" value="取消小图推荐" style=" display:none;" class="cancle-btn-small" /><input type="button" style=" display:none;" value="取消大图推荐" class="cancle-btn-big" /></td><td><input type="button" value="删除" class="del-btn" /></td></tr>');
										if(data.data.pageData[x].recommendType == null){
											$('.tm-zpgl tbody>tr:eq('+(x+1)+') td .small-img').parent().children('.cancle-btn-small').hide();
											$('.tm-zpgl tbody>tr:eq('+(x+1)+') td .small-img').parent().children('.cancle-btn-big').hide();
											$('.tm-zpgl tbody>tr:eq('+(x+1)+') td .small-img').parent().children('.small-img').show();
											$('.tm-zpgl tbody>tr:eq('+(x+1)+') td .small-img').parent().children('.big-img').show();
										}
										if(data.data.pageData[x].recommendType == 1){
											$('.tm-zpgl tbody>tr:eq('+(x+1)+') td .small-img').parent().children('.cancle-btn-big').show().siblings().hide();
										}
										if(data.data.pageData[x].recommendType == 2){
											$('.tm-zpgl tbody>tr:eq('+(x+1)+') td .big-img').parent().children('.cancle-btn-small').show().siblings().hide();
										}
									}
								},
							});
						}
					});
					for(var x = 0; x < data.data.pageData.length ; x ++){
						var contentImgTag = '<td class="left">';
						for(var imgIndex = 0; imgIndex < data.data.pageData[x].workContentPhotos.length; imgIndex++){
							contentImgTag +=  '<img width="25px" src="' + data.data.pageData[x].workContentPhotos[imgIndex].photoPath+'"/>&nbsp;';
						}
						contentImgTag += '</td>';
						$('.tm-zpgl').append('<tr><td>'+data.data.pageData[x].workId+'</td><td>'+data.data.pageData[x].publishTime+'</td>'+contentImgTag+'</td><td>'+data.data.pageData[x].workType+'</td><td>'+data.data.pageData[x].cost+'</td><td>'+data.data.pageData[x].desc+'</td><td><input type="button" value="小图"  class="small-img" /> <input type="button" value="大图" class="big-img" /><input type="button" value="取消小图推荐" style=" display:none;" class="cancle-btn-small" /><input type="button" style=" display:none;" value="取消大图推荐" class="cancle-btn-big" /></td><td><input type="button" value="删除" class="del-btn" /></td></tr>');
						if(data.data.pageData[x].recommendType == null){
							$('.tm-zpgl tbody>tr:eq('+(x+1)+') td .small-img').parent().children('.cancle-btn-small').hide();
							$('.tm-zpgl tbody>tr:eq('+(x+1)+') td .small-img').parent().children('.cancle-btn-big').hide();
							$('.tm-zpgl tbody>tr:eq('+(x+1)+') td .small-img').parent().children('.small-img').show();
							$('.tm-zpgl tbody>tr:eq('+(x+1)+') td .small-img').parent().children('.big-img').show();
						}
						if(data.data.pageData[x].recommendType == 1){
							$('.tm-zpgl tbody>tr:eq('+(x+1)+') td .small-img').parent().children('.cancle-btn-big').show().siblings().hide();
						}
						if(data.data.pageData[x].recommendType == 2){
							$('.tm-zpgl tbody>tr:eq('+(x+1)+') td .big-img').parent().children('.cancle-btn-small').show().siblings().hide();
						}
					}
				},
			});
        });

//<!--  点击"化妆师管理“--》作品管理”“小图” -->
				$('.tm-zpgl tbody>tr>td>.small-img').live('click',function(e) {
					var r = confirm('确定推荐小图？？');
					var smallImg = $(this);
					if(r == true){
						$.ajax({
							url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/work/workRecommend',
							type : 'post',
							dataType : 'json',
							data: {workId:$('.tm-zpgl tbody>tr:eq('+$(this).parent().parent().index()+') td:eq(0)').html(),recommendType:2},
							success : function(data){
								smallImg.hide();
								smallImg.parent().children('input:eq(1)').hide();
								smallImg.parent().children('input:eq(2)').show();
								smallImg.parent().children('input:eq(3)').hide();
							}
						});
					}
                });

//<!--  点击"化妆师管理“--》作品管理”“大图” -->
				$('.tm-zpgl tbody>tr>td>.big-img').live('click',function(e) {
					var r = confirm('确定推荐大图？？');
					var smallImg = $(this);
					if(r == true){
						$.ajax({
							url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/work/workRecommend',
							type : 'post',
							dataType : 'json',
							data: {workId:$('.tm-zpgl tbody>tr:eq('+$(this).parent().parent().index()+') td:eq(0)').html(),recommendType:1},
							success : function(data){
								smallImg.hide();
								smallImg.parent().children('input:eq(0)').hide();
								smallImg.parent().children('input:eq(3)').show();
								smallImg.parent().children('input:eq(2)').hide();
							}
						});
					}
                });

//<!--  点击"化妆师管理“--》作品管理"--》取消小图推荐 -->
				$('.tm-zpgl tbody>tr>td>.cancle-btn-small').live('click',function(e) {
					var r = confirm('确定取消小图推荐？？');
					var qxsmallImg = $(this);
					if(r == true){
						$.ajax({
							url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/work/cancelWorkRecommend',
							type : 'post',
							dataType : 'json',
							data: {workId:$('.tm-zpgl tbody>tr:eq('+$(this).parent().parent().index()+') td:eq(0)').html()},
							success : function(data){
								qxsmallImg.hide();
								qxsmallImg.parent().children('input:eq(0)').show();
								qxsmallImg.parent().children('input:eq(3)').hide();
								qxsmallImg.parent().children('input:eq(1)').show();
							}
						});
					}
                });

//<!--  点击"化妆师管理“--》作品管理"--》取消大图推荐 -->
				$('.tm-zpgl tbody>tr>td>.cancle-btn-big').live('click',function(e) {
					var r = confirm('确定取消大图推荐？？');
					var qxsmallImg = $(this);
					if(r == true){
						$.ajax({
							url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/work/cancelWorkRecommend',
							type : 'post',
							dataType : 'json',
							data: {workId:$('.tm-zpgl tbody>tr:eq('+$(this).parent().parent().index()+') td:eq(0)').html()},
							success : function(data){
								qxsmallImg.hide();
								qxsmallImg.parent().children('input:eq(0)').show();
								qxsmallImg.parent().children('input:eq(2)').hide();
								qxsmallImg.parent().children('input:eq(1)').show();
							}
						});
					}
                });

//<!--  点击"化妆师管理“--》作品管理--》删除按钮 -->
				$('.tm-zpgl tbody>tr td .del-btn').live('click',function(e) {
					var par = $(this).parent().parent().index();
					var r = confirm('确定删除？？？');
					if(r == true){
						$.ajax({
							url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/work/deleteWork',
							type : 'post',
							dataType : 'json',
							data: {num:20,workId:$('.tm-zpgl tbody>tr:eq('+par+') td:eq(0)').html()},
							success : function(data){
								if(data.code == 0){
									$('.tm-zpgl tbody>tr:eq('+par+')').remove();
								}
							}
						});
					}
				});
		
		
//退出登录
		$('.exit').click('click',function(e) {
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/loginOut',
				type : 'post',
				dataType : 'json',
				data: {},
				success : function(data){
					window.top.document.location.href='login.html?v=<%= VERSION %>'
				}
			});
        });
	  
		
	});
