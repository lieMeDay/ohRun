let tool = require('./util').tool
const addUser = (obj) => {
  tool({
    url: '/team/addWxPerson',
    data: obj,
    method: 'POST'
  })
}
const getUser = (obj) => {
  return new Promise((resolve, reject) => {
    tool({
      url: '/team/getWxPerson',
      data: obj
    }).then(res => {
      // console.log(res.data.data)
      return resolve(res.data.data)
    })
  })
}
const putUser = (obj) => {
  tool({
    url: '/team/editWxPerson',
    data: obj,
    method: 'POST'
  })
}

module.exports = {
  addUser: addUser,
  getUser: getUser,
  putUser: putUser
}