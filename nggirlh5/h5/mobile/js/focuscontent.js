$(function(){
	$('.telement').live('touchstart',function(){
		if($(this).attr('superlink') != null && $(this).attr('superlink') != ''){
			window.location.href = $(this).attr('superlink');
		}
	});
});