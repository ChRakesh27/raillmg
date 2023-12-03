
const express = require("express")
const machineRoll = require("../model/machineRoll.model")
const router = express.Router()


router.get('/', async (req, res) => {
    try {
        const userId = req.params.id
        const docs = await machineRoll.find({ user: userId });
        res.send(docs)
    } catch (error) {
        res.send(error)
    }
})

// router.get('/:id', async (req, res) => {
//     try {
//         const docs = await machineRoll.findById(req.params.id)
//         res.send(docs)
//     } catch (error) {
//         res.send(error)
//     }
// })

router.post("/", async (req, res) => {
    try {
        const data = req.body;
        const docs = await machineRoll.create(data)
        res.send(docs)
    } catch (err) {
        res.send(err)
    }
})


module.exports = router;