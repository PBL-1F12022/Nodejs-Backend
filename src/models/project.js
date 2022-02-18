const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    askingPrice: {
        type: Number,
        required: true
    },
    equity: {
        type: Number,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Entrepreneur'
    },
    ownerName: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
})

const project = mongoose.model('Project', projectSchema)

module.exports = project