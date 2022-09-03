const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

//route import
app.use('/user', require('./routes/userRoute'))

const port = process.env.PORT || 4000;


app.listen(port, ()=>{
    console.log(`server is running at port : ${port}`)
})