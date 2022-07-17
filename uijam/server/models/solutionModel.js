const mongoose = require("mongoose")

const solutionSchema = mongoose.Schema({
    site: {
        type: String,
        required: true
    },
    repository: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    authorGithub: {
        type: String,
        required: true
    },
    comments: [
        {
            authorGithub: {
                type: String,
                required: true
            },
            commentBody: {
                type: String,
                required: true
            },
            commentDate: {
                type: String,
                required: true
            },
        }
    ],
    peopleWhoLiked: {
        type: Array
    }
})

module.exports = mongoose.model("solutionSchema", solutionSchema)