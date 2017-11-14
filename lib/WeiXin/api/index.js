const { updatePlatformerInfo, updateTicketAndUserInfo, updateSettingInfo } = require('./updatePlatformerInfo')
const { login, checkLogin } = require('./login')

module.exports = {
  login,
  checkLogin,
  updatePlatformerInfo,
  updateTicketAndUserInfo,
  updateSettingInfo
}
