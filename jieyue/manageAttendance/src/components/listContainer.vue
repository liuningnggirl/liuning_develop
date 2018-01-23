<template>
  <div class="page-loadmore">
    <!-- <p class="page-loadmore-desc">translate : {{ translate }}</p>
    <div class="loading-background" :style="{ transform: 'scale3d(' + moveTranslate + ',' + moveTranslate + ',1)' }">
      translateScale : {{ moveTranslate }} 
    </div> -->

    <!-- <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }"> -->
    <div v-if="!no_content" class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
		<mt-loadmore :top-method="loadTop" 
		@translate-change="translateChange" 
		@top-status-change="handleTopChange"  
		:bottom-all-loaded="allLoaded" 
		ref="loadmore">
			<ul :class="{mb50:list.length<8}" class="page-loadmore-list">
				<li  v-for="item in list" @click="toDetail(item)" class="page-loadmore-listitem">
					<div class="ta_left">
						<img :src="require('@/assets/img/default_img.png')" alt="">
					</div>
					<div class="ta_center">
						<p class="tc_name">{{item.name}}</p>
						<p class="tc_type">{{item.job}}</p>
					</div>
					<div class="ta_right">
						<p class="tr_day_num">
							<span>当月出勤</span>
							<span>{{item.outworkday}}天</span>
						</p>
						<p class="tr_status normal">{{userStatusFn(item.state)}}</p>
					</div>
					<img v-if="item.stick==1||item.stick==2" :src="require('@/assets/img/core.png')" alt="" class="ta_core">
				</li>
			</ul>
			<div slot="top" class="mint-loadmore-top">
				<!-- <span v-show="topStatus !== 'loading'" :class="{ 'is-rotate': topStatus === 'drop' }">↓</span> -->
				<span class="top-load-bar"><mt-spinner type="snake"></mt-spinner></span>
				<!-- <span class="top-load-bar" v-show="topStatus === 'loading'">更新了{{updateNum}}条数据</span> -->
			</div>    
		</mt-loadmore>
    </div>
	<div v-if="no_content" class="no_content">
		<img :src="require('@/assets/img/none_content.png')" alt="">
		<p>暂无内容</p>
	</div>
  </div>
</template>


<script type="text/babel">
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
export default {
	props:["state"],
	data() {
		return {
			list: [],
			allLoaded: true,
			bottomStatus: "",
			wrapperHeight: 0,
			topStatus: "",
			translate: 0,
			moveTranslate: 0,
			updatedata:new Date().Format('yyyy-MM-dd hh:mm'),
			no_content:false,
			updateNum:"0"
		};
	},
  	methods: {
    	handleBottomChange(status) {
      		this.bottomStatus = status;
    	},
		handleTopChange(status) {
			this.moveTranslate = 1;
			this.topStatus = status;
		},
		translateChange(translate) {
			const translateNum = +translate;
			this.translate = translateNum.toFixed(2);
			this.moveTranslate = (1 + translateNum / 70).toFixed(2);
		},
		loadTop() {
			setTimeout(() => {
				var that = this;
				that.list=[];
				that.$http.post(that.urlT+"/schedule/getAllEmployeesStates",
				JSON.stringify({
					state:that.state=="5"?"99":that.state.toString(),
					updatedata:that.updatedata
				}),"text/html; charset=UTF-8").then(res=>{
					var data = res.body;
					if(data.retCode==="200"){
						that.list=data.responseBody.result;
						that.updateNum=data.responseBody.updatesum;
						that.updatedata = data.responseBody.updatedata;
					}
				})
				this.$refs.loadmore.onTopLoaded();
			}, 1500);
		},
		firstLoad(){
			var that = this;
			that.$http.post(that.urlT+"/schedule/getAllEmployeesStates",
			JSON.stringify({
				state:that.state=="5"?"99":that.state.toString(),
				updatedata:that.updatedata
			}),"text/html; charset=UTF-8").then(res=>{
				var data = res.body;
				if(data.retCode==="200"){
					that.list = data.responseBody.result;
					if(that.list.length==0){
						that.no_content=true
					}
					that.updatedata = data.responseBody.updatedata;
				}
			})
		},
		toDetail(item){
			if(item.employeeid==localStorage.getItem("employeeid")){
				this.$router.push({path:"/commonFooter/detail",query:{employeeid:item.employeeid}})
			}else{
				this.$router.push({path:"/detail",query:{employeeid:item.employeeid}})
			}
		}
	},
	mounted() {
		this.wrapperHeight =
		document.documentElement.clientHeight -
		this.$refs.wrapper.getBoundingClientRect().top;
		this.firstLoad();
	},
	watch:{
		updateNum(){
			this.$root.Bus.$emit('showSuccess', "更新了"+this.updateNum+"条数据");
		}
	}
};
</script>

<style lang="less" scoped>
.top-load-bar{
	width:100%;
	background: rgba(81,187,255,.2);
	color: #0C97ED;
	text-align: center;
}
.loading-background,
.mint-loadmore-top span {
  -webkit-transition: 0.2s linear;
  transition: 0.2s linear;
}
.mint-loadmore-top span {
  display: inline-block;
  vertical-align: middle;
}

.mint-loadmore-top span.is-rotate {
  -webkit-transform: rotate(180deg);
  transform: rotate(180deg);
}

.page-loadmore .mint-spinner {
  display: inline-block;
  vertical-align: middle;
}

.page-loadmore-desc {
  text-align: center;
  color: #666;
  padding-bottom: 5px;
}

.page-loadmore-desc:last-of-type,
.page-loadmore-listitem {
  border-bottom: 1px solid #eee;
}

.page-loadmore-listitem:first-child {
  border-top: 1px solid #eee;
}

.page-loadmore-wrapper {
  overflow: scroll;
}
.page-loadmore-wrapper ul{ 
	padding:4px 15px;
	margin-bottom:20%;
	overflow: scroll; 
	-webkit-overflow-scrolling: touch;
	li{ 
		padding: 16px 15px;
		background: #fff;
		box-sizing: border-box;
		overflow: hidden;
		box-shadow: 0 2px 4px 0 rgba(212,212,212,0.50);
		border-radius: 1px; 
		position:relative;
		margin: 5px 0 0 0;
		.ta_left{
			margin:0 15px 0 0;
			img{ 
				width:52px;
				height:52px; 
				border-radius:5px;
				display: inline-block; 
			}
		}
		.ta_right{
			float:right;
			text-align: right;
			position: absolute; 
			right: 15px;
			.tr_status{font-size:14px;position: relative;}
			.tr_day_num{font-size:14px;margin: 0 0 16px 0;}
		}
		.ta_center{
			.tc_name{font-size:20px; color:#333;text-align: left;}
			.tc_type{font-size:14px; color:#999; margin: 16px 0 0 0; text-align: left; }
		} 
		div{
			float:left;
		}
		.ta_core{ width:18px; position:absolute;top:3px;right:0px;}
		p{
			margin:0;
		}
	}
	&.mb50{
		margin-bottom:50%;
	}
}
</style>

