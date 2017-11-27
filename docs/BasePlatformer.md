所有平台需要默认继承`BasePlatformer`，内置post 和 get请求（使用方式与request相同，返回一个promise）

## 构造函数

  - userInfo
  - options

    - host
    - cachePath

## 事件

  - onUserInfoChange: 当平台账户信息更改时触发

## 方法

  - makeUrl: 生成url
    
    - path: 路径
    - query: 请求数据
    - encode: 是否编码
  
  - addEventListener: 增加监听事件

    - eventName: 事件名
    - func: 事件处理函数
  
  - removeEventListener: 取消监听（同上）

  - fireEvent: 触发监听事件