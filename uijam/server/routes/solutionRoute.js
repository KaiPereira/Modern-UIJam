const express = require("express");
const router = express.Router()
const methods = require("../methods")
const SolutionModel = require("../models/solutionModel")
const AccountModel = require("../models/accountModel")
const ObjectId = require('mongodb').ObjectID;
const cloudinary = require("cloudinary").v2;
const env = require("dotenv/config");
const { default: axios } = require("axios");

router.get("/all", async (req, res) => {
    const solutions = await SolutionModel.find()

    try {
        res.send(solutions)
    } catch (err) {
        res.send(err)
    }
})

router.post("/new", methods.ensureToken, async (req, res) => {
    // Change githubname to authentication
    cloudinary.uploader
        .upload(req.body.thumbnail, {
            resource_type: "image",
            folder: "UIJam content"
        })
        .then(async result => {
            const newSolution = new SolutionModel({
                site: req.body.site,
                repository: req.body.repository,
                thumbnail: result.secure_url,
                title: req.body.title,
                likes: 0,
                date: req.body.date,
                authorGithub: methods.parseJwt(req.headers["authorization"].replace("Bearer", "")).username
            })
        
            const solutionSave = await newSolution.save()
            
            try {
                res.send(solutionSave)
            } catch (err) {
                res.send(err)
            }
        })
        .catch(err => console.log(err, null, 2))
})

router.patch("/updateLike", methods.ensureToken, async (req, res) => {
    const solution = await SolutionModel.findOne({_id: req.body.id})
    const usernameInJwt = methods.parseJwt(req.headers["authorization"].replace("Bearer", "")).username

    // If it does include we are going to remove a like + pull the username from the peopleWhoLiked and add a point to the user
    if (solution.peopleWhoLiked.includes(usernameInJwt) && solution.authorGithub !== methods.parseJwt(req.headers["authorization"].replace("Bearer", "")).username) {
        // Remove the like and person from peopleWhoLiked array in document
        await SolutionModel.updateOne(
            {_id: req.body.id},
            {
                $inc: {likes: -1},
                $pull: {peopleWhoLiked: usernameInJwt}
            }
        )
            
        // Remove a point from the solution author's github
        const updatedProfile = await AccountModel.updateOne(
                {githubName: solution.authorGithub},
                {
                    $inc: {points: -1}
                }
            )
    
            try {
                res.send(updatedProfile)
            } catch (err) {
                res.send(err)
            } 
         



    } else {
            
        // If the solution author's github does not equal your username then continue (to make sure the author of the solution cannot gain points from their own solutions)
        if (solution.authorGithub !== methods.parseJwt(req.headers["authorization"].replace("Bearer", "")).username) {
            // Add like and add person to peopleWhoLiked array in document
            await SolutionModel.updateOne(
                {_id: req.body.id},
                {
                    $inc: {likes: 1},
                    $push: {peopleWhoLiked: usernameInJwt}
                }
            )

            // Add a point to the solution author's account
            const updatedProfile = await AccountModel.updateOne(
                {githubName: solution.authorGithub},
                {
                    $inc: {points: 1}
                }
            )
    
            try {
                res.send(updatedProfile)
            } catch (err) {
                res.send(err)
            }
        }
    }

})


router.patch("/addComment", methods.ensureToken, async (req, res) => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;

    const newComment = await SolutionModel.updateOne(
        {_id: req.body.id},
        {
            $push: {
                comments: {
                    commentDate: today,
                    commentBody: req.body.commentBody,
                    authorGithub: methods.parseJwt(req.headers["authorization"].replace("Bearer", "")).username
                }
            }
        }
    )

    try {
        res.send(newComment)
    } catch (err) {
        res.send(err)
    }

})

router.patch("/deleteComment", methods.ensureToken, async (req, res) => {
    // Grabs comment github name and your github name and check if they match
    const specificSolution = await SolutionModel.findOne({_id: req.body.id})
    const specificComment = await specificSolution.comments.id(req.body.commentId)

    if (specificComment.authorGithub == methods.parseJwt(req.headers["authorization"].replace("Bearer", "")).username) {
        const deleteComment = await SolutionModel.updateOne(
            {_id: req.body.id},
            {
               $pull: {
                   comments: {_id: ObjectId(req.body.commentId)}
               } 
            }
        )
    
        try {
            res.send(deleteComment)
        } catch (err) {
            res.send(err)
        }
    }
})

router.patch("/updateComment", methods.ensureToken, async (req, res) => {
    // Grabs comment github name and your github name and check if they match
    const specificSolution = await SolutionModel.findOne({_id: req.body.solutionId})
    const specificComment = await specificSolution.comments.id(req.body.commentId)

    if (specificComment.authorGithub == methods.parseJwt(req.headers["authorization"].replace("Bearer", "")).username) {
        const updatedComment = await SolutionModel.updateOne(
            { "_id": req.body.solutionId, "comments._id": req.body.commentId },
            { 
                "$set": {
                    "comments.$.commentBody": req.body.commentBody
                }
            }
        );

        try {
            res.send(updatedComment)
        } catch (err) {
            res.send(err)
        }
    }
})

router.patch("/delete", methods.ensureToken, async (req, res) => {

    // Grab the solution to minus the likes from the user
    const solutionDetails = await SolutionModel.findOne({_id: req.body.id, authorGithub: methods.parseJwt(req.headers["authorization"].replace("Bearer", "")).username})
    
    cloudinary.uploader
        .destroy(`UIJam content/${solutionDetails.thumbnail.split("/")[8].replace(".png", "").replace(".jpg", "")}`)

    // Delete the solution
    await SolutionModel.deleteOne({_id: req.body.id, authorGithub: methods.parseJwt(req.headers["authorization"].replace("Bearer", "")).username})

    const updatedAccount = await AccountModel.updateOne(
        {githubName: methods.parseJwt(req.headers["authorization"].replace("Bearer", "")).username},
        {
            $inc: {points: "-" + solutionDetails.likes}
        }
    )

    try {
        res.send(updatedAccount)
    } catch (err) {
        res.send(err)
    }
})

router.patch("/update2", methods.ensureToken, async (req, res) => {
    await SolutionModel.updateOne(
        {_id: req.body.id, authorGithub: methods.parseJwt(req.headers["authorization"].replace("Bearer", "")).username},
        {
            site: req.body.site,
            repository: req.body.repository,
            thumbnail: req.body.thumbnail
        }
    )
})

router.patch("/update", methods.ensureToken, async (req, res) => {

    const solution = await SolutionModel.findOne({_id: req.body.id, authorGithub: methods.parseJwt(req.headers["authorization"].replace("Bearer", "")).username})

    // Uploads the new image to storage
    cloudinary.uploader
        .upload(req.body.preview, {
            resource_type: "image",
            folder: "UIJam content"
        }, (err, result) => {
            axios.patch("https://uijam.herokuapp.com/solutions/update2", {
                id: req.body.id,
                site: req.body.site,
                repository: req.body.respository,
                thumbnail: result.secure_url
            }, {
                headers: {
                    Authorization: req.headers["authorization"]
                }
            })

            // Destroys the old image from storage
            cloudinary.uploader
                .destroy(`UIJam content/${solution.thumbnail.split("/")[8].replace(".png", "").replace(".jpg", "")}`)
                .then(data => console.log(data))
        })
})

module.exports = router