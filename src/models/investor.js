const mongoose = require('mongoose')
const validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

mongoose.connect(process.env.MONGODB_URL)

const investorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 7,
        trim: true,
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    bookmarks: [{
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            required: false,
            unique: false
        }
    }],
    coins: {
        type: Number,
    }
}, {
    timestamps: true
})

investorSchema.methods.generateAuthToken = async function () {
    const investor = this
    const token = jwt.sign({ _id: investor.id.toString() }, process.env.JWT_SECRET)

    investor.tokens = investor.tokens.concat({ token })
    await investor.save()

    return token
}

investorSchema.methods.toJSON = function () {
    const investor = this
    const investorObject = investor.toObject()

    delete investorObject.password
    delete investorObject.tokens
    delete investorObject.bookmarks

    return investorObject
}

investorSchema.pre('save', async function (next) {
    const investor = this
    if (investor.isModified('password')) {
        investor.password = await bcrypt.hash(investor.password, 8)
    }
    next()
})

investorSchema.statics.findByCredentials = async (email, password) => {
    const investor = await Investor.findOne({ email })
    if (!investor) {
        throw new Error('No investor register to this email')
    }

    const isMatched = await bcrypt.compare(password, investor.password)

    if (!isMatched) {
        throw new Error('Password does not match')
    }

    return investor
}

const Investor = mongoose.model('Investor', investorSchema)

module.exports = Investor