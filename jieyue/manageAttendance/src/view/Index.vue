<template>
	<div class="indexpage">
		<ul class="title-menu">
			<li v-for="item in titles" class="menu-item" @click="active=item.id" :class="{active:item.id==active}">{{item.name}}</li>
		</ul>
		<div class="content-container">
			<mt-tab-container v-model="active" :swipeable="false">
				<mt-tab-container-item v-for="item,index in titles" :id="item.id">
					<list-container :state="index"></list-container>
				</mt-tab-container-item>
			</mt-tab-container>
		</div>
	</div>
</template>

<script>
	import { TabContainer, TabContainerItem } from 'mint-ui';
	import listContainer from "../components/listContainer"
	import attendPanel from "../components/attendPanel"
	export default {
		name:"index",
		components:{
			TabContainer,TabContainerItem,listContainer,attendPanel
		},
		data(){
			return {
				active:"tab1",
				titles:[
					{
						name:"全部",
						id:"tab1"
					},
					{
						name:"正常",
						id:"tab2"
					},
					{
						name:"休假",
						id:"tab3"
					},
					{
						name:"外出",
						id:"tab4"
					},
					{
						name:"出差",
						id:"tab5"
					},
					{
						name:"其他",
						id:"tab6"
					}
				],
				showPanel:false,
				
			}
		},
		mounted(){
			this.$parent.pagename="index";
		},
		methods:{
			
		}
	}
</script>

<style lang="less" scoped>
	.indexpage{
		.title-menu{
			height: 45px;
			line-height: 45px;
			display: flex;
			position: fixed;
			top:0;
			width:100%;
			z-index: 1;
			background:white;
			font-size: 15px;
			padding:0 10px;
			.menu-item{
				flex:1;
				&.active{
					color: #51BBFF;
					height: 45px;
					border-bottom:3px solid #51BBFF;
				}
			}
		}
		.content-container{
			padding:45px 0 70px 0;
		}
		
	}
</style>