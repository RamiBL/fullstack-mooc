const mongoose = require("mongoose")
const User = require("../models/user")
const helper = require("./test_helper")
const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)

describe("when there is initially one user at db", () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const user = new User({ username: "root", password: "sekret" })
    await user.save()
  })

  test("invalid username", async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: "ml",
      name: "Matti Luukkainen",
      password: "salainen"
    }

    const response = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)

    expect(response.error.text).toBe(
      "Username must be more than 2 characters long."
    )
  })

  test("invalid password", async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "sl"
    }

    const response = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
    expect(response.error.text).toBe(
      "Password must be more than 2 characters long."
    )
  })

  test("fails with duplicate username", async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen"
    }

    await api
      .post("/api/users")
      .send(newUser)
      .expect(200)
      .expect("Content-Type", /application\/json/)

    const response = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

    expect(response.text).toContain("Error")
    expect(response.error.text).toContain(
      "User validation failed: username: Error, expected `username` to be unique."
    )
  })

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen"
    }

    await api
      .post("/api/users")
      .send(newUser)
      .expect(200)
      .expect("Content-Type", /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })
})
