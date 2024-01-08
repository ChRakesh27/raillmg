const usersRouter = require("../controller/user.controller")
const machineRoll = require("../controller/machineRoll.controller")
const railDetails = require("../controller/railDetails.controller")
const machines = require("../controller/machine.controller")
const boards = require("../controller/boards.controller")
const express = require("express")

const router = express.Router()

router.use('/users', usersRouter)
router.use('/machineRolls', machineRoll)
router.use('/machineNonRolls', machineRoll)
router.use('maintenanceRolls', machineRoll)
router.use('maintenanceNonRolls', machineRoll)
router.use('/railDetails', railDetails)
router.use('/machines', machines)
router.use('/boards', boards)

module.exports = router;