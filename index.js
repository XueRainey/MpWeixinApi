const fs = require('fs')
const path = require('path')
const { MpWeixin } = require('./lib')

;(async function run () {
  const userInfoCachePath = path.resolve(__dirname, './cache/userInfo.json')
  const platformer = new MpWeixin(require(userInfoCachePath), {
    cachePath: path.resolve(__dirname, './cache')
  })
  platformer.addEventListener('onUserInfoChange', () => {
    fs.writeFileSync(userInfoCachePath, JSON.stringify(platformer.getUserInfo(), null, 4))
  })
  if (!await platformer.checkLogin()) await platformer.login()
})()
