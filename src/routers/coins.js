const express = require("express");
const router = new express.Router();
const authE = require("../middleware/authE");

router.post("/coin/entrepreneur/buy", authE, function (req, res) {
    try {
        let coins = entrepreneur.coins;
        res.send();
    } catch (e) {
        res.status(400).send(e);
    }
});
