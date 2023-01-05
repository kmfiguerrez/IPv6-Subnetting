import Prefix from "./ipv6.js";

const user = "ff02:0101:0105:0004::"

const ex = Prefix.expand(user).split(":").join("")
const bin = Prefix.hexToBin(ex)
const hex = Prefix.binToHex(bin)

console.log(user)
console.log(ex)
console.log(bin)
console.log(hex)
