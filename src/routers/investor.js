const express = require('express')
const authI = require('../middleware/authI')
const Investor = require('../models/investor')
const Project = require('../models/project')
const router = new express.Router()

// Investor Creation Api
router.post('/investor', async (req, res) => {
    const investor = new Investor(req.body)
    try {
        investor.coins = 0;
        await investor.save()
        const token = await investor.generateAuthToken()
        res.status(201).send({ investor, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

// Investor Login Api
router.post('/investor/login', async (req, res) => {
    try {
        const investor = await Investor.findByCredentials(req.body.email, req.body.password)
        const token = await investor.generateAuthToken()
        res.send({ investor, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

// Investor Logout Api
router.post('/investor/logout', authI, async (req, res) => {
    try {
        req.investor.tokens = req.investor.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.investor.save()

        res.send()
    } catch (e) {
        res.status(500).send(e)
    }
})

// Investor Profile Api
router.get('/investor/me', authI, async (req, res) => {
    res.send(req.investor)
})

router.delete('/investor/me', authI, async (req, res) => {
    try {
        await req.investor.remove()
        res.send("Investor deleted successfully")
    } catch (e) {
        res.status(500).send(e)
    }
})

// bookmark Api
router.post('/bookmark', authI, async (req, res) => {
    try {
        const checkBookmarkId = obj => obj._id == req.body.bookmark;
        if (req.investor.bookmarks.some(checkBookmarkId)) {
            res.status(400).send("Bookmark already present")
        } else {
            req.investor.bookmarks.push(req.body.bookmark)
            req.investor.save()
            res.send(req.body.bookmark)
        }
    } catch (e) {
        res.status(500).send(e)
    }
})

// Get all bookmarked Projects
router.get('/bookmarks', authI, async (req, res) => {
    try {
        var projects = []
        const bookmarks = req.investor.bookmarks;
        // let i = 0;
        for (let i = 0; i < bookmarks.length; i++) {
            let id = bookmarks[i]._id
            var result = await Project.findById(id);
            projects.push(result);
        }
        // console.log('Test');
        res.send(projects)
    }

    catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router