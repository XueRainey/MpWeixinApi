const fs = require('fs')
const path = require('path')
const { WeiBo } = require('../lib')

;(async function run () {
  const userInfoCachePath = path.resolve(__dirname, '../cache/weibo.userinfo.json')
  const platformer = new WeiBo({
    cachePath: path.resolve(__dirname, '../cache'),
    debug: false
  }, require(userInfoCachePath))

  platformer.addListener('loginHook', (status) => {
    console.log(status)
  })

  platformer.addListener('onUserInfoChange', () => {
    fs.writeFileSync(userInfoCachePath, JSON.stringify(platformer.info(), null, 2))
  })
  if (!await platformer.checkLogin()) await platformer.login()
})()
