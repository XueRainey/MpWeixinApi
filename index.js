const fs = require('fs')
const path = require('path')
const MpWeixin = require('./lib/MpWeixin')

;(async function run () {
  const userInfoCachePath = path.resolve(__dirname, './cache/userInfo.json')
  const demo = new MpWeixin(require(userInfoCachePath), {
    cachePath: path.resolve(__dirname, './cache'),
    onUserInfoChange: (userInfo) => {
      fs.writeFileSync(userInfoCachePath, JSON.stringify(userInfo, null, 4))
    }
  })
  await demo.login()
  console.log('login:', await demo.checkLogin())
})()
