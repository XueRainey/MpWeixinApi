# 微信公众平台

## 登陆

有两种方式可以执行登陆操作，一种是在创建账号对象时，options参数传入username和password信息，然后调用登陆方法，或是在登陆方法里传入登陆信息。请监听loginHook事件，对登陆过程进行处理。cookies和token会被拦截并触发`onUserInfoChange`事件，之后即可方便的调用微信公众号后台的api。

```js
  const { WeiXin } = require('muti-platform-manage')
  ;(async function run () {
    try {
      const platformer = new WeiXin({ username: '', password: '' })
      platformer.addListener('loginHook', (status, data) => {
        console.log('status:', status)
        if (status === 'qrImageDownload') fs.writeFileSync('./cache/qr.jpeg', data.buffer.toString('binary'), 'binary', console.log)
      })
      await platformer.login()
    } catch (e) {
      console.error(e.message)
    }
  })()

```

## 获取当前对象账户信息

```js
  ;(async function run () {
    await platformer.info()
  })()
```

## 检测对象是否登陆

```js
  ;(async function run () {
    await platformer.checkLogin()
  })()
```

## 更新当前平台账户信息

```js
  ;(async function run () {
    await platformer.updatePlatformerInfo()
  })()
```