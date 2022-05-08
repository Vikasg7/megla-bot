const R = require("ramda")
const Op = require("rxjs/operators")

// *> :: fa -> fb -> fb
const bindRight = (a , ...as) =>
   R.reduce((l, r) => l |> Op.concatMap(() => r), a, as)

// based on clojure's repeatedly
const repeatedly = (f, n) => {
   const result = []
   while (n != 0) {
      result.push(f())
      n--
   }
   return result
}

module.exports = {
   bindRight,
   repeatedly
}