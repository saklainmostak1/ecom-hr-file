const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const multer = require('multer')
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
var mysql = require('mysql');




  app.get('/', (req, res) => {
 
    res.send('Server running saklain mostak image')
  })

  const port = 5003;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
  });








