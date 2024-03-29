const express = require("express");
const Project = require("../models/project");
const authE = require("../middleware/authE");
const authI = require("../middleware/authI");
const MonkeyLearn = require("monkeylearn");
const router = new express.Router();

router.post("/projects", authE, async (req, res) => {
    const ml = new MonkeyLearn(process.env.MONKEYLEARN_API);
    let model_id = process.env.MONKEYLEARN_MODELID;
    let data = [];
    data[0] = req.body.description;

    try {
        const sectorName = "Investment";
        const classificationAccuracy = 0.58;

        const project = new Project({
            ...req.body,
            owner: req.entrepreneur._id,
            ownerName: req.entrepreneur.name,
            sector: sectorName,
            sectorAccuracy: classificationAccuracy,
            remainingAmount: req.body.askingPrice,
        });

        await project.save();
        res.status(201).send(project);
    } catch (e) {
        res.status(400).send({
            msg: "Something went wrong please try again",
        });
    }
});

// GET /projects?limit=10
// GET /projects?skip=0
router.get("/projects", async (req, res) => {
    let limit;
    if (isNaN(parseInt(req.query.limit))) {
        limit = 0;
    } else {
        limit = parseInt(req.query.limit);
    }

    let skip;
    if (isNaN(parseInt(req.query.skip))) {
        skip = 0;
    } else {
        skip = parseInt(req.query.skip);
    }
    try {
        const projects = await Project.find({}).sort().limit(limit).skip(skip);
        res.send(projects);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.patch("/projects/:id", authE, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["askingPrice", "equity"];
    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
        return res.status(400).send({ msg: "Invalid updates!" });
    }

    try {
        const project = await Project.findOne({
            _id: req.params.id,
            owner: req.investor._id,
        });

        if (!project) {
            return res.status(404).send();
        }

        updates.forEach((update) => (project[update] = req.body[update]));
        await project.save();
        res.send(project);
    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = router;
