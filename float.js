export class Float {
  constructor() {
    // js converts numbers to 32-bit signed ints before doing bitwise operations
    this.bits = 0
  }

  getBit(i) {
    return (this.bits >> i) & 1
  }

  setBit(i, value) {
    this.bits = value ? this.bits | (1 << i) : this.bits & ~(1 << i)
  }

  encode() {
    return this.bits.toString(16)
  }

  load() {
    const params = new URLSearchParams(window.location.search)
    this.bits = parseInt(params.get("v") ?? "0", 16)
  }

  get sign() {
    return (this.bits & 0x80000000) ? -1 : 1
  }

  get exponent() {
    return ((this.bits & 0x7f800000) >> 23) - 127
  }

  get mantissa() {
    return ((this.bits & 0x007fffff) | 0x00800000) * Math.pow(2, -23)
  }

  get value() {
    const exp = this.exponent
    if (this.exponent == 128) {
      return (this.bits & 0x007fffff) ? NaN : Infinity * this.sign
    }

    return this.sign * this.mantissa * Math.pow(2, this.exponent)
  }
}
