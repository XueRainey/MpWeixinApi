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
      Referer: platformer.host
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
      Referer: `${platformer.host}/cgi-bin/bizlogin?action=validate&lang=zh_CN&account=${encodeURIComponent(username)}`
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
      Referer: platformer.host
    }
  })
  if (base_resp.ret) throw new Error(base_resp.err_msg)
  // redirect_url
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
  platformer.request(qrUrl)
    .pipe(fs.createWriteStream(`${platformer.options.cachePath}/qr.png`)) // todo: cache通过platformer get
    .on('error', e => {
      throw e
    })

  while (true) {
    await new Promise((resolve) => setTimeout(() => resolve(), 1000))
    const status = await _askScanQrcodeStatus(platformer)
    if (status === 0) console.log('wait scan...')
    if (status === 4) console.log('wait confirm...')
    if (status === 1) {
      console.log('login success...')
      break
    }
  }
  platformer._setUserInfo({
    token: await _endLogin(platformer)
  })
  platformer.updatePlatformerInfo(platformer)
}

module.exports = login
