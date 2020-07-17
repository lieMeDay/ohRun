// pages/setting/setting.js
const app = getApp()
const util = require('../../utils/util.js')
const userFun = require('../../utils/user')
const tool = util.tool
Page({

  /*
   * 页面的初始数据
   */
  data: {
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '设置', //导航栏 中间的标题
      showBackPre: 0, //显示返回上一页
      showBackHome: 0, //显示返回主页
    },
    height: app.globalData.height * 2 + 20,
    type: '', // 1 战队设置 , 2 团队设置
    user: false,
    comId: '',
    showAlert: false,
    showStateI: '', // 1 战队修改 2 团队修改
    showAS: '', //弹框修改 input 或 textarea
    showName: '',
    inputValue: '',
    companyMsg: {}
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
  // 获取我的个人信息
  getMyMsg() {
    let that = this
    let oo = {
      openId: this.data.openId
    }
    userFun.getUser(oo).then(r => {
      // console.log(r)
      this.setData({
        myMsg: r
      })
    })
    if(that.data.type=='c'){
      let op={id:that.data.comId}
      tool({
        url:'/team/getCompanyPerson',
        data:op
      }).then(res=>{
        let rr=res.data.data
        rr=rr.filter(v=>v.openId==this.data.openId)
        that.setData({
          myComMsg:rr[0]
        })
      })
    }else if(that.data.type=='t'){
      let op={id:that.data.teamId}
      tool({
        url:'/team/getTeamPerson',
        data:op
      }).then(res=>{
        let rr=res.data.data
        rr=rr.filter(v=>v.openId==this.data.openId)
        that.setData({
          myTeamMsg:rr[0]
        })
      })
    }
  },
  // 按钮获取用户信息
  getUserInfo(e) {
    let that = this
    let td=that.data
    let r=td.myMsg
    // console.log(e)
    if (e.detail.errMsg == "getUserInfo:ok") {
      app.globalData.userInfo = e.detail.userInfo
      let userInfo= e.detail.userInfo
      r.nikeName = userInfo.nickName
      r.sex = userInfo.gender
      r.city = userInfo.city
      r.headImgUrl = userInfo.avatarUrl
      that.editMymsg(r)
    }
  },
  // 获取openId
  getOpenId() {
    if (app.globalData.openId) {
      this.setData({
        openId: app.globalData.openId,
      })
      this.getMyMsg()
      if (this.data.type == 'c') {
        this.getmyCompany()
      } else if (this.data.type == 't') {
        this.getmyTeam()
      }
    } else {
      app.getOpenIdCallback = res => {
        this.setData({
          openId: res.openid
        })
        this.getMyMsg()
        if (this.data.type == 'c') {
          this.getmyCompany()
        } else if (this.data.type == 't') {
          this.getmyTeam()
        }
      }
    }
  },
  // 获取战队信息及与我的关系
  getmyCompany() {
    let that = this
    let oo = {
      openId: that.data.openId,
      id: that.data.comId
    }
    tool({
      url: '/team/getCompanyBrief',
      data: oo
    }).then(res => {
      let rr = res.data.data
      if (rr && rr.type == 3) {
        this.getCompany()
      } else if (rr && rr.type != 0 && rr.type != 1 && rr.type != 2) {
        that.setData({
          user: true
        })
      } else {
        if (getCurrentPages().length == 1) {
          wx.switchTab({
            url: '/pages/company/company',
          })
        } else {
          wx.navigateBack()
        }
      }
    })
  },
  // 取消
  cancle() {
    this.setData({
      showAlert: false,
      showStateI: '',
      showName: '',
      showAS: '',
      inputValue: ''
    })
  },
  // 确认
  sure() {
    let that = this
    let td = that.data
    // console.log(td.showStateI, td.showName, td.inputValue)
    if (td.showStateI == 1) {
      let cm = td.companyMsg
      cm[td.showName] = td.inputValue
      that.editCompany(cm)
    } else if (td.showStateI == 2) {
      let tm = td.teamMsg
      tm[td.showName] = td.inputValue
      that.editTeam(tm)
    } else if (td.showStateI == 3) {
      let mm = td.myMsg
      mm[td.showName] = td.inputValue
      mm.nikeName = td.inputValue
      that.editMymsg(mm)
    } else if (td.showStateI == 4) {
      let mm = td.myMsg
      mm[td.showName] = td.inputValue
      that.editMymsg(mm)
    }
  },
  // 换头像
  toggleLogo(e) {
    let that = this
    let s = e.currentTarget.dataset.i
    let cm = that.data.companyMsg
    let tm = that.data.teamMsg
    let mm = that.data.myMsg
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: util.imgUrl + "/team/uploadImg",
          filePath: tempFilePaths[0],
          name: 'img',
          success(res) {
            // console.log(res)
            let imgName = JSON.parse(res.data).data.img
            if (s == 1) {
              cm.logo = imgName
              that.editCompany(cm)
            } else if (s == 2) {
              tm.logo = imgName
              that.editTeam(tm)
            } else if (s == 3) {
              mm.headImgUrl = imgName
              that.editMymsg(mm)
            }
          }
        })
      }
    })
  },
  // 文字内容修改
  editName(e) {
    let that = this
    let i = e.currentTarget.dataset.i
    let s = e.currentTarget.dataset.s
    let v = e.currentTarget.dataset.v
    that.setData({
      showStateI: i,
      showAS: s,
      showName: v,
      showAlert: true
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  // 获取战队信息
  getCompany() {
    let that = this
    let oo = {
      id: that.data.comId
    }
    tool({
      url: '/team/getCompanyById',
      data: oo
    }).then(res => {
      let rr = res.data.data
      that.setData({
        companyMsg: rr
      })
    })
  },
  // 战队申请加入审核
  comSwitch1(e) {
    let that = this
    let ee = e.detail.value
    let cm = that.data.companyMsg
    if (ee) {
      cm.stateCom = 2
    } else {
      cm.stateCom = 1
    }
    that.editCompany(cm)
  },
  // 团队创建审核
  comSwitch2(e) {
    let that = this
    let ee = e.detail.value
    let cm = that.data.companyMsg
    if (ee) {
      cm.stateTeam = 2
    } else {
      cm.stateTeam = 1
    }
    that.editCompany(cm)
  },
  // 战队信息修改
  editCompany(cm) {
    let that = this
    tool({
      url: '/team/editConpany',
      data: cm,
      method: "POST",
      load: true
    }).then(res => {
      that.setData({
        companyMsg: cm,
        showAlert: false,
        showStateI: '',
        showName: '',
        showAS: '',
        inputValue: ''
      })
    })
  },
  // 获取团队信息及与我的关系
  getmyTeam() {
    let that = this
    let oo = {
      openId: that.data.openId,
      id: that.data.teamId
    }
    tool({
      url: '/team/getTeamInfo',
      data: oo
    }).then(res => {
      let rr = res.data.data
      if (rr) {
        that.setData({
          teamMsg: rr
        })
        if (rr.type2 == 3) {
          that.setData({
            user: true
          })
        }
      } else {
        if (getCurrentPages().length == 1) {
          wx.switchTab({
            url: '/pages/company/company',
          })
        } else {
          wx.navigateBack()
        }
      }
    })
  },
  // 团队申请加入审核
  comSwitch3(e) {
    let that = this
    let ee = e.detail.value
    let tm = that.data.teamMsg
    if (ee) {
      tm.type = 1
    } else {
      tm.type = 2
    }
    tool({
      url: '/team/editTeamType',
      data: {
        id: tm.id
      }
    })
  },
  // 团队信息修改
  editTeam(tm) {
    let that = this
    let oo = {
      name: tm.name,
      logo: tm.logo,
      info: tm.info,
      slogan: tm.slogan,
      id: tm.id
    }
    tool({
      url: '/team/editTeam',
      data: oo,
      method: "POST"
    }).then(res => {
      that.setData({
        teamMsg: tm,
        showAlert: false,
        showStateI: '',
        showName: '',
        showAS: '',
        inputValue: ''
      })
    })
  },
  // 我的信息修改
  editMymsg(mm) {
    let that = this
    userFun.putUser(mm)
    that.setData({
      myMsg: mm,
      showAlert: false,
      showStateI: '',
      showName: '',
      showAS: '',
      inputValue: ''
    })
  },
  // 普通人退出战队
  outCompany(){
    let that=this
    let td=that.data
    let msg=td.myComMsg
    // console.log(msg)
    let j={ids:msg.id}
    tool({
      url:'/team/deleteCompanyPerson',
      data:j
    }).then(res=>{
      wx.redirectTo({
        url: '/pages/creatJoinc/creatJoinc',
      })
    })
  },
  // 普通人退出团队
  outTeam(){
    let that=this
    let td=that.data
    let msg=td.myTeamMsg
    // console.log(msg)
    let j={ids:msg.id}
    tool({
      url:'/team/deleteTeamPerson',
      data:j
    }).then(res=>{
      wx.navigateBack()
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.nav_status()
    wx.hideShareMenu()
    // options.type = 'c'
    // options.comId = 7
    if (options.comId) {
      this.setData({
        comId: options.comId,
      })
    } else {
      this.setData({
        teamId: options.teamId
      })
    }
    this.setData({
      type: options.type
    })
    if (options.type == 'c') {
      this.setData({
        'nvabarData.title': "战队设置"
      })
    } else if (options.type == 't') {
      this.setData({
        'nvabarData.title': "团队设置"
      })
    }
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})