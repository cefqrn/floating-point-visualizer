let focusIndex
let focusNext
let focusPrev


const checkboxes = Array.from(document.getElementsByClassName("checkbox-container")).map(
  (element) => element.firstElementChild
)

for (let i=1; i < checkboxes.length; ++i) {
  checkboxes[i].tabIndex = -1
  checkboxes[i].addEventListener("click", _ => {
    focusIndex(i)
  })
}

document.onkeydown = event => {
  const parent = document.activeElement.parentElement
  if (!parent || parent.className !== "checkbox-container") {
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


{
  let selectedIndex = 0

  focusIndex = newIndex => {
    checkboxes[selectedIndex].tabIndex = -1
    checkboxes[newIndex].tabIndex = 0
    checkboxes[newIndex].focus()
    selectedIndex = newIndex
  }
  
  focusPrev = () => {
    focusIndex((selectedIndex ? selectedIndex : checkboxes.length) - 1)
  }

  focusNext = () => {
    focusIndex((selectedIndex + 1) % checkboxes.length)
  }
}
