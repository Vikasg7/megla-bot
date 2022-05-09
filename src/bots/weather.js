// !weather location
async function weatherBot({ username }, ...args) {
   const location = encodeURIComponent(args.join(" "))
   const resp = await fetch(`https://wttr.in/${location}?format=4`)
   const text = await resp.text()
   return `@${username} ${text}`
}

module.exports = weatherBot
