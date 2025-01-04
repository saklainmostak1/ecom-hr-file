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





app.get('/images/products/original/:year/:month/:day/:hour/:minute/:file', (req, res) => {
  const { year, month, day, hour, minute, file } = req.params;
  const imageFilePath = path.join(__dirname, `images/products/original/${year}/${month}/${day}/${hour}/${minute}/${file}`);

  // Check if the image file exists
  if (fs.existsSync(imageFilePath)) {
    res.sendFile(imageFilePath);
  } else {
    res.status(404).json({ error: 'Image file not found' });
  }
});
app.get('/images/products/small/:year/:month/:day/:hour/:minute/:file', (req, res) => {
  const { year, month, day, hour, minute, file } = req.params;
  const imageFilePath = path.join(__dirname, `images/products/small/${year}/${month}/${day}/${hour}/${minute}/${file}`);

  // Check if the image file exists
  if (fs.existsSync(imageFilePath)) {
    res.sendFile(imageFilePath);
  } else {
    res.status(404).json({ error: 'Image file not found' });
  }
});

app.get('/images/products/medium/:year/:month/:day/:hour/:minute/:file', (req, res) => {
  const { year, month, day, hour, minute, file } = req.params;
  const imageFilePath = path.join(__dirname, `images/products/medium/${year}/${month}/${day}/${hour}/${minute}/${file}`);

  // Check if the image file exists
  if (fs.existsSync(imageFilePath)) {
    res.sendFile(imageFilePath);
  } else {
    res.status(404).json({ error: 'Image file not found' });
  }
});

app.get('/images/products/medium_small/:year/:month/:day/:hour/:minute/:file', (req, res) => {
  const { year, month, day, hour, minute, file } = req.params;
  const imageFilePath = path.join(__dirname, `images/products/medium_small/${year}/${month}/${day}/${hour}/${minute}/${file}`);

  // Check if the image file exists
  if (fs.existsSync(imageFilePath)) {
    res.sendFile(imageFilePath);
  } else {
    res.status(404).json({ error: 'Image file not found' });
  }
});






  app.get('/', (req, res) => {
 
    res.send('Server running saklain mostak image')
  })

  const port = 5003;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
  });








