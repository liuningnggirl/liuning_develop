// beautylist.js
var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    dataContent: []
  },
  onLoad: function () {
    this.loadData();
  },
  loadData: function () {
    var that = this;
    // 页面初始化 options为页面跳转所带来的参数
    /*wx.request({
      url: 'https://testcli.nggirl.com.cn/nggirl/app/cli/works/weixin/listWorksAtWxHome/1.4.1',
      data: util.getFinalRequestObject({promotionName: '婚博会专场', num: 4 }),
      method: 'POST',
      dataType: "json",
      success: function (res) {
        console.log(res.data.data);
        if (res.data.code == 0 && res.data.data.length > 0) {
          that.setData({
            dataContent: res.data.data
          });
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.data.error,
            success: function (res) {

            }
          })
        }
      }
    })*/
    


    wx.request({
      url: 'https://testcli.nggirl.com.cn/nggirl/app/cli/works/weixin/listWorksAtWxHome/1.4.1',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      method: "POST",
      data: util.json2Form(util.getFinalRequestObject({ accessToken: util.getAccessToken, promotionName: '婚博会专场', num: 4 })),
      complete: function (res) {
        console.log(res.data.data);
        that.setData({
          
        });
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    })  

  }



})