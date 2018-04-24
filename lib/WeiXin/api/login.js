const fs = require('fs')
const md5 = require('md5')

async function _startLogin (platformer) {
  const { username, password } = platformer.info()
  const { base_resp } = await platformer.xpost({
    url: platformer.makeUrl('/cgi-bin/bizlogin', { action: 'startlogin' }),
    form: {
      username,
      pwd: md5(password),
      imgcode: '',
      f: 'json',
      token: '',
      lang: 'zh_CN',
      ajax: 1
    },
    headers: {
      Referer: platformer.baseUrl
    }
  })
  if (base_resp.ret) throw new Error(base_resp.err_msg)
}

async function _askScanQrcodeStatus (platformer) {
  const { username } = platformer.info()
  const { status } = await platformer.xget({
    url: platformer.makeUrl('/cgi-bin/loginqrcode', {
      action: 'ask',
      token: '',
      lang: 'zh_CN',
      f: 'json',
      ajax: 1
    }),
    headers: {
      Referer: `${platformer.baseUrl}/cgi-bin/bizlogin?action=validate&lang=zh_CN&account=${encodeURIComponent(username)}`
    }
  })
  return status
}

async function _endLogin (platformer) {
  const { base_resp, redirect_url } = await platformer.xpost({
    url: platformer.makeUrl('/cgi-bin/bizlogin', { action: 'login' }),
    form: {
      f: 'json',
      token: '',
      lang: 'zh_CN',
      ajax: 1
    },
    headers: {
      Referer: platformer.baseUrl
    }
  })
  if (base_resp.ret) throw new Error(base_resp.err_msg)

  return redirect_url.match(/token=(\d*)/)[1]
}

async function login (platformer) {
  await _startLogin(platformer)
  // download qrimage
  const qrUrl = platformer.makeUrl('/cgi-bin/loginqrcode', {
    action: 'getqrcode',
    param: 4300,
    rd: Number.parseInt(Math.random() * 1000)
  })
  await platformer.xget(qrUrl, { returnResponse: true, encoding: 'binary' })
    .then(response => {
      platformer.emit('loginHook', 'qrImageDownload', {
        fileType: response.headers['content-type'],
        buffer: Buffer.from(response.body, 'binary')
      })
    })

  while (true) {
    await new Promise((resolve) => setTimeout(() => resolve(), 1000))
    const status = await _askScanQrcodeStatus(platformer)
    if (status === 0) {
      platformer.emit('loginHook', 'waitScan', status)
    }
    if (status === 4) {
      platformer.emit('loginHook', 'waitConfirm', status)
    }
    if (status === 1) {
      platformer.emit('loginHook', 'confirmed', status)
      break
    }
  }

  platformer._setUserInfo({
    token: await _endLogin(platformer),
    loginTime: Date.now()
  })

  await platformer.updatePlatformerInfo(platformer)
  platformer.emit('loginHook', 'finish')
}

async function checkLogin (platformer) {
  const { token } = platformer.info()

  const { base_resp } = await platformer.xget(platformer.makeUrl('/cgi-bin/bizlogin', {
    t: 'home/index',
    lang: 'zh_CN',
    token,
    f: 'json'
  }))

  if (base_resp.ret) return false
  return true
}

module.exports = {
  login,
  checkLogin
}
