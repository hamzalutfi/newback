const mongoose = require('mongoose');
const dotenv =require('dotenv');

const app=require('./app');
dotenv.config();
mongoose

    .connect(process.env.MONGODB_URL)
    .then(() => {
        console.log('DB connection successful');
    })
    .catch((err) => {
        console.log('DB connection failed');
    })
    app.listen(process.env.PORT, () => {
        console.log('Server is running on port 3000');
    })
    app.get("/", (req, res) => {
        res.status(200).send("Welcome to the HopeMaker API!");
      });
      
