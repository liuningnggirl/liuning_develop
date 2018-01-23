<template>
    <div class="commonFooter">
        <router-view></router-view>
        <div class="footer-box">
			<div class="box-item" :class="{active:pagename=='index'}">
				<div>
					<img v-if="pagename=='index'" :src="require('@/assets/img/index_after.png')" alt="">
					<img v-else :src="require('@/assets/img/index_before.png')" alt="">
				</div>
				<span @click="toIndex">首页</span>
			</div>
			<div class="center-button">
				<img @click="showPanelhandler" :src="require('@/assets/img/check_in_white.png')" alt="">
			</div>
			<div class="box-item" :class="{active:pagename!='index'}">
				<div>
					<img v-if="pagename!='index'" :src="require('@/assets/img/mine_after.png')" alt="">
					<img v-else :src="require('@/assets/img/mine_before.png')" alt="">
				</div>
				<span @click="toDetial">我的</span>
			</div>
		</div>
		<attendPanel :showPanel.sync="showPanel" @hiddenPanel="hiddenPanel"></attendPanel>
    </div>
</template>
<script>
import attendPanel from "@/components/attendPanel"
    export default {
        name:"commonFooter",
        data(){
            return{
				showPanel:false,
				pagename:""
            }
        },
        components:{
            attendPanel
        },
        methods:{
            showPanelhandler(){
				this.showPanel=true;
			},
			hiddenPanel(isrefresh){
				if(isrefresh){
					this.$router.go(0)
				}
				this.showPanel=false
			},
			toIndex(){
				
				this.$router.push({path:'/commonFooter/index',query:{employeeid: localStorage.getItem('employeeid')}})
			},
			toDetial(){
				
				this.$router.push({path:'/commonFooter/detail',query:{employeeid: localStorage.getItem('employeeid')}})
			}
		},
		mounted(){
			if(this.$route.path.indexOf("Index")>-1){
				this.pagename="index"
			}
		}
    }
</script>

<style lang="less" scoped>
    .commonFooter{
        .footer-box{
			box-shadow: 0 0 0 1px #f1f1f1;
			background:white;
			z-index: 1;
			position: fixed;
			bottom:0;
			width:100%;
			height:60px;
			line-height: 60px;
			display: flex;
			.center-button{
				height: 50px;
				width:42px;
				position: relative;
				img{
					position: absolute;
					width: 100%;
					height: 100%;
					left: 0;
					right: 0;
					margin: auto;
					top: -12px;
				}
			}
			.box-item{
				font-size: 13px;
				flex:1;
				position: relative;
				color:#666;
				img{
					position: absolute;
					left: 0;
					right: 0;
					top:10px;
					margin:0 auto;
					height: 18px;
				}
				span{
					position: absolute;
					left: 0;
					right: 0;
					top:10px;
					margin:0 auto;
					height: 18px;
				}
				&.active{
					color:#51BBFF;
				}
			}
		}
    }
</style>

