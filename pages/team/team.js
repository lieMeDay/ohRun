// pages/myCT/myCT.js
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
      blue:1,
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title: '我的企业', //导航栏 中间的标题
      showBackPre: 0, //显示返回上一页
      showBackHome: 0, //显示返回主页
    },
    height: app.globalData.height * 2 + 20,
    myCompany: {},
    currI: 1,
    companyId: '',
    auditNum: 0,
    curClass: ''
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
  // 获取滚动固定高度
  getHeight() {
    var that = this;
    wx.createSelectorQuery().select('#head').boundingClientRect(function (rect) {
      rect.height; // 节点高度
    }).exec(function (res) {
      that.setData({
        headerHeight: res[0].height - (res[0].top / 2)
      })
    })
  },
  // 获取openId
  getOpenId() {
    if (app.globalData.openId) {
      this.setData({
        openId: app.globalData.openId,
        // openId:'o3VuM5YikzIzdADRbx81nuei1nno'
      })
      this.getmyCompany()
    } else {
      app.getOpenIdCallback = res => {
        this.setData({
          openId: res.openid
          // openId:'o3VuM5YikzIzdADRbx81nuei1nno'
        })
        this.getmyCompany()
      }
    }
  },
  // 获取我的战队
  getmyCompany() {
    let that = this
    let oo = {
      openId: that.data.openId
    }
    tool({
      url: '/team/getCompanyList',
      data: oo
    }).then(res => {
      let rr = res.data.data
      if (rr.length > 0) {
        if (rr[0].type == 0) {
          wx.redirectTo({
            url: '/pages/creatJoinc/creatJoinc',
          })
        } else {
          rr[0].showDate = util.timeChange(rr[0].creatTime, 2)
          that.setData({
            myCompany:rr[0],
            companyId:rr[0].id
          })
          that.getMyTeam()
        }
      } else {
        wx.redirectTo({
          url: '/pages/creatJoinc/creatJoinc',
        })
      }
    })
  },
  // 获取我的团队
  getMyTeam(){
    let that = this
    let td = that.data
    let oo = {
      id: td.companyId,
      openId: td.openId
    }
    tool({
      url: '/team/getCompanyTeams',
      data: oo
    }).then(res => {
      let rr = res.data.data
      rr = rr.filter(v => v.status != 2)
      that.setData({
        myTeam: rr
      })
    })
  },
  /*
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.nav_status()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getHeight()
    // wx.createSelectorQuery().select('.list_item').boundingClientRect(function (rect) {
    //   rect.height; // 节点高度
    // }).exec(function (res) {
    //   that.itemHeight = res[0].height;
    // })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      auditNum: 0
    })
    this.getOpenId()
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
  // 页面滚动
  onPageScroll(e) {
    if (e.scrollTop >= this.data.headerHeight && !this.data.curClass) {
      // 当页面顶端距离大于一定高度时
      this.setData({
        curClass: 'item_fix'
      })
    } else if (e.scrollTop <= this.data.headerHeight && this.data.curClass) {
      this.setData({
        curClass: ''
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})