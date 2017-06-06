// mine.js
var util = require('../../utils/util.js')
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.getUserInfo();
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  getUserInfo:function(){
    //获取个人信息
    wx.request({
      url: 'https://testcli.nggirl.com.cn/nggirl/app/cli/personalInfo/getUserInfo/2.5.2',
      data: util.getFinalRequestObject({ accessToken: util.getAccessToken}),
      method: 'GET',
      success: function (result) {
        if (result.data.code == 0){
          
        }else{
          wx.redirectTo({
            url: '../login/login',
          })
           
        }
      }
    })
  }



})