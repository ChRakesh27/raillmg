const questionsRouter = require("../controller/question.controller")
const express = require("express")

const router = express.Router()

router.use('/questions', questionsRouter)

module.exports = router;