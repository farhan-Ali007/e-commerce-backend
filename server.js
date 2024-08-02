const express = require('express')
const mongoose = require("mongoose")
const morgan = require("morgan")
const bodyParser = require("body-parser")
const cors = require("cors")
const { readdirSync } = require('fs')
require('dotenv').config()

//import routes
const authRoutes = require('./routes/auth.js')

//app
const app = express()

//db
mongoose.connect(process.env.DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log("DB connected"))
    .catch((err) => console.log("DB CONNECTION Error => ", err));

//middlewares
app.use(morgan("dev"))
app.use(bodyParser.json({ limit: "2mb" }))
app.use(cors())


//route

readdirSync("./routes").map((r) =>
    app.use("/api", require("./routes/" + r)))

//Listener

const port = process.env.PORT || 7000;

app.listen(port, () => {
    console.log(`Server is running on ${port}`)
})