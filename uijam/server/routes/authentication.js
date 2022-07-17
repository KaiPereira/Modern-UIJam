const express = require("express")
const router = express.Router()
const axios = require("axios")
const methods = require("../methods.js")
const jwt = require('jsonwebtoken')
const AccountModel = require("../models/accountModel.js")

router.post("/authenticate", async (req, res) => {
        // Grab the code from req body to get access token
        axios.post(`https://github.com/login/oauth/access_token?client_id=cae64f03f1ded6b7c2f8&client_secret=deabc3db236d89b72484bc93c2e515fd258d5486&code=${req.body.code}`, null, {
        headers: {
            Accept: "application/json"
        }
    })
        .then(data => {
                //Grab Github User Data
                axios.get("https://api.github.com/user", {
                    headers: { 
                        'Authorization': `Bearer ${data.data.access_token}`, 
                    }
                })
                .then(data => {

                    if (data.data.login == "KaiPereira") {
                        // Create Admin Login JWT
                        var token = jwt.sign(
                            {
                                username: data.data.login,
                                admin: true
                            }, 
                            'secretkey',
                            (err, token) => {
                            res.send({
                                ok: true,
                                message: "Login successful",
                                jwtToken: token,
                                extraData: data.data
                            })
                        })
                    } else {
                        // Create Normal Login JWT
                        var token = jwt.sign(
                            { username: data.data.login }, 
                            'secretkey',
                            (err, token) => {
                                res.send({
                                    ok: true,
                                    message: "Login successful",
                                    jwtToken: token,
                                    extraData: data.data
                                })
                        })
                    }
                })
        })
})

router.post("/join", async (req, res) => {
    AccountModel.findOne({"githubUrl": req.body.githubData.html_url}, function (err, account) {
        
        if (!account) {
            // Send new account to database
            const newAccount = new AccountModel({
                githubName: req.body.githubData.login,
                githubUrl: req.body.githubData.html_url,
                avatar: req.body.githubData.avatar_url,
                name: req.body.githubData.login,
                bio: "An unknow user with no bio to display yet! But something’s for sure, this user loves frontend code and design!",
                location: "No Location Set",
                points: 0,
                socials: {github: req.body.githubData.html_url}
            })
            
            const save = newAccount.save() 

            try {
                res.send(save)
            } catch (err) {
                res.send(err)
            }
        }
    })
})

router.post("/parse-jwt", async (req, res) => {
    res.send(methods.parseJwt(req.body.jwt))
})

router.post("/verify-jwt", methods.ensureToken, async (req, res) => {
    try {
        res.send(true)
    } catch (err) {
        res.send(err)
    }
})

module.exports = router