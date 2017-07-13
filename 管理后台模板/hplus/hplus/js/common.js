/**
 * Created by apple on 16/10/20.
 */


var host = window.location.host;
//var basePath = "https://10.0.131.63/cas/"
var basePath = "https://"+ host +"/cas/";
var basePath = "https://localhost:8443/cas/";
var basePath = "https://www.smartscity.com/cas/";

function isNull(obj){
    if(obj == undefined || obj == "undefined" || obj == null || obj == '' || obj=="null")
        return true;
    return false;
}

Date.prototype.format =function(format)
{
    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(),    //day
        "h+" : this.getHours(),   //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
        "S" : this.getMilliseconds() //millisecond
    }
    if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
        (this.getFullYear()+"").substr(4- RegExp.$1.length));
    for(var k in o)if(new RegExp("("+ k +")").test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length==1? o[k] :
                ("00"+ o[k]).substr((""+ o[k]).length));
    return format;
}
