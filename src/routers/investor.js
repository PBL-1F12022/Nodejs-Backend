const express = require('express')
const auth = require('../middleware/auth')
const Investor = require('../models/investor')
const router = new express.Router()

router.post('/investor', async (req, res) => {
    const investor = new Investor(req.body)
    try {
        await investor.save()
        const token = await investor.generateAuthToken()
        res.status(201).send({ investor, token })
    } catch (e) {
        res.status(400).send(e)
    }
    // res.send({ success: "Investor creation successful" })
})

module.exports = router