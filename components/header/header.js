const app = getApp()
Component({
  properties: {
    navbarData: { //navbarData   由父页面传递的数据，变量名字自命名
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {}
    }
  },
  data: {
    height: '',
    //默认值  默认显示左上角
    navbarData: {
      showCapsule: 0,
      showBackPre: 0, //显示返回上一页
      showBackHome: 0, //显示返回主页
    }
  },
  attached: function () {
    // 获取是否是通过分享进入的小程序
    // 只有当前一个界面
    // console.log(getCurrentPages(),getCurrentPages()[0].route)
    if (getCurrentPages().length == 1 && app.globalData.share) {
      let obj = {
        showCapsule: 1,
        showBackHome: 1,
        showBackPre: 0,
        title:this.data.navbarData.title
      }
      this.setData({
        navbarData: obj,
      })
    } else if (getCurrentPages().length == 1 && (getCurrentPages()[0].route != 'pages/active/active' && getCurrentPages()[0].route != 'pages/dynamic/dynamic' && getCurrentPages()[0].route != 'pages/team/team'&& getCurrentPages()[0].route != 'pages/mine/mine')) {
      let obj = {
        showCapsule: 1,
        showBackHome: 1,
        showBackPre: 0,
        title:this.data.navbarData.title
      }
      this.setData({
        navbarData: obj,
      })
    }
    // 定义导航栏的高度   方便对齐
    this.setData({
      height: app.globalData.height
    })
  },
  methods: {
    // 返回上一页面
    _navback() {
      wx.navigateBack()
    },
    //返回到首页
    _backhome() {
      wx.switchTab({
        url: '/pages/company/company',
      })
    }
  }

})