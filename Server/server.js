// Express set up
require('dotenv').config();
const express = require('express');
const app = express();
app.use('/Uploads/', express.static('Uploads'))

var bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));


// Mongoose set up - Server Only
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.on('open', () => console.log('Connected to DB'));
app.use(express.json());

// Set up Routers
const productsRouters = require('./Routes/productsRouters')
app.use('/productsRouters', productsRouters);

const usersRouters = require('./Routes/usersRouters')
app.use('/usersRouters', usersRouters);

// Set up Server Port
app.listen(process.env.LOCALHOST_PORT, () => {console.log("server started on port 5000");})