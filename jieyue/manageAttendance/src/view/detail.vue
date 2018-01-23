<template>
    <div class="detail">
        <div class="cb_message_content">
            <div class="cb_message" @click="toSetting">
                <div class="ta_left">
                    <img :src="avatar" @error="errorImg">
                </div>
                <div class="ta_center">
                    <p class="tc_name">{{baseinfo.name}}</p>
                    <p class="tc_type">{{baseinfo.job}}</p>
                </div>
                <div class="ta_right">
                    <p class="tr_day_num">
                        <span>当月出勤 {{baseinfo.outworkday}} 天</span>
                    </p>
                    <p class="tr_status" v-if="baseinfo.state" :class="userStatusColorFn(baseinfo.state)">{{userStatusFn(baseinfo.state)}}</p>
                </div>
            </div>
        </div>
        <div class="date-list-box" 
        ref="dateListBox" 
        v-infinite-scroll="loadMore" 
        infinite-scroll-disabled="busy" 
        infinite-scroll-distance="10">
            <div class="date-list-item" v-for="item in list">
                <dateList :isMine="isMine" :obj="item"></dateList>
            </div>
            <span v-if="busy&&!AllLoad">正在加载....</span>
        </div>
        <div v-if="none_message" class="none_message">
            <img :src="require('@/assets/img/current_none_message.png')" alt="">
            <p>当前没有状态</p>
        </div>
    </div>
</template>

<script>
    import dateList from "@/components/dateList"
    export default {
        name:"detail",
        components:{
            dateList
        },
        data(){
            return{
                employeeid:this.$route.query.employeeid,
                list:[],
                baseinfo:{

                },
                avatar:"",
                page:0,
                none_message:false,
                busy:false,
                AllLoad:false,
                isMine:this.$route.query.employeeid==localStorage.getItem("employeeid")
            }
        },
        mounted(){
            this.$parent.pagename="detail";
            this.getBaseInfo();
            // this.getEmployeesSchedules();
            this.$refs["dateListBox"].style.height=document.documentElement.clientHeight-124+"px"
            
        },
        methods:{
            getBaseInfo(){
                var that = this;
                that.$http.post(that.urlT+"/schedule/getEmployeesStates",
                JSON.stringify({
                    employeeid:that.employeeid
                }),'text/html; charset=UTF-8')
                .then(ret=>{
                    var data = ret.body;
                    if(data.retCode=="200"){
                        that.baseinfo=data.responseBody;
                        that.avatar=that.urlT+that.baseinfo.imageurl;
                    }else{
                        that.$root.Bus.$emit("showError",data.errorDesc);
                    }
                })
            },
            getEmployeesSchedules(){
                var that = this;
                that.$http.post(that.urlT+"/schedule/getEmployeesSchedules",
                JSON.stringify({
                    employeeid:that.employeeid,
                    page:that.page.toString()
                }),'text/html; charset=UTF-8')
                .then(ret=>{
                    var data = ret.body;
                    if(data.retCode=="200"){
                        that.list=that.list.concat(data.responseBody.statelist);
                        if(data.responseBody.statelist==0){
                            if(that.page==1){
                                that.none_message=true;
                            }
                            that.AllLoad=true;
                        }
                    }else{
                        that.$root.Bus.$emit("showError",data.errorDesc);
                    }
                    that.busy=false;
                })
            },
            errorImg(e){
                this.avatar=require("@/assets/img/default_img.png");
            },
            loadMore(){
                var that = this;
                that.busy=true;
                that.page++;
                if(!that.AllLoad){
                    that.getEmployeesSchedules();
                }
            },
            toSetting(){
                if(this.isMine){
                    this.$router.push({path:"/setting"})
                }
            }
        }
    }
</script>

<style lang="less" scoped>
p{
    margin:0;
    text-align: left;
    color:#8f8f94;
}
.none_message img{ width:50%;}
.none_message{ margin:52% 0 0 0; text-align:center;}
.none_message p{ font-size:15px; color:#666; margin:5.4% 0 0 0;text-align: center;}
.cb_message{ padding: 16px 15px;  background: #fff;  box-sizing: border-box;  overflow: hidden;  box-shadow: 0 2px 4px 0 rgba(212,212,212,0.50);  border-radius: 1px;  position: relative;margin: 15px 0;}
.cb_message .ta_left img{ width:52px;height:52px; border-radius:5px;display:inline-block; }
.cb_message .ta_left{margin:0 15px 0 0;}
.cb_message .ta_right{float:right;text-align: right;}
.cb_message .ta_center .tc_name{font-size:20px; color:#333;}
.cb_message .ta_center .tc_type{font-size:14px; color:#999; margin: 16px 0 0 0;}
.cb_message .ta_right .tr_status{font-size:14px;position: relative;margin-bottom: 0px;}
.cb_message .ta_right .tr_day_num{font-size:14px;margin: 0 0 16px 0;}
.cb_message div{float:left;}
.cb_message .ta_core{ width:18px; position:absolute;top:0px;right:0px;}
.cb_message_content{ background:#FBFCFF; position:fixed;width:100%; top:0px; z-index:2;    padding: 0 14px;}
.cb_message .ta_right p{
    text-align: right;
}
.date-list-box{
    margin-top:124px;
    overflow-y:auto;
    padding-bottom:90px;
}
</style>

