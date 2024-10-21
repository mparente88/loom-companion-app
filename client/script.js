//I asked ChatGPT for help in formatting the "createElement" function.

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

      fearDiv.addEventListener(`click`, () => {
        window.location.href = `fearDetail.html?id=${fear._id}`
      })
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
        <button class="edit-btn" onclick="window.location.href='editKid.html?id=${
          kid._id
        }'">Edit</button>
      `

      kidDiv.addEventListener(`click`, () => {
        window.location.href = `kidDetail.html?id=${kid._id}`
      })
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

      stuffyDiv.addEventListener(`click`, () => {
        window.location.href = `stuffyDetail.html?id=${stuffy._id}`
      })
      stuffiesList.appendChild(stuffyDiv)
    })
  } catch (error) {
    console.error("Error fetching stuffies:", error)
  }
}

const fetchFearDetail = async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const fearId = urlParams.get(`id`)

  if (fearId) {
    try {
      const response = await axios.get(`http://localhost:3001/fears/${fearId}`)
      const fear = response.data
      const fearDetailDiv = document.getElementById(`fear-detail`)

      fearDetailDiv.innerHTML = `
      <h1>${fear.name}</h1>
      <p>${fear.desc}</p>
      <p>Severity: ${fear.severity}</p>
      <p>Frequency: ${fear.frequency}</p>
      `
    } catch (error) {
      console.error("Error fetching fear details:", error)
    }
  }
}

const fetchStuffyDetail = async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const stuffyId = urlParams.get(`id`)

  if (stuffyId) {
    try {
      const response = await axios.get(
        `http://localhost:3001/stuffies/${stuffyId}`
      )
      const stuffy = response.data
      const stuffyDetailDiv = document.getElementById(`stuffy-detail`)
      const belongsToLink = stuffy.person
        ? `<a href="kidDetail.html?id=${stuffy.person._id}">${stuffy.person.name}</a>`
        : `No One`

      stuffyDetailDiv.innerHTML = `
      <h1>${stuffy.name}</h1>
      <p>${stuffy.animalType}</p>
      <p>${stuffy.desc}</p>
      <p>${stuffy.role}</p>
      <p>${stuffy.wearTear}</p>
      <p>Belongs to: ${belongsToLink}</p>
      `
    } catch (error) {
      console.error(`Error fetching stuffed animal details:`, error)
    }
  }
}

//ChatGPT helped with the .map higher function

const fetchKidDetail = async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const kidId = urlParams.get("id")

  if (kidId) {
    try {
      const response = await axios.get(`http://localhost:3001/kids/${kidId}`)
      const kid = response.data
      const kidDetailDiv = document.getElementById("kid-detail")
      const favStuffyLink = kid.favStuffy
        ? `<a href="stuffyDetail.html?id=${kid.favStuffy._id}">${kid.favStuffy.name}</a>`
        : `None`

      const mainFearLink = kid.mainFear
        ? `<a href="fearDetail.html?id=${kid.mainFear._id}">${kid.mainFear.name}</a>`
        : `None`

      const otherFearsLinks =
        kid.otherFears && kid.otherFears.length
          ? kid.otherFears
              .map(
                (fear) =>
                  `<a href="fearDetail.html?id=${fear._id}">${fear.name}</a>`
              )
              .join(", ")
          : "None"

      kidDetailDiv.innerHTML = `
        <h1>${kid.name}</h1>
        <p>${kid.age} Years Old</p>
        <p>${kid.desc}</p>
        <p>Main Fear: ${mainFearLink}</p>
        <p>Favorite Stuffy: ${favStuffyLink}</p>
        <p>Sleep Quality: ${kid.sleepQual}</p>
        <p>Nightmare Count: ${kid.nightmareCt}</p>
        <p>Other Fears: ${otherFearsLinks}</p>
        <p>Notes: ${kid.notes ? kid.notes : "None"}</p>
      `
    } catch (error) {
      console.error("Error fetching kid details:", error)
    }
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
  } else if (path === "/client/fearDetail.html") {
    fetchFearDetail()
  } else if (path === "/client/kidDetail.html") {
    fetchKidDetail()
  } else if (path === "/client/stuffyDetail.html") {
    fetchStuffyDetail()
  }
})

const kidForm = document.getElementById("add-kid-form")

if (kidForm) {
  kidForm.addEventListener("submit", async (event) => {
    event.preventDefault()

    const newKid = {
      name: event.target.name.value,
      age: event.target.age.value,
      desc: event.target.desc.value,
      sleepQual: event.target.sleepQual.value,
      nightmareCt: event.target.nightmareCt.value,
      notes: event.target.notes.value || null,
    }

    try {
      await axios.post(`http://localhost:3001/kids`, newKid)
      alert(`Kid created!`)
      window.location.href = `kids.html`
    } catch (error) {
      console.error(`Error creating kid:`, error)
      alert(`Failed to create kid`)
    }
  })
}

const stuffyForm = document.getElementById(`add-stuffy-form`)

if (stuffyForm) {
  stuffyForm.addEventListener(`submit`, async (event) => {
    event.preventDefault()

    const newStuffy = {
      name: event.target.name.value,
      animalType: event.target.animalType.value,
      desc: event.target.desc.value,
      role: event.target.role.value,
      wearTear: event.target.wearTear.value,
    }

    console.log(`New Stuffy Data:`, newStuffy)

    try {
      await axios.post(`http://localhost:3001/stuffies`, newStuffy)
      alert(`Stuffed Animal created successfully!`)
      window.location.href = `stuffies.html`
    } catch (error) {
      console.error(`Error creating new stuffed animal:`, error)
      alert(`Failed to create new stuffed animal.`)
    }
  })
}

const fearForm = document.getElementById(`add-fear-form`)

if (fearForm) {
  fearForm.addEventListener(`submit`, async (event) => {
    event.preventDefault()

    const newFear = {
      name: event.target.name.value,
      desc: event.target.desc.value,
      severity: event.target.severity.value,
      frequency: event.target.frequency.value,
    }

    try {
      await axios.post(`http://localhost:3001/fears`, newFear)
      alert(`Fear successfully created!`)
      window.location.href = `fears.html`
    } catch (error) {
      console.error(`Error adding new fear:`, error)
      alert(`Failed to add fear.`)
    }
  })
}

document.querySelector(".hamburger").addEventListener("click", () => {
  document.querySelector(".hamburger-menu").classList.toggle("show")
  document.querySelector(".logo").classList.toggle("shift")
})

document.querySelector(".close-btn").addEventListener("click", () => {
  document.querySelector(".hamburger-menu").classList.remove("show")
  document.querySelector(".logo").classList.remove("shift")
})

//ChatGPT showed me what "isClickInside" is.

document.addEventListener("click", (event) => {
  const isClickInside = document
    .querySelector(".hamburger-menu")
    .contains(event.target)
  const isHamburger = document
    .querySelector(".hamburger")
    .contains(event.target)

  if (!isClickInside && !isHamburger) {
    document.querySelector(".hamburger-menu").classList.remove("show")
    document.querySelector(".logo").classList.remove("shift")
  }
})
