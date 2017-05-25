// index.js
///////////////////////////////////scroll-view
// var order = ['red', 'yellow', 'blue', 'green', 'red']
// Page({
//   data: {
//     toView: 'red',
//     scrollTop: 100
//   },
//   upper: function (e) {
//     console.log(e)
//   },
//   lower: function (e) {
//     console.log(e)
//   },
//   scroll: function (e) {
//     console.log(e)
//   },
//   tapTest: function (e) {
//     for (var i = 0; i < order.length; ++i) {
//       if (order[i] === this.data.toView) {
//         this.setData({
//           toView: order[i + 1]
//         })
//         break
//       }
//     }
//   },
//   tapMove: function (e) {
//     this.setData({
//       scrollTop: this.data.scrollTop + 10
//     })
//   },
//   test:function(e){
//     this.setData({
//       scrollTop:this.data.scrollTop + 100
//     })
//   },
// })




/////////////////////////////////////////////swiper
// Page({
//   data: {
//     background: ['green', 'red', 'blue'],
//     indicatorDots: true,
//     vertical: false,
//     autoplay: false,
//     interval: 3000,
//     duration: 3000
//   },
//   changeIndicatorDots: function (e) {
//     this.setData({
//       indicatorDots: !this.data.indicatorDots
//     })
//   },
//   changeVertical: function (e) {
//     this.setData({
//       vertical: !this.data.vertical
//     })
//   },
//   changeAutoplay: function (e) {
//     this.setData({
//       autoplay: !this.data.autoplay
//     })
//   },
//   intervalChange: function (e) {
//     this.setData({
//       interval: e.detail.value
//     })
//   },
//   durationChange: function (e) {
//     this.setData({
//       duration: e.detail.value
//     })
//   }
// })



////////////////////////////////////////icon
// Page({
//   data: {
//     iconSize: [20, 30, 40, 50, 60, 70],
//     iconColor: [
//       'red', 'orange', 'yellow', 'green', 'rgb(0,255,255)', 'blue', 'purple','pink'
//     ],
//     iconType: [
//       'success', 'info', 'warn', 'waiting', 'safe_success', 'safe_warn',
//       'success_circle', 'success_no_circle', 'waiting_circle', 'circle', 'download',
//       'info_circle', 'cancel', 'search', 'clear'
//     ],
//     arr:[
//       1,2,3,4,5,6
//     ],
//     str:[
//       'red','info','warn','waiting','safe_success'
//     ]
//   }
// })

/////////////////////////////////////////////   text
// var initText = 'this is first line this is second line'
// Page({
//   data: {
//     text: initText
//   },
//   extraLine: [],
//   add: function (e) {
//     this.extraLine.push('other line')
//     this.setData({
//       text: initText + '\n' + this.extraLine.join('\n')
//     })
//   },
//   remove: function (e) {
//     if (this.extraLine.length > 0) {
//       this.extraLine.pop()
//       this.setData({
//         text: initText + '\n' + this.extraLine.join('\n')
//       })
//     }
//   },
//   test: function(e){
//     this.extraLine.push('this is test message!!');
//     this.setData({
//       text:initText + '\n' + this.extraLine.join('\n')
//     })
//   }
// })




////////////////////////////////////////// button
// var types = ['default', 'primary', 'warn']
// var pageObject = {
//   data: {
//     defaultSize: 'default',
//     primarySize: 'default',
//     warnSize: 'default',
//     disabled: false,
//     plain: false,
//     loading: false
//   },
//   setDisabled: function (e) {
//     this.setData({
//       disabled: !this.data.disabled
//     })
//   },
//   setPlain: function (e) {
//     this.setData({
//       plain: !this.data.plain
//     })
//   },
//   setLoading: function (e) {
//     this.setData({
//       loading: !this.data.loading
//     })
//   }
// }

// for (var i = 0; i < types.length; ++i) {
//   (function (type) {
//     pageObject[type] = function (e) {
//       var key = type + 'Size'
//       var changedData = {}
//       changedData[key] =
//         this.data[key] === 'default' ? 'mini' : 'default'
//       this.setData(changedData)
//     }
//   })(types[i])
// }

// Page(pageObject)



///////////////////////////////////////  checkbox
// Page({
//   data: {
//     items: [
//       { name: 'USA', value: '美国' },
//       { name: 'CHN', value: '中国', checked: 'true' },
//       { name: 'BRA', value: '巴西' },
//       { name: 'JPN', value: '日本' },
//       { name: 'ENG', value: '英国' },
//       { name: 'FRA', value: '法国' },
//     ]
//   },
//   checkboxChange: function (e) {
//     console.log('checkbox发生change事件，携带value值为：', e.detail.value)
//   }
// })



////////////////////////////  form表单
// Page({
//   data: {
//     pickerHidden: true,
//     chosen: ''
//   },
//   pickerConfirm: function (e) {
//     this.setData({
//       pickerHidden: true
//     })
//     this.setData({
//       chosen: e.detail.value
//     })
//   },
//   pickerCancel: function (e) {
//     this.setData({
//       pickerHidden: true
//     })
//   },
//   pickerShow: function (e) {
//     this.setData({
//       pickerHidden: false
//     })
//   },
//   formSubmit: function (e) {
//     console.log('form发生了submit事件，携带数据为：', e.detail.value)
//   },
//   formReset: function (e) {
//     console.log('form发生了reset事件，携带数据为：', e.detail.value)
//     this.setData({
//       chosen: ''
//     })
//   }
// })




//////////////////////////   input
// Page({
//   data: {
//     focus: false,
//     inputValue: '',
//     inputStr:''
//   },
//   bindButtonTap: function () {
//     this.setData({
//       focus: true
//     })
//   },
//   bindKeyInput: function (e) {
//     this.setData({
//       inputValue: e.detail.value
//     })
//   },
//   bindReplaceInput: function (e) {
//     var value = e.detail.value
//     var pos = e.detail.cursor
//     if (pos != -1) {
//       // 光标在中间
//       var left = e.detail.value.slice(0, pos)
//       // 计算光标的位置
//       pos = left.replace(/11/g, '2').length
//     }

//     // 直接返回对象，可以对输入进行过滤处理，同时可以控制光标的位置
//     return {
//       value: value.replace(/11/g, '2'),
//       cursor: pos
//     }

//     // 或者直接返回字符串,光标在最后边
//     // return value.replace(/11/g,'2'),
//   },
//   bindHideKeyboard: function (e) {
//     if (e.detail.value === "123") {
//       //收起键盘
//       wx.hideKeyboard()
//     }
//   },
//   get_focus:function(e){
//     this.setData({
//       focus:true
//     })
//   },
//   bindStr:function(e){
//     this.setData({
//       inputStr:e.detail.value
//     })
//   },
//   slider_up:function(e){
//     wx.hideKeyborad()
//   }
// })



/////////////////////////////////   label
// Page({
//   data: {
//     checkboxItems: [
//       { name: 'USA', value: '美国' },
//       { name: 'CHN', value: '中国', checked: 'true' },
//       { name: 'BRA', value: '巴西' },
//       { name: 'JPN', value: '日本', checked: 'true' },
//       { name: 'ENG', value: '英国' },
//       { name: 'FRA', value: '法国' },
//     ],
//     radioItems: [
//       { name: 'USA', value: '美国' },
//       { name: 'CHN', value: '中国', checked: 'true' },
//       { name: 'BRA', value: '巴西' },
//       { name: 'JPN', value: '日本' },
//       { name: 'ENG', value: '英国' },
//       { name: 'FRA', value: '法国' },
//     ],
//     hidden: false
//   },
//   checkboxChange: function (e) {
//     var checked = e.detail.value
//     var changed = {}
//     for (var i = 0; i < this.data.checkboxItems.length; i++) {
//       if (checked.indexOf(this.data.checkboxItems[i].name) !== -1) {
//         changed['checkboxItems[' + i + '].checked'] = true
//       } else {
//         changed['checkboxItems[' + i + '].checked'] = false
//       }
//     }
//     this.setData(changed)
//   },
//   radioChange: function (e) {
//     var checked = e.detail.value
//     var changed = {}
//     for (var i = 0; i < this.data.radioItems.length; i++) {
//       if (checked.indexOf(this.data.radioItems[i].name) !== -1) {
//         changed['radioItems[' + i + '].checked'] = true
//       } else {
//         changed['radioItems[' + i + '].checked'] = false
//       }
//     }
//     this.setData(changed)
//   },
//   tapEvent: function (e) {
//     console.log('按钮被点击')
//   }
// })




//////////////////////////////////////  picker
// Page({
//   data: {
//     array: ['中国', '美国', '巴西', '日本', ' 韩国', '你猜'],
//     index: 0,
//     date: '2016-09-01',
//     time: '12:01'
//   },
//   bindPickerChange: function (e) {
//     console.log('picker发送选择改变，携带值为', e.detail.value)
//     this.setData({
//       index: e.detail.value
//     })
//   },
//   bindDateChange: function (e) {
//     this.setData({
//       date: e.detail.value
//     })
//   },
//   bindTimeChange: function (e) {
//     this.setData({
//       time: e.detail.value
//     })
//   }
// })


//audio
// Page({
//   onReady: function (e) {
//     // 使用 wx.createAudioContext 获取 audio 上下文 context
//     this.audioCtx = wx.createAudioContext('myAudio')
//   },
//   data: {
//     poster: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000',
//     name: '此时此刻',
//     author: '许巍',
//     src: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46',
//   },
//   audioPlay: function () {
//     this.audioCtx.play()
//   },
//   audioPause: function () {
//     this.audioCtx.pause()
//   },
//   audio14: function () {
//     this.audioCtx.seek(14)
//   },
//   audioStart: function () {
//     this.audioCtx.seek(0)
//   }
// })


////////////////////////////////////////  image
// Page({
//   data: {
//     array: [{
//       mode: 'scaleToFill',
//       text: 'scaleToFill：不保持纵横比缩放图片，使图片完全适应'
//     }, {
//       mode: 'aspectFit',
//       text: 'aspectFit：保持纵横比缩放图片，使图片的长边能完全显示出来'
//     }, {
//       mode: 'aspectFill',
//       text: 'aspectFill：保持纵横比缩放图片，只保证图片的短边能完全显示出来'
//     }, {
//       mode: 'top',
//       text: 'top：不缩放图片，只显示图片的顶部区域'
//     }, {
//       mode: 'bottom',
//       text: 'bottom：不缩放图片，只显示图片的底部区域'
//     }, {
//       mode: 'center',
//       text: 'center：不缩放图片，只显示图片的中间区域'
//     }, {
//       mode: 'left',
//       text: 'left：不缩放图片，只显示图片的左边区域'
//     }, {
//       mode: 'right',
//       text: 'right：不缩放图片，只显示图片的右边边区域'
//     }, {
//       mode: 'top left',
//       text: 'top left：不缩放图片，只显示图片的左上边区域'
//     }, {
//       mode: 'top right',
//       text: 'top right：不缩放图片，只显示图片的右上边区域'
//     }, {
//       mode: 'bottom left',
//       text: 'bottom left：不缩放图片，只显示图片的左下边区域'
//     }, {
//       mode: 'bottom right',
//       text: 'bottom right：不缩放图片，只显示图片的右下边区域'
//     }],
//     src: '../images/01_blue.png'
//   },
//   imageError: function (e) {
//     console.log('image3发生error事件，携带值为', e.detail.errMsg)
//   }
// })



/////////////////////   video
// function getRandomColor() {
//   let rgb = []
//   for (let i = 0; i < 3; ++i) {
//     let color = Math.floor(Math.random() * 256).toString(16)
//     color = color.length == 1 ? '0' + color : color
//     rgb.push(color)
//   }
//   return '#' + rgb.join('')
// }

// Page({
//   onReady: function (res) {
//     this.videoContext = wx.createVideoContext('myVideo')
//   },
//   inputValue: '',
//   data: {
//     src: '',
//     danmuList: [
//       {
//         text: '第 1s 出现的弹幕',
//         color: '#ff0000',
//         time: 1
//       },
//       {
//         text: '第 3s 出现的弹幕',
//         color: '#ff00ff',
//         time: 3
//       },
//       {
//         text: '第 20s 出现的弹幕',
//         color: '#ff00ff',
//         time: 20
//       }]
//   },
//   bindInputBlur: function (e) {
//     this.inputValue = e.detail.value
//   },
//   bindButtonTap: function () {
//     var that = this
//     wx.chooseVideo({
//       sourceType: ['album', 'camera'],
//       maxDuration: 60,
//       camera: ['front', 'back'],
//       success: function (res) {
//         that.setData({
//           src: res.tempFilePath
//         })
//       }
//     })
//   },
//   bindSendDanmu: function () {
//     this.videoContext.sendDanmu({
//       text: this.inputValue,
//       color: getRandomColor()
//     })
//   }
// })



//map
// Page({
//   data: {
//     latitude: 23.099994,
//     longitude: 113.324520,
//     markers: [{
//       latitude: 23.099994,
//       longitude: 113.324520,
//       name: '嘉盛中心'
//     }],
//     covers: [{
//       latitude: 23.099994,
//       longitude: 113.344520,
//       iconPath: '/image/green_tri.png', // 目前有 bug，正确的写法应该是 /image/green_tri.png ，等我们下个版本修复吧T_T 
//     }, {
//       latitude: 23.099994,
//       longitude: 113.304520,
//       iconPath: '/image/green_tri.png',
//       rotate: 180
//     }]
//   }
// })



var app = getApp()
Page({
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    toView: 'red',
    scrollTop: 100
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  tap: function (e) {
    for (var i = 0; i < order.length; ++i) {
      if (order[i] === this.data.toView) {
        this.setData({
          toView: order[i + 1]
        })
        break
      }
    }
  },
  tapMove: function (e) {
    this.setData({
      scrollTop: this.data.scrollTop + 10
    })
  },
  onLoad: function () {
    
  }
})

