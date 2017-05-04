$(function(){
	//获取弹框高度与窗体同高
	$('.window_alert').height($(window).height());
	//删除地址
	$('.list-li .btn').unbind();
	$('.list-li .btn').live('click',function(){
		var ok = $(this);
        $.post('<%= CLI_HOST_API_URL %>/nggirl/app/cli/address/deleteAddress/1.5.0',getFinalRequestObject({accessToken: getAccessToken(),id:$(this).parent().attr('areaid')}),function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				var r = confirm('确定要删除？？');
				if(r == true){
					alert('删除成功!');
					ok.parent().remove();
					//判断是否有还有地址
					if($('.list-ul li').length > 0){
						$('.no').hide();	
					}else{
						$('.no').show();	
					}
				}
			}else{
				alert(data.data.error);	
			}	
		});
    });
	
	//编辑地址
	$('.con-right').live('click',function(e) {
		var con = $(this).parent();
        window.location.href = "addressEdit.html?address="+ con.attr('address') +'&detail=' + con.attr('detail') +'&cityid=' +con.attr('cityid') +'&bizname='+con.attr('bizName') +'&areaName='+con.attr('areaName')+'&areaid='+con.attr('areaid')+'&id='+con.attr('id')+'&cityname='+con.attr('cityname') +'&flag=ser'+'&provinceName='+ con.attr('provinceName')+'&provinceId='+con.attr('provinceId')+'&cityId='+con.attr('cityId')+'&cityCode='+con.attr('cityCode')+'&v=<%= VERSION %>';
    });
	
	//获取用户地址列表
	$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/address/getAddressList/2.5.0',getFinalRequestObject({accessToken: getAccessToken()}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			//判断是否有常用地址
			if(data.data.length == 0){
				$('.no').show();	
			}else{
				for(var x = 0; x < data.data.length; x ++){
					$('.list-ul').append('<li cityCode="'+data.data[x].cityCode+'" provinceId="'+data.data[x].provinceId+'" provinceName="'+data.data[x].provinceName+'" areaIdd="'+data.data[x].areaId+'" cityname="'+data.data[x].cityName+'" address="'+data.data[x].address+'" detail="'+data.data[x].detail+'" cityid="'+data.data[x].cityId+'" bizName="'+data.data[x].bizName+'" areaName="'+data.data[x].areaName+'" areaid = "'+data.data[x].id+'" id="li" class="list-li"><img src="images/address-circle.png" class="con-circle-img" /><img src="images/address-get.png" class="con-get-img" /><div class="con">'+data.data[x].cityName+data.data[x].areaName+data.data[x].bizName+data.data[x].address+data.data[x].detail+'</div><div class="btn">删除</div><div class="con-right"><img src="images/edit.png" alt="" /><p>编辑</p></div></li>');	
				}
			}
			
			//当页面加载的时候判断从上一个页面是否带过来之前选择过的服务地址
			var serAddressId = getParam('addressId').split(',');
			if(getParam('addressId') != ''){//有数据
				for(var x= 0; x < serAddressId.length; x ++){
					serIdFn(serAddressId[x]);	
				}
			}
		};
		if(data.code == 1){
			alert(data.data.error);
		};
	});
	
	//点击”新建地址“按钮
	$('.btn-ok').click(function(e) {
        window.location.href="addressAdd.html?flag=ser&v=<%= VERSION %>";
    });
	
	//勾选服务地址
	$('.list-ul').delegate("li .con","click",function(e) {
		//存储选中的商圈名
		var str ='';
		var addressId='';
		var cityId='';
		var areaId='';
		var reservationAddress = '';
		//判断用户选择的服务地址是否在所选作品的地区
		if($(this).parent().attr('cityid') == localStorage.getItem('cityId')){
			//判断是否勾地址
			if(typeof($(this).prev().prev('.con-circle-img').attr('checked')) == "undefined"){//未勾选
				$(this).prev('.con-get-img').show();
				$(this).parent().siblings().children('.con-get-img').hide();
				$(this).parent().siblings().children('.con-circle-img').removeAttr('checked');
				$(this).prev().prev('.con-circle-img').attr('checked','checked');
				for(var x =0; x < $('.list-ul li').length; x ++){
					//查找被选中的标记
					if(typeof($('.list-ul li:eq('+x+')').children('.con-circle-img').attr('checked')) != "undefined"){
						str = $('.list-ul li:eq('+x+')').attr('bizname');//拿到选中的商圈
						addressId = $('.list-ul li:eq('+x+')').attr('areaid');//拿到选中的商圈id
						cityId = $('.list-ul li:eq('+x+')').attr('cityid');//拿到选中的商圈的城市编号
						areaId = $('.list-ul li:eq('+x+')').attr('areaidd');//拿到选中的商圈的地区编号
						reservationAddress = $('.list-ul li:eq('+x+')').attr('cityname')+$('.list-ul li:eq('+x+')').attr('areaname')+$('.list-ul li:eq('+x+')').attr('address')+$('.list-ul li:eq('+x+')').attr('detail');//拿到预约地址
					}	
				}
			}
		}else{
			//$('.window_alert').fadeIn();
		}
		window.location.href = "wantOrder.html?dresserId="+getParam('dresserId')+'&selectedBizarea='+ $(this).parent().attr('bizname') +'&addressId='+ $(this).parent().attr('areaid') +'&cityId='+ $(this).parent().attr('cityid') +'&areaId='+ $(this).parent().attr('areaidd')+'&reservationAddress='+ $(this).html()+'&v=<%= VERSION %>';
    });
	$('.list-ul').delegate("li .con-circle-img","click",function(e) {
		//存储选中的商圈名
		var str ='';
		var addressId='';
		var cityId='';
		var areaId='';
		var reservationAddress = '';
		//判断用户选择的服务地址是否在所选作品的地区
		if($(this).parent().attr('cityid') == $(this).parent().attr('cityid')){
			//判断是否勾地址
			if(typeof($(this).attr('checked')) == "undefined"){//未勾选
				$(this).show();
				$(this).parent().siblings().children('.con-get-img').hide();
				$(this).parent().siblings().children('.con-circle-img').removeAttr('checked');
				$(this).attr('checked','checked');
				str = $(this).parent().attr('bizname');//拿到选中的商圈
				addressId = $(this).parent().attr('areaid');//拿到选中的商圈id
				cityId = $(this).parent().attr('cityid');//拿到选中的商圈的城市编号
				areaId = $(this).parent().attr('areaidd');//拿到选中的商圈的地区编号
				reservationAddress = $(this).parent().attr('cityname')+$(this).parent().attr('areaname')+$(this).parent().attr('address')+$(this).parent().attr('detail');//拿到预约地址
			}
		}else{
			//$('.window_alert').fadeIn();
		}
		window.location.href = "wantOrder.html?dresserId="+getParam('dresserId')+'&selectedBizarea='+ $(this).parent().attr('bizname') +'&addressId='+ $(this).parent().attr('areaid') +'&cityId='+ $(this).parent().attr('cityid') +'&areaId='+ $(this).parent().attr('areaidd')+'&reservationAddress='+ $(this).next().next().html()+'&v=<%= VERSION %>';		
    });
	
	//关闭弹框
	$('.window_alert,.ab_ok').click(function(e) {
        $('.window_alert').fadeOut();
    });
});

//拿到商圈id回选
function serIdFn(num){
	for(var x = 0; x< $('.list-ul li').length; x ++){
		if($('.list-ul li:eq('+x+')').attr('areaid') == num){
			$('.list-ul li:eq('+x+')').children('.con-circle-img').attr('checked','checked');
			$('.list-ul li:eq('+x+')').children('.con-get-img').show();
		}
	}
}

//滑动
window.addEventListener('load',function(){
	var initX;
	var moveX;
	var X = 0;
	var objX = 0;
	var li = document.getElementById('li');
	window.addEventListener('touchstart',function(event){
		//event.preventDefault();
		var obj = event.target.parentNode;
		if(obj.className == "list-li"){
			initX = event.targetTouches[0].pageX;
			objX =(obj.style.WebkitTransform.replace(/translateX\(/g,"").replace(/px\)/g,""))*1;
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
						if(l>80){
							l=80;
							obj.style.WebkitTransform = "translateX(" + -l + "px)";
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
						var r = -80 + Math.abs(X);
						obj.style.WebkitTransform = "translateX(" + r + "px)";
						if(r>0){
							r=0;
							obj.style.WebkitTransform = "translateX(" + r + "px)";
						}
					}
					else {     //向左滑动
						obj.style.WebkitTransform = "translateX(" + -80 + "px)";
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
				obj.style.WebkitTransform = "translateX(" + -80 + "px)";
			}
		}
	 })
})