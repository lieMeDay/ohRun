// 图片上传头
const imgUrl = "http://192.168.0.103:8989"

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

// 时间戳转正常格式
const timeChange = (timestamp, i) => {
  timestamp=Number(timestamp)
  var date = new Date(timestamp);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? "0" + m : m;
  var d = date.getDate();
  d = d < 10 ? "0" + d : d;
  var h = date.getHours();
  h = h < 10 ? "0" + h : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? "0" + minute : minute;
  second = second < 10 ? "0" + second : second;
  if (i == 1) {
    return y + "/" + m + "/" + d + " " + h + ":" + minute + ":" + second;
  } else if (i == 2) {
    return y + "-" + m + "-" + d
  }
}

module.exports = {
  imgUrl: imgUrl, //图片请求地址
  tool: request, //接口调用
  timeChange: timeChange, // 时间戳转正常格式
}