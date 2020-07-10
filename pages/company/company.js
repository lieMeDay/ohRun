// pages/company/company.js
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
      title: '百团大战', //导航栏 中间的标题
      showBackPre: 0, //显示返回上一页
      showBackHome: 0, //显示返回主页
    },
    height: app.globalData.height * 2 + 20,
    allList:[]
  },
  // 获取openId
  getOpenId() {
    if (app.globalData.openId) {
      this.setData({
        openId: app.globalData.openId,
      })
      this.getmyCompany()
    } else {
      app.getOpenIdCallback = res => {
        this.setData({
          openId: res.openid
        })
        this.getmyCompany()
      }
    }
  },
  // 我是否加入战队
  getmyCompany(){
    let that = this
    let oo = {
      openId: that.data.openId
    }
    tool({
      url: '/team/getCompanyList',
      data: oo
    }).then(res => {
      let rr = res.data.data
      if (rr.length <= 0) {
        wx.redirectTo({
          url: '/pages/creatJoinc/creatJoinc',
        })
      }
    })
  },
  // 所有战队
  getAllCompany(){
    let that=this
    tool({
      url:"/team/getCompanyList",
      data:{openId:''}
    }).then(res=>{
      let rr=res.data.data
      rr.forEach(v=>{
        v.showDate=util.timeChange(v.creatTime,2)
      })
      that.setData({
        allList:rr
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getAllCompany()
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