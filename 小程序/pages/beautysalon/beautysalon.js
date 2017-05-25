// beautysalon.js
var util = require('../../utils/util.js')
Page({
  data:{
    dataContent:[]
  },
  onLoad:function(){
    //this.getdata();
    
  }, 
  onReady:function(){
    // 页面渲染完成
    this.getdata();
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
  getdata: function () {
    var that = this;
    // 页面初始化 options为页面跳转所带来的参数
    wx.request({
      url: 'https://testcli.nggirl.com.cn/nggirl/app/cli/salon/works/listSalonProducts/1.4.0', //仅为示例，并非真实的接口地址
      data: util.getFinalRequestObject({ city: '北京' }),
      success: function (res) {
        console.log(res.data.data);
        if (res.data.code == 0){
          that.setData({
            dataContent: res.data.data
          });
        }else{
          // wx.showToast({
          //   title: 'res.data.data.error',
          //   icon: 'succes',
          //   duration: 1000,
          //   mask: true
          // })
          wx.showModal({
            title: '提示',
            content: res.data.data.error,
            success: function (res) {
              
            }
          })
        }       
      }
    })
  },
})