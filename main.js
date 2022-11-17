import { Float } from "./float.js"

const ELEMENT_IDS = {
  LINK:     0b00001,
  VALUE:    0b00010,
  SIGN:     0b00100,
  EXPONENT: 0b01000,
  MANTISSA: 0b10000,
  ALL:      0b11111
}

addEventListener("DOMContentLoaded", _ => {
  const floatValue = new Float

  const linkElement = document.getElementById("permalink")
  function updateLink() {
    const urlParams = new URLSearchParams({"v": floatValue.encode()})
    const url = `${window.location.origin}${window.location.pathname}?${urlParams}`

    linkElement.setAttribute("href", url)
    linkElement.innerText = url
  }

  const valElement = document.getElementById("val")  
  function updateValue() {
    const value = floatValue.value
    if (value === 0) {
      valElement.value = `${floatValue.isNegative ? "-" : ""}${value}`
    } else {
      valElement.value = value
    }
  }

  const sgnElement = document.getElementById("sgn")
  function updateSign() {
    sgnElement.value = floatValue.sign === 1 ? "+" : "-"
  }

  const expElement = document.getElementById("exp")
  function updateExponent() {
    expElement.value = floatValue.exponent
  }

  const manElement = document.getElementById("man")
  function updateMantissa() {
    manElement.value = floatValue.mantissa
  }

  function updateElements(selectedElements) {
    if (selectedElements & ELEMENT_IDS.LINK    ) updateLink()
    if (selectedElements & ELEMENT_IDS.VALUE   ) updateValue()
    if (selectedElements & ELEMENT_IDS.SIGN    ) updateSign()
    if (selectedElements & ELEMENT_IDS.EXPONENT) updateExponent()
    if (selectedElements & ELEMENT_IDS.MANTISSA) updateMantissa()
  }

  
  const checkboxes = Array.from(document.getElementsByClassName("checkbox-container")).map(
    (element) => element.firstElementChild
  )

  checkboxes.reverse()

  function updateCheckboxes() {
    for (let i=0; i < checkboxes.length; ++i) {
      checkboxes[i].checked = floatValue.getBit(i)
    }
  }

  const detailsTitle = document.getElementById("details-title")
  const detailsEntered = document.getElementById("entered")
  const detailsTrue = document.getElementById("true")
  const detailsEncoded = document.getElementById("encoded")
  function setDetails(title, enteredValue, trueValue, encodedValue) {
    detailsTitle.innerText = title
    detailsEntered.innerText = enteredValue
    detailsTrue.innerText = trueValue
    detailsEncoded.innerText = encodedValue
  }

  floatValue.load()
  for (let i=0; i < checkboxes.length; ++i) {
    const checkbox = checkboxes[i]

    checkbox.checked = floatValue.getBit(i)

    checkbox.addEventListener("click", _ => {
      floatValue.setBit(i, checkbox.checked)
      updateElements(ELEMENT_IDS.ALL)
    })
  }

  valElement.addEventListener("input", _ => {
    floatValue.setValue(valElement.value)

    setDetails("Value", valElement.value, floatValue.value, `0x${floatValue.valueBits.toString(16)}`)
    updateCheckboxes()
    updateElements(ELEMENT_IDS.ALL & ~(ELEMENT_IDS.VALUE))
  })

  expElement.addEventListener("input", _ => {
    floatValue.setExponent(expElement.value)

    setDetails("Exponent", expElement.value, floatValue.exponent, `0x${floatValue.exponentBits.toString(16)}`)
    updateCheckboxes()
    updateElements(ELEMENT_IDS.ALL & ~(ELEMENT_IDS.EXPONENT))
  })

  manElement.addEventListener("input", _ => {
    floatValue.setMantissa(manElement.value)

    setDetails("Mantissa", manElement.value, floatValue.mantissa, `0x${floatValue.mantissaBits.toString(16)}`)
    updateCheckboxes()
    updateElements(ELEMENT_IDS.ALL & ~(ELEMENT_IDS.MANTISSA))
  })

  valElement.addEventListener("click", _ => {
    setDetails("Value", valElement.value, floatValue.value, `0x${floatValue.valueBits.toString(16)}`)
  })

  expElement.addEventListener("click", _ => {
    setDetails("Exponent", expElement.value, floatValue.exponent, `0x${floatValue.exponentBits.toString(16)}`)
  })

  manElement.addEventListener("click", _ => {
    setDetails("Mantissa", manElement.value, floatValue.mantissa, `0x${floatValue.mantissaBits.toString(16)}`)
  })

  // TODO: improve this, repeats the same thing like 20 times
  // maybe use an array
  const leftButton = document.getElementById("button-left")
  leftButton.addEventListener("click", _ => {
    switch (detailsTitle.innerHTML) {
      case "Value":
        setDetails("Mantissa", manElement.value, floatValue.mantissa, `0x${floatValue.mantissaBits.toString(16)}`)
        break
      case "Exponent":
        setDetails("Value", valElement.value, floatValue.value, `0x${floatValue.valueBits.toString(16)}`)
        break
      case "Mantissa":
        setDetails("Exponent", expElement.value, floatValue.exponent, `0x${floatValue.exponentBits.toString(16)}`)
        break
      default:
        setDetails("Value", valElement.value, floatValue.value, `0x${floatValue.valueBits.toString(16)}`)
    }
  })

  const rightButton = document.getElementById("button-right")
  rightButton.addEventListener("click", _ => {
    switch (detailsTitle.innerHTML) {
      case "Value":
        setDetails("Exponent", expElement.value, floatValue.exponent, `0x${floatValue.exponentBits.toString(16)}`)
        break
      case "Exponent":
        setDetails("Mantissa", manElement.value, floatValue.mantissa, `0x${floatValue.mantissaBits.toString(16)}`)
        break
      case "Mantissa":
        setDetails("Value", valElement.value, floatValue.value, `0x${floatValue.valueBits.toString(16)}`)
        break
      default:
        setDetails("Value", valElement.value, floatValue.value, `0x${floatValue.valueBits.toString(16)}`)
    }
  })

  updateElements(ELEMENT_IDS.ALL)
  setDetails("Value", valElement.value, floatValue.value, `0x${floatValue.valueBits.toString(16)}`)
})
