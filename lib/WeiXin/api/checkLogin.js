module.exports = async function checkLogin (platformer) {
  const { token } = platformer.getUserInfo()
  const { base_resp } = await platformer.xget(`${platformer.host}/cgi-bin/home?t=home/index&lang=zh_CN&token=${token}&f=json`)
  if (base_resp.ret) return false
  return true
}
