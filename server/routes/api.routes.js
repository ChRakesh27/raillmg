const usersRouter = require("../controller/user.controller")
const express = require("express")

const router = express.Router()

router.use('/users', usersRouter)

module.exports = router;