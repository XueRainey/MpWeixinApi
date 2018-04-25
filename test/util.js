const { describe, it, before, after } = require('mocha')
const { expect } = require('chai')
const { mixinApi } = require('../lib/util')

describe('Util', function () {
  before(async function () {
    console.log('before')
  })
  after(function () {
    console.log('after')
  })

  describe('#mixinApi()', function () {
    it('should throw Error when no platformer', async function () {
      expect(mixinApi).to.throw('platformer must be extend BasePlatform')
    })
  })
})
