const express = require("express");
const authI = require("../middleware/authI");
const Investor = require("../models/investor");
const Project = require("../models/project");
const Entrepreneur = require("../models/entrepreneur");
const router = new express.Router();

// Investor Creation Api
router.post("/investor", async (req, res) => {
    const investor = new Investor(req.body);
    try {
        investor.coins = 0;
        await investor.save();
        const token = await investor.generateAuthToken();
        res.status(201).send({ investor, token });
    } catch (e) {
        res.status(400).send(e);
    }
});

// Investor Login Api
router.post("/investor/login", async (req, res) => {
    try {
        const investor = await Investor.findByCredentials(
            req.body.email,
            req.body.password
        );
        const token = await investor.generateAuthToken();
        res.send({ investor, token });
    } catch (e) {
        res.status(400).send(e);
    }
});

// Investor Logout Api
router.post("/investor/logout", authI, async (req, res) => {
    try {
        req.investor.tokens = req.investor.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.investor.save();

        res.send();
    } catch (e) {
        res.status(500).send(e);
    }
});

// Investor Profile Api
router.get("/investor/me", authI, async (req, res) => {
    res.send(req.investor);
});

router.delete("/investor/me", authI, async (req, res) => {
    try {
        await req.investor.remove();
        res.send("Investor deleted successfully");
    } catch (e) {
        res.status(500).send(e);
    }
});

// bookmark Api
router.post("/bookmark", authI, async (req, res) => {
    try {
        const checkBookmarkId = (obj) => obj._id == req.body.bookmark;
        if (req.investor.bookmarks.some(checkBookmarkId)) {
            // res.status(400).send({ msg: "Bookmark already present" });
            req.investor.bookmarks.remove(req.body.bookmark);
            req.investor.save();
            res.send(req.investor.bookmarks);
        } else {
            req.investor.bookmarks.push(req.body.bookmark);
            req.investor.save();
            res.send(req.investor.bookmarks);
        }
    } catch (e) {
        res.status(500).send(e);
    }
});

// Get all bookmarked Projects
router.get("/bookmarks", authI, async (req, res) => {
    try {
        var projects = [];
        const bookmarks = req.investor.bookmarks;
        // let i = 0;
        for (let i = 0; i < bookmarks.length; i++) {
            let id = bookmarks[i]._id;
            var result = await Project.findById(id);
            projects.push(result);
        }
        // console.log('Test');
        res.send(projects);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.post("/investor/invest", authI, async (req, res) => {
    try {
        const _id = req.body.project_id;
        const amount = req.body.amount;

        const project = await Project.findOne({
            _id,
        });

        if (project.remainingAmount < amount) {
            res.status(400).send({
                msg: "Investing amount greater than asking price",
            });
        } else if (req.investor.coins < amount) {
            res.status(400).send({
                msg: "Insufficient Balance",
            });
        } else {
            req.investor.coins -= amount;

            const equity = (project.equity * amount) / project.askingPrice;

            req.investor.investments.push({
                project: _id,
                amount: amount,
                equity: equity,
            });

            req.investor.save();

            project.remainingAmount -= amount;

            project.investorDetails.push({
                investorId: req.investor._id,
                name: req.investor.name,
                amount: amount,
                equity: equity,
            });

            project.save();

            const owner = await Entrepreneur.findById(project.owner);
            owner.coins += amount;
            owner.save();

            res.status(200).send({ msg: "Investment Successful!" });
        }
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get("/investor/investments", authI, async (req, res) => {
    try {
        var investedProjects = [];
        const investments = req.investor.investments;

        for (let i = 0; i < investments.length; i++) {
            let id = investments[i].project;
            const project = await Project.findById(id);
            investedProjects.push({
                project: project,
                amount: investments[i].amount,
                equity: investments[i].equity,
            });
        }
        res.send(investedProjects);
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;
