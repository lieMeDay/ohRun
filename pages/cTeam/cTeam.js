// pages/cTeam/cTeam.js
const app = getApp()
const util = require('../../utils/util.js')
const tool = util.tool
Page({

  /*
   * 页面的初始数据
   */
  data: {
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '创建团队', //导航栏 中间的标题
      showBackPre: 1, //显示返回上一页
      showBackHome: 0, //显示返回主页
    },
    height: app.globalData.height * 2 + 20,
    showAlert: true,
    logo: '/image/add.png', //团队logo
  },
  // 获取openId
  getOpenId() {
    if (app.globalData.openId) {
      this.setData({
        openId: app.globalData.openId,
      })
    } else {
      app.getOpenIdCallback = res => {
        this.setData({
          openId: res.openid
        })
      }
    }
  },
  // 获取 是否需要审核
  getCompany(opt) {
    tool({
      url: '/team/getCompanyById',
      data: opt
    }).then(res => {
      let rr = res.data.data
      if (rr.stateTeam == 1) {
        this.setData({
          showAlert: false
        })
      } else {
        this.setData({
          showAlert: true
        })
      }
    })
  },
  // logo
  toggleImg() {
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        // // 上传图片
        wx.uploadFile({
          url: util.imgUrl + "/team/uploadImg",
          filePath: tempFilePaths[0],
          name: 'img',
          success(res) {
            // console.log(res)
            let imgName = JSON.parse(res.data).data.img
            that.setData({
              logo: imgName
            })
          }
        })
      }
    })
  },
  // 隐藏弹框
  hiddenAlert() {
    this.setData({
      showAlert: false
    })
  },
  ipt1(e) {
    this.setData({
      name: e.detail.value
    })
  },
  ipt2(e) {
    this.setData({
      slogan: e.detail.value
    })
  },
  ipt3(e) {
    this.setData({
      info: e.detail.value
    })
  },
  // 提交
  sub() {
    let that = this
    let td = that.data
    let obj = {
      name: td.name,
      logo: td.logo,
      info: td.info,
      slogan: td.slogan,
      companyId: td.companyId,
      openId: td.openId
    }
    let trueMsg = true
    for (let k in obj) {
      if (k == 'logo' && obj[k] == '/image/add.png') {
        that.tost('请上传团队logo')
        trueMsg = false
      } else if (k == 'name' && !obj[k]) {
        that.tost('请输入团队名称')
        trueMsg = false
      }
    }
    if (trueMsg) {
      tool({
        url: '/team/addTeam',
        data: obj,
        method: "POST"
      }).then(res => {
        // wx.redirectTo({
        //   url: '/pages/myCT/myCT?id=' + td.companyId + '&state=2',
        // })
        wx.switchTab({
          url: '/pages/team/team',
        })
      })
    }
  },
  // 提示内容
  tost(v) {
    wx.showToast({
      title: v,
      icon: 'none',
      duration: 2000
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options.comId=3
    wx.hideShareMenu()
    this.setData({
      companyId: options.comId
    })
    let oo = {
      id: options.comId
    }
    this.getCompany(oo)
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