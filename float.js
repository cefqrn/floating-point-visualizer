const BIT_MASKS = {
  SIGN:     0x80000000,
  EXPONENT: 0x7f800000,
  MANTISSA: 0x007fffff
}

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

  get negative() {
    return (this.bits & BIT_MASKS.SIGN) >> 31
  }

  get sign() {
    return  (this.bits & BIT_MASKS.SIGN) ? -1 : 1
  }

  get exponent() {
    return ((this.bits & BIT_MASKS.EXPONENT) >> 23) - 127
  }

  set exponent(newValue) {
    const val = Number.parseFloat(newValue)

    this.bits &= BIT_MASKS.SIGN | BIT_MASKS.MANTISSA
    this.bits |= ((val + 127) << 23) & BIT_MASKS.EXPONENT
  }

  get mantissa() {
    return ((this.bits & BIT_MASKS.MANTISSA) | 0x00800000) * Math.pow(2, -23)
  }

  set mantissa(newValue) {
    const val = Number.parseFloat(newValue)

    if (isNaN(val)) return

    const man = Math.round(val * Math.pow(2, 23))
    this.bits &= ~BIT_MASKS.MANTISSA
    this.bits |= man & BIT_MASKS.MANTISSA
  }

  get value() {
    if (this.exponent == 128) {
      return (this.bits & BIT_MASKS.MANTISSA) ? NaN : Infinity * this.sign
    } else if (!(this.bits & ~BIT_MASKS.SIGN)) {
      return 0
    }

    return this.sign * this.mantissa * Math.pow(2, this.exponent)
  }

  set value(newValue) {
    const val = Number.parseFloat(newValue)

    if (isNaN(val)) {
      this.bits = BIT_MASKS.EXPONENT | BIT_MASKS.MANTISSA
      return
    }

    const exp = Math.floor(Math.log2(val))
    const man = Math.round((val/Math.pow(2, exp - 23)))
    const sgn = val < 0 || Object.is(val, -0) ? 1 : 0

    if (exp >= 128) {
      this.bits = (sgn << 31) | BIT_MASKS.EXPONENT
    } else {
      this.bits = (sgn << 31) | ((exp + 127) << 23) | (man & BIT_MASKS.MANTISSA)
    }
  }
}
