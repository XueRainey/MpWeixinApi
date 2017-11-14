module.exports = function (platformer, apiMap) {
  if (typeof platformer !== 'object') throw new Error('platformer must be extend BasePlatform')
  Object.keys(apiMap).forEach(apiName => {
    (platformer[apiName] = (options) => apiMap[apiName](platformer, options))
  })
}
