const R = require("ramda")
const Op = require("rxjs/operators")

// *> :: fa -> fb -> fb
const bindRight = (a , ...as) =>
   R.reduce((l, r) => l |> Op.concatMap(() => r), a, as)

// based on clojure's repeatedly
const repeatedly = (f, n) => {
   const result = []
   while (n != 0) {
      const r = f()
      if (r) result.push(r);
      n--
   }
   return result
}

const remove = (as, a) => {
   const idx = as.indexOf(a)
   if (idx != -1) {
      return as.splice(idx, 1)[0]
   }
}

module.exports = {
   bindRight,
   repeatedly,
   remove
}