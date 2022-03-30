const { response } = require("express");
const express = require("express");
const authE = require("../middleware/authE");
const Entrepreneur = require("../models/entrepreneur");
const router = new express.Router();

router.post("/entrepreneur", async (req, res) => {
  const entrepreneur = new Entrepreneur(req.body);
  try {
    entrepreneur.coins = 0;
    await entrepreneur.save();
    const token = await entrepreneur.generateAuthToken();
    res.status(201).send({ entrepreneur, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

// Entrepreneur Login Api
router.post("/entrepreneur/login", async (req, res) => {
  try {
    const entrepreneur = await Entrepreneur.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await entrepreneur.generateAuthToken();
    res.send({ entrepreneur, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

// Entrepreneur Logout Api
router.post("/entrepreneur/logout", authE, async (req, res) => {
  try {
    req.entrepreneur.tokens = req.entrepreneur.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.entrepreneur.save();

    res.send();
  } catch (e) {
    res.status(500).send(e);
  }
});

// Entrepreneur Profile Api
router.get("/entrepreneur/me", authE, async (req, res) => {
  res.send(req.entrepreneur);
});

router.delete("/entrepreneur/me", authE, async (req, res) => {
  try {
    await req.entrepreneur.remove();
    res.send("Entrepreneur deleted successfully");
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/classify", async (req, res) => {});

module.exports = router;
