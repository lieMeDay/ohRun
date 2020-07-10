// pages/news/news.js
const app = getApp()
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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