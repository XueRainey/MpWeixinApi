// const fs = require('fs')
// const md5 = require('md5')
const NodeRSA = require('node-rsa')

async function checkLogin (platformer) {
  await platformer.xget('http://baijiahao.baidu.com/builderinner/api/content/analysis/getFansChartInfo?app_id=1541454735992052&start=20171207&end=20171214&fans_type=new%2Csum&is_page=1&sort=desc&page=1&page_size=5')
    .then(res => console.log(res))
}

function getGid () {
  return "xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(e) {
    var t = 16 * Math.random() | 0, n = "x" == e ? t : 3 & t | 8
    return n.toString(16)
  }).toUpperCase()
}

function getToken (platformer, { gid }) {
  return platformer.xget(platformer.makeUrl('https://passport.baidu.com/v2/api/', {
    getapi: null,
    tpl: 'lightwebapp',
    apiver: 'v3',
    loginversion: 'v4',
    tt: Date.now(),
    class: 'login',
    gid,
    logintype: 'basicLogin',
    traceid: ''
  }))
    .then(body => JSON.parse(body.replace(/'/g, '"')))
    .then(res => res.data.token)
}

function getKey (platformer, { gid, token }) {
  return platformer.xget(platformer.makeUrl('https://passport.baidu.com/v2/getpublickey', {
    token,
    tpl: 'lightwebapp',
    apiver: 'v3',
    tt: Date.now(),
    class: 'login',
    gid,
    traceid: ''
  }))
    .then(body => JSON.parse(body.replace(/'/g, '"')))
    .then(res => {
      if (res.errno === '0') return res
      throw new Error(res.msg)
    })
}

function realLogin (platformer, { token, gid, rsakey, publicKey }) {
  const { username, password } = platformer.info()
  const RSA = new NodeRSA(publicKey)
  const _password = RSA.encrypt(password, 'base64')
  console.log('_password', _password)
  return platformer.xpost('https://passport.baidu.com/v2/api/?login', {
    form: {
      staticpage: 'http://baijiahao.baidu.com/content/static/third_party/passport/v3Jump.html',
      charset: 'UTF-8',
      token,
      tpl: 'lightwebapp',
      subpro: null,
      apiver: 'v3',
      tt: Date.now(),
      codestring: null,
      safeflg: 0,
      u: 'http://baijiahao.baidu.com?source=inner',
      isPhone: null,
      detect: 1,
      gid,
      quick_user: 0,
      logintype: 'basicLogin',
      logLoginType: 'pc_loginBasic',
      idc: null,
      loginmerge: true,
      username,
      password: _password,
      mem_pass: 'on',
      rsakey,
      crypttype: 12,
      // ppui_logintime: 1134480,
      countrycode: null,
      // fp_uid: 'a53ac70e6d2f59c8baffb07745e08651',
      // fp_info: 'a53ac70e6d2f59c8baffb07745e08651002~~~lwllsQoBI5tkB52lC5x_kllqvoB1kGz1bH~v0YxooB1kGz1bH~v0ZePlnHrIlnHrSllrVlnv0To0ClFmxdvb2x4kYhv0Gx1Ifl4I3jFm~g4f1g4IXevgX21IZ2nfygvIql4IXg10f2nwFl1IG~vgqzvgHynNvW4KCVLbvwuklXAklXWklXLklrDo0PnGmQh8mtOLm6ZLzv-L5698ZCSFK-V8p~tLKtOLm6g6zwfCMCULK6W75vwLNvwFzCSFNrWqMwOq5vRLzCs6Z-1qM6f75JS8KwfC5QkLz2lC52lcOVzCMag75Q94kZ9vpyyckZx1gXUGo0oyCm6KqM6W8b2KvmshqI1hqgZlqIshqI6V1gZ-vzG~vI8Kvm6Vq5vkCkFlv0Z-CIZlqkvw10Fyv0sxC0qgv0Y-C5sh456fvgVwnKZx156O1gawqkHgC08Vv5YgvIrKCmGyCKZxqg6VC0F-1zse40sgqgs2vIse40Fx15qzvIYzC5Y2CkGe1gFx1m6jC01g1K6V4IY21kawvkHyv0wOqk1yCmZgqz1evIqxvIq~1k3f4mY21zqlCktOvg6K1zGgC5Ck4mqzvztf106w4b2fC5CV85~lnksh4mvf4IwwvIFx1zZ~qkwkv5Zzqk1yvgwwv0X~1mYxvmqxqI6wC5Yzq56f4IqlC5vVqIwOvmshvIY210fx1ztj1k3O1gXl1k8kqkGgvzG~10VO1gGz10Cw1Itf10CkvKs-1kf2vKZ21mvk1gYg1kG2vzG-vgwKCkG2CmqxvmZg1e2w4I3OCkCO4IGyCIrkvkHhvIGxqK6wCkFx1KvKvICKCm6kqKseqkFyvkXyvI6O15Z2q5qeqgvVC5tk10F~qzakzklrFklrtklrBklrHllsEorPKHDYly_roB852RLKQeLH__lklrsllXCklXOklXXklXbklXaklXmoPcIZ9v0s~v0Yy40sg40FlvgslvY__',
      dv: 'MDExAAoA9QALAz0AJAAAAF00AAwCACSI09PTwv3ksPG_-Krrpvmm9qX1qpip9qnZuMu4z6DStsa1wqYHAgAEkZGRkQkCACWIinFzYmJiYm4UrKz4ufew4qPuse6-7b3i0OG-4ZHwg_CH6Jr-DQIAHpGd60ZfC0oEQxFQHUIdTR5OESMSTRJnFHEDTSxBJAkCACWIi42MWlpaWlYgg4PXltifzYzBnsGRwpLN_86RzrvIrd-R8J34BwIABJGRkZEHAgAEkZGRkQwCAAuVzs7Oym3No9a61gcCAASRkZGRCAIACZGSVFStra2_0AcCAASRkZGREwIAMJG9vb3VodWln7Cf_Zz1n_aX_57x373ctdGkiumG68Sm07rWsteliuub68Sox6DJpxACAAGRFwIADZGR8vL6mPfcrvWbwLIFAgAEkZGRnwECAAaRmZmU8h0VAgAIkZGQ8KO0L-cEAgAGk5ORkqSWFgIAI7PHrJyyhreHtIC2hrCBuIuygrqOtoOyh7aFt4W3graCsYOzBgIAKG6Rb8zMzMpaWlpeX19fW3t7e3FxcXF01NTU3t7e3ttSUlJYWFhYXdQIAgAJkZJSU0hISF2-CAIACZGSbG28vLjwwwkCAAyRkpeX0tLS0tZxExMIAgAcgoFOTEBATCTDl9aY343Mgd6B0YLSjbnmucqn1AkCAAyRkouK8_Pz8_-QVlYIAgAJkZKFhAwMAHR8BwIABJGRkZENAgAekZ3nWkMXVhhfDUwBXgFRAlINPw5RDnsIbR9RMF04DQIAHpGd5yY_aypkI3EwfSJ9LX4ucUNyLXICYxBjFHsJbQ0CAB6RnePm_6vqpOOx8L3ive2-7rGDsu2ywqPQo9S7ya0NAgAekYCs5v-r6qTjsfC94r3tvu6xg7LtssKj0KPUu8mtCQIAJYiLn55LS0tLWnYoKHw9czRmJ2o1ajppOWZUZTplEGMGdDpbNlMMAgAgiNPT08Lv7rr7tfKg4azzrPyv_6CSo_yj1qXAsvyd8JUMAgAgiN7e3s_ioPS1-7zur-K94rLhse7c7bLtmOuO_LLTvtsHAgAEkZGRkQwCACSI3t7ez_BQBEULTB5fEk0SQhFBHiwdQh1tDH8MexRmAnIBdhI',
      traceid: 'FBCC7901'
    }
  }).then(res => console.log(res))
}




async function login (platformer, loginInfo) {
  if (!loginInfo) loginInfo = platformer.getLoginInfo()
  if (!loginInfo.username) throw new Error('Must exist username!')
  if (!loginInfo.password) throw new Error('Must exist password!')
  // GID
  const gid = getGid()
  // const urlList = [
  //   'https://passport.baidu.com/passApi/js/wrapper.js?cdnversion=201712141100',
  //   'http://passport.bdimg.com/passApi/js/login_tangram_74f9e56.js',
  //   'https://passport.baidu.com/static/passpc-base/js/ld.min.js?cdnversion=1513220401462'
  // ]
  // while (urlList.length) await platformer.xget(urlList.pop())
  // // token
  const token = await getToken(platformer, { gid })
  console.log('token:', token)
  await platformer.xget('https://ttl-bjh.baidu.com/cms/statistics/statistics/img/s.gif', {
    op_time: 1526436612841,
    client_type: 'pc',
    app_id: '',
    user_id: '',
    page_url: 'https://baijiahao.baidu.com/builder/app/login',
    refer: 'https://baijiahao.baidu.com/builder/app/choosetype',
    urlkey: 'passport-account-login-btn'
  })
  
  // // public key
  // const { key: rsakey, pubkey: publicKey } = await getKey(platformer, { gid, token })
  // console.log('rsakey:', rsakey)
  // console.log('publicKey:', publicKey)

  // await realLogin(platformer, { gid, token, rsakey, publicKey })

  // platformer.emit('loginHook', 'finish')
}

module.exports = {
  login,
  checkLogin
}
