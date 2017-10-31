const Base = require('./base')
const md5 = require('md5')
const fs = require('fs')

class MpWeixin extends Base {
  constructor (userInfo, options) {
    super(options)
    this._initUserInfo(userInfo)
    this.defaultHost = 'https://mp.weixin.qq.com'
  }

  _initUserInfo (userInfo = {}) {
    if (!userInfo.username) throw new Error('no username!')
    if (!userInfo.password) throw new Error('no password!')
    this.userInfo = userInfo
  }

  _setUserInfo (_userInfo = {}) {
    if (!this.userInfo) this.userInfo = {}
    Object.assign(this.userInfo, _userInfo)
  }

  async login () {
    await this.startLogin()

    // download qrimage
    const qrUrl = `${this.defaultHost}/cgi-bin/loginqrcode?action=getqrcode&param=4300&rd=${Number.parseInt(Math.random() * 1000)}`
    this.request(qrUrl)
      .pipe(fs.createWriteStream(`${this.cachePath}/qr.png`))
      .on('error', e => {
        throw e
      })

    await this.askScanQrcodeStatus()

    while (true) {
      await new Promise((resolve) => setTimeout(() => resolve(), 1000))
      const status = await this.askScanQrcodeStatus()
      if (status === 0) console.log('wait scan...')
      if (status === 4) console.log('wait confirm...')
      if (status === 1) {
        console.log('login success...')
        break
      }
    }
    const token = await this.endLogin()
    this._setUserInfo({ token })
  }

  async startLogin () {
    const { username, password } = this.userInfo
    const { base_resp } = await this.request.xpost({
      url: `${this.defaultHost}/cgi-bin/bizlogin?action=startlogin`,
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
        Referer: 'https://mp.weixin.qq.com'
      }
    })
    if (base_resp.ret) throw new Error(base_resp.err_msg)
  }

  async askScanQrcodeStatus () {
    const { username } = this.userInfo
    const { status } = await this.request.xget({
      url: 'https://mp.weixin.qq.com/cgi-bin/loginqrcode?action=ask&token=&lang=zh_CN&f=json&ajax=1',
      headers: {
        Referer: `https://mp.weixin.qq.com/cgi-bin/bizlogin?action=validate&lang=zh_CN&account=${encodeURIComponent(username)}`
      }
    })
    return status
  }

  async endLogin () {
    const { base_resp, redirect_url } = await this.request.xpost({
      url: 'https://mp.weixin.qq.com/cgi-bin/bizlogin?action=login',
      form: {
        f: 'json',
        token: '',
        lang: 'zh_CN',
        ajax: 1
      },
      headers: {
        Referer: 'https://mp.weixin.qq.com/'
      }
    })
    if (base_resp.ret) throw new Error(base_resp.err_msg)
    // redirect_url
    return redirect_url.match(/token=(\d*)/)[1]
  }
}

module.exports = MpWeixin
