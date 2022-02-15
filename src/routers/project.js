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

// GET /projects?limit=10
// GET /projects?skip=0
router.get('/projects', async (req, res) => {

    let limit;
    if (isNaN(parseInt(req.query.limit))) {
        limit = 0
    } else {
        limit = parseInt(req.query.limit)
    }

    let skip;
    if (isNaN(parseInt(req.query.skip))) {
        skip = 0
    } else {
        skip = parseInt(req.query.skip)
    }
    try {
        const projects = await Project.find({}).sort().limit(limit).skip(skip)
        res.send(projects)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/projects/:id', authI, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['askingPrice', 'equity']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const project = await Project.findOne({ _id: req.params.id, owner: req.investor._id })

        if (!project) {
            return res.status(404).send()
        }

        updates.forEach((update) => project[update] = req.body[update])
        await project.save()
        res.send(project)

    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router