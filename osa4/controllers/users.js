const usersRouter = require("express").Router()
const User = require("../models/user")
const bcrypt = require("bcrypt")

usersRouter.get("/", async (request, response, next) => {
  const users = await User.find({}).populate("blogs", {
    author: 1,
    title: 1
  })
  try {
    response.json(
      users.map(user => {
        return user.toJSON()
      })
    )
  } catch (error) {
    next(error)
  }
})

usersRouter.post("/", async (request, response, next) => {
  try {
    const body = request.body
    if (body.username.length < 3) {
      return response
        .status(400)
        .send("Username must be more than 2 characters long.")
    }
    if (body.password.length < 3) {
      return response
        .status(400)
        .send("Password must be more than 2 characters long.")
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash
    })

    const savedUser = await user.save()

    response.json(savedUser)
  } catch (exception) {
    next(exception)
  }
})

module.exports = usersRouter
