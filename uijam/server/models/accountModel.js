const mongoose = require("mongoose")

const accountSchema = mongoose.Schema({
    githubName: {
        type: String,
        required: true
    },
    githubUrl: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    socials: {
        hashnode: {
            type: String,
        },
        github: {
            type: String,
        },
        codewars: {
            type: String,
        },
        codepen: {
            type: String,
        },
        devto: {
            type: String,
        },
        linkedin: {
            type: String,
        },
        website: {
            type: String
        }
    },
    points: {
        type: Number,
        required: true
    }
})

/*
socials are

hashnode
github
codewars
stackoverflow
codepen
devto
linkedin
*/
module.exports = mongoose.model("accountSchema", accountSchema)
