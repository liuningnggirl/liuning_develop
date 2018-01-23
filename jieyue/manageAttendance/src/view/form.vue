<template>
    <div class="form">
        <div class="box bottom-line" @click="selectCity" v-if="state=='4'">
            <div class="title">出差地区<span class="xing">*</span></div>
            <span class="cb_right">{{address}}</span>
            <img :src="require('@/assets/img/img_icon_more@2x.png')" class="cb_arr" alt="">
            <div class="clear"></div>
        </div>
        <div class="clear"></div>
        <div class="box">
            <div class="title">事由<span class="xing" v-if="state==3">*</span><span class="xuantian" v-else>（选填）</span></div>
            <textarea class="text-area" resize="false" maxlength="14" v-model="reason"></textarea>
        </div>
        <div class="submit_btn" @click="onSubmit">提交</div>
    </div>
</template>

<script>
    export default {
        name:"form",
        data(){
            return{
                //3外出，4出差
                state:this.$route.query.state,
                reason:"",
                address:""
            }
        },
        created(){
            var that=this;
            that.$root.Bus.$on("updateCitys",data=>{
                that.address=data.province+" /"+data.city;
                that.$root.Bus.$emit("hideCityPicker");
            })
        },
        methods:{
            onSubmit(){
                var that = this;
                this.$http.post(this.urlT+"/schedule/insertEmployeeStates",
                JSON.stringify({
                    state:that.state,
                    employeeid:localStorage.getItem('employeeid'),
                    remarks:that.reason,
                    address:that.address
                }),"text/html; charset=UTF-8")
                .then(res=>{
                    var data = res.body;
                    if(data.retCode==="200"){
                        this.$router.push({path:'/commonFooter/Index', query: {employeeid: localStorage.getItem('employeeid')}});
                    }else{
                        that.$root.Bus.$emit('showError', data.errorDesc);
                    }
                })
            },
            selectCity(){
                var that=this;
                that.$root.Bus.$emit("showCityPicker");
            }
        },
        watch:{
            reason(){
                var that = this;
                if(this.reason.length>=14){ 
                    this.$root.Bus.$emit('showError', "最多输入14个字哦");
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .form{
        .box{
            margin-top:10px;
            line-height: 40px;
            position: relative;
        }
        .bottom-line{
            border-bottom: 1px solid #ddd;
        }
        .title{
            padding:0 14px;
            text-align: left;
            float:left;
            .xing{
                color: red;
                position: relative;
                top: 2px;
                left: 4px;
                font-size: 16px;
            }
            .xuantian{
                font-size: 16px;
                color: #999;
            }
        }
        .text-area{
            padding:0 14px;
            height:100px;
            width:100%;
            border:none;
            outline: none;
            border-bottom: 1px solid #ddd;
            margin-top:20px;
            resize: none;
            line-height: 26px;
            font-size:16px;
            color: #999;
        }
        .submit_btn{
            padding: 16px 0;
            width: 82%;
            border-radius: 4px;
            text-align: center;
            color: #fff;
            font-size: 16px;
            background: #51BBFF;
            margin: 30px auto;
        }
        .cb_right{
            border:none;
            float:left;
            height: 30px;
            outline: none;
            color:#999;
        }
        .cb_arr{
            height:20px;
            float:right;
            position: absolute;
            right: 20px;
            top:6px;
        }
    }
</style>

