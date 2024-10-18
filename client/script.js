document.querySelector(".hamburger").addEventListener("click", () => {
  document.querySelector(".hamburger-menu").classList.toggle("show")
})

document.querySelector(".close-btn").addEventListener("click", () => {
  document.querySelector(".hamburger-menu").classList.remove("show")
})
