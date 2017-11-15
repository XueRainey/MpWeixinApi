const fs = require('fs')
const path = require('path')
const { WeiXin } = require('./lib')

;(async function run () {
  const userInfoCachePath = path.resolve(__dirname, './cache/weixin.userinfo.json')
  const platformer = new WeiXin(require(userInfoCachePath), {
    cachePath: path.resolve(__dirname, './cache')
  })
  platformer.addListener('onUserInfoChange', () => {
    fs.writeFileSync(userInfoCachePath, JSON.stringify(platformer.info(), null, 4))
  })
  if (!await platformer.checkLogin()) await platformer.login()
  await platformer.updatePlatformerInfo(platformer)
})()
