const express = require("express")
const router = express.Router()
const methods = require("../methods")
const ResourceSchema = require("../models/resourceModel")

router.get("/all", async (req, res) => {
    const allResources = await ResourceSchema.find()

    try {
        res.send(allResources)
    } catch (err) {
        res.send(err)
    }
})
router.post("/new", methods.ensureToken, async (req, res) => {
    if (methods.parseJwt(req.headers["authorization"].replace("Bearer", "")).admin == true) {
        const newResource = new ResourceSchema({
            thumbnail: req.body.thumbnail,
            header: req.body.header,
            skills: req.body.skills,
            description: req.body.description,
            link: req.body.link
        })

        const saveResource = await newResource.save()

        try {
            res.send(saveResource)
        } catch (err) {
            res.send(err)
        }
    }
    
})


module.exports = router