// beautysalon.js
var util = require('../../utils/util.js')
var total = 0
Page({
  data:{
    dataContent:[]
  },
  onLoad:function(){
    this.getdata();
    
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
  getdata: function (page) {
    var that = this;
    // 页面初始化 options为页面跳转所带来的参数
    wx.request({
      url: 'https://testcli.nggirl.com.cn/nggirl/app/cli/salon/works/listSalonProducts/1.4.0', //仅为示例，并非真实的接口地址
      data: util.getFinalRequestObject({city: '北京'}),
      success: function (res) {
        console.log(res.data.data);
        if (res.data.code == 0 && res.data.data.length > 0){
          that.setData({
            dataContent: res.data.data
          });
        }else{
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
  // 上拉加载回调接口
  onReachBottom: function () {
    // 我们用total和count来控制分页，total代表已请求数据的总数，count代表每次请求的个数。
    // 上拉时需把total在原来的基础上加上count，代表从count条后的数据开始请求。
    total += 1;
    // 网络请求
    this.getdata();
  }

})