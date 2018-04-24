const { updatePlatformerInfo, updateTicketAndUserInfo, updateSettingInfo } = require('./platformerInfo')
const { login, checkLogin } = require('./login')

module.exports = {
  login,
  checkLogin,
  updatePlatformerInfo,
  updateTicketAndUserInfo,
  updateSettingInfo
}
