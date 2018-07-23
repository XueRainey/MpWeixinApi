const fs = require('fs')
const path = require('path')
const WeiXin = require('../lib/WeiXin')
const { weixin: weixinLoginInfo } = require('../cache/loginInfo')
const { describe, it, before, after } = require('mocha')
const { expect } = require('chai')

const userInfoCachePath = path.resolve(__dirname, '../cache/weixin.userinfo.json')
const platformer = new WeiXin({
  debug: false,
  test: true
})
platformer.addListener('onUserInfoChange', () => fs.writeFileSync(userInfoCachePath, JSON.stringify(platformer.info(), null, 2)))

describe('WeiXin', function () {
  before(async function () {
    console.log('before')
  })
  after(function () {
    console.log('after')
  })

  describe('#checkLogin()', function () {
    it('should return false when the platformer not login', async function () {
      expect(await platformer.checkLogin()).to.equal(false)
    })
  })

  describe('#login()', function () {
    const hookList = []
    platformer.addListener('loginHook', (status, data) => {
      hookList.push(status)
      if (status === 'qrImageDownload') {
        fs.writeFileSync('./cache/qr.jpeg', data.buffer.toString('binary'), 'binary', console.log)
      }
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
      await platformer.login(weixinLoginInfo)
    })

    it('login should call all the hooks', async function () {
      // waitConfirm 等待确认可能会由于在轮询等待时间内操作完成而缺失
      expect(hookList).to.include.members(['qrImageDownload', 'waitScan', 'confirmed', 'finish'])
    })

    it('should return true when the platformer login', async function () {
      expect(await platformer.checkLogin()).to.equal(true)
    })
  })
})
