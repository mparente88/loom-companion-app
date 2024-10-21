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
      <button class="edit-btn" onclick="window.location.href='editFear.html?id=${fear._id}'">Edit</button>
      `

      fearDiv.addEventListener(`click`, () => {
        window.location.href = `fearDetail.html?id=${fear._id}`
      })
      fearsList.appendChild(fearDiv)

      const editButton = fearDiv.querySelector(`.edit-btn`)
      editButton.addEventListener(`click`, (event) => {
        event.stopPropagation()
        window.location.href = `editFear.html?id=${fear._id}`
      })
    })
  } catch (error) {
    console.error(`Error fetching fears:`, error)
  }
}

const fetchFearDetailForEdit = async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const fearId = urlParams.get("id")

  if (fearId) {
    try {
      const response = await axios.get(`http://localhost:3001/fears/${fearId}`)
      const fear = response.data

      document.getElementById("name").value = fear.name || ""
      document.getElementById("desc").value = fear.desc || ""
      document.getElementById("severity").value = fear.severity || 0
      document.getElementById("frequency").value = fear.frequency || 0

      const editForm = document.getElementById("edit-fear-form")
      editForm.addEventListener("submit", async (event) => {
        event.preventDefault()

        const updatedFear = {
          name: event.target.name.value,
          desc: event.target.desc.value,
          severity: parseInt(event.target.severity.value),
          frequency: parseInt(event.target.frequency.value),
        }

        try {
          await axios.put(`http://localhost:3001/fears/${fearId}`, updatedFear)
          alert("Fear updated successfully!")
          window.location.href = "fears.html"
        } catch (error) {
          console.error("Error updating fear:", error)
        }
      })
    } catch (error) {
      console.error("Error fetching fear details for edit:", error)
    }
  }
}

if (window.location.pathname === "/client/editFear.html") {
  fetchFearDetailForEdit()
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

      const editButton = kidDiv.querySelector(`.edit-btn`)
      editButton.addEventListener(`click`, (event) => {
        event.stopPropagation() // ChatGPT showed me how to do this
        window.location.href = `editKid.html?id=${kid._id}`
      })

      kidsList.appendChild(kidDiv)
    })
  } catch (error) {
    console.error("Error fetching kids:", error)
  }
}

const fetchKidDetailForEdit = async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const kidId = urlParams.get("id")

  const [stuffiesResponse, fearsResponse] = await Promise.all([
    axios.get(`http://localhost:3001/stuffies`),
    axios.get(`http://localhost:3001/fears`),
  ])
  const stuffies = stuffiesResponse.data
  const fears = fearsResponse.data

  const favStuffySelect = document.getElementById("favStuffy")
  const mainFearSelect = document.getElementById("mainFear")
  const otherFearsSelect = document.getElementById("otherFears")

  stuffies.forEach((stuffy) => {
    const option = document.createElement("option")
    option.value = stuffy._id
    option.textContent = stuffy.name
    favStuffySelect.appendChild(option)
  })

  fears.forEach((fear) => {
    const option = document.createElement("option")
    option.value = fear._id
    option.textContent = fear.name
    mainFearSelect.appendChild(option)

    const otherFearsOption = option.cloneNode(true)
    otherFearsSelect.appendChild(otherFearsOption)
  })

  if (kidId) {
    try {
      const response = await axios.get(`http://localhost:3001/kids/${kidId}`)
      const kid = response.data

      document.getElementById("name").value = kid.name
      document.getElementById("age").value = kid.age
      document.getElementById("desc").value = kid.desc
      document.getElementById("favStuffy").value = kid.favStuffy
        ? kid.favStuffy._id
        : ""
      document.getElementById("mainFear").value = kid.mainFear
        ? kid.mainFear._id
        : ""
      document.getElementById("sleepQual").value = kid.sleepQual
      document.getElementById("nightmareCt").value = kid.nightmareCt
      document.getElementById("notes").value = kid.notes || ""

      kid.otherFears.forEach((fear) => {
        const option = otherFearsSelect.querySelector(
          `option[value="${fear._id}"]`
        )
        if (option) option.selected = true
      })

      const editForm = document.getElementById("edit-kid-form")
      editForm.addEventListener("submit", async (event) => {
        event.preventDefault()

        const updatedKid = {
          name: event.target.name.value,
          age: event.target.age.value,
          desc: event.target.desc.value,
          mainFear: event.target.mainFear.value,
          favStuffy: event.target.favStuffy.value,
          sleepQual: event.target.sleepQual.value,
          nightmareCt: event.target.nightmareCt.value,
          notes: event.target.notes.value || null,
          otherFears: Array.from(
            event.target["otherFears[]"].selectedOptions
          ).map((fearOption) => fearOption.value),
        }

        try {
          await axios.put(`http://localhost:3001/kids/${kidId}`, updatedKid)
          alert("Kid updated successfully!")
          window.location.href = "kids.html"
        } catch (error) {
          console.error("Error updating kid:", error)
        }
      })
    } catch (error) {
      console.error("Error fetching kid details for edit:", error)
    }
  }
}

if (window.location.pathname === "/client/editKid.html") {
  fetchKidDetailForEdit()
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
        <button class="edit-btn" onclick="window.location.href='editStuffy.html?id=${
          stuffy._id
        }'">Edit</button>
      `

      stuffyDiv.addEventListener(`click`, () => {
        window.location.href = `stuffyDetail.html?id=${stuffy._id}`
      })
      stuffiesList.appendChild(stuffyDiv)

      const editButton = stuffyDiv.querySelector(`.edit-btn`)
      editButton.addEventListener(`click`, (event) => {
        event.stopPropagation()
        window.location.href = `editStuffy.html?id=${stuffy._id}`
      })
    })
  } catch (error) {
    console.error("Error fetching stuffies:", error)
  }
}

const fetchStuffyDetailForEdit = async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const stuffyId = urlParams.get("id")

  const kidsResponse = await axios.get(`http://localhost:3001/kids`)
  const kids = kidsResponse.data

  const personSelect = document.getElementById("person")
  kids.forEach((kid) => {
    const option = document.createElement("option")
    option.value = kid._id
    option.textContent = kid.name
    personSelect.appendChild(option)
  })

  if (stuffyId) {
    try {
      const response = await axios.get(
        `http://localhost:3001/stuffies/${stuffyId}`
      )
      const stuffy = response.data

      document.getElementById("name").value = stuffy.name
      document.getElementById("animalType").value = stuffy.animalType
      document.getElementById("desc").value = stuffy.desc
      document.getElementById("person").value = stuffy.person
        ? stuffy.person._id
        : ""

      const editForm = document.getElementById("edit-stuffy-form")
      editForm.addEventListener("submit", async (event) => {
        event.preventDefault()

        const updatedStuffy = {
          name: event.target.name.value,
          animalType: event.target.animalType.value,
          desc: event.target.desc.value,
          person: event.target.person.value || null,
        }

        try {
          await axios.put(
            `http://localhost:3001/stuffies/${stuffyId}`,
            updatedStuffy
          )
          alert("Stuffy updated successfully!")
          window.location.href = "stuffies.html"
        } catch (error) {
          console.error("Error updating stuffy:", error)
        }
      })
    } catch (error) {
      console.error("Error fetching stuffy details for edit:", error)
    }
  }
}

if (window.location.pathname === "/client/editStuffy.html") {
  fetchStuffyDetailForEdit()
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
      <button id="edit-fear-btn" class="detail-edit-btn">Edit</button>
      `

      document.getElementById(`edit-fear-btn`).addEventListener(`click`, () => {
        window.location.href = `editFear.html?id=${fearId}`
      })

      document
        .getElementById(`delete-fear-btn`)
        .addEventListener(`click`, async () => {
          const confirmDelete = confirm(
            `You are about to delete a fear. Are you sure?`
          )
          if (confirmDelete) {
            try {
              await axios.delete(`http://localhost:3001/fears/${fearId}`)
              alert(`Fear deleted successfully`)
              window.location.href = `fears.html`
            } catch (error) {
              console.error(`Error deleting fear:`, error)
              alert(`Failed to delete fear.`)
            }
          }
        })
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
      <button id="edit-stuffy-btn" class="detail-edit-btn">Edit</button>
      `

      document
        .getElementById(`edit-stuffy-btn`)
        .addEventListener(`click`, () => {
          window.location.href = `editStuffy.html?id=${stuffyId}`
        })

      document
        .getElementById(`delete-stuffy-btn`)
        .addEventListener(`click`, async () => {
          const confirmDelete = confirm(
            `You are about to delete a stuffed animal. Are you sure?`
          )
          if (confirmDelete) {
            try {
              await axios.delete(`http://localhost:3001/stuffies/${stuffyId}`)
              alert(`Stuffed animal deleted successfully`)
              window.location.href = `stuffies.html`
            } catch (error) {
              console.error(`Error deleting stuffed animal:`, error)
              alert(`Failed to delete stuffed animal.`)
            }
          }
        })
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
        <button id="edit-kid-btn" class="detail-edit-btn">Edit</button>
      `

      document.getElementById("edit-kid-btn").addEventListener("click", () => {
        window.location.href = `editKid.html?id=${kidId}`
      })

      document
        .getElementById("delete-kid-btn")
        .addEventListener("click", async () => {
          const confirmDelete = confirm(
            "You are about to delete this entry. Are you sure?"
          )
          if (confirmDelete) {
            try {
              await axios.delete(`http://localhost:3001/kids/${kidId}`)
              alert("Kid deleted successfully")
              window.location.href = "kids.html"
            } catch (error) {
              console.error("Error deleting kid:", error)
              alert("Failed to delete kid.")
            }
          }
        })
    } catch (error) {
      console.error("Error fetching kid details:", error)
    }
  }
}

const populateDropdowns = async () => {
  try {
    const [kidsResponse, fearsResponse] = await Promise.all([
      axios.get("http://localhost:3001/kids"),
      axios.get("http://localhost:3001/fears"),
    ])

    const kids = kidsResponse.data
    const fears = fearsResponse.data
    const kidSelect = document.getElementById("kid")
    const fearSelect = document.getElementById("fear")

    kids.forEach((kid) => {
      const option = document.createElement("option")
      option.value = kid._id
      option.textContent = kid.name
      kidSelect.appendChild(option)
    })

    fears.forEach((fear) => {
      const option = document.createElement("option")
      option.value = fear._id
      option.textContent = fear.name
      fearSelect.appendChild(option)
    })
  } catch (error) {
    console.error("Error populating dropdowns:", error)
  }
}

const handleFormSubmit = async (event) => {
  event.preventDefault()

  const kidId = document.getElementById("kid").value
  const fearId = document.getElementById("fear").value

  if (!kidId || !fearId) {
    alert("Please select both a kid and a fear.")
    return
  }

  try {
    const response = await axios.post("http://localhost:3001/recommendStuffy", {
      kidId,
      fearId,
    })

    const recommendation = response.data.recommendation

    const resultDiv = document.getElementById("recommendation-result")
    resultDiv.innerHTML = `<H2>Recommended Stuffed Animal:</h2><p>${recomendation}</p>`
  } catch (error) {
    console.error("Error getting recommendation:", error)
    alert("Failed to get stuffed animal recommendation.")
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
  } else if (path === "/client/stuffyFinder.html") {
    populateDropdowns()
    const form = document.getElementById("recommendation-form")
    form.addEventListener("submit", handleFormSubmit)
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
