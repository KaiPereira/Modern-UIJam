const mongoose = require("mongoose")

const challengeSchema = mongoose.Schema({
    header: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        required: true
    },
    requirements: [{
        type: String,
        required: true
    }],
})

// Easy, normal, hard, expert

module.exports = mongoose.model("challengeSchema", challengeSchema)