const fs = require('fs')
const path = require('path')
const { BaiDu } = require('../lib')

;(async function run () {
  const userInfoCachePath = path.resolve(__dirname, '../cache/baidu.userinfo.json')
  const platformer = new BaiDu(require(userInfoCachePath), {
    cachePath: path.resolve(__dirname, '../cache'),
    debug: true
  })

  platformer.addListener('loginHook', (status) => {
    console.log(status)
    if (status === 'finish') {
      console.log(platformer.userInfo.cookieData)
      fs.writeFileSync(userInfoCachePath, JSON.stringify(platformer.info(), null, 4))
    }
  })
  // await platformer.checkLogin()
  // console.log('------------------------------------------------------------------------')
  await platformer.login()
  // console.log('------------------------------------------------------------------------')
  // await platformer.checkLogin()
  // if (!await platformer.checkLogin()) await platformer.login()
  // await platformer.updatePlatformerInfo(platformer)
})()
