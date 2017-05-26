// beautysalon_details.js
Page({
  data: {
    imgUrls: [
      'https://photosd.nggirl.com.cn/work/d58cae412f2a49929e949f228cfdd60c.png',
      'https://photosd.nggirl.com.cn/work/e7bae173f7f546fda6cc92e5df1cc198.jpg',
      'https://photosd.nggirl.com.cn/work/e7bae173f7f546fda6cc92e5df1cc198.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    toView: 'red',
    scrollTop: 100
  },
  onLoad: function (options) {//navigationBarTitleText 
    wx.setNavigationBarTitle({
      title: options.title,
    })
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

