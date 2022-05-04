const jwt = require("jsonwebtoken")
const Investor = require('../models/investor')

const authI = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const investor = await Investor.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!investor) {
            throw new Error()
        }
        req.token = token
        req.investor = investor
        next()
    } catch (e) {
        res.status(401).send({ msg: "Please Authenticate." })
    }
}

module.exports = authI
