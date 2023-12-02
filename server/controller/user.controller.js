const express = require("express")
const users = require("../model/user.model")
const router = express.Router()


router.get('/', async (req, res) => {
    try {
        if (!req.query.p) {
        } else {
            const page = req.query.p
        }
        const docs = await users.find();
        delete docs.password
        res.send(docs)
    } catch (error) {
        res.send(error)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const docs = await users.findById(req.params.id)
        res.send(docs)
    } catch (error) {
        res.send(error)
    }
})

router.post("/", async (req, res) => {
    try {
        const data = req.body;
        const docs = await users.create(data)
        res.send(docs)
    } catch (err) {
        res.send(err)
    }
})


module.exports = router;