const tmi = require("tmi.js"), 
      Rx  = require("rxjs"),
      Op  = require("rxjs/operators"),
      cfg = require("../config.json"),
      { log } = require("console"),
      Utils = require("./utils")

const isAdmin = (user) => user == cfg.chnl

function twirc(cfg) {
   const client = new tmi.Client({
      // options: { debug: true },
      connection: { secure: true },
      identity: {
         username: cfg.user,
         password: cfg.tokn
      },
      channels: [cfg.chnl]
   })

   const connect = Rx.defer(client.connect(?))
   
   const join = 
      Rx.fromEvent(client, "join")
      |> Op.take(1)

   const setupConnection = Utils.bindRight(connect, join)
   
   const msgs = Rx.fromEvent(client, "message")
   
   const reply = client.say(cfg.chnl, ?)

   const disconnect = client.disconnect(?)

   return {
      setupConnection,
      msgs,
      reply,
      disconnect
   }
}

/*
   !list
   !list me
   !list next
   !list next n
   !list help
*/
const list = []
function listBot({username}, subcmd, n = 1) {
   if (!subcmd) {
      return list.length 
               ? [`@${username} ` + list.join(", ")] 
               : [`@${username} list is empty. Type < !list me > to add yourself to the list`]
   } else
   if (subcmd == "me") {
      if (list.includes(username)) {
         return [`@${username} You are already in the list.`]
      }
      list.push(username)
      return [`Added @${username} to the list.`]
   } else
   if (subcmd == "next" && isAdmin(username)) { 
      if (!list.length) return [];
      n = n > list.length ? list.length : n // making sure n !> list.length 
      const nextup = Utils.repeatedly(() => list.shift(), n)
      const tags = "@" + nextup.join(" @")
      return [`${tags} You are up next. Ready up! and join the team.`]
   }
   if (subcmd == "help") { 
      return [
         `@${username} ` +
         "👿 !list        - Shows the list " +
         "👿 !list me     - Adds you in the list " +
         "👿 !list next   - Pops first name from the list and shows it (Admin only) " + 
         "👿 !list next n - Pops first n names from the list and shows them (Admin only) " +
         "👿 !list help   - Shows help text"
      ]
   } else {
      return []
   }
}

// !weather location
async function weatherBot({username}, ...args) {
   const location = encodeURIComponent(args.join(" "))
   const resp = await fetch(`https://wttr.in/${location}?format=4`)
   const text = await resp.text()
   return `@${username} ${text}`
}

function replies([channel, tags, message, self]) {
   if (self || !message.startsWith('!')) return [];

   const [cmd, ...args] = message.slice(1).split(' ')

   const command = cmd.toLowerCase()
   
   return command == "list"    ? listBot(tags, ...args) :
          command == "weather" ? weatherBot(tags, ...args)
                               : []
}

function main() {
   const twi = twirc(cfg)
   return twi.setupConnection
          |> Op.mergeMap(() => twi.reply("megla_b0t is connected!"))
          |> Op.concatMap(() => twi.msgs)
          |> Op.mergeMap(replies)
          |> Op.mergeMap(twi.reply)
          |> Op.finalize(twi.disconnect)
}

main().subscribe(null, log)