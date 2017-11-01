'use strict'
const tough = require('tough-cookie')
const Store = tough.Store
const permuteDomain = tough.permuteDomain
const permutePath = tough.permutePath

class CookieStore extends Store {
  constructor (saveCookies, loadCookies) {
    super()
    this.idx = (loadCookies && loadCookies()) || {} // idx is memory cache
    this.synchronous = true
    this.saveCookies = saveCookies
  }

  findCookie (domain, path, key, cb) {
    if (!this.idx[domain]) {
      return cb(null, undefined)
    }
    if (!this.idx[domain][path]) {
      return cb(null, undefined)
    }
    return cb(null, this.idx[domain][path][key] || null)
  }

  findCookies (domain, path, cb) {
    const results = []
    if (!domain) {
      return cb(null, [])
    }

    let pathMatcher
    if (!path) {
      pathMatcher = function matchAll (domainIndex) {
        for (const curPath in domainIndex) {
          const pathIndex = domainIndex[curPath]
          for (const key in pathIndex) {
            results.push(pathIndex[key])
          }
        }
      }
    } else if (path === '/') {
      pathMatcher = function matchSlash (domainIndex) {
        const pathIndex = domainIndex['/']
        if (!pathIndex) {
          return
        }
        for (const key in pathIndex) {
          results.push(pathIndex[key])
        }
      }
    } else {
      const paths = permutePath(path) || [path]
      pathMatcher = function matchRFC (domainIndex) {
        paths.forEach(function (curPath) {
          const pathIndex = domainIndex[curPath]
          if (!pathIndex) {
            return
          }
          for (const key in pathIndex) {
            results.push(pathIndex[key])
          }
        })
      }
    }

    const domains = permuteDomain(domain) || [domain]
    const idx = this.idx
    domains.forEach(function (curDomain) {
      const domainIndex = idx[curDomain]
      if (!domainIndex) {
        return
      }
      pathMatcher(domainIndex)
    })

    cb(null, results)
  }
  putCookie (cookie, cb) {
    if (!this.idx[cookie.domain]) {
      this.idx[cookie.domain] = {}
    }
    if (!this.idx[cookie.domain][cookie.path]) {
      this.idx[cookie.domain][cookie.path] = {}
    }
    this.idx[cookie.domain][cookie.path][cookie.key] = cookie
    this.saveCookies(this.idx)
  }
  updateCookie (oldCookie, newCookie, cb) {
    this.putCookie(newCookie, cb)
  }
  removeCookie (domain, path, key, cb) {
    if (this.idx[domain] && this.idx[domain][path] && this.idx[domain][path][key]) {
      delete this.idx[domain][path][key]
    }
    this.saveCookies(this.idx)
  }
  removeCookies (domain, path, cb) {
    if (this.idx[domain]) {
      if (path) {
        delete this.idx[domain][path]
      } else {
        delete this.idx[domain]
      }
    }
    this.saveCookies(this.idx)
  }
}

module.exports = CookieStore
