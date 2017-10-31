const request = require('request')
const FileCookieStore = require('tough-cookie-filestore-bugfixed')
const requestExpand = require('./requestExpand')

class Base {
  constructor (options) {
    this._initOptions(options)
    this._initRequest()
  }
  _initRequest () {
    this.cookieJar = request.jar(new FileCookieStore(this.cookieJarPath))
    this.request = requestExpand(request.defaults({
      jar: this.cookieJar,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.75 Safari/537.36'
      },
      json: true
    }))
    this.request.debug = this.options.debug
  }

  _initOptions (options = {}) {
    if (!options.cachePath) throw new Error('no cachePath')
    this.cachePath = options.cachePath
    if (!options.cookieJarPath) throw new Error('no cookieJarPath')
    this.cookieJarPath = options.cookieJarPath
    this.options = options
  }
}

module.exports = Base
