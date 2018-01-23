<template>
    <div v-show="showPanel" class="sign-box" :class="{}">
        <div class="sign-states">
            <div class="sign-normal" @click="attend(1)" :class="{animated:showPanel, fadeInUp:showPanel}">
                <img src="../assets/img/ic_nav_normal_setting_hl@2x.png"/>正常 
        	 </div>
            <ul class="sign-four"> 
                <li class="sign-holiday" @click="attend(2)" :class="{animated:showPanel, fadeInUp:showPanel}"> 
        			<img src="../assets/img/ic_nav_xiujia_setting_hl@2x.png"/>休假 
        		 </li> 
                <li class="sign-out" @click="attend(3)" :class="{animated:showPanel, fadeInUp:showPanel}"> 
        			<img src="../assets/img/ic_nav_out_setting_hl@2x.png"/>外出 
        		 </li> 
            </ul> 
            <ul class="sign-four"> 
                <li class="sign-another" @click="attend(99)" :class="{animated:showPanel, fadeInUp:showPanel}"> 
        			<img src="../assets/img/ic_nav_orther_setting_hl@2x.png"/>其他 
        		 </li> 
                <li class="sign-chuchai" @click="attend(4)" :class="{animated:showPanel, fadeInUp:showPanel}"> 
        			<img src="../assets/img/ic_nav_chuchai_setting_hl@2x.png"/>出差 
        		 </li> 
            </ul> 
            <div class="sign-footer">
        		<img @click="hiddenPanel" src="../assets/img/close.png" class="sign-close" :class="{animated:showPanel, fadeInUp:showPanel}"/>
        	 </div>
		</div>
	</div>
</template>

<script>
    export default {
        name:"sign-box",
        props:["showPanel"],
        data(){
            return{

            }
        },
        mounted(){
            var that = this;
            this.$on("successInsert",function(){
                that.$emit("hiddenPanel",true)
            })
        },
        methods:{
            hiddenPanel(){
                this.$emit("hiddenPanel");
            },
            attend(state){
                if(state==1||state==2||state==99){
                    this.signFn(state);
                }else if(state==3||state==4){
                    this.$router.push({path:"/form?state="+state})
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .sign-box{

    }
</style>


