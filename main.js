import { Float } from "./float.js"

addEventListener("DOMContentLoaded", _ => {
  const ELEMENT_IDS = {
    LINK:     0b00001,
    VALUE:    0b00010,
    SIGN:     0b00100,
    EXPONENT: 0b01000,
    MANTISSA: 0b10000,
    ALL:      0b11111
  }

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

    updateCheckboxes()
    updateElements(ELEMENT_IDS.ALL & ~(ELEMENT_IDS.VALUE))
  })

  expElement.addEventListener("input", _ => {
    floatValue.setExponent(expElement.value)

    updateCheckboxes()
    updateElements(ELEMENT_IDS.ALL & ~(ELEMENT_IDS.EXPONENT))
  })

  manElement.addEventListener("input", _ => {
    floatValue.setMantissa(manElement.value)

    updateCheckboxes()
    updateElements(ELEMENT_IDS.ALL & ~(ELEMENT_IDS.MANTISSA))
  })

  updateElements(ELEMENT_IDS.ALL)
})
