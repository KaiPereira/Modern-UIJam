const express = require("express")
const router = express.Router()
const ChallengeModel = require("../models/challengeModel")
const methods = require("../methods")

router.get("/all", async (req, res) => {
    const challenges = await ChallengeModel.find()

    try {
        res.send(challenges)
    } catch (err) {
        res.send(err)
    }
})

router.post("/new", methods.ensureToken, async (req, res) => {
    if (methods.parseJwt(req.headers["authorization"]).admin == true) {
        const newChallenge = new ChallengeModel({
            header: req.body.header,
            description: req.body.description,
            difficulty: req.body.difficulty,
            requirements: req.body.requirements,
            image: req.body.image
        })

        const challengeSave = await newChallenge.save()

        try {
            res.send(challengeSave)
        } catch (err) {
            res.send(err)
        } 
    }
})

router.get("/specific", async (req, res) => {
    const specificComment = await ChallengeModel.findOne({title: req.body.header})

    try {
        res.send(specificComment)
        console.log(specificComment)
    } catch (err) {
        res.send(err)
    }
})


module.exports = router