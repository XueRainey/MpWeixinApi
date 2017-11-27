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
const { WeiXin } = require('./lib')

;(async function run () {
  const userInfoCachePath = path.resolve(__dirname, './cache/weixin.userinfo.json')
  const platformer = new WeiXin(require(userInfoCachePath), {
    cachePath: path.resolve(__dirname, './cache')
  })

  platformer.addListener('loginHook', (status) => {
    console.log(status)
    if (status === 'finish') {
      fs.writeFileSync(userInfoCachePath, JSON.stringify(platformer.info(), null, 4))
    }
  })

  if (!await platformer.checkLogin()) await platformer.login()
  await platformer.updatePlatformerInfo(platformer)
})()

```

## 环境要求

  需要 NodeJS 8.0+ 环境