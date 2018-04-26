const { encryptUsername, encryptPassord } = require('../helper/sso_encoder')
const querystring = require('querystring')

function getPreLoginData (platformer, { username }) {
  const su = encryptUsername(username)
  return platformer.xget(
    platformer.makeUrl('https://login.sina.com.cn/sso/prelogin.php', {
      entry: 'weibo',
      checkpin: 1,
      rsakt: 'mod',
      client: 'ssologin.js(v1.4.19)',
      su,
      _: Date.now()
    })
  ).then(res => Object.assign(res, { su }))
}

function realLogin (platformer, options) {
  const { pinCode, rsakv, nonce, servertime, su, sp } = options
  // showpin 是否显示验证码
  if (pinCode) throw new Error('你知道你的验证码逻辑还没写吗！！！！')
  return platformer.xpost({
    url: platformer.makeUrl('https://login.sina.com.cn/sso/login.php', { client: 'ssologin.js(v1.4.19)' }),
    form: {
      nonce,
      rsakv,
      servertime,
      su,
      sp,
      encoding: 'UTF-8',
      entry: 'weibo',
      from: '',
      gateway: 1,
      pagerefer: '',
      prelt: 296,
      pwencode: 'rsa2',
      returntype: 'META',
      savestate: 0,
      service: 'miniblog',
      sr: '1366*768',
      url: 'https://weibo.com/ajaxlogin.php?framelogin=1&callback=parent.sinaSSOController.feedBackUrlCallBack',
      useticket: 1,
      vsnf: 1
    },
    headers: {
      Referer: platformer.baseUrl
    },
    gzip: true
  }).then(html => {
    const reg = /location\.replace\((?:"|')(.*)(?:"|')\)/
    const loginUrl = reg.exec(html)[1]
    const { retcode } = querystring.parse(loginUrl)
    if (retcode === '0' || !retcode) {
      return loginUrl
    } else if (retcode === '101') {
      throw new Error('登录失败，登录名或密码错误')
    } else if (retcode === '2070') {
      throw new Error('登录失败，验证码错误')
    } else {
      throw new Error('未知错误')
    }
  })
}

function redirectCrazy (platformer, redirectUrl) {
  return platformer.xget(redirectUrl).then(html => {
    const reg = /location\.replace\((?:"|')(.*)(?:"|')\)/
    const loginUrl = reg.exec(html)[1]
    console.log(loginUrl)
    return platformer.xget(loginUrl)
  })
    .then(html => {
      const reg = /parent\.sinaSSOController\.feedBackUrlCallBack\((.*)\)/
      const arr = reg.exec(html)
      console.log(arr)
      if (!arr) throw new Error('微博403')
      return JSON.parse(arr[1])
    })
    .then(({ userinfo }) => ({
      uniqueid: userinfo.uniqueid,
      userdomain: userinfo.userdomain
    }))
}

async function login (platformer, loginInfo) {
  if (!loginInfo) loginInfo = platformer.getLoginInfo()
  if (!loginInfo.username) throw new Error('Must exist username!')
  if (!loginInfo.password) throw new Error('Must exist password!')
  const options = await getPreLoginData(platformer, loginInfo)
  platformer.emit('loginHook', 'preLoginDone')
  options.sp = encryptPassord(loginInfo.password, options)
  const redirectUrl = await realLogin(platformer, options)
  platformer.emit('loginHook', 'realLoginDone')
  const userInfo = await redirectCrazy(platformer, redirectUrl)
  platformer.emit('loginHook', 'redirectCrazyDone')
  platformer._setUserInfo({ ...userInfo, loginTime: Date.now() })
  platformer.emit('loginHook', 'finish')
}

async function checkLogin (platformer) {
  const html = await platformer.xget(platformer.baseUrl)
  return /\$CONFIG\['nick'\]='/.test(html)
}

module.exports = {
  login,
  checkLogin
}
