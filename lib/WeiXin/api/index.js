const { updatePlatformerInfo, updateTicketAndUserInfo, updateSettingInfo } = require('./updatePlatformerInfo')

module.exports = {
  login: require('./login'),
  checkLogin: require('./checkLogin'),
  updatePlatformerInfo,
  updateTicketAndUserInfo,
  updateSettingInfo
}
