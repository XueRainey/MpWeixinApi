const BasePlatformer = require('../BasePlatformer')
const defaultOptions = require('./defaultOptions')
const { mixinApi } = require('../util')
const apiMap = require('./api')

class WeiXin extends BasePlatformer {
  constructor (userInfo, options) {
    const opt = Object.assign(defaultOptions, options)
    super(userInfo, opt)
    mixinApi(this, apiMap)
  }
}

module.exports = WeiXin
