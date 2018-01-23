var ua = navigator.userAgent;
ua = JSON.parse(ua.substring(ua.lastIndexOf('/')+1));
//中转对象
var transferService = {
    //核心开户结果
    coreOpenAccount:function(value,message){
        this.toClient("coreOpenAccount",value,message);
    },
    //恒丰开户绑卡结果
    HFOpenAccountTieOnCard:function(value,message){
        this.toClient("HFOpenAccountTieOnCard",value,message);
    },
    //恒丰绑卡结果
    HFTieOnCard:function(value,message){
        this.toClient("HFTieOnCard",value,message);
    },
    //充值
    recharge:function(value,message){
        this.toClient("recharge",value,message);
    },
    //提现
    withdrawals:function(value,message){
        this.toClient("withdrawals",value,message);
    },
    //解绑银行卡
    unbundlingCard:function(value,message){
        this.toClient("unbundlingCard",value,message);
    },
    //重置交易密码
    resetPassword:function(value,message){
        this.toClient("resetPassword",value,message);
    },
    //调用客户端
    toClient:function(type,value,message){
        var param = {
            type:type,
            data:{
                resultCode:value,
                message:message
            }
        }
        if(ua.appType == 'android'){
            window.jsToJava.jsCallbackMethod(JSON.stringify(param));
        };
        if(ua.appType=='iOS'){
            window.webkit.messageHandlers.jsCallbackMethod.postMessage(param);
        }
    }
}

$(function(){
    var methodName = $('#type').val();
    var value = $('#resultCode').val();
    var message = $('#message').val();
    if(methodName){
        transferService[methodName](value,message);
        MobclickAgent.onPageBegin(methodName);
    }
})

