/*===评价详情====*/
$(function(){
	function getParam(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null)
			return decodeURI(r[2]);
		return '';
	}
	var pageSize = 20;
	$(function() {
		//加载第一页
		loadDressersthree(0,20);
	});
	 function loadDressersthree(pageNum,pageSize){
	 	var key = getParam('key');
		$.ajax({//采用异步
			type: "get",
			url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/getReservationEvaluate',
			data:getFinalRequestObject({accessToken: getAccessToken(), reservationId: getParam('reservationId')}),
			timeout:15000,//10s
			dataType:"json",
			success: initPagetwo,
		})
	 }

	function initPagetwo(data){
		console.log(data.data);
			var workData = data.data;
			var str = "";
		 	 str += '<div class="evaluate_main"><p>化妆师是否指定时间到达</p><p>'+ getstart(workData.onTimeEvaluation) +'</p></div><div class="evaluate_main"><p>化妆品品牌是否跟描述一致</p><p>'+ getstart(workData.sumEvaluation) +'</p></div><div class="evaluate_main"><p>化妆师技法是否娴熟</p><p>'+ getstart(workData.tecniqueEvaluation) +'</p></div><div class="evaluate_main"><p>服务态度</p><p>'+ getstart(workData.serviceEvaluation) +'</p></div><div class="evaluate_foot">'+workData.evaluation+'</div><div class="evaluate_btm">'+getphotos(workData)+'</div><div class="evaluate_time">'+ getLocalTime(workData.evaluationTime)+'</div>';
		 	 $(".evaluate_w").append(str);
		 	console.log(workData);
	 }

/*判断有几个星星*/
function getstart(star){
	var str = '';
	for(var i = 1;i <= star;i++){
		str =str + '<img src="images/xing.png"/>';
	};
	return str;
}

function getphotos(workData){
	str = '<ul>';
	for (var i = 0; i <workData.photos.length; i++) {
		str += '<li><img src="'+workData.photos[i]+'"></li>';
		console.log(workData.photos.length);
	};
	str += "</ul>";
	return str;
}
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