$(function(){
/*----------------------------------------------------------添加化妆师作品开始----------------------------------------------------------*/
//<!--  点击“化妆师管理”--》全部取消按钮 -->
	$('.hzsxqq  .cancle-btn').live('click',function(e) {
		$('.hzsxqq .order-num .search').val('');
		$('.hzsxqq .order-num .search_realname').val('');
		$('.hzsxqq .order-num .on-select option:eq(0)').attr('selected','selected');
		loadDresserPage();
	});
	
	//点击添加作品按钮弹出--》添加作品页面
	$('.add-works-btm').live('click',function(){
		$('#form0-addworks').children('.box').remove();
		$('.add-works .works-name').val('');
		$('.add-works .works-price').val('');
		$('.add-works .works-content').val('');
		$('.add-works-tips-select .tips-selected').html('');
		
		$('.add-works .cosmetics-class').children('li').remove();
		$('.published-work-btn-update').hide();
		$('.published-work-btn').show();
		$('.add-works').show();
		$('.ckxq').hide();
		$('.order-num').attr('dresserId',$('.add-works-btm').attr('dresserId'));
		var brandString = '';
		var brandFen = '';
		
		//获取装束类型
		$.ajax({
			url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/dresser/listWorkType',
			type : 'get',
			dataType : 'json',
			data: {},
			success : function(data){
				for(var x = 0; x <data.data.length; x ++){
					$('.add-works .works-type').append('<option>'+data.data[x]+'</option>');
				}
			},
		});	
		
		//点击获取装束标签束标签
		$('.add-works-tips-select').click(function(e) {
			$('.add-works .works-tips').empty();
			var arr = $('.tips-selected').html().split(' ');
			console.log('arr'+arr);
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/dresser/listWorkTag',
				type : 'get',
				dataType : 'json',
				data: {},
				async:false,
				success : function(data){
					$('.add-works .works-tips').empty();
					for(var x = 0; x <data.data.length; x ++){
						if(containsStr(data.data[x],arr)){
							$('.add-works .works-tips').append('<input type="checkbox" checked="checked" value="'+data.data[x]+'" name="tips" /><label for="">'+data.data[x]+'</label><br />');
						}else{
							$('.add-works .works-tips').append('<input type="checkbox" value="'+data.data[x]+'" name="tips" /><label for="">'+data.data[x]+'</label><br />');
						}
					}
					$('.add-works .works-tips').append('<br /><input type="button" value="保存" class="save-tips" />');
				},
			});	
			$('.works-tips').slideDown();
			//获取被选中的装束标签名称
		});
		
		//判断标签值是否相等
		function containsStr(str,arr){
			for(var y = 0; y < arr.length; y ++){
				if(str == arr[y]){
					return true;		
				}
			}
			return false;
		}
		
		//点击获取装束标签里面的保存按钮，拿到选中的标签
		$('.save-tips').unbind('click');
		$('.save-tips').die().live('click',function(e) {
			 var text=""; 
			 var num = 0; 
			 $(this).siblings("input[name=tips]:checked").each(function() { 
			 	num ++; 
				text += $(this).val()+" ";  
			 });
			if(num > 3){
				alert('选中的标签个数不能超过3个！！');
			}else{
				 var s = text.substring(0,text.length-1);
				 $('.tips-selected').html(s);
				 $('.works-tips').slideUp();
				 console.log('tags:'+s);
			}
		});
		
		//获取化妆品品类列表
		$.ajax({
			url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/dresser/listCosmeticsClass',
			type : 'get',
			dataType : 'json',
			data: {},
			success : function(data){
				for(var x = 0; x <data.data.length; x ++){
					$('.add-works .cosmetics-class').append('<li><div class="hzp-title" cosmeticsClass="'+data.data[x]+'">'+data.data[x]+'<span class="fdy"></span></div><div class="hzp-box"></div></li>');
				}
				//化妆师注册时已选的化妆品
				$.ajax({
					url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/dresser/getCosmeticsInfo',
					type : 'get',
					dataType : 'json',
					data: {dresserId:$('.add-works-btm').attr('dresserId')},
					success : function(data){
						//获取所有化妆师选择化妆品品类对应的品牌
						for(var x = 0; x < data.data.length; x ++){
							brandString = '';
							for(var y = 0; y <data.data[x].dresserCosmBrands.length; y++){
								brandString += data.data[x].dresserCosmBrands[y].brand+' , ';
								brandFen += data.data[x].dresserCosmBrands[y].brand+',';
							}	
							panCos(data.data[x].cosmClass,'&nbsp;&nbsp;&nbsp;'+brandString.substring(0,brandString.length-1));
						}
					},
				});	
			},
		});
		
		//添加化妆师化妆时所用化妆品品类
		$('.add-works .cosmetics-class li .hzp-title').live('click',function(e) {
			var brand = $(this);
			//获取化妆品品牌列表
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/dresser/listCosmeticsBrand',
				type : 'post',
				dataType : 'json',
				data: {cosmeticsClass:$(this).attr('cosmeticsClass')},
				success : function(data){
					$('.add-works .cosmetics-class li .hzp-box').children().remove();
					
					brandString = brand.children('.fdy').html();
					
					for(var x = 0; x <data.data.length; x ++){
						brand.next().append('<p style=" padding:5px 0; background:#ddd;">'+data.data[x].country+'</p>'+getBrand(data.data[x].brand));											
					}
					//添加上保存按钮
					brand.parent().children('.hzp-box').append('<input type="button" value="保存" class="save" />');
				},
			});
			$(this).next().slideDown();
		});
		
		
		//点击保存按获取化妆师所用化妆品名称
		$('.save').live('click',function(e) {
			 var text="";  
			 $(this).siblings("input[name=box]:checked").each(function() {  
				text += $(this).val()+" , ";  
			 });
			 var s = text.substring(0,text.length-1);
			 $(this).parent().parent().children('.hzp-title').children('.fdy').html('&nbsp;&nbsp;&nbsp;'+s);
			 $(this).parent().slideUp();
		});
	
		//获取品牌和国家
		function getBrand(brand){
			var str = '';
			var re=new RegExp("(\\&nbsp;)","g");
			var array = brandString.substring(0,brandString.length-2).replace(re,"").split(" , ");
			for(var x = 0; x <brand.length; x ++){
				if($.inArray(brand[x],array) == -1){
					str += '<input name="box" value="'+brand[x]+'" type="checkbox" /><label for="">'+brand[x]+'</label><br /><br />';		
				}else{
					str += '<input name="box" value="'+brand[x]+'" type="checkbox" checked="checked" /><label for="">'+brand[x]+'</label><br /><br />';	
				}
			}
			return str;
		}
	});
		
	//上传化妆师作品图片
	$('#file0-add-works').fileupload({
		dataType: 'json',
		done: function (e, data) {
			$('#form0-addworks').append('<span class="box"><img src="'+data.result.data.url+'" id="img0-addworks" /> <div class="btn"></div></span>');
		}
	});
	
	//点击默认的图片上传图片
	$('#img0-addworks').click(function(e) {
		$('#file0-add-works').click();
	});
	
	//删除图片
	$('.box .btn').live('click',function(e) {
        $(this).parent().remove();
    });
	
		
	//提交化妆师信息
	$('.published-work-btn').unbind('click');
	$('.published-work-btn').live('click',function(e) {
		var dd = '';
		var str = '';
		var tr = '';
		var pinleiPinpai= '';
		var re=new RegExp("(\\&nbsp;)","g");
		
		//获取品牌和品类
		$('.cosmetics-class>li .hzp-title .fdy').each(function(){
			if($(this).html().replace(re,"") != ''){
				dd = '';
				//获取品牌
				tr = $(this).html().substring(0,$(this).html().length-2).replace(re,"");
				var strs=tr.split(" , "); 
				console.log(strs);
				for (i=0;i<strs.length ;i++ ){
					dd+='"'+strs[i]+'",';	
				}
				var brand = dd.substring(0,dd.length-1);
				console.log('dd'+brand);
				//获取品类
				var pinlei ='"cosmeticsClass":"'+ $(this).parent().attr('cosmeticsclass')+'"';
				pinleiPinpai += '{'+pinlei + ',"cosmeticsBrand":['+brand+']},';
			}else{
					
			}
		});
		str = '{"cosmetics":['+pinleiPinpai.substring(0,pinleiPinpai.length-1)+']}';
		console.log(str);
		
		//获取除了封面以外上传的其他图片地址
		var imgUrl = '';
		var imgContentPhoto = '';
		$('#form0-addworks>.box:gt(0)').each(function(){
			imgUrl += '"'+$(this).children('img').attr('src')+'",';
		})
		//去掉最后一个逗号
		imgContentPhoto = '{"contentPhoto":['+imgUrl.substring(0,imgUrl.length-1)+']}';
		
		//判断填写项
		if($('#form0-addworks .box:eq(0)').children('img').attr('src') == ''){
			alert('请选择封面！');	
		}else if($.trim($('.works-name').val()) == ''){
			alert('请填写装束名称！！');
		}else if($.trim($('.works-price').val())== ''){
			alert('请填写价格！');
		}else if($('.tips-selected').html() == ''){
			alert('请选择装束标签！');
		}else if($.trim($('.works-content').val())== ''){
			alert('请输入装束说明！');	
		}else if(pinleiPinpai.length == 0){
			alert('请输选择至少一种使用的化妆品！');	
		}else{
			var requestData = {dresserId:$('.add-works-btm').attr('dresserId'),workName:$('.works-name').val(),workType:$('.works-type option:selected').html(),timeUsed:$('.works-time option:selected').html(),cost:$('.works-price').val(),tags:$('.tips-selected').html(),descriptions:$('.works-content').val(),cosmetics:str,cover:$('#form0-addworks .box:eq(0)').children('img').attr('src'),contentPhoto:imgContentPhoto};
			//拿到所有信息发送给后台，添加化妆师信息
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/dresser/addWork/V1.4.0',
				type : 'POST',
				dataType : 'json',
				data: requestData,
				success : function(data){
					if(data.code == 0){
						$('.tm-zpgl tr:gt(0)').remove();
						$('.add-works').hide();
						$('.ckxq').show();
						getDresserWorkFn($('.add-works-btm').attr('dresserId'));
					};
					
					if(data.code == 1){
						alert(data.data.error);	
					}
				},
			});	
		}
	});
	
/*----------------------------------------------------------添加化妆师作品结束----------------------------------------------------------*/


/*----------------------------------------------------------编辑化妆师履历开始----------------------------------------------------------*/
	$('.editResume-works-btm').click(function(e) {
		//获取化妆师履历
        $.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/dresser/getDresserResumeDetail/1.5.0',{dresserId:$('.ckxq-box .cb-left').attr('dresserid')},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				$('.editResume-dresser').attr('dresserid',$('.ckxq-box .cb-left').attr('dresserid'));
				$('.ckxq-box').hide();
				$('.editResume-dresser').show();
				$('.editResume-dresser .ed-resume-content').val(data.data.profile);//化妆师简介
				//擅长领域
				var specials = data.data.specials.split('、');
				$('.editResume-dresser .goodField.one').val(specials[0]);
				$('.editResume-dresser .goodField.two').val(specials[1]);
				$('.editResume-dresser .goodField.three').val(specials[2]);
				$('.editResume-dresser #img-mine-img').attr('src',data.data.portrait);//个人写真
				$('.editResume-dresser .ed-year').val(data.data.serviceYear);//从业年限
				//从业经历
				$('.businessExperience .be-step').remove();
				for(var x = 0; x < data.data.experience.length; x ++){
					$('.businessExperience').append('<div class="be-step"><span>'+(x+1)+'</span>.<textarea class="bs-content">'+data.data.experience[x].item+'</textarea></div>');
				}
				$('.editResume-dresser .cooperationArtists').val(data.data.coartist);//合作艺人
				$('.editResume-dresser').attr('dresserid',data.data.dresserId);
			}else{
				alert(data.data.error);	
			}
		});
		
		//获取系统默认擅长领域
		$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/dresser/getSysSpecial/1.5.0',{},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				$('.editResume-dresser .reference span').html(data.data.sysSpecial);
			}else{
				alert(data.data.error);	
			}
		});
    });
	
//点击增加条目，添加新的从业经历
	$('.editResume-dresser .ed-add').click(function(e) {
		$('.businessExperience').append('<div class="be-step"><span>'+parseInt(parseInt($(this).prev().children('.be-step').length) + 1)+'</span>.<textarea class="bs-content"></textarea></div>');
    });	
	
//监听个人简介输入字符的个数
	$('.ed-resume-content').keyup(function(e) {
        //判断输入的内容是否超过100
		$('.ed-num .current-num').html($.trim($(this).val()).length);
    });
	$('.ed-resume-content').keydown(function(e) {
        //判断输入的内容是否超过100
		$('.ed-num .current-num').html($.trim($(this).val()).length);
    });
	
	
//修改化妆师个人写真
	$('#file-mine-img').fileupload({
		dataType: 'json',
		done: function (e, data) {
			$('#img-mine-img').attr('src',data.result.data.url);
		}
	});
	
//点击化妆师履历里面的返回按钮
	$('.editResume-dresser .ed-return-btn').click(function(e) {
        $('.editResume-dresser').hide();
		$('.ckxq .ckxq-box').show();
    });
	
//获取化妆师个人履历
	function getExperienceFn(){
		var str = '';
		$('.businessExperience .be-step').each(function(index, element) {
            str += '{' + '"seq":' + $(this).children('span').html() +',"item":' + '"' + $(this).children('.bs-content').val() +'"},';
        });	
		str = str.substring(0,str.length -1);
		return str;
	}
	
//编辑个人简介
	$('.editResume-dresser .ed-save-btn').click(function(e) {
		var dresserResumeInfo = '{"dresserId":' 
		+ $('.editResume-dresser').attr('dresserid') 
		+',"profile":"' 
		+ $('.editResume-dresser .ed-resume-content').val() 
		+'","specials":"' 
		+ $('.goodField.one').val() 
		+ '、' + $('.goodField.two').val() 
		+'、' + $('.goodField.three').val() 
		+'","portrait":"' + $('#img-mine-img').attr('src') 
		+ '","experience":[' + getExperienceFn() + '],"coartist":"' 
		+ $('.editResume-dresser .cooperationArtists').val() 
		+'","serviceYear":' + $('.editResume-dresser .ed-year').val() +'}';
		var r = confirm('确定要保存？？');
		if(r == true){
			$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/dresser/updateDresserResume/1.5.0',{dresserResumeInfo:dresserResumeInfo},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					alert('保存成功！！');
					$('.ckxq .ckxq-box').show();
					$('.editResume-dresser').hide();
				}else{
					alert(data.data.error);	
				}
			});
		};
    });		
	
//点击保存化妆师商圈 
	$('.busi-circle .bc-save').click(function(e) {
		var bizStr = '{"cityId":'+$('.busi-circle').attr('cityid')+',"areas":[' + getAreasFn() + ']}'
		var r = confirm('确定要保存？？');
		if(r == true){
			$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/dresser/saveDresserBizAreas/1.5.0',{dresserId:$('.busi-circle').attr('dresserid'),bizAreas:bizStr,cityId:1},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					alert('保存成功！！');
					$('.busi-circle').hide();
					$('.ckxq').show();
					$('.ckxq .ckxq-box').show();
				}else{
					alert(data.data.error);	
				}	
			});
		}
    });
	
//点击返回化妆师商圈
	$('.busi-circle .bc-return').click(function(e) {
		$('.busi-circle').hide();
		$('.ckxq').show();
		$('.ckxq .ckxq-box').show();
    });
/*----------------------------------------------------------编辑化妆师履历结束----------------------------------------------------------*/


/*----------------------------------------------------------管理化妆师商圈开始----------------------------------------------------------*/
	
	//选取或者是取消选择商圈
	$('#biz_area>div>input').live('click',function(e) {
		//只要修改选择过的商圈，那么全选按钮被取消
		$('.select_all_item').removeAttr('checked');
		var ok = $(this);
		for(var x = 0; x < $('.selectBiz tbody tr').length; x ++){
			if($('.selectBiz tbody tr:eq('+x+')').children('td:eq(0)').html() == $('#district option:selected').html()){
				$('#biz_area div').each(function(index, element) {
					var strArr = '';	
					if($('.selectBiz tbody tr:eq('+x+')').children('td:eq(1)').html() != ''){
						strArr = $('.selectBiz tbody tr:eq('+x+')').children('td:eq(1)').html().split(',');	
					}else{
						strArr = [];	
					}
					var str = '';
                    if(typeof(ok.attr('checked')) != "undefined"){
						//添加或删除文本
						if($.isArray($(this).children('label').html(),strArr) > -1){
							strArr.push(ok.next().html());
							for(var j = 0; j < strArr.length;j ++){
								str += strArr[j] + ',';
							}
						}
					}else{
						for(var y = 0; y < strArr.length; y++){
							if(ok.next().html() == strArr[y]){
								 	
							}else{
								str += strArr[y] +',';	
							}
						}	
					}
					str = str.substring(0,str.length -1);
					$('.selectBiz tbody tr:eq('+x+')').children('td:eq(1)').html(str);
					return false;
                });
			}
		}
    });
	
//页面加载生成全选按钮
	$('.select_all_item').unbind();
	$('.select_all_item').live('click',function(e) {
		var ok = $(this);
		//判断是否选中全选按钮
		if(typeof($(this).attr('checked')) == "undefined"){
			ok.removeAttr('checked');			
			var str = '';
			for(var x = 0; x < $('.selectBiz tbody tr').length; x ++){
				if($('.selectBiz tbody tr:eq('+x+')').children('td:eq(0)').html() == $('#district option:selected').html()){
					ok.parent().children('div').each(function(index, element) {
						str += $(this).children('label').html() +',';
						$(this).children('input').removeAttr('checked');
					});
					$('.selectBiz tbody tr:eq('+x+')').children('td:eq(1)').html('')
				}
			}
		}else{//没选中则清空所有选项
			ok.attr('checked','checked');
			var str = '';
			for(var x = 0; x < $('.selectBiz tbody tr').length; x ++){
				if($('.selectBiz tbody tr:eq('+x+')').children('td:eq(0)').html() == $('#district option:selected').html()){
					ok.parent().children('div').each(function(index, element) {
						str += $(this).children('label').html() +',';
						$(this).children('input').attr('checked','checked');
					});
					$('.selectBiz tbody tr:eq('+x+')').children('td:eq(1)').html(str.substring(0,str.length -1))
				}
			}
		}
    });
/*----------------------------------------------------------管理化妆师商圈结束----------------------------------------------------------*/
	
//获取对应城区的商圈个数
function getBizAreaFn(biz){
	var str = '';
	if(biz.length != 0){
		for(var x = 0; x < biz.length; x ++){
			str += biz[x] + ',';	
		}
		str = str.substring(0,str.length -1);
	}
	return str;
}	
	
//获取已选择的城区
function getAreasFn(){
	var str = '';
	for(var x = 1; x < $('.selectBiz tbody tr').length; x ++){
		if($('.selectBiz tbody tr:eq('+x+')').children('td:eq(1)').html() != ''){
			str += '{"areaId":' + $('.selectBiz tbody tr:eq('+x+')').attr('areaid') +',"bizAreas":[' + getBizAreasFn($('.selectBiz tbody tr:eq('+x+')').children('td:eq(1)').html()) + ']},'
		}
	}
	str = str.substring(0,str.length -1);
	return str;
}

//获取已选择的商圈
function getBizAreasFn(arr){
	var arr = arr.split(',');
	var str = '';
	for(var x = 0; x < arr.length; x ++){
		str += '"' + arr[x] +'",'	
	}
	str = str.substring(0,str.length -1);
	return str;
}
	
/*-------------------------------------------------添加化妆师开始-------------------------------------------------------------*/
//上传头像
	$("#file0-touxiang").change(function(){
		var objUrl = getObjectURL(this.files[0]) ;
		console.log("objUrl = "+objUrl) ;
		if (objUrl) {
			$("#img0-touxiang").attr("src", objUrl) ;
		}
	}) ;
	
//上传证件照正面
	$("#file0-qian").change(function(){
		var objUrl = getObjectURL(this.files[0]) ;
		console.log("objUrl = "+objUrl) ;
		if (objUrl) {
			$("#img0-qian").attr("src", objUrl) ;
		}
	}) ;
	
//上传证件照反面
	$("#file0-hou").change(function(){
		var objUrl = getObjectURL(this.files[0]) ;
		console.log("objUrl = "+objUrl) ;
		if (objUrl) {
			$("#img0-hou").attr("src", objUrl) ;
		}
	}) ;
	
//建立一個可存取到該file的url
	function getObjectURL(file) {
		var url = null ; 
		if (window.createObjectURL!=undefined) { // basic
			url = window.createObjectURL(file) ;
		} else if (window.URL!=undefined) { // mozilla(firefox)
			url = window.URL.createObjectURL(file) ;
		} else if (window.webkitURL!=undefined) { // webkit or chrome
			url = window.webkitURL.createObjectURL(file) ;
		}
		return url ;
	}
	
	//上传头像
	$('#file0-touxiang').fileupload({
		dataType: 'json',
		done: function (e, data) {
			$('#img0-touxiang').attr('src',data.result.data.url);
		}
	});
	
	//上传身份证正面
	$('#file0-qian').fileupload({
		dataType: 'json',
		done: function (e, data) {
			$('#img0-qian').attr('src',data.result.data.url);
		}
	});
	
	//上传身份证背面
	$('#file0-hou').fileupload({
		dataType: 'json',
		done: function (e, data) {
			$('#img0-hou').attr('src',data.result.data.url);
		}
	});
	
	//点击对应的化妆品品类来添加不同的品牌
	$('.add-dresser ul>li .hzp-title').click(function(e) {
		$(this).next().slideDown();
	});
	
	//点击“添加化妆师”弹出添加化妆师页面
	$('.add-dressers-btn').live('click',function(e) {
        $('.add-dresser').show();
		$('.hzsxqq').hide();
		
		//获取省的列表
		$.ajax({
			url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/dresser/getCitys',
			type : 'get',
			dataType : 'json',
			data: {},
			success : function(data){
				for(var x = 0; x <data.data.length; x ++){
					$('#dresser-province').append('<option cityId = "'+data.data[x].cityId+'">'+data.data[x].cityName+'</option>');
				}
			},
		});	
				
		//添加化妆师--城市级联
		$('#dresser-province').change(function(){
			//获取省对应城市的列表
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/dresser/getCountys',
				type : 'get',
				dataType : 'json',
				data: {cityId:$('#dresser-province option:selected').attr('cityId')},
				success : function(data){
					$('.dresser-city option:gt(0)').remove();
					for(var x = 0; x <data.data.length; x ++){
						$('.dresser-city').append('<option areaId="'+data.data[x].countyId+'">'+data.data[x].countyName+'</option>');
					}
				},
			});	
		});	
			
		//获取化妆品品类列表
		$.ajax({
			url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/dresser/listCosmeticsClass',
			type : 'get',
			dataType : 'json',
			data: {},
			success : function(data){
				//移除每次编辑时请求的数据
				$('.add-works .cosmetics-class li').remove();
				for(var x = 0; x <data.data.length; x ++){
					$('.cosmetics-class').append('<li><div class="hzp-title" cosmeticsClass="'+data.data[x]+'">'+data.data[x]+'<span class="fdy"></span></div><div class="hzp-box"></div></li>');
				}
			},
		});
		
		//添加化妆师化妆时所用化妆品品类
		$('.cosmetics-class li .hzp-title').live('click',function(e) {
			var brand = $(this);
			//获取化妆品品牌列表
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/dresser/listCosmeticsBrand',
				type : 'post',
				dataType : 'json',
				data: {cosmeticsClass:$(this).attr('cosmeticsClass')},
				success : function(data){
					$('.cosmetics-class li .hzp-box').children().remove();
					for(var x = 0; x <data.data.length; x ++){
						brand.next().append('<p style=" padding:5px 0; background:#ddd;">'+data.data[x].country+'</p>'+getBrand(data.data[x].brand));
					}
					//添加上保存按钮
					brand.parent().children('.hzp-box').append('<input type="button" value="保存" class="save" />');
				},
			});
			$(this).next().slideDown();
		});
		
		
		//点击保存按获取化妆师所用化妆品名称
		$('.save').live('click',function(e) {
			 var text="";  
			 $(this).siblings("input[name=box]:checked").each(function() {  
				text += $(this).val()+",";  
			 });
			 var s = text.substring(0,text.length-1);
			 $(this).parent().parent().children('.hzp-title').children('.fdy').html('&nbsp;&nbsp;&nbsp;'+s);
			 $(this).parent().slideUp();
		});
	
		
		
		//获取品牌和国家
		function getBrand(brand){
			var str = '';
			for(var x = 0; x <brand.length; x ++){
				str += '<input name="box" value="'+brand[x]+'" type="checkbox" /><label for="">'+brand[x]+'</label><br /><br />';	
			}
			return str;
		}

   });
   
   
	//获取城市列表
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/common/getCitys',
		type : 'get',
		dataType : 'json',  
		success : function(data){
			for(var x = 0; x < data.data.length; x ++){
				$('.cn-city .mine-city').append('<option cityId='+data.data[x].cityId+'>'+data.data[x].cityName+'</option>');
			}
		}
	});
	
	//改变城市获取对应的地区列表
	$('.cn-city #province').change(function(){
		//获取地区列表
		$.ajax({
			url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/common/getCountys',
			type : 'get',
			data : ({cityId:$('.cn-city .mine-city option:selected').attr('cityId')}),
			dataType : 'json',  
			success : function(data){
				$('.city option:gt(0)').remove();
				$('.city option:eq(0)').html('请选择所在地区');
				for(var x = 0; x < data.data.length; x ++){
					$('.cn-city .mine-area').append('<option areaId="'+data.data[x].areaId+'">'+data.data[x].areaName+'</option>');
				}
			}
		});
	});


	//提交化妆师信息
	$('.dresser-btn').click(function(e) {
		var dd = '';
		var str = '';
		var tr = '';
		var pinleiPinpai= '';
		var re=new RegExp("(\\&nbsp;)","g");
		
		//获取品牌和品类
		$('.cosmetics-class>li .hzp-title .fdy').each(function(){
			if($(this).html() != ''){
				dd = '';
				//获取品牌
				tr = $(this).html().replace(re,"");
				var strs=tr.split(","); 
				console.log(strs);
				for (i=0;i<strs.length ;i++ ){
					dd+='"'+strs[i]+'",';	
				}
				var brand = dd.substring(0,dd.length-1);
				console.log('dd'+brand);
				//获取品类
				var pinlei ='"cosmeticsClass":"'+ $(this).parent().attr('cosmeticsclass')+'"';
				pinleiPinpai += '{'+pinlei + ',"cosmeticsBrand":['+brand+']},';
			};
		});
		str = '{"cosmeticsInfo":['+pinleiPinpai.substring(0,pinleiPinpai.length-1)+']}';
		console.log(str);
		
		//判断用户是否填写信息
		if($('.dresser-nickname').val() == ''){
			alert('请输入化妆师昵称!');	
		}else if($('.dresser-name').val() == ''){
			alert('请输入真实姓名!');	
		}else if($('.dresser-tel').val() == ''){
			alert('请填写电话号码!');	
		}else if($('#dresser-province option:selected').html() == '请选择省份'){
			alert('请选择所在省份!');
		}else if($('.dresser-city option:selected').html() == '请选择城市'){
			alert('请选择所在城市!');	
		}else if($('.dresser-id').val() == ''){
			alert('请填写身份证号!');	
		}else if($('#img0-touxiang').attr('src') == ''){
			alert('请选择头像！');
		}else if($('#img0-qian').attr('src') == ''){
			alert('请上传持身份证正面照！');
		}else if($('#img0-hou').attr('src') == ''){
			alert('请上传持身份证反面照！');
		}else if(pinleiPinpai.length == 0){
			alert('请选择至少一种使用的化妆品!');	
		}else{
			var requestData = {nickName:$('.dresser-nickname').val(),realName:$('.dresser-name').val(),sex:$('.add-dresser input[name="sex"]:checked').val(),city:$('#dresser-province option:selected').html(),county:$('.dresser-city option:selected').html(),phoneNum:$('.dresser-tel').val(),profile:$('#img0-touxiang').attr('src'),identificationCard:$('.dresser-id').val(),identificationUpside:$('#img0-qian').attr('src'),identificationDownside:$('#img0-hou').attr('src'),cosmeticsInfo:str,cityId:$('.add-dresser #dresser-province option:selected').attr('cityid'),areaId:$('.add-dresser .dresser-city option:selected').attr('areaid')};
			//拿到所有信息发送给后台，添加化妆师信息
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/dresser/addDresser/1.5.0',
				type : 'POST',
				dataType : 'json',
				data: requestData,
				success : function(data){
					if(data.code == 0){
						alert('成功添加化妆师');	
						window.location.reload();//刷新当前页面.
					}else{
						alert(data.data.error);	
					}
				},
			});	
		}
    });

/*---------------------------------------------------------------------添加化妆师结束-------------------------------------------------------------*/
	
	
	// 点击“化妆师管理”--》搜索按钮
	$('.hzsxqq .search-btn').click(loadDresserPage);
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
					renzheng.parent().parent().next().children('.jiav').children('.plusv-cancle').hide();
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
	
	
	//------------------------------化妆师查看按钮关联页面---------------------------
	//化妆师管理，查看
	$('.hzsxq tbody>tr td .look').live('click',function(e) {
		//移除每次编辑时请求的数据
		$('.add-works .cosmetics-class li').remove();
		
		$('.tm-zpgl tr:gt(0)').remove();
		var dresserId = $('.hzsxq tbody>tr:eq('+$(this).parent().parent().index()+') td:eq(0)').html();
		var dresserName = $('.hzsxq tbody>tr:eq('+$(this).parent().parent().index()+') td:eq(1)').html();
		//<!--  显示化妆师详细信息 -->
		$.ajax({
			url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/dresser/dresserDetail/1.5.0',
			type : 'get',
			dataType : 'json',
			data: {dresserId:dresserId},
			success : function(data){
				$('.ckxq-box').show();
				$('.ckxq').show().siblings().hide();
				$('.ckxq .add-works-btm').attr('dresserId',dresserId);
				$('.cb-left .ckxq-name .ct-name').val(data.data.nickName);
				$('.cb-left .ckxq-name .ct-tel').val(data.data.phoneNum);
				$('.cb-left .ckxq-name .ct-id').val(data.data.cardId);
				$('.ckxq-name .qian').attr('src',data.data.cardUpside);
				$('.ckxq-name .hou').attr('src',data.data.cardDownside);
				$('.ckxq-name .ct-true-name').val(data.data.realName);
				$('.ckxq-box .cb-left').attr('dresserId',data.data.dresserId);
				$('.ckxq-name .cityid').children('option').html(data.data.cityName);  //拿到城市
				//回显所在城市
				$('.cn-city .mine-city option').each(function(index, element) {
					if($(this).html() == data.data.cityName){
						$(this).attr('selected','selected');	
					};
				});
				
				var areaname = data.data.countyName;
				//回显所在城区
				$.ajax({
					url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/common/getCountys',
					type : 'get',
					data : ({cityId:$('.cn-city .mine-city option:selected').attr('cityId')}),
					dataType : 'json',  
					success : function(data){
						$('.city option:gt(0)').remove();
						for(var x = 0; x < data.data.length; x ++){
							if(areaname == data.data[x].areaName){
								$('.cn-city .mine-area').append('<option selected="selected" areaId="'+data.data[x].areaId+'" >'+data.data[x].areaName+'</option>');
							}else{
								$('.cn-city .mine-area').append('<option areaId="'+data.data[x].areaId+'">'+data.data[x].areaName+'</option>');
							}
						}
					}
				});
			},
		});


//<!--  显示"化妆师管理“--》”作品管理“ -->
		$('.tm-zpgl tr:gt(0)').remove();
		getDresserWorkFn(dresserId);
    });
	
//<!---  点击“化妆师管理”--》“查看”--》“详细信息”--》“保存”-->
	$('.city-btn').unbind('click');
	$('.city-btn').live('click',function(e) {
		var r = confirm('确认要修改？？');
		if(r == true){
			if(isPhoneNum($.trim($('.cb-left .ckxq-name .ct-tel').val()))){
				$.ajax({
					url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/dresser/updateDresser/1.5.0',
					type : 'post',
					dataType : 'json',
					data: {dresserId:$('.ckxq-box .cb-left').attr('dresserId'),nickName:$.trim($('.cb-left .ckxq-name .ct-name').val()),phoneNum:$.trim($('.cb-left .ckxq-name .ct-tel').val()),cardId:$.trim($('.cb-left .ckxq-name .ct-id').val()),cityId:$('.ckxq-name .mine-city').children('option:selected').attr('cityid'),areaId:$('.ckxq-name .city').children('option:selected').attr('areaid'),realName:$.trim($('.ckxq-name .ct-true-name').val()),cardUpside:$('.ckxq-name .qian').attr('src'),cardDownside:$('.ckxq-name .hou').attr('src')},
					success : function(data){
						if(data.code == 0){
							alert('修改成功!!');
							$('.ckxq').hide();
							$('#dresser_manage').show();
							loadDresserPage();
						};
						
						if(data.code == 1){
							alert(data.data.error);	
						}
					}
				});
			}else{
				alert('请输入正确的手机号！');
			}
		}
	});
	
//点击“返回”按钮，返回到化妆师管理首页面
	$('.ckxq-box .return-works-btm').click(function(e) {
        $('.ckxq-box').hide();
		$('.hzsxqq').show();
    });	
	
//点击化妆师身份证正面
	$('.ckxq-box .qian').click(function(e) {
        $('#ckxq_file_add_img_qian').click();
    });	
	
//身份证正面照上传	
	$('#ckxq_file_add_img_qian').fileupload({
		dataType: 'json',
		done: function (e, data) {
			$('.ckxq-box .qian').attr('src',data.result.data.url);
		}
	});
	
//点击化妆师身份证反面
	$('.ckxq-box .hou').click(function(e) {
        $('#ckxq_file_add_img_hou').click();
    });	
	
//身份证反面照上传	
	$('#ckxq_file_add_img_hou').fileupload({
		dataType: 'json',
		done: function (e, data) {
			$('.ckxq-box .hou').attr('src',data.result.data.url);
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
					};
					if(data.code == 1){
						alert(data.data.error);
					};
				}
			});
		}
	});
});

//<!--  显示"化妆师管理“--》”作品管理“ -->
function getDresserWorkFn(dresserId){
	$('.tm-zpgl tr:gt(0)').remove();
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
						data: {dresserId:dresserId,page:p},
						success : function(data){
							$('.tm-zpgl tr:gt(0)').remove();
							for(var x = 0; x < data.data.pageData.length ; x ++){
								var contentImgTag = '<td class="left">';
								for(var imgIndex = 0; imgIndex < data.data.pageData[x].workContentPhotos.length; imgIndex++){
									contentImgTag +=  '<img width="25px" src="' + data.data.pageData[x].workContentPhotos[imgIndex].photoPath+'"/>&nbsp;';
								}
								contentImgTag += '</td>';
								$('.tm-zpgl').append('<tr><td>'+data.data.pageData[x].workId+'</td><td>'+data.data.pageData[x].publishTime+'</td>'+contentImgTag+'</td><td>'+data.data.pageData[x].workType+'</td><td>'+data.data.pageData[x].cost+'</td></td><td><input type="button" value="删除" class="del-btn" /></td></tr>');
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
				$('.tm-zpgl').append('<tr><td>'+data.data.pageData[x].workId+'</td><td>'+data.data.pageData[x].publishTime+'</td>'+contentImgTag+'</td><td>'+data.data.pageData[x].workType+'</td><td>'+data.data.pageData[x].cost+'</td><td>'+data.data.pageData[x].desc+'</td><td><input type="button" value="删除" class="del-btn" /></td></tr>');
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
	
//<!---  点击“化妆师管理”--》“查看”--》“详细信息”--》“保存”-->
	/*$('.city-btn').unbind('click');
	$('.city-btn').live('click',function(e) {
		var r = confirm('确认要修改？？');
		if(r == true){
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/dresser/updateDresser/1.5.0',
				type : 'post',
				dataType : 'json',
				data: {dresserId:$('.ckxq-box .cb-left').attr('dresserId'),nickName:$('.cb-left .ckxq-name .ct-name').val(),phoneNum:$('.cb-left .ckxq-name .ct-tel').val(),cardId:$('.cb-left .ckxq-name .ct-id').val(),cityId:$('.ckxq-name .mine-city').children('option:selected').attr('cityid'),areaId:$('.ckxq-name .city').children('option:selected').attr('areaid'),realName:$('.ckxq-name .ct-true-name').val(),cardUpside:$('.ckxq-name .qian').attr('src'),cardDownside:$('.ckxq-name .hou').attr('src')},
				success : function(data){
					if(data.code == 0){
						alert('修改成功!!');
						loadDresserPage();
					};
					
					if(data.code == 1){
						alert(data.data.error);	
					}
				}
			});
		}
	});*/


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
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/dresser/listDressers/1.5.0',
				type : 'get',
				dataType : 'json',
				data: params,
				success : initDresserPage
			});
			
			
		}
	});
}

//初始化化妆师列表页面
function initDresserPage(data){
	for(var x = 0; x < data.data.pageData.length ; x ++){
		$('.hzsxq').append('<tr><td dresserId='+data.data.pageData[x].dresserId+'>'+data.data.pageData[x].dresserId+'</td><td>'+data.data.pageData[x].nickName+'</td><td>'+data.data.pageData[x].realName+'</td><td>'+data.data.pageData[x].phoneNum+'</td><td>'+data.data.pageData[x].cardId+'</td><td>'+data.data.pageData[x].city+'</td><td>'+data.data.pageData[x].county+'</td><td><div class=\'double-btn\'><input  type="button" value="认证" class="renzheng" style="display:none;" /><input type="button" value="取消" class="cancle"  /></div></td><td><div class=\'jiav\'><input type="button" value="加V" class="plusv" /><input type="button" value="取消" class="plusv-cancle" /></div></td><td><input type="button" value="编辑" class="look "dresserId='+data.data.pageData[x].dresserId+' /></td></tr>');
		//判断化妆师是否已通过认证，0未通过，1已通过
		if(data.data.pageData[x].isCert == 0){
			$('.hzsxq tbody>tr:eq('+(x+1)+') td:eq(7) .double-btn>.renzheng').show();
			$('.hzsxq tbody>tr:eq('+(x+1)+') td:eq(7) .double-btn>.cancle').hide();
			$('.hzsxq tbody>tr:eq('+(x+1)+') td:eq(8) .jiav>.plusv-cancle').hide();
			$('.hzsxq tbody>tr:eq('+(x+1)+') td:eq(8) .jiav>.plusv').hide();
		}else{
			$('.hzsxq tbody>tr:eq('+(x+1)+') td:eq(7) .double-btn>.renzheng').hide();
			$('.hzsxq tbody>tr:eq('+(x+1)+') td:eq(7) .double-btn>.cancle').show();

			//判断化妆师是否加V化妆师，0未加V，1已加V
			if(data.data.pageData[x].isVDresser == 1){
				$('.hzsxq tbody>tr:eq('+(x+1)+') td:eq(8) .jiav>.plusv-cancle').show();
				$('.hzsxq tbody>tr:eq('+(x+1)+') td:eq(8) .jiav>.plusv').hide();
			}else{
				$('.hzsxq tbody>tr:eq('+(x+1)+') td:eq(8) .jiav>.plusv-cancle').hide();
				$('.hzsxq tbody>tr:eq('+(x+1)+') td:eq(8) .jiav>.plusv').show();
			}
		}
	}
}

//化妆师管理参数
function getDresserSearchParams(){
	var params = new Object();
	params.page = 1;
	params.isCert = $('.hzsxqq .on-select option:selected').attr('value');
	params.nickName = $('.hzsxqq .search').val();
	params.realName = $('.hzsxqq .search_realname').val();
	return params;
}
//化妆师管理加载页面
function  loadDresserPage(){
	$('.hzsxq tr:gt(0)').remove(); //清除原来的表格信息
	var params = getDresserSearchParams();
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/dresser/listDressers/1.5.0',
		type : 'get',
		dataType : 'json',
		data: params,
		success : function(data){
			createDresserPage(data);
			initDresserPage(data);
		},
	});
}

	
//拿到每一个化妆师已选择过得品类	
function panCos(dataCosBrands,dataBrand){
	$('.cosmetics-class>li .hzp-title').each(function() {
		console.log($(this).attr('cosmeticsClass'));
		if($(this).attr('cosmeticsClass') == dataCosBrands){
			$(this).children('.fdy').html(dataBrand);
		};
	});
	return true;
}		
