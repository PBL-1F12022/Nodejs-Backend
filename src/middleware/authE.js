const jwt = require("jsonwebtoken")
const Entrepreneur = require('../models/entrepreneur')

const authE = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const entrepreneur = await Entrepreneur.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!entrepreneur) {
            throw new Error()
        }
        req.token = token
        req.entrepreneur = entrepreneur
        next()
    } catch (e) {
        res.status(401).send({ msg: "Please Authenticate." })
    }
}

module.exports = authE
