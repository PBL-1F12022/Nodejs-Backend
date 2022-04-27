const mongoose = require('mongoose')
const validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

mongoose.connect(process.env.MONGODB_URL)

const entrepreneurSchema = new mongoose.Schema({
    name: {
        type: String
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
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    coins: {
        type: Number,
    }
}, {
    timestamps: true
})

entrepreneurSchema.methods.generateAuthToken = async function () {
    const entrepreneur = this
    const token = jwt.sign({ _id: entrepreneur.id.toString() }, process.env.JWT_SECRET)

    entrepreneur.tokens = entrepreneur.tokens.concat({ token })
    await entrepreneur.save()

    return token
}


entrepreneurSchema.methods.toJSON = function () {
    const entrepreneur = this
    const entrepreneurObject = entrepreneur.toObject()
    
    delete entrepreneurObject.password
    delete entrepreneurObject.tokens
    
    return entrepreneurObject
}

entrepreneurSchema.pre('save', async function (next) {
    const entrepreneur = this
    if (entrepreneur.isModified('password')) {
        entrepreneur.password = await bcrypt.hash(entrepreneur.password, 8)
    }
    next()
})

entrepreneurSchema.virtual('projects', {
    ref: 'Projects',
    localField: '_id',
    foreignField: 'owner'
})

entrepreneurSchema.statics.findByCredentials = async (email, password) => {
    const entrepreneur = await Entrepreneur.findOne({ email })
    if (!entrepreneur) {
        throw new Error('No entrepreneur register to this email')
    }

    const isMatched = await bcrypt.compare(password, entrepreneur.password)

    if (!isMatched) {
        throw new Error('Password does not match')
    }

    return entrepreneur
}

const Entrepreneur = mongoose.model('Entrepreneur', entrepreneurSchema)

module.exports = Entrepreneur