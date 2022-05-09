const tmi = require("tmi.js"), 
      Rx  = require("rxjs"),
      Op  = require("rxjs/operators"),
      cfg = require("../config.json"),
      { log } = require("console"),
      Utils = require("./utils"),
      { listBot, weatherBot } = require("./bots")

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