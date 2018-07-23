# 快速开始

## 介绍

当今新媒体平台层出不穷，很多信息产出端面临着同一篇文章或同一份媒体文件需要同时在多个平台发布的困难，而且需要同时监控多个平台的数据信息等。为此，想要对多个平台的公开api整理成一个闭包，方便二次开发和使用。

## 安装

```bash
npm i muti-platform-manage --save
```

## 使用

```js
const fs = require('fs')
const path = require('path')
const { WeiXin } = require('muti-platform-manage')

;(async function run () {
  try {
    const userInfoCachePath = path.resolve(__dirname, '../cache/weixin.userinfo.json')
    const platformer = new WeiXin()

    platformer.addListener('onUserInfoChange', () => {
      fs.writeFileSync(userInfoCachePath, JSON.stringify(platformer.info(), null, 2))
    })

    platformer.addListener('loginHook', (status, data) => {
      console.log('status:', status)
      if (status === 'qrImageDownload') fs.writeFileSync('./cache/qr.jpeg', data.buffer.toString('binary'), 'binary', console.log)
    })

    if (!await platformer.checkLogin()) await platformer.login({ username: '', password: '' })
  } catch (e) {
    console.error(e.message)
  }
})()

```

## 环境要求

  需要 NodeJS 8.0+ 环境