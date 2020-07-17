// pages/creatJoin/creatJoin.js
const app = getApp()
const util = require('../../utils/util.js')
const tool = util.tool
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 组件所需的参数
    nvabarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title: '', //导航栏 中间的标题 我的企业
      showBackPre: 0, //显示返回上一页
      showBackHome: 0, //显示返回主页
    },
    height: app.globalData.height * 2 + 20,
  },
  // 获取openId
  getOpenId() {
    if (app.globalData.openId) {
      this.setData({
        openId: app.globalData.openId,
      })
      this.goPage()
    } else {
      app.getOpenIdCallback = res => {
        this.setData({
          openId: res.openid
        })
        this.goPage()
      }
    }
  },
  nav_status() {
    if (getCurrentPages().length == 1) {
      this.setData({
        'nvabarData.showCapsule': 0,
        'nvabarData.showBackPre': 0, //显示返回上一页
        'nvabarData.showBackHome': 0, //显示返回主页
      })
    } else {
      this.setData({
        'nvabarData.showCapsule': 1,
        'nvabarData.showBackPre': 1, //显示返回上一页
        'nvabarData.showBackHome': 0, //显示返回主页
      })
    }
  },
  // 创建或加入前先判断有没有加入过 查询我的战队
  goPage(e) {
    let that = this
    let i = ''
    if (e) {
      i = e.currentTarget.dataset.i
    }
    let oo = {
      openId: that.data.openId
    }
    tool({
      url: '/team/getCompanyList',
      data: oo
    }).then(res => {
      let rr = res.data.data
      // rr存在直接到该战队详情
      if (rr.length > 0) {
        if (rr[0].type == 0) {
          if (i) {
            if (i == 1) {
              wx.navigateTo({
                url: '/pages/cCompany/cCompany',
              })
            } else if (i == 2) {
              wx.navigateTo({
                url: '/pages/saCT/saCT?status=c',
              })
            }
          } else {
            wx.showToast({
              title: '您已被拒绝加入战队,请创建或重新申请加入',
              icon: 'none',
              duration: 3000
            })
          }
        } else {
          // wx.redirectTo({
          //   url: `/pages/myCT/myCT?id=${rr[0].id}`
          // })
          wx.switchTab({
            url: '/pages/team/team',
          })
        }
      } else {
        if (i == 1) {
          wx.navigateTo({
            url: '/pages/cCompany/cCompany',
          })
        } else if (i == 2) {
          wx.navigateTo({
            url: '/pages/saCT/saCT?status=c',
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.nav_status()
    this.getOpenId()
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

  }
})