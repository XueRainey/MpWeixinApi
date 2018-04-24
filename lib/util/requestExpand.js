const { initParams } = require('request')

module.exports = function (request) {
  function verbPromiseFunc (verb) {
    const method = verb.toUpperCase()
    return (uri, options, callback) => {
      const params = initParams(uri, options, callback)
      return new Promise((resolve, reject) => {
        params.method = method
        return request(params, (error, response, body) => {
          if (error) return reject(error.message)
          // if (!body) return reject('no body');
          if (params.returnResponse) return resolve(response)
          resolve(body)
        })
      })
    }
  }

  request.xpost = verbPromiseFunc('post')
  request.xget = verbPromiseFunc('get')
  return request
}
