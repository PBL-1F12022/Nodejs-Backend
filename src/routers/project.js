const express = require('express')
const Project = require('../models/project')
const authE = require('../middleware/authE')
const authI = require('../middleware/authI')
const router = new express.Router()

router.post('/projects', authI, async (req, res) => {
    const project = new Project({
        ...req.body,
        owner: req.investor._id,
        name: req.investor.name
    })
    try {
        await project.save()
        res.status(201).send(project)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/projects', async (req, res) => {
    try {
        const projects = await Project.find({})
        res.send(projects)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router