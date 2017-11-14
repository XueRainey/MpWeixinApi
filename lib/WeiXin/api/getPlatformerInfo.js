module.exports = async function (platformer) {
  const { token } = platformer.getUserInfo()
  const url = platformer.makeUrl('/cgi-bin/settingpage', {
    t: 'setting/index',
    action: 'index',
    token,
    lang: 'zh_CN',
    f: 'json'
  })
  const res = await platformer.xget(url)
  const { base_resp, setting_info: settingInfo } = res
  if (base_resp.ret) throw new Error(base_resp.err_msg)
  return {
    uid: settingInfo.original_username
    // avatar: userInfo.head_img,
    // alias: userInfo.alias,
    // nickName: userInfo.nick_name,
    // fakeId: userInfo.fake_id,
    // fakeIdBase64: userInfo.fake_id_base64,
    // locationInfo: settingInfo.location_info,
    // signature: settingInfo.intro.signature,
    // originalId: settingInfo.original_username,
  }
}
