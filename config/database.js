const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
    mongoose.connect(process.env.DATABASE_URL, 
        {
            useNewUrlParser:true,
            useUnifiedTopology:true
        }
    )
    .then( () => console.log("Database Connection Successful"))
    .catch( (error) => {
        console.log("Error in DB connection");
        console.log(error);
        process.exit(1);

    })
}
