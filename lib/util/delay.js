module.exports = function (timeOut) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), timeOut)
  })
}
