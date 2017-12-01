$(function(){
    var ua = navigator.userAgent;
    $('.content_box ul li').click(function(){
        var this_=$(this).children('.cb_li').children('.cb_arr');
        if(this_.hasClass('on')){
            this_.removeClass('on');
            this_.css({'transition':'-webkit-transform 200ms ease-out','webkitTransform':'rotate(0deg)'});
            this_.prev().addClass('hidden');
        }else{
            this_.addClass('on');
            this_.css({'transition':'-webkit-transform 200ms ease-out','webkitTransform':'rotate(180deg)'});
            this_.prev().removeClass('hidden');
        }
    });

    $('.cb_msg .ti_cash').click(function(event){
        alert();
        event.stopPropagation();
        var param = '{"type": "helpToCash","data":""}';
        if(ua.indexOf('iOS') >= 0){
            window.webkit.messageHandlers.jsCallbackMethod.postMessage(param);
        }
        if(ua.indexOf('android') >= 0){
            window.jsToJava.jsCallbackMethod(param);
        }
    })

    $('.cb_msg .call_phone').click(function(event){
        event.stopPropagation();
    })
});
