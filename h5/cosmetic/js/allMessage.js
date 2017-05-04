// JavaScript Document
$(function(){
	var pageSize = 10;
	getAllMessage(0,10);
	$(".allmessage").width($(window).width()-16);
	$(".allmessage").height($(window).height()-69);
});	
function getAllMessage(pageNum,pageSize){
$.ajax({//采用异步
	type: "get",
	url:'<%= UGC_HOST_API_URL %>/nggirl/app/cli/cosmetic/getLeaveMessageList/2.1.0',
	data:getFinalRequestObject({cosmeticId:1,pageNum:pageNum,pageSize:pageSize}),
	timeout:15000,//10s
	dataType:"json",
	success: function (data) {
		if(data.code == 0){
			var str = "";
			for(var i = 0;i <data.data.length;i++){
				str += '<div class="messages clearfix">';
				str += '<div class="userphoto" id="'+data.data[i].userId+'"><img src="'+data.data[i].profile+'"></div>';
				str += '<div class="username"><p>'+data.data[i].nickName+'</p><p>'+getLocalTime1(data.data[i].applyTime)+'</p></div>';
				str += '<p class="messagedetail">'+data.data[i].message+'</p></div>';	
			}
			$(".allmessage").append(str);	
			if( data.data.length == pageSize ){
				var tur = true;	
				$(".allmessage").scroll(function(){
					 var winH = $(".allmessage").height(); //页面可视区域高度  
					 var pageH = $(".messagesall").height();  
					 var scrollT = $(".allmessage").scrollTop(); //滚动条top
					 var aa = (pageH - winH - scrollT) / winH;  
					 if(tur && aa <0.02){
						 setTimeout(function(){
							 getMoreMessage();
						 },500);
						 tur = false;
					 } 
			
			   });
			}
		}else{
			alert(data.data.error);
			}
	},
	error: function (XMLHttpRequest, textStatus, errorThrown) {
		//console.log( XMLHttpRequest )
		//$(".main").html("尚未发布任何信息！");
	}
});
}
function getMoreMessage(){
	var pageSize = 10;
	var pageNum = $('body').data('pageNum');
	if(pageNum == undefined || parseInt(pageNum) == NaN){
		pageNum = 0;
	}
	pageNum = pageNum + 1;
	$('body').data('pageNum',pageNum);
	getAllMessage(pageNum,pageSize);
	}	
//留言时间格式化
function getLocalTime1(publishTime) {
    var d_minutes, d_hours, d_days;
    var timeNow = parseInt(new Date().getTime() / 1000);
    var d;
    d = timeNow - publishTime/1000;
    d_days = parseInt(d / 86400);
    d_hours = parseInt(d / 3600);
    d_minutes = parseInt(d / 60);
	var st = 0;
    st = new Date(publishTime);
    var sthours=parseInt(st.getHours());
	var nohours=parseInt(new Date().getHours());
    if (d_days <= 0 && d_hours >= 0 && nohours>=sthours) {
		var s = 0;
        s = new Date(publishTime);
        var hours=parseInt(s.getHours());
		if(hours<10){
			hours="0"+hours;
			}
		var minutes=parseInt(s.getMinutes());
		if(minutes<10){
			minutes="0"+minutes;
			}
        return (hours + ":" +  minutes) ;
    } else {
        var s = 0;
        s = new Date(publishTime);
		var m=parseInt(s.getMonth() + 1);
		if(m<10){
			m="0"+m;
			}
		var day=parseInt(s.getDate());
		if(day<10){
			day="0"+day;
			}
        return (s.getFullYear() + "-" + m) + "-" +day ;
    }
}
