const cfg = require("../../config.json"),
      { log } = require("console"),
      Utils = require("../utils")

const isAdmin = (user) => user == cfg.chnl

const list = ["Symone", "Pump"]
function listBot({ username }, subcmd, ...args) {
   if (!subcmd) {
      return (
         list.length
            ? ["List - [ " + list.join(", ") + " ]"]
            : [`@${username} List is empty right now. Type [ !list me ] to add yourself to the list.`]
      )
   }
   if (subcmd == "me") {
      if (list.includes(username)) {
         return [`@${username} You are already in the list.`]
      }
      list.push(username)
      return [`Added @${username} to the list.`]
   }
   if (subcmd == "next" && isAdmin(username)) {
      if (!list.length) return [`@${username} List is empty.`];
      let n = args[0] || 1
      n = n > list.length ? list.length : n // making sure n !> list.length 
      const nextup = Utils.repeatedly(list.shift(?), n)
      const tags = "@" + nextup.join(" @")
      return [`${tags} You are up next. Ready up! and join the team.`]
   }
   if (subcmd == "off" && isAdmin(username)) {
      const takenOff =
         args
         .map(arg => arg.replace("@", ""))
         .map(Utils.remove(list, ?))
         .filter(x => x)
      return ( 
         takenOff.length
            ? [`@${takenOff.join(" @")} taken off of the list.`]
            : [`@${username} Nobody was taken off from the list.`]
      )
   }
   if (subcmd == "off") {
      if (!list.includes(username)) {
         return [`@${username} You are not in the list.`]
      }
      const takenOff = Utils.remove(list, username)
      return [`Took @${takenOff} off of the list.`]
   }
   if (subcmd == "help") {
      return [
         `@${username} ` +
         "👺[ !list        ] - Shows the list. " +
         "👺[ !list me     ] - Adds you in the list. " +
         "👺[ !list next   ] - Pops first name from the list and shows it. (Admin only) " +
         "👺[ !list next n ] - Pops first n names from the list and shows them. (Admin only) " +
         "👺[ !list off    ] - Takes you off the list. " +
         "👺[ !list off X  ] - Takes X off the list if present. (Admin only) " +
         "👺[ !list help   ] - Shows help text. "
      ]
   }
   return []
}

module.exports = listBot