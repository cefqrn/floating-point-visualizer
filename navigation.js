document.onkeydown = function(event) {
  const focus = document.activeElement
  const parent = focus.parentElement

  if (parent.className !== "checkbox-container") {
    return
  }

  let newFocus
  switch (event.key) {
    case "ArrowLeft":
      if (parent.previousElementSibling) {
        newFocus = parent.previousElementSibling
      } else if (parent.parentElement.previousElementSibling) {
        newFocus = parent.parentElement.previousElementSibling.lastElementChild
      }

      break
    case "ArrowRight":
      if (parent.nextElementSibling) {
        newFocus = parent.nextElementSibling
      } else if (parent.parentElement.nextElementSibling) {
        newFocus = parent.parentElement.nextElementSibling.firstElementChild
      }

      break
    default:
      return
  }

  if (newFocus && newFocus.className === "checkbox-container") {
    newFocus.focus()
  }

  event.preventDefault()
}
