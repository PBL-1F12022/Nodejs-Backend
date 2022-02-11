const mongoose = require('mongoose')

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
    }]
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

entrepreneurSchema.pre('save', async function (next) {
    const entrepreneur = this
    if (entrepreneur.isModified('password')) {
        entrepreneur.password = await bcrypt.hash(entrepreneur.password, 8)
    }
    next()
})

const Entrepreneur = mongoose.model('Entrepreneur', entrepreneurSchema)

module.exports = Entrepreneur