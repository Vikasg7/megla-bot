const tmi = require("tmi.js"), 
      Rx  = require("rxjs"),
      Op  = require("rxjs/operators"),
      { log } = require("console"),
      Utils = require("./utils"),
      bots = require("./bots")

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
   
   const send = client.say(cfg.chnl, ?)

   const disconnect = client.disconnect(?)

   const reply = ([channel, tags, message, self]) => {
      if (self || !message.startsWith('!')) return [];
      const [cmd, ...args] = message.toLowerCase().slice(1).split(' ')
      const bot = bots[cmd]
      if (bot === undefined) return [];
      return bot(tags, ...args)
   }

   return {
      setupConnection,
      msgs,
      send,
      disconnect, 
      reply
   }
}

module.exports = twirc