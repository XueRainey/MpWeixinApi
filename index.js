const path = require('path')
const MpWeixin = require('./src')
const userInfo = require('./cache/user.json')

;(async function run () {
  const demo = new MpWeixin(userInfo, {
    cookieJarPath: path.resolve(__dirname, './cache/cookiesJar.json'),
    cachePath: path.resolve(__dirname, './cache')
  })

  await demo.login()
  console.log(demo.userInfo)
})()
