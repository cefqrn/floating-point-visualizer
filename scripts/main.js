import { Float } from "./float.js"

const ELEMENT_IDS = {
  LINK:       0b0000001,
  VALUE:      0b0000010,
  SIGN:       0b0000100,
  EXPONENT:   0b0001000,
  MANTISSA:   0b0010000,
  CHECKBOXES: 0b0100000,
  DETAILS:    0b1000000,
  ALL:        0b1111111
}

const DETAILS_IDS = {
  VALUE:    0,
  EXPONENT: 1,
  MANTISSA: 2
}

let updateElements
let setDetails
let nextDetails
let prevDetails


const valElement  = document.getElementById("val")
const sgnElement  = document.getElementById("sgn")
const expElement  = document.getElementById("exp")
const manElement  = document.getElementById("man")

const floatValue = new Float
let checkboxes

{
  const linkElement = document.getElementById("permalink")

  let updateDetails
  {
    let detailsFunctionsIndex = 0
    const detailsFunctions = [
      () => ["Value",    valElement.value, floatValue.value,    `0x${floatValue.valueBits.toString(16).padStart(8, '0')}`   ],
      () => ["Exponent", expElement.value, floatValue.exponent, `0x${floatValue.exponentBits.toString(16).padStart(2, '0')}`],
      () => ["Mantissa", manElement.value, floatValue.mantissa, `0x${floatValue.mantissaBits.toString(16).padStart(6, '0')}`]
    ]

    const detailsTitle   = document.getElementById("details-title")
    const detailsEntered = document.getElementById("entered")
    const detailsTrue    = document.getElementById("true")
    const detailsEncoded = document.getElementById("encoded")
    
    setDetails = (newIndex) => {
      const [title, enteredValue, trueValue, encodedValue] = detailsFunctions[newIndex]()

      detailsTitle.innerText   = title
      detailsEntered.innerText = enteredValue
      detailsTrue.innerText    = trueValue
      detailsEncoded.innerText = encodedValue

      detailsFunctionsIndex = newIndex
    }

    updateDetails = () => {
      const [title, enteredValue, trueValue, encodedValue] = detailsFunctions[detailsFunctionsIndex]()

      detailsTitle.innerText   = title
      detailsEntered.innerText = enteredValue
      detailsTrue.innerText    = trueValue
      detailsEncoded.innerText = encodedValue
    }

    prevDetails = () => {
      setDetails((detailsFunctionsIndex ? detailsFunctionsIndex : detailsFunctions.length) - 1)
    }

    nextDetails = () => {
      setDetails((detailsFunctionsIndex + 1) % detailsFunctions.length)
    }
  }

  const updateLink = () => {
    const urlParams = new URLSearchParams({"v": floatValue.encode()})
    const url = `${window.location.origin}${window.location.pathname}?${urlParams}`

    linkElement.setAttribute("href", url)
    linkElement.innerText = url
  }

  const updateValue = () => {
    const value = floatValue.value
    if (value === 0) {
      valElement.value = `${floatValue.isNegative ? "-" : ""}${value}`
    } else {
      valElement.value = value
    }
  }

  const updateSign = () => {
    sgnElement.value = floatValue.sign === 1 ? "+" : "-"
  }

  const updateExponent = () => {
    expElement.value = floatValue.exponent
  }

  const updateMantissa = () => {
    manElement.value = floatValue.mantissa
  }

  const updateCheckboxes = () => {
    for (let i=0; i < checkboxes.length; ++i) {
      checkboxes[i].checked = floatValue.getBit(i)
    }
  }

  updateElements = selectedElements => {
    if (selectedElements & ELEMENT_IDS.LINK      ) updateLink()
    if (selectedElements & ELEMENT_IDS.VALUE     ) updateValue()
    if (selectedElements & ELEMENT_IDS.SIGN      ) updateSign()
    if (selectedElements & ELEMENT_IDS.EXPONENT  ) updateExponent()
    if (selectedElements & ELEMENT_IDS.MANTISSA  ) updateMantissa()
    if (selectedElements & ELEMENT_IDS.CHECKBOXES) updateCheckboxes()
    if (selectedElements & ELEMENT_IDS.DETAILS   ) updateDetails()
  }
}


floatValue.load()

checkboxes = Array.from(document.getElementsByClassName("checkbox-container")).map(
  element => element.firstElementChild
)

checkboxes.reverse()

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

  setDetails(DETAILS_IDS.VALUE)
  updateElements(ELEMENT_IDS.ALL & ~(ELEMENT_IDS.VALUE))
})

expElement.addEventListener("input", _ => {
  floatValue.setExponent(expElement.value)

  setDetails(DETAILS_IDS.EXPONENT)
  updateElements(ELEMENT_IDS.ALL & ~(ELEMENT_IDS.EXPONENT))
})

manElement.addEventListener("input", _ => {
  floatValue.setMantissa(manElement.value)

  setDetails(DETAILS_IDS.MANTISSA)
  updateElements(ELEMENT_IDS.ALL & ~(ELEMENT_IDS.MANTISSA))
})

valElement.addEventListener("click", _ => setDetails(DETAILS_IDS.VALUE   ))
expElement.addEventListener("click", _ => setDetails(DETAILS_IDS.EXPONENT))
manElement.addEventListener("click", _ => setDetails(DETAILS_IDS.MANTISSA))

document.getElementById("button-left" ).addEventListener("click", prevDetails)
document.getElementById("button-right").addEventListener("click", nextDetails)


updateElements(ELEMENT_IDS.ALL)
setDetails(DETAILS_IDS.VALUE)
