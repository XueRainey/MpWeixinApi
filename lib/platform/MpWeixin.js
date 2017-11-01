const fs = require('fs')
const md5 = require('md5')
const Base = require('./Base')
const defaultOptions = require('./defaultOptions')

class MpWeixin extends Base {
  constructor (userInfo, options) {
    const opt = Object.assign(defaultOptions, options)
    super(userInfo, opt)
  }

  async login () {
    await this._startLogin()
    // download qrimage
    const qrUrl = this.makeUrl('/cgi-bin/loginqrcode', {
      action: 'getqrcode',
      param: 4300,
      rd: Number.parseInt(Math.random() * 1000)
    })
    this.request(qrUrl)
      .pipe(fs.createWriteStream(`${this.options.cachePath}/qr.png`))
      .on('error', e => {
        throw e
      })

    while (true) {
      await new Promise((resolve) => setTimeout(() => resolve(), 1000))
      const status = await this._askScanQrcodeStatus()
      if (status === 0) console.log('wait scan...')
      if (status === 4) console.log('wait confirm...')
      if (status === 1) {
        console.log('login success...')
        break
      }
    }
    const token = await this._endLogin()
    const info = await this._getSettingInfo(token)
    info.token = token
    info.loginTime = Date.now()
    this._setUserInfo(info)
  }

  async _startLogin () {
    const { username, password } = this.getUserInfo()
    const { base_resp } = await this.xpost({
      url: this.makeUrl('/cgi-bin/bizlogin', { action: 'startlogin' }),
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
        Referer: this.host
      }
    })
    if (base_resp.ret) throw new Error(base_resp.err_msg)
  }

  async _askScanQrcodeStatus () {
    const { username } = this.getUserInfo()
    const { status } = await this.xget({
      url: this.makeUrl('/cgi-bin/loginqrcode', {
        action: 'ask',
        token: '',
        lang: 'zh_CN',
        f: 'json',
        ajax: 1
      }),
      headers: {
        Referer: `${this.host}/cgi-bin/bizlogin?action=validate&lang=zh_CN&account=${encodeURIComponent(username)}`
      }
    })
    return status
  }

  async _endLogin () {
    const { base_resp, redirect_url } = await this.xpost({
      url: this.makeUrl('/cgi-bin/bizlogin', { action: 'login' }),
      form: {
        f: 'json',
        token: '',
        lang: 'zh_CN',
        ajax: 1
      },
      headers: {
        Referer: this.host
      }
    })
    if (base_resp.ret) throw new Error(base_resp.err_msg)
    // redirect_url
    return redirect_url.match(/token=(\d*)/)[1]
  }

  async _getSettingInfo (token) {
    const { base_resp, user_info: userInfo, setting_info: settingInfo } = await this.xget(this.makeUrl('/cgi-bin/settingpage', {
      t: 'setting/index',
      action: 'index',
      token,
      lang: 'zh_CN',
      f: 'json'
    }))
    if (base_resp.ret) throw new Error(base_resp.err_msg)
    return {
      headImg: userInfo.head_img,
      alias: userInfo.alias,
      fakeId: userInfo.fake_id,
      fakeIdBase64: userInfo.fake_id_base64,
      nickName: userInfo.nick_name,
      locationInfo: settingInfo.location_info,
      signature: settingInfo.intro.signature,
      uid: settingInfo.original_username,
      originalId: settingInfo.original_username
    }
  }

  async checkLogin () {
    const { base_resp } = await this.request.xget(`${this.host}/cgi-bin/home?t=home/index&lang=zh_CN&token=${this.userInfo.token}&f=json`)
    if (base_resp.ret === -1) return false
    return true
  }
}

module.exports = MpWeixin
