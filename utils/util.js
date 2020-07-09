// 图片上传头
const imgUrl="http://192.168.0.103:8989"

// 接口调用函数
const request = (options) => {
  let BaseUrl = 'http://192.168.0.103:8989'
  return new Promise((resolve, reject) => {
    if (!options.method) {
      options.method = "GET"
    }
    Object.assign(options, {
      url: BaseUrl + options.url,
      data: options.data,
      header: {
        "Content-Type": "application/json"
      },
      success: resolve,
      fail: reject,
      complete: (res) => {
        if (options.load) {
          wx.hideLoading({
            fail: (res) => {
              console.log('已关闭')
            },
          })
        }
      },
    })
    if (options.load) {
      wx.showLoading({
        title: '加载中...',
      })
    }
    wx.request(options)
  })
}

module.exports = {
  imgUrl: imgUrl,
  tool: request
}