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
    completed: {
        type: Boolean,
        default: false,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Investor'
    }
}, {
    timestamps: true
})


const project = mongoose.model('Task', projectSchema)

module.exports = project