const express = require("express");
const authE = require("../middleware/authE");
const authI = require("../middleware/authI");
const router = new express.Router();

router.post("/coins/investor/buy", authI, function (req, res) {
    try {
        let limit = 10000;
        let coins = req.investor.coins;
        requiredCoins = req.body.coins;
        if (requiredCoins > limit) {
            res.status(400).send({ msg: "Withdraw limit 10000" });
        }
        req.investor.coins = coins + requiredCoins;
        req.investor.save();
        res.status(200).send({ msg: "Coins credited to account" });
    } catch (e) {
        res.status(400).send(e);
    }
});

router.get("/coins/investor/balance", authI, function (req, res) {
    try {
        let coins = req.investor.coins;
        res.send({ coins });
    } catch (e) {
        res.status(400).send(e);
    }
});

router.post("/coins/investor/sell", authI, function (req, res) {
    try {
        let coins = req.investor.coins;
        requiredCoins = req.body.coins;
        if (requiredCoins > coins) {
            res.status(400).send({ msg: "Insufficient Balance" });
        } else {
            req.investor.coins = coins - requiredCoins;
            req.investor.save();
            res.status(200).send({ msg: "Coins debited Successfully" });
        }
    } catch (e) {
        res.status(400).send(e);
    }
});

router.get("/coins/entrepreneur/balance", authE, function (req, res) {
    try {
        let coins = req.entrepreneur.coins;
        res.send({ coins });
    } catch (e) {
        res.status(400).send(e);
    }
});

router.post("/coins/entrepreneur/buy", authE, function (req, res) {
    try {
        let limit = 10000;
        let coins = req.entrepreneur.coins;
        requiredCoins = req.body.coins;
        if (requiredCoins > limit) {
            res.status(400).send({ msg: "Withdraw limit 10000" });
        }
        req.entrepreneur.coins = coins + requiredCoins;
        req.entrepreneur.save();
        res.status(200).send({ msg: "Coins credited to account" });
    } catch (e) {
        res.status(400).send(e);
    }
});

router.post("/coins/entrepreneur/sell", authE, function (req, res) {
    try {
        let coins = req.entrepreneur.coins;
        requiredCoins = req.body.coins;
        if (requiredCoins > coins) {
            res.status(400).send({ msg: "Insufficient Balance" });
        } else {
            req.entrepreneur.coins = coins - requiredCoins;
            req.entrepreneur.save();
            res.status(200).send({ msg: "Coins debited Successfully" });
        }
    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = router;
