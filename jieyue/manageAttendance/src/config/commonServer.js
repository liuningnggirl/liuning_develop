export default {
    install(Vue,options){
        Vue.mixin({
            data(){
                var SERVER_URL={
                    "dev":'http://172.18.100.97:8080/',
                    "test":'http://172.18.50.207:8080/',
                    'uat':"http://115.182.212.71:28083",
                    "prod":'/',
                };
                var runMode = "uat";
                return {
                    urlT:SERVER_URL[runMode],
                    
                }
            },
            methods:{
                userStatusFn(status){
                    var str = '';
                    if(status == 1){
                        str = '正常';
                    }else if(status == 2){
                        str = '休假';
                    }else if(status == 3){
                        str = '外出';
                    }else if(status == 4){
                        str = '出差';
                    }else if(status == null || status == undefined || status == ''){
                        str = '';
                    }else if(status == null || status == undefined || status == ''){
                        str = '';
                    }else{
                        str = '其他';
                    }
                    return str;
                },
                //用户状态颜色 用户状态：0（默认） 全部，1 正常，2 休假，3 外出，4 出差，99 其他
                userStatusColorFn(status){
                    var str = '';
                    if(status == 1){
                        str = 'normal';
                    }else if(status == 2){
                        str = 'leave';
                    }else if(status == 3){
                        str = 'goout';
                    }else if(status == 4){
                        str = 'chai';
                    }else if(status == null || status == undefined || status == ''){
                        str = '';
                    }else{
                        str = 'another';
                    }
                    return str;
                },
                signFn(state){//1=正常,2=休假,3=外出，4=出差,99=其他

                },
                getItemsArr(o){   
                    var tmpArr = [];
                    for(var item in o)
                    {
                        tmpArr.push(item);
                    }
                    return tmpArr;
                },
                getItemName(idx,o)
                {
                    return this.getItemsArr(o)[idx-1];
                },
                userDetailsStatusColorFn(status){
                    var str = '';
                    if(status == 1){
                        str = 'normal_date';
                    }else if(status == 2){
                        str = 'leave_date';
                    }else if(status == 3){
                        str = 'goout_date';
                    }else if(status == 4){
                        str = 'chai_date';
                    }else{
                        str = 'another_date';
                    }
                    return str;
                },
                signFn(state){
                    this.$http.post(this.urlT+"/schedule/insertEmployeeStates",
                    JSON.stringify({
                        state:state.toString(),
                        employeeid:localStorage.getItem("employeeid")
                    }),"text/html; charset=UTF-8")
                    .then(ret=>{
                        var data =ret.body;
                        if(data.retCode==200){
                            this.$emit("successInsert")
                        }else{
                            this.$root.Bus.$emit("showError",data.errorDesc);
                        }
                    })
                }
            }
        })
    }
}