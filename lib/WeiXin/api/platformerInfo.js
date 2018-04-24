async function getTicketAndUserInfo (platformer) {
  const { token } = platformer.info()
  const url = platformer.makeUrl('/cgi-bin/frame', {
    t: 'advanced/dev_tools_frame',
    nav: '10049',
    token,
    lang: 'zh_CN',
    f: 'json'
  })
  const { base_resp, user_info: userInfo } = await platformer.xget(url)
  if (base_resp.ret) throw new Error(base_resp.err_msg)
  const info = {
    avatar: userInfo.head_img,
    alias: userInfo.alias,
    nickName: userInfo.nick_name,
    fakeId: userInfo.fake_id,
    fakeIdBase64: userInfo.fake_id_base64,
    mediaTicket: base_resp.media_ticket,
    masterTicket: base_resp.master_ticket,
    masterTicketId: base_resp.master_ticket_id
  }
  platformer._setUserInfo(info)
  return info
}

async function getSettingInfo (platformer) {
  const { token } = platformer.info()
  const url = platformer.makeUrl('/cgi-bin/settingpage', {
    t: 'setting/index',
    action: 'index',
    token,
    lang: 'zh_CN',
    f: 'json'
  })
  const { base_resp, setting_info: settingInfo } = await platformer.xget(url)
  if (base_resp.ret) throw new Error(base_resp.err_msg)
  const info = {
    uid: settingInfo.original_username,
    locationInfo: settingInfo.location_info,
    signature: settingInfo.intro.signature,
    originalId: settingInfo.original_username
  }
  platformer._setUserInfo(info)
  return info
}

async function getPlatformerInfo (platformer) {
  return Object.assign(
    await getSettingInfo(platformer),
    await getTicketAndUserInfo(platformer)
  )
}

module.exports = {
  getSettingInfo,
  getPlatformerInfo,
  getTicketAndUserInfo
}
