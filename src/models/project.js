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
    },
    sector: {
        type: String,
        trim: true
    },
    sectorAccuracy: {
        type: Number,
        trim : true
    },
    remainingAmount : {
        type: Number
    },
    investorDetails: [{
        investorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Investor',
            required: true,
            unique: false
        },
        name: {
            type: String,
            trim: true,
            required: true
        },
        amount: {
            type: Number,
            required: true
        }
    }],
}, {
    timestamps: true
})

projectSchema.virtual('bookmarks', {
    ref: 'Investor',
    localField: '_id',
    foreignField: 'projectId'
})

const project = mongoose.model('Project', projectSchema)

module.exports = project
// req.investor.bookmarks.push(req.body.bookmark)