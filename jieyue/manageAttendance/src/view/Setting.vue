<template>
  <div class="content_box">
    <div class="cb_top">
      <div class="ct_content" @click="modify_img">
        <span class="cb_left">修改头像</span>
        <img src="../assets/img/img_icon_more@2x.png" alt="">
      </div>
    </div>
    <div class="cb_bottom" id="confirmBtn" @click="logout">
      <span>退出登录</span>
    </div>
  </div>
</template>

<script>
  import { MessageBox } from 'mint-ui';
	export default {
		data(){
			return {
        ua : navigator.userAgent
			}
		},
		mounted(){

		},
		methods:{
      modify_img : function(){
        //回调客户端方法  type=updateHeader   通知客户端修改头像
        var updateHeader = '{"type": "updateHeader","data": {}}';
        if(this.ua.indexOf("androidH5App") >= 0){
          window.jsToJava.jsCallbackMethod(updateHeader);
        };
      },
      logout : function(){
        // MessageBox({
        //   title: '退出登录',
        //   message: '您是否要退出登录？?',
        //   showCancelButton: true,
        //   showConfirmButton:true,

        // });
        MessageBox.confirm('', {
          message:'您是否要退出登录？',
          title: '退出登录',
          showConfirmButton:true,
          showCancelButton:true,
          cancelButtonClass:'cancelButton',
          confirmButtonClass:'confirmButton',
        }).then(action => {
          if (action == 'confirm') {
            var loginCallBack = '{"type": "loginCallBack","data": {"isLogin":"false","mobile":"","employeeid":""}}';
            if(this.ua.indexOf("androidH5App") >= 0){
              window.jsToJava.jsCallbackMethod(loginCallBack);
            };
          }
        }).catch(err => {
          if (err == 'cancel') {
            
          }
        });
      }
		}
	}
</script>
<style>
body{
	background: #FBFCFF;
}
</style>

<style lang="less" scoped>
  body{ background:#fbfcff;}
  .content_box .cb_top{font-size:16px; padding: 0 0 0 16px;}
  .content_box .cb_top .ct_content{ border-bottom:1px solid #DDDDDD; padding:13px 0; position: relative; text-align: left; }
  .content_box .cb_top .ct_content .cb_right{ color:#999; float: right; margin-right: 30px;}
  .content_box .cb_top .ct_content img{ width: 7.5px; position: absolute;  right: 10px;  top: 19px;}
  .content_box{ background: #fff; margin-top: 10px;}
  .content_box .cb_bottom textarea{color: #333333; width: 100%; resize: none;  border: none;  padding: 15px;  box-sizing: border-box;  font-size: 16px;}
  .content_box .cb_bottom{border-bottom:1px solid #ddd;}
  .cb_bottom{color: #333; font-size: 16px;  padding: 13px 16px;  text-align: left;}
  html,body{
    width:100%;
    height:100%;
  }
  .mask-set{
    width:100%;
    height:100%;
    background:black;
    opacity: .3;
    position: fixed;
    top:0;
    left:0;
  }
  .tip-box{
    z-index: 1;
  }
</style>


