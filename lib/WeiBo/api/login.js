const { encryptUsername, encryptPassord } = require('../helper/sso_encoder')

function getPreLoginData (platformer) {
  const { username } = platformer.info()
  const su = encryptUsername(username)
  return platformer.xget(
    platformer.makeUrl('http://login.sina.com.cn/sso/prelogin.php', {
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
      url: 'http://weibo.com/ajaxlogin.php?framelogin=1&callback=parent.sinaSSOController.feedBackUrlCallBack',
      useticket: 1,
      vsnf: 1
    },
    headers: {
      Referer: platformer.baseUrl
    },
    gzip: true
  }).then(html => {
    const reg = /location\.replace\((?:"|')(.*)(?:"|')\)/
    const loginUrl = reg.exec(decodeURIComponent(html))[1]
    const retcode = (/retcode=(.*)&/).exec(loginUrl)[1]
    if (retcode === '0') {
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

async function login (platformer) {
  const options = await getPreLoginData(platformer)
  platformer.emit('loginHook', 'preLoginDone')
  const { password } = platformer.info()
  options.sp = encryptPassord(password, options)
  await realLogin(platformer, options)
  platformer._setUserInfo({ loginTime: Date.now() })
  platformer.emit('loginHook', 'finish')
}

async function checkLogin (platformer) {
  // https://www.weibo.com
  // console.log(platformer.request.debug)
  platformer.xget(platformer.baseUrl)
    .then(decodeURIComponent)
    .then((html) => {
      // console.log(html)
      const fs = require('fs')
      fs.writeFileSync('./a.html', html)
    })
}

module.exports = {
  login,
  checkLogin
}
