var getParam = urlParse();
var ua = navigator.userAgent;
$(function(){

})
function jsCallbackMethodResult(obj){
    var objEnd = '';
    if(ua.indexOf('iOS') >= 0){
        objEnd = obj.data;
    }else{
        objEnd = JSON.parse(obj.data);
    }
    if(obj.type == 'getRepayMessageFn'){
        for(x in objEnd){
            $('.content_box ul').append('<li>\n' +
                '            <span>'+objEnd[x].term+'</span>\n' +
                '            <span>'+objEnd[x].repayDate+'</span>\n' +
                '            <span>'+objEnd[x].repayMoney+'</span>\n' +
                '        </li>');
        }
    }
}