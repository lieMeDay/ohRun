// pages/seeTeam/seeTeam.js
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
      title: '团队信息', //导航栏 中间的标题
      showBackPre: 0, //显示返回上一页
      showBackHome: 0, //显示返回主页
    },
    height: app.globalData.height * 2 + 20,
    currI:1,
    auditNum:0
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
  // 获取openId
  getOpenId() {
    if (app.globalData.openId) {
      this.setData({
        openId: app.globalData.openId,
      })
      this.getTeamMsg()
    } else {
      app.getOpenIdCallback = res => {
        this.setData({
          openId: res.openid
        })
        this.getTeamMsg()
      }
    }
  },
  // 获取团队信息及与我的关系
  getTeamMsg() {
    let that = this
    let td = that.data
    let oo = {
      id: td.teamId,
      openId: td.openId
    }
    tool({
      url: '/team/getTeamInfo',
      data: oo
    }).then(res => {
      let rr = res.data.data
      rr.showDate = rr.creatTime.slice(0,10)
      that.setData({
        teamMsg: rr
      })
    })
  },
  // 获取团队成员
  getTeamPre(){
    let that=this
    let oo={
      id:that.data.teamId
    }
    tool({
      url:'/team/getTeamPerson',
      data:oo
    }).then(res=>{
      let rr=res.data.data
      rr=rr.filter(v=>v.status==1)
      let dd=res.data.data
      let atn=that.data.auditNum
      dd=dd.filter(v=>v.status==3)
      atn+=dd.length
      that.setData({
        userList:rr,
        auditNum:atn
      })
    })
  },
  toggleList(e) {
    this.setData({
      currI: e.currentTarget.dataset.i
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.nav_status()
    // options.teamId = 11
    this.setData({
      teamId: options.teamId
    })
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
    this.setData({
      auditNum:0
    })
    this.getOpenId()
    this.getTeamPre()
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