
function sleep(time = 1) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, time * 1000)
  })
}

function random(min = 1, max = 10) {
  return min + Math.floor((Math.random()) * (max - min))
}

module.exports = {
  sleep,
  random
}
