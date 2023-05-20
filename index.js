const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

require("dotenv").config();

const port = process.env.PORT || 5000;

app.use(cookieParser());
app.use(express.json());

require("./config/database").connect();

const user = require("./routes/route")
app.use(user);


app.listen(port, () => {
    console.log(`App running on port ${port}`)
})