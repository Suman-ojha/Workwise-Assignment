// app.js
const express = require('express');
const app = express();
require('dotenv').config(); // Load environment variables early


global.DB_NAME = process.env.DB_NAME
global.USER = process.env.USER
global.PASSWORD = process.env.PASSWORD
global.HOST = process.env.HOST
global.JWTSECRET = process.env.JWTSECRET
global.basepath = ''


// const sequelize = require('./');
const db = require('./models/association');

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


//register the routes with base path
app.use(basepath +'/api/auth'  , require('./routes/authRoutes') )
app.use(basepath +'/api/seats'  , require('./routes/seatRoutes') )



app.get(basepath+'/', function (req, res) {
    res.send(`
    <h3 style=\"text-align: center; padding: 10% 0; text-transform: uppercase;\">
        !! this is a secure connection hence cannot be accessed !!
    </h3>`)
    
})
app.get(basepath+'/test', function (req, res) {
    //console.log("testlink--->",basepath)
      res.send(`This is the test link`)
 })
app.get(basepath+'*', function(req, res){
    return res.status(404).send({ 
        status: 'error', 
        message: 'Page Not Found' 
    });
});
app.post(basepath+'*', function(req, res){
    return res.status(404).send({ 
        status: 'error', 
        message: 'Page Not Found' 
    });
});
const PORT = process.env.PORT || 5000;

db.sequelize.sync({ force:false  , alter:true })
  .then(() => {
   
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    console.log('Database connected successfully...')
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
