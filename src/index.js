const Base = require('./base')
const md5 = require('md5')

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
      },
      json: true
    })
    if (base_resp.ret) throw new Error(base_resp.err_msg)
  }
}

module.exports = MpWeixin
