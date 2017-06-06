// login.js
var util = require('../../utils/util.js')
var checkout_pwd = true
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image:'../images/new_login_pwd_eyes.png',
    pwd:'password',
    phoneNum:'',
    password:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  checkout_eyes_fn:function(e){
    //切换眼睛
    if(checkout_pwd){
      checkout_pwd = false
      this.setData({
        image: '../images/new_login_eyes.png',
        pwd:'tel'
      })
    }else{
      checkout_pwd = true
      this.setData({
        image: '../images/new_login_pwd_eyes.png',
        pwd:'password'
      })
    }
  },
  back_page:function(){
    //返回上一个页面
    wx.navigateBack();
  },
  //用户名和密码输入框事件
  userNameInput: function (e) {
    this.setData({
      phoneNum: e.detail.value
    })
  },
  passWdInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  logon_fn:function(e){
    wx.request({
      url: 'https://testcli.nggirl.com.cn/nggirl/app/cli/register/weixin/logon/1.5.0',
      data: util.getFinalRequestObject({ phoneNum: this.data.phoneNum, password: this.data.password }),
      dataType:'json',
      method: 'POST',
      success: function (result) {
        if (result.data.code == 0) {
            wx.navigateBack();
        } else {
          wx.showToast({
            title: '登陆失败',
            icon: 'warn',
            duration: 2000
          })
        }
      }
    })
  }


})