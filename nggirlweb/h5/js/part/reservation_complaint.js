$(function(){
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

//<!--  清空‘订单投诉’文本框内容 -->
	$('.tsxq .all-cancle').click(function(e) {
        $('.tsxq .search').val('');
    });
});

//订单投诉
function loadReservationComplaint(){
	var url = '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/reservationComplaint/listComplaints';
	loadData(url,1);
}

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