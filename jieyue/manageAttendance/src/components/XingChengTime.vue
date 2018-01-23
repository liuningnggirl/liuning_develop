<template>
    <mt-cell-swipe
    class="ul_li_content list-li"
    :right="btn" v-if="isMine&&!deleteItem">
        <div class="cc_status" :class="statusClass">{{userStatusFn(obj.state)}}</div>
        <div class="cc_date" :class="{options:!obj.address&&!obj.remarks}">{{obj.time}}</div>
        <div class="cc_box clear">
            <div class="cc_where" v-if="obj.address"><span>{{obj.address}}</span></div>
            <div class="cc_reason" v-if="obj.remarks"><span>{{obj.remarks}}</span></div>
            <!-- <div class="cc_where" ><span>aaaaaa</span></div>
            <div class="cc_reason"><span>aaaaaa</span></div> -->
        </div>
    </mt-cell-swipe>
    <div v-else-if="!deleteItem" class="list-li">
        <div class="ul_li_content">
            <div class="cc_status" :class="statusClass">{{userStatusFn(obj.state)}}</div>
            <div class="cc_date" :class="{options:!obj.address&&!obj.remarks}">{{obj.time}}</div>
            <div class="cc_box clear">
                <div class="cc_where" v-if="obj.address"><span>{{obj.address}}</span></div>
                <div class="cc_reason" v-if="obj.remarks"><span>{{obj.remarks}}</span></div>
                <!-- <div class="cc_where" ><span>aaaaaa</span></div>
                <div class="cc_reason"><span>aaaaaa</span></div> -->
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:"",
    props:["obj","isMine"],
    data(){
        var statusClass=this.userDetailsStatusColorFn(this.obj.state);
        var str = !this.obj.address&&!this.obj.remarks?"options":"";
        return{
            statusClass:statusClass+" "+str,
            btn:[{ 
                content:'<span class="btnText">删除</span>', 
                style:{ 
                    backgroundColor: '#FF5156',
                    fontSize:'16px', 
                    color: '#fff',
                    position:"relative",
                    width:"80px"
                },
                handler:this.hello
            }],
            deleteItem:false
        }
    },
    methods:{
        hello(){
            var that = this;
            that.$http.post(that.urlT+"/schedule/deleteChecks",
            JSON.stringify({
                employeeid:localStorage.getItem("employeeid"),
                cid:that.obj.cid.toString()
            }),'text/html; charset=UTF-8')
            .then(ret=>{
                var data = ret.body;
                if(data.retCode=="200"){
                    that.deleteItem=true;
                    that.$root.Bus.$emit("showSuccess","删除成功")
                }else{
                    that.$root.Bus.$emit("showError",data.errorDesc);
                }
            })
        }
    }
}
</script>

<style lang="less">
    .btnText{
        position: absolute;
        width:80px;
        display:inline-block;
        left: 0;
        right: 0;
        margin:auto;
        height:10px;
        top:0;
        bottom:0;
        line-height: 10px;

    }
    .list-li {
        border-bottom: 1px solid #EFEFEF;
        position: relative;
        padding: 0 12px;
        color: #666;
        line-height: 30px;
        min-height:80px;
        .mint-cell-title{
            display: none;
        }
        .ul_li_content{
            padding:20px 14px;
            line-height: 30px;
            color: #B7B7B7;
            font-size:12px;
            .cc_status{
                font-size:16px; 
                position: absolute;
                left:37px;  
                top:14px; 
                &::before{ 
                    content:""; width:7px; height:7px;border-radius:50%;  display:inline-block;position: absolute; left: -17px;  top: 10px;
                }
                &.options{
                    top:24px;
                }
            }
            .cc_box{
                text-align: left;
                padding-left:10px;
                margin-top:20px!important;
                margin-bottom:0;
            }
        }
        .cc_status{
            font-size:16px;    
            position: absolute;
            left: 20px;
            top: 16px;
            &::before{ 
                content:""; width:7px; height:7px;border-radius:50%;  display:inline-block;position: absolute; left: -17px;  top: 4px;
            }
            &.options{
                top: 32px;
            }
        }
        .cc_date{
            position: absolute;
            right: 20px;
            top: 16px;
            &.options{
                top: 32px;
            }
        }
        .cc_box{
            text-align: left;
            padding-left:10px;
            margin-top:40px;
            margin-bottom:10px;
        }
        .cc_reason,.cc_where{
            position: relative;
            line-height: 30px;
        }
.cc_reason:before{    background:url("../assets/img/img_icon_action@2x.png") no-repeat; background-size:100%;  content: "";  width:12px;  height: 12px; display: inline-block;  position: absolute;  left: -19px;  top: 10px;}
.cc_where:before{    background:url("../assets/img/img_icon_laction@2x.png") no-repeat; background-size:100%;  content: "";  width:12px;  height: 12px; display: inline-block;  position: absolute;  left: -19px;  top: 10px;}
    }
</style>


