document.querySelector(".hamburger").addEventListener("click", () => {
  document.querySelector(".hamburger-menu").classList.toggle("show")
  document.querySelector(".logo").classList.toggle("shift")
})

document.querySelector(".close-btn").addEventListener("click", () => {
  document.querySelector(".hamburger-menu").classList.remove("show")
  document.querySelector(".logo").classList.remove("shift")
})

const fetchFears = async () => {
  try {
    const response = await axios.get(`http://localhost:3001/fears`)
    const fears = response.data
    const fearsList = document.getElementById(`fears-list`)

    fears.forEach((fear) => {
      const fearDiv = document.createElement(`div`)
      fearDiv.classList.add(`fear-item`)
      fearDiv.innerHTML = `
      <h3>${fear.name}</h3>
      <p>${fear.desc}</p>
      <p>Severity: ${fear.severity}</p>
      <p>Frequency: ${fear.frequency}</p>
      `
      fearsList.appendChild(fearDiv)
    })
  } catch (error) {
    console.error(`Error fetching fears:`, error)
  }
}

const fetchKids = async () => {
  try {
    const response = await axios.get("http://localhost:3001/kids")
    const kids = response.data
    const kidsList = document.getElementById("kids-list")

    kids.forEach((kid) => {
      const kidDiv = document.createElement("div")
      kidDiv.classList.add("kid-item")
      kidDiv.innerHTML = `
        <h3>${kid.name}</h3>
        <p>Age: ${kid.age}</p>
        <p>Description: ${kid.desc}</p>
        <p>Main Fear: ${kid.mainFear ? kid.mainFear.name : `None`}</p>
        <p>Favorite Stuffy: ${kid.favStuffy ? kid.favStuffy.name : `None`}</p>
      `
      kidsList.appendChild(kidDiv)
    })
  } catch (error) {
    console.error("Error fetching kids:", error)
  }
}

const fetchStuffies = async () => {
  try {
    const response = await axios.get("http://localhost:3001/stuffies")
    const stuffies = response.data
    const stuffiesList = document.getElementById("stuffies-list")

    stuffies.forEach((stuffy) => {
      const stuffyDiv = document.createElement("div")
      stuffyDiv.classList.add("stuffy-item")
      stuffyDiv.innerHTML = `
        <h3>${stuffy.name}</h3>
        <p>Type: ${stuffy.animalType}</p>
        <p>Description: ${stuffy.desc}</p>
        <p>Belongs To: ${stuffy.person ? stuffy.person.name : `No One`}</p>
      `
      stuffiesList.appendChild(stuffyDiv)
    })
  } catch (error) {
    console.error("Error fetching stuffies:", error)
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname

  if (path === "/client/fears.html") {
    fetchFears()
  } else if (path === "/client/stuffies.html") {
    fetchStuffies()
  } else if (path === "/client/kids.html") {
    fetchKids()
  }
})
