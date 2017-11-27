WeiXin，调用login后，本地cache路径下会保存一张二维码图片，扫码验证后，即可保证该对象登陆成功，cookies和token会被拦截并触发`onUserInfoChange`事件，之后即可方便的调用微信公众号后台的api

## 方法

  - login: 登录平台账户（会调用一次updatePlatformerInfo）

  - checkLogin: 检测平台账户是否登录

  - updatePlatformerInfo: 更新当前平台账户信息