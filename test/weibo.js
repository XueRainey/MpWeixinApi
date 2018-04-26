const fs = require('fs')
const path = require('path')
const WeiBo = require('../lib/WeiBo')
const { weibo: weiboLoginInfo } = require('../cache/loginInfo')
const { describe, it, before, after } = require('mocha')
const { expect } = require('chai')

const userInfoCachePath = path.resolve(__dirname, '../cache/weibo.userinfo.json')
const platformer = new WeiBo({
  debug: false,
  test: true
})
platformer.addListener('onUserInfoChange', () => fs.writeFileSync(userInfoCachePath, JSON.stringify(platformer.info(), null, 2)))

describe('WeiBo', function () {
  before(async function () {
    console.log('before')
  })
  after(function () {
    console.log('after')
  })

  describe('#checkLogin()', function () {
    it('should return false when the platformer not login', async function () {
      this.timeout(0)
      expect(await platformer.checkLogin()).to.be.false
    })
  })

  describe('#login()', function () {
    const hookList = []
    platformer.addListener('loginHook', (status, data) => {
      hookList.push(status)
    })

    it('should throw error when no username', async function () {
      try {
        await platformer.login()
      } catch (e) {
        expect(e.message).to.equal('Must exist username!')
      }
    })

    it('should throw error when no password', async function () {
      try {
        await platformer.login({ username: 'test password' })
      } catch (e) {
        expect(e.message).to.equal('Must exist password!')
      }
    })

    it('should not throw error', async function () {
      this.timeout(0)
      await platformer.login(weiboLoginInfo)
    })

    it('login should call all the hooks', async function () {
      expect(hookList).to.include.members(['preLoginDone', 'realLoginDone', 'redirectCrazyDone', 'finish'])
    })

    it('should return true when the platformer login', async function () {
      this.timeout(0)
      expect(await platformer.checkLogin()).to.be.true
    })
  })
})
