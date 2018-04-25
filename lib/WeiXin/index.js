const BasePlatformer = require('../BasePlatformer')
const defaultOptions = require('./defaultOptions')
const { mixinApi } = require('../util')
const apiMap = require('./api')

class WeiXin extends BasePlatformer {
  constructor (options, userInfo) {
    super(Object.assign(defaultOptions, options), userInfo)
    mixinApi(this, apiMap)
  }

  getToken () {
    return this.userInfo.token
  }
}

module.exports = WeiXin
