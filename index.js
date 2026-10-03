
require("dotenv").config();
const express = require('express');
const cors = require('cors'); 
const path = require('path');


const app = express();
const port = process.env.PORT || 5000;
const mongoose = require('mongoose');
const httpStatusText = require('./utils/httpStatusTest');

app.use('/uploads', express.static(path.join(__dirname, 'upload')));
 
app.use(express.json());

const db_url = process.env.MONGO_URL ;
mongoose.connect(db_url).then(()=>{
  console.log("connected to mongo");
}).catch((err)=>{
  console.log(err);
})



const coursesRoutes = require("./routes/courses.route") 
const usersRoutes = require("./routes/users.route")


app.use(cors()); 

app.use('/api/courses', coursesRoutes)
app.use('/api/users', usersRoutes)


// Handle 404 for undefined routes
app.all('{*splat}', (req, res) => {
  res.status(404).json({status : httpStatusText.Fail , data : {course:null , message:"not found"}});
})

// Global error handling middleware
app.use((error, req, res, next) => {
    return res.status(error.statusCode || 500).json({status :error.status || httpStatusText.Error , data : {course:null , message:error.message}});
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`); 
})
