const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

module.exports = {
  convert : async (userCd) => {
    let currentTime = new Date().getTime()
    let remainMil = userCd - currentTime;
    let remaining = remainMil / 1000
    let time
    if (remaining > 60) {
      time = Math.round(remaining / 60)
      if (time > 60) {
        time = Math.round(time / 60) + `h`
      } else {
        time = time + `m`
      }
    } else {
      time = remaining + `s`
    }
    return {
      formatted: time,
      relative: `<t:${Math.floor(new Date().setTime(currentTime + remainMil)/1000)}:R>`
    }
  }
}