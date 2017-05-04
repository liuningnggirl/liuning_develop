$(function(){
	//删除地址
	$('.list-li .btn').live('touchstart',function(e) {
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
	$('.con-right').live('touchstart', function (e) {
		var con = $(this).parent();
        window.location.href = "addressEdit.html?address="+ con.attr('address') +'&detail=' + con.attr('detail') +'&cityid=' +con.attr('cityid') +'&bizname='+con.attr('bizName') +'&areaName='+con.attr('areaName')+'&areaid='+con.attr('areaid')+'&id='+con.attr('id')+'&cityname='+con.attr('cityname')+'&flag=common'+'&provinceName='+ con.attr('provinceName')+'&provinceId='+con.attr('provinceId')+'&cityId='+con.attr('cityId')+'&cityCode='+con.attr('cityCode')+'&v=<%= VERSION %>';
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
					$('.list-ul').append('<li cityCode="'+data.data[x].cityCode+'" provinceId="'+data.data[x].provinceId+'" provinceName="'+data.data[x].provinceName+'" id="'+data.data[x].id+'" cityname="'+data.data[x].cityName+'" address="'+data.data[x].address+'" detail="'+data.data[x].detail+'" cityId="'+data.data[x].cityId+'" bizName="'+data.data[x].bizName+'" areaName="'+data.data[x].areaName+'" areaid = "'+data.data[x].id+'" class="list-li"><div class="con">'+data.data[x].cityName+data.data[x].bizName+data.data[x].address+data.data[x].detail+'</div><div class="btn">删除</div><div class="con-right"><img src="images/edit.png" alt="" /><p>编辑</p></div></li>');	
				}
			}
		};
		if(data.code == 1){
			alert(data.data.error);
		};
	});
	
	//点击”新建地址“按钮
	$('.btn-ok').click(function(e) {
        window.location.href="addressAdd.html?flag=common&v=<%= VERSION %>";
    });
	
	//点击常用地址页面上方的返回箭头，返回到个人资料页面
	$('.title-btn img').click(function(e) {
        window.location.href ="mine-message.html?v=<%= VERSION %>";
    });
});

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
