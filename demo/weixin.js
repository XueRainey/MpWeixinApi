const fs = require('fs')
const path = require('path')
const { WeiXin } = require('../lib')
const { weixin: weixinLoginInfo } = require('../cache/loginInfo')

;(async function run () {
  try {
    const userInfoCachePath = path.resolve(__dirname, '../cache/weixin.userinfo.json')
    const platformer = new WeiXin()

    platformer.addListener('onUserInfoChange', () => {
      fs.writeFileSync(userInfoCachePath, JSON.stringify(platformer.info(), null, 2))
    })

    platformer.addListener('loginHook', (status, data) => {
      console.log(status)
      if (status === 'qrImageDownload') fs.writeFileSync('./cache/qr.jpeg', data.buffer.toString('binary'), 'binary', console.log)
    })

    if (!await platformer.checkLogin()) await platformer.login(weixinLoginInfo)
    console.log('login:', await platformer.checkLogin())
  } catch (e) {
    console.error(e.message)
  }
})()