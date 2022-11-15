const BIT_MASKS = {
  SIGN:     0x80000000,
  EXPONENT: 0x7f800000,
  MANTISSA: 0x007fffff,
  NAN:      0x7fffffff
}

const MAN_MAX = 1 + BIT_MASKS.MANTISSA * Math.pow(2, -23)

function clamp(num, min, max) {
  return Math.max(Math.min(num, max), min)
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

  setExponent(newValue) {
    let val = Number.parseFloat(newValue)
    if (isNaN(val)) return null

    val = clamp(val, -127, 128)

    this.bits &= BIT_MASKS.SIGN | BIT_MASKS.MANTISSA
    this.bits |= ((val + 127) << 23) & BIT_MASKS.EXPONENT

    return this.exponent
  }

  setMantissa(newValue) {
    let val = Number.parseFloat(newValue)
    if (isNaN(val)) return null

    val = clamp(val, 1, MAN_MAX)

    const man = Math.round(val * Math.pow(2, 23))
    this.bits &= ~BIT_MASKS.MANTISSA
    this.bits |= man & BIT_MASKS.MANTISSA

    return this.mantissa
  }

  setValue(newValue) {
    const val = Number.parseFloat(newValue)

    if (isNaN(val)) {
      this.bits = BIT_MASKS.NAN
      return this.value
    }

    const absVal = Math.abs(val)
    const expBits = this.setExponent(Math.floor(Math.log2(absVal)))
    
    // don't set the mantissa if the value is infinite
    if (expBits < 128) {
      this.setMantissa(absVal/Math.pow(2, expBits))
    } else {
      this.setMantissa(1)
    }

    this.bits &= ~BIT_MASKS.SIGN
    this.bits |= (val < 0 || Object.is(val, -0)) << 31

    return this.value
  }

  get isNegative() {
    return (this.bits & BIT_MASKS.SIGN) >> 31
  }

  get sign() {
    return  (this.bits & BIT_MASKS.SIGN) ? -1 : 1
  }

  get exponent() {
    return ((this.bits & BIT_MASKS.EXPONENT) >> 23) - 127
  }

  get mantissa() {
    return ((this.bits & BIT_MASKS.MANTISSA) | 0x00800000) * Math.pow(2, -23)
  }

  get value() {
    if (this.exponent == 128) {
      return (this.bits & BIT_MASKS.MANTISSA) ? NaN : Infinity * this.sign
    } else if (!(this.bits & ~BIT_MASKS.SIGN)) {
      return 0
    }

    return this.sign * this.mantissa * Math.pow(2, this.exponent)
  }
}
