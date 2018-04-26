const BasePlatformer = require('../BasePlatformer')
const defaultOptions = require('./defaultOptions')
const { mixinApi } = require('../util')
const apiMap = require('./api')

class WeiBo extends BasePlatformer {
  constructor (options, userInfo) {
    super(Object.assign(defaultOptions, options), userInfo)
    mixinApi(this, apiMap)
  }
}

module.exports = WeiBo
