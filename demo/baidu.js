const fs = require('fs')
const path = require('path')
const { BaiDu } = require('../lib')
const { baidu: baiduLoginInfo } = require('../lib')

;(async function run () {
  const userInfoCachePath = path.resolve(__dirname, '../cache/baidu.userinfo.json')
  const platformer = new BaiDu({
    debug: false
  }, require(userInfoCachePath))

  platformer.addListener('loginHook', (status) => {
    console.log(status)
  })
  // await platformer.checkLogin()
  // console.log('------------------------------------------------------------------------')
  await platformer.login(baiduLoginInfo)
  // console.log('------------------------------------------------------------------------')
  // await platformer.checkLogin()
  // if (!await platformer.checkLogin()) await platformer.login()
  // await platformer.updatePlatformerInfo(platformer)
})()
