const Emitter = require('events')
const request = require('request')
const tough = require('tough-cookie')
const { requestExpand, CookieStore } = require('./util')
const { defaultApiNameList } = require('./config')

class BasePlatformer extends Emitter {
  constructor (options, userInfo) {
    super()
    this._initOptions(options)
    this._initUserInfo(userInfo)
    this._initRequest()
    /* istanbul ignore if  */ if (!options.test) this._initDefaultApi()
  }

  /* istanbul ignore next */
  _initDefaultApi () {
    defaultApiNameList.forEach(apiName => {
      this[apiName] = function () {
        // throw new Error('The method of type must override a superclass method.')
        console.error(`[${apiName}]:The method of type must override a superclass method.`)
      }
    })
  }

  _initOptions (options = {}) {
    /* istanbul ignore if  */ if (!options.host) throw new Error('no host')
    this.host = options.host
    this.protocol = options.protocol
    this.baseUrl = `${options.protocol}://${options.host}`
    this.options = options
  }

  _initRequest () {
    const stroe = new CookieStore(cookieData => this._setUserInfo({ cookieData }), () => this.userInfo.cookieData)
    request.debug = this.options.debug
    this.cookieJar = request.jar(stroe)
    this.request = requestExpand(request.defaults({
      jar: this.cookieJar,
      headers: this.options.defaultHeaders,
      json: true
    }, request))
    this.xget = this.request.xget
    this.xpost = this.request.xpost
  }

  /* istanbul ignore next */
  _initUserInfo (userInfo = {}) {
    userInfo.cookieData = userInfo.cookieData || null
    if (typeof userInfo.cookieData === 'string') {
      userInfo.cookieData = JSON.parse(userInfo.cookieData)
    }
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
    Object.assign(this.userInfo, _userInfo)
    this.emit('onUserInfoChange')
  }

  info () {
    const _userInfo = JSON.parse(JSON.stringify(this.userInfo))
    _userInfo.cookieData = JSON.stringify(_userInfo.cookieData)
    return _userInfo
  }

  getLoginInfo () {
    return {
      username: this.userInfo.username,
      password: this.userInfo.password
    }
  }

  /* istanbul ignore next */
  getCookieMap (uri) {
    const cookieList = this.cookieJar._jar.getCookieStringSync(uri || this.baseUrl).split('; ')
    const cookieMap = {}
    cookieList.forEach(cookieStr => {
      const keyValue = cookieStr.split('=')
      cookieMap[keyValue[0]] = keyValue[1]
    })
    return cookieMap
  }

  makeUrl (path, query = {}, encode = true) {
    let url = this.baseUrl
    if (typeof path === 'string') {
      url = path.includes('http') ? path : `${this.baseUrl}${path}`
    } else {
      query = path
    }
    const queryString = Object.keys(query).map(key => {
      if (query[key] === null) return key
      const val = encode ? encodeURIComponent(query[key]) : query[key]
      return `${key}=${val}`
    }).join('&')
    if (queryString) return `${url}?${queryString}`
    return url
  }
}

module.exports = BasePlatformer
