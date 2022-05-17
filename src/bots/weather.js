// !weather location
async function weatherBot({ username }, ...args) {
   try {
      const location = encodeURIComponent(args.join(" "))
      const resp = await fetch(`https://wttr.in/${location}?format=4`)
      const text = await resp.text()
      return `@${username} ${text}`
   } catch (e) {
      return `@${username} Oops! Error fetching weather.`
   }
}

module.exports = weatherBot
