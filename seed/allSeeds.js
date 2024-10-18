const db = require(`../db`)
const Kid = require(`../models/kid`)
const Stuffy = require(`../models/stuffy`)
const Fear = require(`../models/fear`)

db.on(`error`, console.error.bind(console, `MongoDB connection error:`))

const main = async () => {
  await Kid.deleteMany()
  await Stuffy.deleteMany()
  await Fear.deleteMany()

  const exampleFear1 = await new Fear({
    name: `Fear of the Dark`,
    desc: `The child is afraid of being in dark rooms and places.`,
    severity: 80,
    frequency: 60,
  })

  const exampleFear2 = await new Fear({
    name: `Fear of Thunderstorms`,
    desc: `The child gets scared during thunderstorms due to loud noises and flashes of lightning.`,
    severity: 70,
    frequency: 50,
  })

  const exampleKid = await new Kid({
    name: `Emma`,
    age: 7,
    desc: `Emma is a bright and curious child who has a fear of the dark and thunderstorms.`,
    favStuffy: null,
    mainFear: exampleFear1._id,
    otherFears: [exampleFear2._id],
    sleepQual: 75,
    nightmareCt: 2,
    note: `Emma sleeps with her bear Fluffy every night to feel safe.`,
  })

  const exampleStuffy1 = await new Stuffy({
    name: `Fluffy the Bear`,
    animalType: `Bear`,
    desc: `A soft brown bear with a calming lavender scent.`,
    role: `Protector`,
    wearTear: `Slightly worn, with a few patches of fabric`,
    person: null,
  })

  const exampleStuffy2 = await new Stuffy({
    name: `Rex the Dinosaur`,
    animalType: `Dinosaur`,
    desc: `A green stuffed T-Rex with a small red cape.`,
    role: `Guardian`,
    wearTear: `New and in perfect condition`,
    person: null,
  })

  exampleStuffy1.person = exampleKid._id
  exampleStuffy2.person = exampleKid._id

  exampleKid.favStuffy = exampleStuffy1._id

  await exampleFear1.save()
  await exampleFear2.save()
  await exampleStuffy1.save()
  await exampleStuffy2.save()
  await exampleKid.save()
}

const run = async () => {
  await main()
  db.close()
}

run()
