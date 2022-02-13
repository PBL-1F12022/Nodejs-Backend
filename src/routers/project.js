const express = require('express')
const Project = require('../models/project')
const authE = require('../middleware/authE')
const authI = require('../middleware/authI')
const router = new express.Router()

router.post('/projects', async (req, res) => {
    res.send({ success: "project creation successful" })
})

module.exports = router