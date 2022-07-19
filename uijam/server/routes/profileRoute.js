const express = require("express")
const AccountModel = require("../models/accountModel")
const router = express.Router()
const methods = require("../methods")
const cloudinary = require("cloudinary").v2;
const env = require("dotenv/config");
const { default: axios } = require("axios");

// Finding a profile
router.post("/profile", async (req, res) => {
    const profile = await AccountModel.find({githubName: req.body.githubName})

    try {
        res.send(profile)
    } catch (err) {
        res.send(err)
    }
})

router.patch("/update2", methods.ensureToken, async (req, res) => {
    // If it works, add the profile details too
    await AccountModel.updateOne(
        {githubName: methods.parseJwt(req.headers["authorization"].replace("Bearer", "")).username},
        {
            avatar: req.body.avatar,
            name: req.body.name,
            location: req.body.location,
            bio: req.body.bio,
            socials: req.body.socials
        }
    )
})

// Updating a profile via settings
router.patch("/update", methods.ensureToken, async (req, res) => {
    // Gets the profile details based on the JWT username
    const profileDetails = await AccountModel.findOne({githubName: methods.parseJwt(req.headers["authorization"].replace("Bearer", "")).username})

    if (profileDetails.avatar.split("/").length !== 5) {
        // Destroys the current avatar in storage
        cloudinary.uploader
            .destroy(`UIJam content/${profileDetails.avatar.split("/")[8].replace(".png", "").replace(".jpg", "")}`)   
    }

    // Adds new avatar to storage
    cloudinary.uploader
        .upload(req.body.avatar, {
            resource_type: "image",
            folder: "UIJam content"
        }, (err, result) => {
            axios.patch("http://uijam.herokuapp.com/profiles/update2", {
                avatar: result ? result.secure_url : req.body.avatar,
                name: req.body.name,
                location: req.body.location,
                bio: req.body.bio,
                socials: req.body.socials
            }, {
                headers: {
                    Authorization: req.headers["authorization"]
                }
            })
        })
        
})

router.patch("/removePoint", methods.ensureToken, async (req, res) => {
    if (req.body.authorGithub !== methods.parseJwt(req.headers["authorization"].replace("Bearer", "")).username) {
       const updatedProfile = await AccountModel.updateOne(
            {githubName: methods.parseJwt(req.headers["authorization"].replace("Bearer", "")).username},
            {
                $inc: {points: -1}
            }
        )

        try {
            res.send(updatedProfile)
        } catch (err) {
            res.send(err)
        } 
    }
})

router.get("/all", async (req, res) => {
    const allProfiles = await AccountModel.find()

    try {
        res.send(allProfiles)
    } catch (err) {
        res.send(err)
    }
})

module.exports = router