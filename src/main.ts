import Prefix from "./ipv6.js";

const user = "ff02:0101:0105:0004::"

// const ex = Prefix.expand(user)
// const bin = Prefix.hexToBin(ex);
// const hex = Prefix.binToHex(bin)
// const ibin = Prefix.ipv6ToBin(ex)
// const ip = Prefix.binToIPv6(ibin.join(""))
const b = Prefix.binToIPv6("0".repeat(11))

console.log(b)