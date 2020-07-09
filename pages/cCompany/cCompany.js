// pages/cCompany/cCompany.js
const app = getApp()
const util = require('../../utils/util.js')
const userFun = require('../../utils/user')
const tool = util.tool
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '我的主页', //导航栏 中间的标题
    },

    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20 , 
    logo: '/image/add.png', //战队logo
    name: '', //公司/战队名称
    originator: '', //姓名
    phoneNumber: '', //手机号
    openId: '',
    showGPhone: true
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
  // logo
  toggleImg() {
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log(res)
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
  ipt1(e) {
    this.setData({
      name: e.detail.value
    })
  },
  ipt2(e) {
    this.setData({
      originator: e.detail.value
    })
  },
  ipt3(e) {
    this.setData({
      phoneNumber: e.detail.value
    })
  },
  // 获取手机号
  getPhone(e) {
    let that = this
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      wx.login({
        success: res => {
          let JSCODE = res.code
          tool({
            url: "/team/getOpenId",
            data: {
              code: JSCODE
            },
          }).then(res => {
            let rv = res.data.data
            let obj = {
              iv: e.detail.iv,
              encryptedData: e.detail.encryptedData,
              sessionKey: rv.session_key
            }
            tool({
              url: "/team/getPhone",
              data: obj,
            }).then(val => {
              let vv = val.data.data
              if (vv) {
                that.setData({
                  phoneNumber: vv.purePhoneNumber,
                  showGPhone: false
                })
              }
            })
          })
        }
      })
    }
  },
  // 提交
  sub() {
    let that = this
    let td = that.data
    let obj = {
      logo: td.logo, //战队logo
      name: td.name, //公司/战队名称
      originator: td.originator, //姓名
      phoneNumber: td.phoneNumber, //手机号
      openId: td.openId,
      creatTime: new Date().getTime()
    }
    let oo = {
      openId: td.openId
    }
    userFun.getUser(oo).then(r => {
      if (r) {
        // 修改
        r.phone=td.phoneNumber
        r.name=td.originator
        userFun.putUser(r)
      } else {
        // 添加
        let mm = {
          openId: td.openId,
          nikeName: '',
          sex: '',
          city: '',
          phone: td.phoneNumber,
          name: td.originator,
          headImgUrl: ''
        }
        userFun.addUser(mm)
      }
    })
    // console.log(obj)
    var sj = /^[1][3-8]\d{9}$|^([6|9])\d{7}$|^[0][9]\d{8}$|^[6]([8|6])\d{5}$/; //手机号包括港澳台
    let allMsg = true
    for (let k in obj) {
      if (!obj[k]) {
        if (k == 'name') {
          that.tost('请填写公司/组织名称')
        } else if (k == 'originator') {
          that.tost('请填写姓名')
        } else if (k == 'phoneNumber') {
          that.tost('请填写手机号')
        }
        allMsg = false
        break
      } else if (k == 'logo' && obj[k] == '/image/add.png') {
        that.tost('请选择logo')
        allMsg = false
        break
      } else if (k == 'phoneNumber' && !sj.test(obj[k])) {
        that.tost('请填写有效手机号')
        allMsg = false
        break
      }
    }
    if(allMsg){
      tool({
        url:'/team/addCompany',
        data:obj,
        method:'POST'
      }).then(res=>{
        wx.navigateTo({
          url: '/pages/myCT/myCT',
        })
      })
    }
  },
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