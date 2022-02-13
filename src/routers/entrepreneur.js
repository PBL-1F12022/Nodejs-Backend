const express = require('express')
const Entrepreneur = require('../models/entrepreneur')
const authE = require('../middleware/authE')
const router = new express.Router()

router.post('/entrepreneur', async (req, res) => {
    res.send({ success: "Entrepreneur creation successful" })
})

module.exports = router