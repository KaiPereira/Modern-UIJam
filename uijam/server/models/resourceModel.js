const mongoose = require("mongoose")

const resourceSchema = mongoose.Schema({
    thumbnail: {
        type: String,
        required: true
    },
    header: {
        type: String,
        required: true
    },
    skills: {
        type: Array,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("resourceSchema", resourceSchema)