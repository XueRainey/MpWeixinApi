# 微信公众号平台API

微信公众号平台API

## 平台账户封装

MpWeixin，内置post 和 get请求（使用方式与request相同，返回一个promise），调用login后，保证传入的userInfo的cookie信息有效，即可方便的调用微信公众号后台的api

### Constructor

  - userInfo
  - options

    - host
    - cachePath

### Event

  1. onUserInfoChange: 当平台账户信息更改时触发

### Method

  - login: 登录平台账户

  - checkLogin: 检测平台账户是否登录

  - getUserInfo: 获取当前平台账户信息

  - makeUrl: 生成url
    
    - path: 路径
    - query: 请求数据
    - encode: 是否编码
  
  - addEventListener: 增加监听事件

    - eventName: 事件名
    - func: 事件处理函数
  
  - removeEventListener: 取消监听（同上）

  - fireEvent: 触发监听事件


## 功能特性

  1. 登录

## 环境要求

  需要 NodeJS 8.0+ 环境