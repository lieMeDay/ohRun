//app.js
var utils = require('./utils/util.js')
var userFun = require('./utils/user')
App({
  onLaunch: function (options) {
    console.log(options.scene)
    // 判断是否由分享进入小程序
    if (options.scene == 1007 || options.scene == 1008) {
      this.globalData.share = true
    } else {
      this.globalData.share = false
    };
    //获取设备顶部窗口的高度（不同设备窗口高度不一样，根据这个来设置自定义导航栏的高度）
    //这个最初我是在组件中获取，但是出现了一个问题，当第一次进入小程序时导航栏会把
    //页面内容盖住一部分,当打开调试重新进入时就没有问题，这个问题弄得我是莫名其妙
    //虽然最后解决了，但是花费了不少时间
    // let menuButtonObject = wx.getMenuButtonBoundingClientRect();
    // console.log(menuButtonObject)
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.height = res.statusBarHeight
      }
    })
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        let JSCODE = res.code
        utils.tool({
          url: "/team/getOpenId",
          data: {
            code: JSCODE
          },
          load: true
        }).then(res => {
          let rr = res.data.data
          this.globalData.openId = rr.openid
          // 可能会在 Page.onLoad 之后才返回
          // 所以此处加入 callback 以防止这种情况
          if (this.getOpenIdCallback) {
            this.getOpenIdCallback(rr)
          }
          let oo = {
            openId: rr.openid
          }
          userFun.getUser(oo).then(r => {
            if (r) {
              // 修改
              // wx.getSetting({
              //   success: res => {
              //     if (res.authSetting['scope.userInfo']) {
              //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              //       wx.getUserInfo({
              //         success: res => {
              //           // 可以将 res 发送给后台解码出 unionId
              //           var userInfo = res.userInfo
              //           r.nikeName = userInfo.nickName
              //           r.headImgUrl = userInfo.avatarUrl
              //           r.sex = userInfo.gender //性别 0：未知、1：男、2：女
              //           r.city = userInfo.city
              //           userFun.putUser(r)
              //         }
              //       })
              //     }
              //   }
              // })
            } else {
              // 添加
              let mm = {
                openId: rr.openid,
                nikeName: '',
                sex: '',
                city: '',
                phone: '',
                name: '',
                headImgUrl: ''
              }
              userFun.addUser(mm)
            }
          })
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    openId: null,
    userInfo: null,
    share: false, // 分享默认为false
    height: 0,
  }
})