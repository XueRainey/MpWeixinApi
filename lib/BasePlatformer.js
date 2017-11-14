const request = require('request')
const tough = require('tough-cookie')
const { requestExpand, CookieStore } = require('./util')

class Base {
  constructor (userInfo, options) {
    this._initOptions(options)
    this._initUserInfo(userInfo)
    this._initRequest()
    this.listener = {}
  }

  addEventListener (eventName, func) {
    if (this.listener[eventName]) this.listener[eventName].push(func)
    this.listener[eventName] = [func]
  }

  removeEventListener (eventName, func) {
    if (this.listener[eventName]) {
      this.listener[eventName] = this.listener[eventName].filter(f => f !== func)
    }
  }

  fireEvent (eventName, data) {
    if (this.listener[eventName]) this.listener[eventName].forEach(func => func(data))
  }

  _initOptions (options = {}) {
    if (!options.host) throw new Error('no host')
    if (!options.cachePath) throw new Error('no cachePath')
    this.host = options.host
    this.options = options
  }

  _initRequest () {
    const stroe = new CookieStore(cookieData => this._setUserInfo({ cookieData }), () => this.userInfo.cookieData)
    this.cookieJar = request.jar(stroe)
    this.request = requestExpand(request.defaults({
      jar: this.cookieJar,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.75 Safari/537.36'
      },
      json: true
    }))
    this.xget = this.request.xget
    this.xpost = this.request.xpost
    this.request.debug = this.options.debug
  }

  _initUserInfo (userInfo = {}) {
    if (!userInfo.username) throw new Error('no username!')
    if (!userInfo.password) throw new Error('no password!')
    userInfo.cookieData = userInfo.cookieData || null
    for (const domainName in userInfo.cookieData) {
      for (const pathName in userInfo.cookieData[domainName]) {
        for (const cookieName in userInfo.cookieData[domainName][pathName]) {
          userInfo.cookieData[domainName][pathName][cookieName] = tough.fromJSON(JSON.stringify(userInfo.cookieData[domainName][pathName][cookieName]))
        }
      }
    }
    this.userInfo = userInfo
  }

  _setUserInfo (_userInfo = {}) {
    if (!this.userInfo) this.userInfo = {}
    Object.assign(this.userInfo, _userInfo)
    this.fireEvent('onUserInfoChange')
  }

  info () {
    return JSON.parse(JSON.stringify(this.userInfo))
  }

  makeUrl (path, query = {}, encode = true) {
    const url = path.includes('http') ? path : `${this.host}${path}`
    const queryString = Object.keys(query).map(key => {
      const val = encode ? encodeURIComponent(query[key]) : query[key]
      return `${key}=${val}`
    }).join('&')
    return `${url}?${queryString}`
  }
}

module.exports = Base
