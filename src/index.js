const Op  = require("rxjs/operators"),
      cfg = require("../config.json"),
      { log } = require("console"),
      twirc = require("./twirc")

function main() {
   const twi = twirc(cfg)
   return twi.setupConnection
          |> Op.mergeMap(() => twi.send("megla_b0t is connected!"))
          |> Op.concatMap(() => twi.msgs)
          |> Op.mergeMap(twi.reply)
          |> Op.mergeMap(twi.send)
          |> Op.finalize(twi.disconnect)
}

main().subscribe(null, log)