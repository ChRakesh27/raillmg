const usersRouter = require("../controller/user.controller")
const machineRoll = require("../controller/machineRoll.controller")
const express = require("express")

const router = express.Router()

router.use('/users', usersRouter)
router.use('/machineRolls', machineRoll)

module.exports = router;