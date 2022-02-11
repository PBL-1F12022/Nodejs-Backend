const express = require('express')
const Investor = require('../models/investor')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/investor', async (req, res) => {
    res.send({ success: "Investor creation successful" })
})

module.exports = router