<template>
	<div class="login-page">
		<mt-popup
			v-model="popupVisible"
			position="Diy"
			:modal="false"
			popup-transition="popup-fade">
			{{errorMsg}}
		</mt-popup>
		<div class="logo">
			<img src="../assets/img/logo@xxhdpi.png" alt="">
		</div>
		<div class="login-box">
			<div class="login-form">
				<div class="form-group tel">
					<input class="form__input" placeholder="手机号" maxlength="11" v-model.trim="Phone" @input="$v.Phone.$touch()">
					<p class="get_yzm" @click="getYzm()">获取验证码</p>
				</div>
				<div class="form-group yzm">
					<input class="form__input" placeholder="验证码" v-model.trim="Code" @blur="$v.Code.$touch()">
				</div>
				<div class="button-box">
					<button type="button" @click="Login()">登录</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { required,numeric } from 'vuelidate/lib/validators'
	import { Popup } from 'mint-ui';
	export default {
		name:"",
		components:{
			Popup,
		},
		data(){
			return {
				popupVisible:false,
				errorMsg:"",
				Phone: '',
                Code: ''
			}
		},
		validations: {
            Phone: {
				required,
				phone:function(value){
					var reg = /^1(([3|8|7|5][0-9])|(5[^4|\D]))\d{8}$/;
    				return reg.test(value);
				}
            },
            Code: {
				required
            }
        },
		mounted(){
			var bbNetwork = (new BBNetwork()).isOnline();
		},
		methods:{
			showPopup(msg){
				if(this.popupVisible){
					return;
				}
				this.errorMsg = msg;
				this.popupVisible=true;
				var that = this;
				setTimeout(function(){
					that.popupVisible = false;
				},2000)
			},
			Login(){
				if(!(this.$v.Phone.required)){
					this.showPopup("手机号不能为空");
					return;
				}
				if(!(this.$v.Phone.phone)){
					this.showPopup("请输入正确手机号");
					return;
				}
				if(!(this.$v.Code.required)){
					this.showPopup("验证码不能为空");
					return;
				}
				this.$http.post(this.urlT+'/schedule/logins',
					JSON.stringify({
						tellphone:this.Phone,
						verifycode:this.Code
					}),"text/html; charset=UTF-8"
				).then(Response=>{
					var data = Response.body;
					localStorage.setItem('lastLoginDateTime',data.responseBody.returnparam.lastlogindatetime);
					localStorage.setItem('localStorageLoginNum',data.responseBody.returnparam.ifone);
					localStorage.setItem('employeeid',data.responseBody.returnparam.employeeid);
					//回调客户端方法  type=loginCallBack  isLogin=true  登录成功
					var loginCallBack = '{"type": "loginCallBack","data": {"isLogin":"true","mobile":"'+this.Phone+'","employeeid":"'+data.responseBody.returnparam.employeeid+'","verifycode":"'+this.Code+'"}}';
					var ua = navigator.userAgent;
					if(ua.indexOf("androidH5App") >= 0){
						window.jsToJava.jsCallbackMethod(loginCallBack);
					};
					this.$router.push({path:'/commonFooter/Index', query: {employeeid: data.responseBody.returnparam.employeeid}});
				},Response=>{
				})
			},
			getYzm(){
				if(!(this.$v.Phone.required)){
					this.showPopup("手机号不能为空");
					return;
				}
				if(!(this.$v.Phone.phone)){
					this.showPopup("请输入正确手机号");
					return;
				}
				this.$http.post(this.urlT+'/schedule/sendSmsCodes',
					JSON.stringify({
						tellphone:this.Phone
					}),"text/html; charset=UTF-8"
				).then(Response=>{
					var data = Response.body;
					if(data.retCode=="200"){
						this.$root.Bus.$emit("showSuccess","验证码发送成功");
					}else{
						this.$root.Bus.$emit("showError",data.errorMsg);
					}
				},Response=>{
				})
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

	.login-page{
		.mint-popup-Diy{
			background: red;
			color: white;
			width: 100%;
			height: 40px;
			line-height: 40px;
			top: 20px;
		}
		.logo{
			img{
				width: 26.9%;
				margin: 80px auto 40px;
			}
		}
		.login-box{
			padding:0 15px;
			.login-form{
				padding:42px 18px;
				background:white;
				.form-group{
					position: relative;
					width:100%;
					.form__input{
						padding-left:36px;
						background: #F9F9F9;
						height: 46px;
						line-height: 46px;
						border-radius: 4px;
						border: none;
						box-sizing: border-box;
						width: 100%;
						font-size: 15px;
						color: #333;
						outline: none;

					}
					&.tel{
						&:before{
							content: "";
							background: url(../assets/img/login_phone.png) no-repeat;
							position: absolute;
							left: 15px;
							top: 15px;
							background-size: 100%;
							width: 10.7px;
    						height: 18px;
						}
					}
					&.yzm{
						&:before{
							content: "";
							background: url(../assets/img/login_key.png) no-repeat;
							position: absolute;
							left: 15px;
							top: 15px;
							background-size: 100%;
							width: 10.7px;
    						height: 20px;
						}
					}
					.get_yzm{
						position: absolute;
						top: 14px;
						right: 15px;
						font-size: 15px;
						color: #51BBFF;
						margin:0;
					}
					&+.form-group{
						margin-top:40px;
					}
				}
			}
			.button-box{
				button{
					border:none;
					outline: none;
					padding: 16px 0;
					width: 100%;
					background: #51BBFF;
					color: #fff;
					font-size: 18px;
					text-align: center;
					border-radius: 4px;
					margin: 40px 0 0 0;
				}
			}
		}

	}
	.mint-popup-Diy{
		top:30px;
	}
</style>


