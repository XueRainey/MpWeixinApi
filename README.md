# 新媒体平台群管方案

## 内部结构介绍

### 平台基类

所有平台需要默认继承`BasePlatformer`，内置post 和 get请求（使用方式与request相同，返回一个promise）

#### Constructor

  - userInfo
  - options

    - host
    - cachePath

#### Event

  1. onUserInfoChange: 当平台账户信息更改时触发

#### Method

  - makeUrl: 生成url
    
    - path: 路径
    - query: 请求数据
    - encode: 是否编码
  
  - addEventListener: 增加监听事件

    - eventName: 事件名
    - func: 事件处理函数
  
  - removeEventListener: 取消监听（同上）

  - fireEvent: 触发监听事件

### 微信公众号平台

WeiXin，调用login后，本地cache路径下会保存一张二维码图片，扫码验证后，即可保证该对象登陆成功，cookies和token会被拦截并触发`onUserInfoChange`事件，之后即可方便的调用微信公众号后台的api

#### Method

  - login: 登录平台账户（会调用一次updatePlatformerInfo）

  - checkLogin: 检测平台账户是否登录

  - updatePlatformerInfo: 更新当前平台账户信息

## 环境要求

  需要 NodeJS 8.0+ 环境