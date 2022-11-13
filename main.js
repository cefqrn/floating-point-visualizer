import { Float } from "./float.js"

addEventListener("DOMContentLoaded", _ => {
  const floatValue = new Float

  const linkElement = document.getElementById("permalink")
  function updatePermalink() {
    const urlParams = new URLSearchParams({"v": floatValue.encode()})
    const url = `${window.location.origin}${window.location.pathname}?${urlParams}`

    linkElement.setAttribute("href", url)
    linkElement.innerText = url
  }

  const valElement = document.getElementById("val")
  const sgnElement = document.getElementById("sgn")
  const expElement = document.getElementById("exp")
  const manElement = document.getElementById("man")
  function updateValues() {
    valElement.value = floatValue.value
    sgnElement.value = floatValue.sign === 1 ? "+" : "-"
    expElement.value = floatValue.exponent
    manElement.value = floatValue.mantissa
  }

  
  const checkboxes = Array.from(document.getElementsByClassName("checkbox-container")).map(
    (element) => element.firstElementChild
  )

  checkboxes.reverse()

  floatValue.load()
  for (let i=0; i < checkboxes.length; ++i) {
    const checkbox = checkboxes[i]

    checkbox.checked = floatValue.getBit(i)

    checkbox.addEventListener("change", _ => {
      floatValue.setBit(i, checkbox.checked)
      updateValues()
      updatePermalink()
    })
  }

  updateValues()
  updatePermalink()
})
