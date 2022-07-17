const express = require("express")
const mongoose = require("mongoose")
const app = express()
const cors = require("cors")
app.use(cors())
app.use(express.json())
const env = require("dotenv/config")

app.listen(process.env.PORT || 5000)

const authenticationRoute = require("./routes/authentication.js")
app.use("/authentication/", authenticationRoute)

const challengeRoute = require("./routes/challengeRoute.js")
app.use("/challenges/", challengeRoute)

const solutionRoute = require("./routes/solutionRoute.js")
app.use("/solutions", solutionRoute)

const profileRoute = require("./routes/profileRoute.js")
app.use("/profiles", profileRoute)

const resourceRoute = require("./routes/resourceRoute.js")
app.use("/resources", resourceRoute)

mongoose.connect(process.env.DB, (err) => {
    err ? console.log(err) : console.log("Mongo Live")
})