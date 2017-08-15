// beautysalon_details.js
var util = require('../../utils/util.js')
Page({
  data: {
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    toView: 'red',
    scrollTop: 100,
    genData:[]
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  onLoad: function (options) {//navigationBarTitleText 
    // wx.setNavigationBarTitle({
    //   title: options.title,
    // })
    this.getDetailsData(options.unionProductId, options.productType);
  },
  getDetailsData: function (unionProductId,productTypetype) {
    var that = this;
    // 页面初始化 options为页面跳转所带来的参数
    wx.request({
      url: 'https://cli.nggirl.com.cn/nggirl/app/cli/salon/works/salonProductDetail/1.5.0', //仅为示例，并非真实的接口地址
      data: util.getFinalRequestObject({ unionProductId: unionProductId, productTypetype: productTypetype }),
      success: function (res) {
        console.log(res.data.data);
        if (res.data.code == 0) {
          that.setData({
            imgUrls: res.data.data.cover,
            genData:res.data.data
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
    })
  },
  pullDownRefresh: function (e) {
    console.log("下拉刷新....")
    this.onLoad()
  },
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
  
  }
})

