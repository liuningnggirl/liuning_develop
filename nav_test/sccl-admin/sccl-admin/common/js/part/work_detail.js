var testUrl = 'https://testcli.nggirl.com.cn';
$(function(){
// 点击“作品管理”--》搜索按钮
	$('.zpxqq .search-btn').click(loadWorkPage);

//点击“作品管理”--》全部取消按钮 
	$('.zpxqq .cancle-btn').click(function(e) {
        $('.zpxqq .search').val('');
		$('.zpxqq .on-yuan-price-one').val('');
		$('.zpxqq .on-yuan-price-two').val('');
		$('.zpxqq .on-sale-price-one').val('');
		$('.zpxqq .on-sale-price-two').val('');
		$('.zpxqq .qian').val('');
		$('.zpxqq .hou').val('');
		$('.zpxqq .search-workid').val('');
    });
	
//获取装束类型
	$.get(testUrl+'/nggirl-web/web/admin/common/getWorkTypes',function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			for(var x = 0; x < data.data.length; x ++){
				$('.zpxqq .on-type').append('<option value="'+data.data[x]+'">'+data.data[x]+'</option>');
			}
		};
		if(data.code == 1){
			alert(data.data.error);
		}
	});

//编辑作品
	$('.zpxqq .zpxq-edit').unbind('click');
	$('.zpxqq .zpxq-edit').live('click',editWork);
	
//删除作品
	$('.zpxq .del-btn').live('click',function(e) {
		var ok = $(this);
        $.post(testUrl+'/nggirl-web/web/admin/work/deleteWork',{workId:$(this).attr('workid')},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				var r = confirm('确定要删除？？');
				if(r == true){
					ok.parent().parent().remove();
				};
			};
			if(data.code == 1){
				alert(data.data.error);
			};
		});
    });
	
//点击“上线”按钮
	$('.zpxq-line .on-line').live('click',function(e) {
		var online = $(this);
        $.post(testUrl+'/nggirl-web/web/admin/work/audit/1.4.1',{auditType:$(this).attr('audittype'),workId:$(this).attr('workid')},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				var r = confirm('确定要上线？？');
				if(r == true){
					online.hide();
					online.next().show();
					online.parent().parent().prev().html('已通过审核');
				};
			};
			if(data.code == 1){
				alert(data.data.error);	
			}
		});
    });
//点击“下线”按钮
	$('.zpxq-line .down-line').live('click',function(e) {
		var downline = $(this);
        $.post(testUrl+'/nggirl-web/web/admin/work/audit/1.4.1',{auditType:$(this).attr('audittype'),workId:$(this).attr('workid')},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				var r = confirm('确定要下线？？');
				if(r == true){
					downline.hide();
					downline.prev().show();
					downline.parent().parent().prev().html('待审核');
				};
			};
			if(data.code == 1){
				alert(data.data.error);	
			}
		});
    });
	
	//点击图片放大
	$('.zpxq .left img').live('click',function(){
		var src=$(this).attr('src');
		$('body').append('<div class="gray-box" style=" width:100%; height:100%; position:fixed; top:0px; left:0px; background:rgba(0,0,0,.5);"></div><img src="'+src+'" style=" position:fixed; top:100px; z-index:999999; left:35%; max-width:500px;" class="gray-img" />');
	});
	
	$('.gray-box').live('click',function(e) {
		$('body .gray-box').remove();
		$('body .gray-img').remove();
	});
	
	//编辑作品
	function editWork(){
		//清空装束标签
		$('.add-works .works-tips').children().remove();
		
		//清空所有图片
		$('#form0-addworks').children('.box').remove();
		
		//清空化妆师注册时所选的化妆品品类
		$('.add-works .cosmetics-class li .hzp-title .fdy').remove();
		
		//清空装束类型
		$('.add-works .works-type option').remove();
		
		$('.published-work-btn').hide();
		$('.published-work-btn-update').show();
		$('.zpxqq').hide();
		$('.add-works').show();	
		var brandString = '';
		var brandFen = '';
		var workId = $(this).parent().parent().children('td:eq(0)').html();
		
		//获取装束类型
		$.ajax({
			url : testUrl+'/nggirl-web/web/admin/dresser/listWorkType',
			type : 'get',
			dataType : 'json',
			data: {},
			async: false,
			success : function(data){
				$('.add-works .works-tips').empty();
				for(var x = 0; x <data.data.length; x ++){
					$('.add-works .works-type').append('<option>'+data.data[x]+'</option>');
				}
			},
		});	
				
		//点击获取装束标签束标签
		$('.add-works-tips-select').unbind();
		$('.add-works-tips-select').click(function(e) {
			$('.add-works .works-tips').empty();
			var arr = $('.tips-selected').html().split(' ');
			console.log('arr'+arr);
			$.ajax({
				url : testUrl+'/nggirl-web/web/admin/dresser/listWorkTag',
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
		$('.save-tips').unbind();
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
			url : testUrl+'/nggirl-web/web/admin/dresser/listCosmeticsClass',
			type : 'get',
			dataType : 'json',
			data: {},
			success : function(data){
				//移除每次编辑时请求的数据
				$('.add-works .cosmetics-class li').remove();
				for(var x = 0; x <data.data.length; x ++){
					$('.add-works .cosmetics-class').append('<li><div class="hzp-title" cosmeticsClass="'+data.data[x]+'">'+data.data[x]+'<span class="fdy"></span></div><div class="hzp-box"></div></li>');
				}
				
				//化妆师注册时已选的化妆品
				$.ajax({
					url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/work/getWorkCosmeticsInfo',
					type : 'get',
					dataType : 'json',
					data: {workId:workId},
					success : function(data){
						//brandString = '';
						//获取所有化妆师选择化妆品品类对应的品牌
						for(var x = 0; x < data.data.length; x ++){
							brandString = '';
							for(var y = 0; y <data.data[x].dresserCosmBrands.length; y++){
								brandString += data.data[x].dresserCosmBrands[y].brand+' , ';
								brandFen += data.data[x].dresserCosmBrands[y].brand+',';
							}	
							panCos(data.data[x].cosmClass,'&nbsp;&nbsp;&nbsp;'+brandString.substring(0,brandString.length-1));
						}
						console.log('brandString--------------'+brandString);
					},
				});	
			},
		});
		
		
		//标签回显开始
		//图片
		console.log($(this).parent().parent().children('td:eq(4)').children('img').attr('src'));
		var imgLen = $(this).parent().parent().children('td:eq(4)').children('img');
		imgLen.each(function(){
			$('#form0-addworks').append('<span class="box"><img src="'+$(this).attr('src')+'" id="img0-addworks" /><div class="btn"></div></span>');
		});
		
		//装束类型
		var workstype = $(this).parent().parent().children('td:eq(6)').html();
		$('.works-type option').each(function() {
			if($(this).html() == workstype){
				$(this).remove();
			}
		});
		$('.works-type').append('<option selected="selected">'+workstype+'</option>');
		
		//化妆时间
		var timeused = $(this).attr('timeused');
		$('.works-time option').each(function() {
			if($(this).html() == timeused){
				$(this).remove();
			}
		});
		$('.works-time').append('<option selected="selected">'+$(this).attr('timeused')+'</option>');
		
		//费用
		$('.add-works .works-price').val($(this).parent().parent().children('td:eq(8)').html());
		
		//装束说明
		$('.add-works .works-content').val($(this).parent().parent().children('td:eq(7)').html());
		
		//装束标签
		$('.add-works .tips-selected').html($(this).attr('worktag'));
		
		//获取workId
		var workId= $(this).parent().parent().children('td:eq(0)').html();
		
		//获取作品名称
		$('.add-works .works-name').val($(this).parent().parent().children('td:eq(5)').html());
		
		//标签回显结束
		
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
		
		//上传化妆师作品图片
		$('#file0-add-works').fileupload({
			dataType: 'json',
			done: function (e, data) {
				if($('#form0-addworks .box').length > 3){
					alert('最多上传四张图片！！');
				}else{
					$('#form0-addworks').append('<span class="box"><img src="'+data.result.data.url+'" id="img0-addworks" /> <div class="btn"></div></span>');
				}
			}
		});
		
		//点击默认的图片上传图片
		$('#img0-addworks').unbind('click');
		$('#img0-addworks').click(function(e) {
			$('#file0-add-works').click();
		});
		
		//删除图片
		$('.box .btn').live('click',function(e) {
			$(this).parent().remove();
		});
		
		//更新化妆师作品
		$('.published-work-btn-update').unbind('click');
		$('.published-work-btn-update').click(function(e) {
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
			str = '['+pinleiPinpai.substring(0,pinleiPinpai.length-1)+']';
			console.log(str);
			
			//获取除了封面以外上传的其他图片地址
			var imgUrl = '';
			var imgContentPhoto = '';
			$('#form0-addworks>.box:gt(0)').each(function(){
				imgUrl += $(this).children('img').attr('src')+',';
			})
			//去掉最后一个逗号
			imgContentPhoto = imgUrl.substring(0,imgUrl.length-1);
			console.log(imgContentPhoto);
			
			//获取选中的妆束标签个数
			var tipsArr = $('.tips-selected').html().split(' ');
			console.log('tipsArr++++++++'+tipsArr);
			
			//判断填写项
			if($('#form0-addworks .box:eq(0)').children('img').attr('src') == ''){
				alert('请选择封面！');	
			}else if($.trim($('.works-name').val())== ''){
				alert('请填写妆束名称！');
			}else if($.trim($('.works-price').val())== ''){
				alert('请填写价格！');
			}else if($('.tips-selected').html() == ''){
				alert('请选择妆束标签！');
			}else if(tipsArr.length > 3){
				alert('选择的妆束标签不能超过3个！！');
			}else if($.trim($('.works-content').val())== ''){
				alert('请输入妆束说明！');	
			}else if($.trim($('.works-content').val()).length > 160){
				alert('妆束说明文字不得超过160个！！！');	
			}else if(pinleiPinpai.length == 0){
				alert('请输选择至少一种使用的化妆品！');	
			}else{
				$('.graybox').show();
				$('.loading').show();
				var requestData = {workId:workId,workName:$('.works-name').val(),workType:$('.works-type option:selected').html(),timeUsed:$('.works-time option:selected').html(),cost:$('.works-price').val(),tags:$('.tips-selected').html(),descriptions:$('.works-content').val(),cosmetics:str,cover:$('#form0-addworks .box:eq(0)').children('img').attr('src'),contentPhoto:imgContentPhoto};
				//拿到所有信息发送给后台，添加化妆师信息
				$.ajax({
					url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/work/updateWork/V1.4.0',
					type : 'POST',
					dataType : 'json',
					data: requestData,
					success : function(data){
						$('.graybox').hide();
						$('.loading').hide();
						if(data.code == 0){
							alert('更新成功!');
							$('.add-works').hide();
							loadWorkPage();
							$('.zpxqq').show();
						};
						if(data.code == 1){
							alert(data.data.error);
						};
					},
				});	
			}
		});
	}
	
});

	
//获取装束标签名称
function workTagFn(tags){
	$('.tips-selected').html('');
	var strsub = '';
	var str = '';
	for(var x =0; x < tags.length && x < 3; x ++){
		str = str+ tags[x].tag + ' ';
	}
	strsub = str.substring(0,str.length -1);
	return strsub;
}

//创建作品列表分页
function createWorkPage(data){
	$(".zpxqq .tcdPageCode").createPage({
		pageCount:parseInt(data.data.totalPageNum),
		current:parseInt(data.data.currnetPageNum),
		backFn:function(p){
			var params = getWorkSearchParams();
			params.page = p;
			$('.zpxq>tbody>tr:gt(0)').remove(); //清除原来的表格信息
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/work/listWorks/V1.4.1',
				type : 'post',
				dataType : 'json',
				data: params,
				success : initWorkPage
			});			
		}
	});
}

//初始化作品分页
function initWorkPage(data){
	createWorkPage(data);
	for(var x = 0; x < data.data.pageData.length ; x ++){
		var contentImgTag = '<td class="left"><img width="25px" src="'+data.data.pageData[x].cover+'" />&nbsp;';
		for(var imgIndex = 0; imgIndex < data.data.pageData[x].workContentPhotos.length; imgIndex++){
			contentImgTag +=  '<img width="25px" src="' + data.data.pageData[x].workContentPhotos[imgIndex].photoPath+'"/>';
		}
		contentImgTag += '</td>';
		//判断是上线还是下线（0：下线）
		if(data.data.pageData[x].auditStatus == 0){
			//判断审核状态(0:为待审核)
			if(data.data.pageData[x].auditStatus == 0){
				$('.zpxq').append('<tr dresserId="'+data.data.pageData[x].dresserId+'"><td>'+data.data.pageData[x].workId+'</td><td>'+data.data.pageData[x].publishTime+'</td><td>'+data.data.pageData[x].dresserName+'</td><td>'+data.data.pageData[x].phoneNum+'</td>'+contentImgTag+'<td>'+data.data.pageData[x].workName+'</td><td>'+data.data.pageData[x].workType+'</td><td>'+data.data.pageData[x].desc+'</td><td>'+data.data.pageData[x].cost+'</td><td>'+data.data.pageData[x].discountName+'</td><td>'+data.data.pageData[x].discountedCost+'</td><td>待审核</td><td><div class="zpxq-line"><input value="上线" type="button" class="on-line"  workid="'+data.data.pageData[x].workId+'" auditType="1" /><input value="下线" type="button" class="down-line" style="display:none;"  workid="'+data.data.pageData[x].workId+'" auditType="0" /><br /><br /></div><input value="编辑" type="button" class="zpxq-edit" timeused="'+data.data.pageData[x].timeUsed+'" workTag="'+workTagFn(data.data.pageData[x].workTag)+'" /><br /><br /><input value="删除" type="button" class="del-btn" workid="'+data.data.pageData[x].workId+'" /></td></tr>');
			};
		};
		//(1:上线)
		if(data.data.pageData[x].auditStatus == 1){
			//判断审核状态(1:已通过审核)
			if(data.data.pageData[x].auditStatus == 1){
				$('.zpxq').append('<tr dresserId="'+data.data.pageData[x].dresserId+'"><td>'+data.data.pageData[x].workId+'</td><td>'+data.data.pageData[x].publishTime+'</td><td>'+data.data.pageData[x].dresserName+'</td><td>'+data.data.pageData[x].phoneNum+'</td>'+contentImgTag+'<td>'+data.data.pageData[x].workName+'</td><td>'+data.data.pageData[x].workType+'</td><td>'+data.data.pageData[x].desc+'</td><td>'+data.data.pageData[x].cost+'</td><td>'+data.data.pageData[x].discountName+'</td><td>'+data.data.pageData[x].discountedCost+'</td><td>已通过审核</td><td><div class="zpxq-line"><input value="上线" type="button" class="on-line" style=" display:none;" workid="'+data.data.pageData[x].workId+'" auditType="1" /><input value="下线" type="button" class="down-line" workid="'+data.data.pageData[x].workId+'" auditType="0" /><br /><br /></div><input value="编辑" type="button" class="zpxq-edit" timeused="'+data.data.pageData[x].timeUsed+'" workTag="'+workTagFn(data.data.pageData[x].workTag)+'" /><br /><br /><input value="删除" type="button" class="del-btn" workid="'+data.data.pageData[x].workId+'" /></td></tr>');
			};
		};
	}
}

//获取查询参数
function getWorkSearchParams(page){
	var params = new Object();
	if(page == undefined){
		page =1;
	}
	params.page = page;
	params.dresserName = $('.zpxqq .search').val();
    var re=new RegExp("[\\-,\\:, ]","g"); 
    if($('.zpxqq .qian').length > 0){
        var startPublishTime = $('.zpxqq .qian').val().replace(re, "");
        params.startPublishTime = startPublishTime;
    }
    if($('.zpxqq .hou').length > 0){
        var endPublishTime = $('.zpxqq .hou').val().replace(re, "");
        params.endPublishTime = endPublishTime;
    }
	params.startOrigionPrice = $('.zpxqq .on-yuan-price-one').val();
	params.endOrigionPrice = $('.zpxqq .on-yuan-price-two').val();
	params.startDiscountedPrice = $('.zpxqq .on-sale-price-one').val();
	params.endDiscountedPrice = $('.zpxqq .on-sale-price-two').val();
	params.endDiscountedPrice = $('.zpxqq .on-sale-price-two').val();
	params.workType = $('.zpxqq .on-type option:selected').attr('value');
	params.auditStatus = $('.zpxqq .on-check option:selected').attr('value');
	params.workId = $('.zpxqq .search-workid').val();
	return params;
}

//加载作品分页数据
function loadWorkPage(){
	$('.zpxq>tbody>tr:gt(0)').remove();
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/work/listWorks/V1.4.1',
		type : 'post',
		dataType : 'json',
		data: getWorkSearchParams(1),
		success : initWorkPage,
	});
}


