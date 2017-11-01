function initParams (uri, options, callback) {
  if (typeof options === 'function') {
    callback = options
  }
  const params = {}
  if (typeof options === 'object') {
    Object.assign(params, options, {
      uri: uri
    })
  } else if (typeof uri === 'string') {
    Object.assign(params, {
      uri: uri
    })
  } else {
    Object.assign(params, uri)
  }
  params.callback = callback || params.callback
  return params
}

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
          resolve(body)
        })
      })
    }
  }

  request.xpost = verbPromiseFunc('post')
  request.xget = verbPromiseFunc('get')
  return request
}
