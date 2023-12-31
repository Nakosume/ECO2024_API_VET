const express = require('express')
const app = express()
const port = 3000

// Use Json middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors())

const { validateUser } = require('./SCHEMAS/user')
const { validatePet } = require('./SCHEMAS/pet')
const { validateVet } = require('./SCHEMAS/vet')
const { object } = require('zod')

let vets = []
let users = []
let pets = []

vets.push({
    id: 1006106410,
    name: "Jhon",
    last: "Doe",
})

pets.push({
    id: 1006106140,
    name: "pipi",
    age: 2,
    type: "gato",
    vetId: 1006106410,
    userId: 1234567890
})

pets.push({
    id: 1006106141,
    name: "engel",
    age: 4,
    type: "gato",
    vetId: 1006106410,
    userId: 1234567890
})

users.push({
    id: 1234567890,
    name: "Mr",
    last: "beast",
})


////////////////////////////////////////////////
app.listen(port, () => {
    console.log(`Running on port ${port}`)
})

app.get('/', (req, res) => {
    res.send('API IS RUNNING')
})
////////////////////////////////////////////////
//vets//
app.get('/vets', (req, res) => {
    res.send({ "vets": vets })
})

app.get('/vets/:id', (req, res) => {
    const idToGet = req.params.id;
    let indexToGet = vets.findIndex(vet=>vet.id==idToGet)
    let vetGet = vets[indexToGet]

    let petList = []
    for (let i = 0; i < pets.length; i++) {
        if (pets[i].vetId == idToGet) {
            petList.push(pets[i])
        }
    } 

    let fullVet = {
        id: vetGet.id,
        name: vetGet.name,
        last: vetGet.last,
        petList: petList
    }

    res.send({ "vets": fullVet })
})

app.post('/vets', (req, res) => {
    const vetValidationResult = validateVet(req.body)
    console.log("result", vetValidationResult.error)

    if (vetValidationResult.error) {
        return res.status(400).send(
            { message: JSON.parse(vetValidationResult.error.message) }
        )
    }

    let newVet = {
        name: vetValidationResult.data.name,
        last: vetValidationResult.data.last,
        id: vetValidationResult.data.id,
    }
    vets.push(newVet)
    res.status(201).send({ "message": "New Vet in the jungle!", "user": newVet })
})

//patch de veterinario. si e veterinario cambia de id, este tambien cambia el vetID de los pacientes del dichoso

app.patch('/vets/:id', (req, res) => {
    let index = vets.findIndex(vet => vet.id == req.params.id)

    for (let i = 0; i < pets.length; i++) {
        //pets[i].vetId=req.body.id||pets[i].vetId
        if (pets[i].vetId == vets[index].id) {
            pets[i].vetId = req.body.id || pets[i].vetId
        }
    }

    vets[index].name = req.body.name || vets[index].name
    vets[index].last = req.body.last || vets[index].last
    vets[index].id = req.body.id || vets[index].id

    res.send("veterinario modificado ")
})

app.delete('/vets/:id', (req, res)=>{
    const idToDelete = req.params.id;
    let indexToDelete = vets.findIndex(vet=>vet.id==idToDelete)
    let vetDeleted = vets.splice(indexToDelete, 1)
    res.send("Vet Deleted: " + vetDeleted[0].id)
})

/////////////////////////////////////////////////////////////////////////////////////
//pets//
app.get('/pets', (req, res) => {
    res.send({ "pets": pets })
})

app.post('/pets', (req, res) => {
    const petValidationResult = validatePet(req.body)
    console.log("result", petValidationResult.error)

    if (petValidationResult.error) {
        return res.status(400).send(
            { message: JSON.parse(petValidationResult.error.message) }
        )
    }

    let newPet = {
        name: petValidationResult.data.name,
        age: petValidationResult.data.age,
        id: petValidationResult.data.id,
        type: petValidationResult.data.type,
        vetId: petValidationResult.data.vetId,
        userId: petValidationResult.data.userId,
    }
    pets.push(newPet)
    res.status(201).send({ "message": "New pet in the jungle!", "user": newPet })
})

app.delete('/pets/:id', (req, res)=>{
    const idToDelete = req.params.id;
    let indexToDelete = pets.findIndex(pet=>pet.id==idToDelete)
    let userDeleted = pets.splice(indexToDelete, 1)
    res.send("Pet Deleted: " + userDeleted[0].id)
})

///////////////////////////////////////////////////////////////////////////////////////
//users//
app.get('/users', (req, res) => {
    res.send({ "users": users })
})

app.get('/users/:id', (req, res) => {
    const idToGet = req.params.id;
    let indexToGet = users.findIndex(user=>user.id==idToGet)
    let userGet = users[indexToGet]

    let petList = []
    for (let i = 0; i < pets.length; i++) {
        if (pets[i].userId == idToGet) {
            petList.push(pets[i])
        }
    } 

    let fullUser = {
        id: userGet.id,
        name: userGet.name,
        last: userGet.last,
        petList: petList
    }

    res.send({ "users": fullUser })
})


app.post('/users', (req, res) => {
    const userValidationResult = validateUser(req.body)
    console.log("result", userValidationResult.error)

    if (userValidationResult.error) {
        return res.status(400).send(
            { message: JSON.parse(userValidationResult.error.message) }
        )
    }

    let newUser = {
        name: userValidationResult.data.name,
        last: userValidationResult.data.last,
        id: userValidationResult.data.id,
    }
    users.push(newUser)
    res.status(201).send({ "message": "New User in the jungle!", "user": newUser })
})

app.patch('/users/:id', (req, res) => {
    let index = users.findIndex(user => user.id == req.params.id)

    for (let i = 0; i < pets.length; i++) {
        //pets[i].vetId=req.body.id||pets[i].vetId
        if (pets[i].userId == users[index].id) {
            pets[i].userId = req.body.id || pets[i].vetId
        }
    }

    users[index].name = req.body.name || users[index].name
    users[index].last = req.body.last || users[index].last
    users[index].id = req.body.id || users[index].id

    res.send("usuario modificado ")
})

app.delete('/users/:id', (req, res)=>{
    const idToDelete = req.params.id;
    let indexToDelete = users.findIndex(user=>user.id==idToDelete)
    let userDeleted = users.splice(indexToDelete, 1)
    res.send("User Deleted: " + userDeleted[0].id)
})