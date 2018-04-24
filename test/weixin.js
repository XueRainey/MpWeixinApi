const fs = require('fs')
const path = require('path')
const { WeiXin } = require('../lib')

;(async function run () {
  const userInfoCachePath = path.resolve(__dirname, '../cache/weixin.userinfo.json')
  const platformer = new WeiXin(require(userInfoCachePath), {
    debug: false
  })

  platformer.addListener('loginHook', (status, data) => {
    console.log(status)
    if (status === 'qrImageDownload') {
      // `data:${data.fileType};base64,${data.buffer.toString('base64')}`
      fs.writeFileSync('./ab.jpeg', data.buffer.toString('binary'), 'binary', console.log)
    }
    if (status === 'finish') {
      fs.writeFileSync(userInfoCachePath, JSON.stringify(platformer.info(), null, 4))
    }
  })

  if (!await platformer.checkLogin()) await platformer.login()
  await platformer.updatePlatformerInfo()
})()