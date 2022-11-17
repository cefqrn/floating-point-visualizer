let checkboxes

let focusIndex
let focusNext
let focusPrev

{
  let selectedIndex = 0

  focusIndex = newIndex => {
    checkboxes[selectedIndex].tabIndex = -1
    checkboxes[newIndex].tabIndex = 0
    checkboxes[newIndex].focus()
    selectedIndex = newIndex
  }
  
  focusNext = () => {
    focusIndex((selectedIndex + 1) % checkboxes.length)
  }
  
  focusPrev = () => {
    focusIndex((selectedIndex ? selectedIndex : checkboxes.length) - 1)
  }
}

document.onkeydown = event => {
  if (document.activeElement.parentElement?.className !== "checkbox-container") {
    return
  }

  switch (event.key) {
    case "a":
    case "A":
    case "ArrowLeft":
      focusPrev()
      break
    case "d":
    case "D":
    case "ArrowRight":
      focusNext()
      break
    default:
      return
  }

  event.preventDefault()
}

addEventListener("DOMContentLoaded", _ => {
  checkboxes = Array.from(document.getElementsByClassName("checkbox-container")).map(
    (element) => element.firstElementChild
  )

  for (let i=1; i < checkboxes.length; ++i) {
    checkboxes[i].tabIndex = -1
    checkboxes[i].addEventListener("click", _ => {
      focusIndex(i)
    })
  }
})
