const usersRouter = require("../controller/user.controller")
const machineRoll = require("../controller/machineRoll.controller")
const machineNonRoll = require("../controller/machineNonRoll.controller")
const maintenanceRoll = require("../controller/maintenanceRoll.controller")
const maintenanceNon = require("../controller/maintenanceNon.controller")
const railDetails = require("../controller/railDetails.controller")
const machines = require("../controller/machine.controller")
const boards = require("../controller/boards.controller")
const express = require("express")

const router = express.Router()

router.use('/users', usersRouter)
router.use('/machineRolls', machineRoll)
router.use('/machineNonRolls', machineNonRoll)
router.use('/maintenanceRolls', maintenanceRoll)
router.use('/maintenanceNonRolls', maintenanceNon)
router.use('/railDetails', railDetails)
router.use('/machines', machines)
router.use('/boards', boards)

module.exports = router;