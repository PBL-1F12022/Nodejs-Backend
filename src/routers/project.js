const express = require('express')
const Project = require('./models/project')
const auth = require('./middleware/auth')
const router = new express.Router()

router.post('/projects', async (req, res) => {
    res.send({ success: "project creation successful" })
})

module.exports = router