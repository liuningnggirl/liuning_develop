$(function(){
	var sUserAgent=navigator.userAgent.toLowerCase();
	
	//搜索框获得焦点
	$('.search').focus();
	if(getParam('search') != ''){
		$('.search').val(getParam('search'));
		$('.sb_del').show();
	}
	
	//判断还剩几条历史记录，如果没有历史记录了那么你懂得
	if(localStorage.getItem('name') == undefined || localStorage.getItem('name')==''){
		$('.bc_history_search').hide();
	}else{
		$('.bc_history_search').show();
	}
	
	//获取热门搜索词
	$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/search/getPopularSearchWords/2.2.0',getFinalRequestObject({accessToken:getAccessToken()}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			//判断是否有热门搜索记录
			if(data.data.length > 0){
				for(var x = 0; x < data.data.length; x ++){
					//判断是否有right
					if(data.data[x].length == 1){
						$('.hot_list').append('<li><div class="hl_left">'+data.data[x][0]+'</div></li>');
					}else{
						$('.hot_list').append('<li><div class="hl_left">'+data.data[x][0]+'</div><div class="hl_right">'+data.data[x][1]+'</div></li>');
					}
				}
			}else{
				$('.bc_hot_search').hide();	
			}
		}else{
			alert(data.data.erro);	
		}
	});
	
	//获取历史搜索
	newArr = localStorage.name;
	if(localStorage.name !='' && localStorage.name != undefined && localStorage.name != null){
		newArr = newArr.substring(0,newArr.length -1);
		//判断机型
		if(sUserAgent.match(/iphone os/i) == "iphone os"){
			newArr = newArr.split(',').reverse();//数组逆排
		}else{
			newArr = sortFn(newArr.split(','));//数组逆排
		}
		for(var x = 0; x < newArr.length && x < 20; x ++){
			$('.history_list').append('<li><div>'+newArr[x]+'</div><img src="images/index_close.png" class="bhs_list_del" alt="" /></li>');	
		}
	}
	
	//判断如果搜索历史记录大于三条则显示查看更多按钮
	if($('.history_list li').length > 3){
		$('.bhs_look_more').show();	
	}else{
		$('.bhs_look_more').hide();	
	}
	
	//隐藏搜索历史记录大于三条
	$('.history_list li:gt(2)').hide();
	
	//点击查看更多搜索历史按钮
	$('.bhs_look_more').click(function(e) {
		//判断当前是展开还是收起
		if($(this).attr('status') == "no"){
			$('.history_list li:gt(2)').slideDown();
			$('.bhs_look_more p span').html('收起');
			$('.blm_arr').attr('src','images/index_search_arr_up.png');
			$(this).attr('status','ok');
		}else{
			$('.history_list li:gt(2)').slideUp();
			$('.bhs_look_more p span').html('查看更多搜索历史');
			$('.blm_arr').attr('src','images/index_search_arr_down.png');
			$(this).attr('status','no');
		}
    });
	
	//当文本框输入内容时显示叉号
	$('.search').keyup(function(e) {
        if($.trim($(this).val()) != ''){
			$('.sb_del').show();
		}else{
			$('.sb_del').hide();
		}
    });
	
	//点击叉号清空文本框内容
	$('.sb_del').click(function(e) {
        $('.search').val('');
		$('.search').focus();
    });
	
	//删除某条历史记录
	$('.bhs_list_del').live('click',function(e) {
		$(this).parent().remove();
		var delArr = '';
		for(var x = 0; x < newArr.length; x ++){
			if(newArr[x] != $(this).prev().html()){
				delArr += newArr[x]+',';
			}
		}
		//去掉最后一个字符
		if(delArr.length > 0){
			delArr = delArr.substring(0,delArr.length -1);
			//判断机型
			if(sUserAgent.match(/iphone os/i) == "iphone os"){
				delArr = delArr.split(',').reverse();//数组逆排
			}else{
				delArr = sortFn(delArr.split(','));//数组逆排
			}
			var endStr = '';
			for(var x = 0; x < delArr.length ; x ++){
				endStr += delArr[x]+',';
			}
			localStorage.name = endStr;
			
			newArr = endStr.substring(0,endStr.length -1);
			//判断机型
			if(sUserAgent.match(/iphone os/i) == "iphone os"){
				newArr = newArr.split(',').reverse();//数组逆排
			}else{
				newArr = sortFn(newArr.split(','));//数组逆排
			}
			$('.history_list li:lt(3)').show();
			$('.history_list li:gt(2)').hide();
			if($('.history_list li').length > 3){
				$('.bhs_look_more').show();
			}else{
				$('.bhs_look_more').hide();
			}
		}else{
			localStorage.name = '';
			$('.bc_history_search').hide();	
		}
    });
	
	//清空全部历史搜索记录
	$('.bhs_btn_del').click(function(e) {
        localStorage.removeItem("name");
		window.location.reload();
    });
	$('form.form1').on('submit', function(e){
		window.location.href = "indexSearchResult.html?search="+$(".search").val()+'&v=<%= VERSION %>';
		return false;
	});
	//点击历史搜索记录
   	$('.history_list').delegate("li div","click",function(){
		window.location.href = "indexSearchResult.html?search="+$(this).html()+'&v=<%= VERSION %>';
	});
	
	//点击热门搜索
	$('.hot_list').delegate("li .hl_left","click",function(){
		window.location.href = "indexSearchResult.html?search="+$(this).html()+'&v=<%= VERSION %>';
	});
	$('.hot_list').delegate("li .hl_right","click",function(){
		window.location.href = "indexSearchResult.html?search="+$(this).html()+'&v=<%= VERSION %>';
	});
	
	//点击左侧箭头返回首页
	$('.sb_left_arr').click(function(e) {
		window.location.href = "index.html?v=<%= VERSION %>";
    });
	
});

//逆向排序数组
function sortFn(arr){
	var strArr = [];
	for(var x = 0; x < arr.length; x ++){
		strArr.unshift(arr[x]);
	}	
	return strArr;
}
