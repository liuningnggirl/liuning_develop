$(function(){
	//查看订单详情
	$('#shope_complaints_advisory_manage .shope_complaints_advisory_manage_table .order_details').live('click',function(e) {
        $('.shope_complaints_advisory_manage_order_details').show();
    });
	//订单详情弹框跟随滚动条滚动
	$(window).scroll(function(e) {
        $('.shope_complaints_advisory_manage_order_details').animate({'top':$(window).scrollTop()},1);
    });
	
	//关闭订单详情弹框
	$('.shope_complaints_advisory_manage_order_details .sure_btn').click(function(e) {
        $('.shope_complaints_advisory_manage_order_details').hide();
    });
});