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

var connections = mysql.createConnection({
  // host: 'localhost',
  //  host: '192.168.0.110',
  host: '162.0.239.48',
  timezone: 'Z',
  port: '3306',
  user: "urbanit101_allowance",
  database: "urbanit101_allowance",
  password: "urb!n@!t!O!_@llO#!**w@nc=e"
});


app.post('/submit-form', (req, res) => {
  const cssContent = req.body.css;

  // Generate a folder structure based on the current date and time
  const cssFolderPath = path.join(__dirname, 'admin_template');

  // Create the folder structure if it doesn't exist
  if (!fs.existsSync(cssFolderPath)) {
    fs.mkdirSync(cssFolderPath, { recursive: true });
  }
  const cssFilePath = path.join(cssFolderPath, `admin_template.css`);
          fs.writeFileSync(cssFilePath, cssContent);

  res.json({ message: 'CSS file generated successfully', cssFilePath});
});

app.get('/get-css-content/:file', (req, res) => {
  const cssFileName = req.params.file; // Use req.params.file to get the value of :file parameter
  const cssFilePath = path.join(__dirname, 'admin_template', cssFileName);

  try {
    // Read the content of the specified CSS file
    const generatedCssContent = fs.readFileSync(cssFilePath, 'utf-8');

    res.json(generatedCssContent );
  
  } catch (error) {
    // Handle file read error
    console.error('Error reading CSS file:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/get-css/:file', (req, res) => {
  const cssFileName = req.params.file;
  const cssFilePath = path.join(__dirname, 'admin_template', cssFileName);

  // Check if the CSS file exists
  if (fs.existsSync(cssFilePath)) {
      const cssContent = fs.readFileSync(cssFilePath, 'utf-8');
      res.type('text/css').send(cssContent);
  } else {
      res.status(404).json({ error: 'CSS file not found' });
  }
});





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





app.get('/get-image/:path', (req, res) => {
  const imagePath = req.params.path;
  const imageFileName = req.params.file;
  const imageFilePath = path.join(__dirname,'/images/',  imagePath, imageFileName);

  // Check if the image file exists
  if (fs.existsSync(imageFilePath)) {
    res.sendFile(imageFilePath);
  } else {
    res.status(404).json({ error: 'Image file not found' });
  }
});




const storages = multer.diskStorage({
  destination: (req, file, cb) => {
 
    const folderPath = path.join(__dirname, '../files/images', getCurrentDateTime());
    
 
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
  
    // const fileName = `${Date.now()}_${file.originalname}`;
    const fileName = `${file.originalname}`;
    cb(null, fileName);
  },
});

const uploads = multer({ storage: storages });

// app.post('/upload', uploads.array('files', 5), (req, res) => {
 
//   res.json({ message: 'File uploaded successfully' });
// });


function getCurrentDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  // const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}/${month}/${day}/${hours}/${minutes}`;
}


const sharp = require('sharp');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Get current date-time
    const currentDateTime = getCurrentDateTime();

    // Generate folder paths for original and resized images
    const folderPaths = generateFolderPaths(currentDateTime);

    // Create folders if they don't exist
    folderPaths.forEach(folderPath => {
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }
    });

    // Pass the original folder path to multer
    cb(null, folderPaths[0]); // Assuming original folder path is the first one
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueFilename = `${file.originalname}`;

    // Pass the original filename to multer
    cb(null, uniqueFilename);
  },
});

// Function to generate folder paths for original and resized images
function generateFolderPaths(currentDateTime) {
  const baseFolderPath = path.join(__dirname, '../files/images/products', );
  const folderNames = ['original', 'small', 'medium', 'medium_small'];
  return folderNames.map(folderName => path.join(baseFolderPath, folderName, currentDateTime));
}

const upload = multer({ storage: storage });

// /file/upload/product
app.post('/product_upload', upload.array('files', 5), async (req, res) => {
  const { fields } = req.body;
  console.log(fields);
  // Get current date-time
  const currentDateTime = getCurrentDateTime();
  const folderPaths = generateFolderPaths(currentDateTime);

  // Fetch image sizes from the database
  connections.query('SELECT * FROM image_size', async (error, results, fields) => {
    if (error) {
      console.error('Error fetching image sizes:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    // Move the uploaded file to small, medium, and medium_small folders
    await Promise.all(req.files.map(file => {
      const originalFilePath = path.join(folderPaths[0], file.filename);
      const resizedFilePaths = folderPaths.slice(1).map((folderPath, index) => path.join(folderPath, file.filename));

      // Determine the resizing parameters based on image sizes fetched from the database
      const sizes = ['small', 'medium', 'medium_small'];
      const resizingPromises = sizes.map((size, index) => {
        const sizeInfo = results.find(s => s.name === size);
        return sharp(originalFilePath).resize({ width: sizeInfo.width, height: sizeInfo.height }).toFile(resizedFilePaths[index]);
      });

      return Promise.all(resizingPromises);
    }));

    res.json({ message: 'File uploaded successfully' });
  });
});



//  brand

const storageBrand = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderPath = path.join(__dirname, '../files/brand', getCurrentDateTime());
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const fileName = `${file.originalname}`;
    cb(null, fileName);
  },
});

const uploadBrand = multer({ storage: storageBrand });

app.post('/brand/brand_image', uploadBrand.array('files', 5), (req, res) => {
  res.json({ message: 'File uploaded successfully' });
});



// const storageBrand = multer.diskStorage({
//   destination: (req, file, cb) => {
    
 
//     const folderPath = path.join(__dirname, '../files/brand', getCurrentDateTime());
    
 
//     if (!fs.existsSync(folderPath)) {
//       fs.mkdirSync(folderPath, { recursive: true });
//     }

//     cb(null, folderPath);
//   },
//   filename: (req, file, cb) => {
  
//     // const fileName = `${Date.now()}_${file.originalname}`;
//     const fileName = `${file.originalname}`;
//     cb(null, fileName);
//   },
// });

// const uploadBrand = multer({ storage: storageBrand });

// app.post('/brand/brand_image', uploadBrand.array('files', 5), (req, res) => {
 
//   res.json({ message: 'File uploaded successfully' });
// });


app.get('/brand/:year/:month/:day/:hour/:minute/:file', (req, res) => {
  const { year, month, day, hour, minute, file } = req.params;
  const imageFilePath = path.join(__dirname, `brand/${year}/${month}/${day}/${hour}/${minute}/${file}`);

  // Check if the image file exists
  if (fs.existsSync(imageFilePath)) {
    res.sendFile(imageFilePath);
  } else {
    res.status(404).json({ error: 'Image file not found' });
  }
});


app.delete('/brand/:year/:month/:day/:hour/:minute/:file', (req, res) => {
  const { year, month, day, hour, minute, file } = req.params;
  const imageFilePath = path.join(__dirname, `brand/${year}/${month}/${day}/${hour}/${minute}/${file}`);

  // Check if the image file exists
  if (fs.existsSync(imageFilePath)) {
    // Delete the image file
    fs.unlinkSync(imageFilePath);
    res.json({ message: 'Image file deleted successfully' });
  } else {
    res.status(404).json({ error: 'Image file not found' });
  }
});

// category



const storageCategory = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderPath = path.join(__dirname, '../files/category', getCurrentDateTime());
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const fileName = `${file.originalname}`;
    cb(null, fileName);
  },
});

const uploadCategory = multer({ storage: storageCategory });

app.post('/category/category_image', uploadCategory.array('files', 5), (req, res) => {
  res.json({ message: 'File uploaded successfully' });
});



app.get('/category/:year/:month/:day/:hour/:minute/:file', (req, res) => {
  const { year, month, day, hour, minute, file } = req.params;
  const imageFilePath = path.join(__dirname, `category/${year}/${month}/${day}/${hour}/${minute}/${file}`);

  // Check if the image file exists
  if (fs.existsSync(imageFilePath)) {
    res.sendFile(imageFilePath);
  } else {
    res.status(404).json({ error: 'Image file not found' });
  }
});


app.delete('/category/:year/:month/:day/:hour/:minute/:file', (req, res) => {
  const { year, month, day, hour, minute, file } = req.params;
  const imageFilePath = path.join(__dirname, `category/${year}/${month}/${day}/${hour}/${minute}/${file}`);

  // Check if the image file exists
  if (fs.existsSync(imageFilePath)) {
    // Delete the image file
    fs.unlinkSync(imageFilePath);
    res.json({ message: 'Image file deleted successfully' });
  } else {
    res.status(404).json({ error: 'Image file not found' });
  }
});


// color

const storageColor = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderPath = path.join(__dirname, '../files/color', getCurrentDateTime());
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const fileName = `${file.originalname}`;
    cb(null, fileName);
  },
});

const uploadColor = multer({ storage: storageColor });

app.post('/color/color_image', uploadColor.array('files', 5), (req, res) => {
  res.json({ message: 'File uploaded successfully' });
});



app.get('/color/:year/:month/:day/:hour/:minute/:file', (req, res) => {
  const { year, month, day, hour, minute, file } = req.params;
  const imageFilePath = path.join(__dirname, `color/${year}/${month}/${day}/${hour}/${minute}/${file}`);

  // Check if the image file exists
  if (fs.existsSync(imageFilePath)) {
    res.sendFile(imageFilePath);
  } else {
    res.status(404).json({ error: 'Image file not found' });
  }
});


app.delete('/color/:year/:month/:day/:hour/:minute/:file', (req, res) => {
  const { year, month, day, hour, minute, file } = req.params;
  const imageFilePath = path.join(__dirname, `color/${year}/${month}/${day}/${hour}/${minute}/${file}`);

  // Check if the image file exists
  if (fs.existsSync(imageFilePath)) {
    // Delete the image file
    fs.unlinkSync(imageFilePath);
    res.json({ message: 'Image file deleted successfully' });
  } else {
    res.status(404).json({ error: 'Image file not found' });
  }
});

// material


const storageMaterial = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderPath = path.join(__dirname, '../files/material', getCurrentDateTime());
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const fileName = `${file.originalname}`;
    cb(null, fileName);
  },
});

const uploadMaterial = multer({ storage: storageMaterial });

app.post('/material/material_image', uploadMaterial.array('files', 5), (req, res) => {
  res.json({ message: 'File uploaded successfully' });
});



app.get('/material/:year/:month/:day/:hour/:minute/:file', (req, res) => {
  const { year, month, day, hour, minute, file } = req.params;
  const imageFilePath = path.join(__dirname, `material/${year}/${month}/${day}/${hour}/${minute}/${file}`);

  // Check if the image file exists
  if (fs.existsSync(imageFilePath)) {
    res.sendFile(imageFilePath);
  } else {
    res.status(404).json({ error: 'Image file not found' });
  }
});


app.delete('/material/:year/:month/:day/:hour/:minute/:file', (req, res) => {
  const { year, month, day, hour, minute, file } = req.params;
  const imageFilePath = path.join(__dirname, `material/${year}/${month}/${day}/${hour}/${minute}/${file}`);

  // Check if the image file exists
  if (fs.existsSync(imageFilePath)) {
    // Delete the image file
    fs.unlinkSync(imageFilePath);
    res.json({ message: 'Image file deleted successfully' });
  } else {
    res.status(404).json({ error: 'Image file not found' });
  }
});

// model

const storageModel = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderPath = path.join(__dirname, '../files/model', getCurrentDateTime());
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const fileName = `${file.originalname}`;
    cb(null, fileName);
  },
});

const uploadModel = multer({ storage: storageModel });

app.post('/model/model_image', uploadModel.array('files', 5), (req, res) => {
  res.json({ message: 'File uploaded successfully' });
});



app.get('/model/:year/:month/:day/:hour/:minute/:file', (req, res) => {
  const { year, month, day, hour, minute, file } = req.params;
  const imageFilePath = path.join(__dirname, `model/${year}/${month}/${day}/${hour}/${minute}/${file}`);

  // Check if the image file exists
  if (fs.existsSync(imageFilePath)) {
    res.sendFile(imageFilePath);
  } else {
    res.status(404).json({ error: 'Image file not found' });
  }
});


app.delete('/model/:year/:month/:day/:hour/:minute/:file', (req, res) => {
  const { year, month, day, hour, minute, file } = req.params;
  const imageFilePath = path.join(__dirname, `model/${year}/${month}/${day}/${hour}/${minute}/${file}`);

  // Check if the image file exists
  if (fs.existsSync(imageFilePath)) {
    // Delete the image file
    fs.unlinkSync(imageFilePath);
    res.json({ message: 'Image file deleted successfully' });
  } else {
    res.status(404).json({ error: 'Image file not found' });
  }
});



//  period


const storagePeriod = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderPath = path.join(__dirname, '../files/period', getCurrentDateTime());
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const fileName = `${file.originalname}`;
    cb(null, fileName);
  },
});

const uploadPeriod = multer({ storage: storagePeriod });

app.post('/period/period_image', uploadPeriod.array('files', 5), (req, res) => {
  res.json({ message: 'File uploaded successfully' });
});



app.get('/period/:year/:month/:day/:hour/:minute/:file', (req, res) => {
  const { year, month, day, hour, minute, file } = req.params;
  const imageFilePath = path.join(__dirname, `period/${year}/${month}/${day}/${hour}/${minute}/${file}`);

  // Check if the image file exists
  if (fs.existsSync(imageFilePath)) {
    res.sendFile(imageFilePath);
  } else {
    res.status(404).json({ error: 'Image file not found' });
  }
});


app.delete('/period/:year/:month/:day/:hour/:minute/:file', (req, res) => {
  const { year, month, day, hour, minute, file } = req.params;
  const imageFilePath = path.join(__dirname, `period/${year}/${month}/${day}/${hour}/${minute}/${file}`);

  // Check if the image file exists
  if (fs.existsSync(imageFilePath)) {
    // Delete the image file
    fs.unlinkSync(imageFilePath);
    res.json({ message: 'Image file deleted successfully' });
  } else {
    res.status(404).json({ error: 'Image file not found' });
  }
});

// sub_category

const storageSubCategory = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderPath = path.join(__dirname, '../files/sub_category', getCurrentDateTime());
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const fileName = `${file.originalname}`;
    cb(null, fileName);
  },
});

const uploadSubCategory = multer({ storage: storageSubCategory });

app.post('/sub_category/sub_category_image', uploadSubCategory.array('files', 5), (req, res) => {
  res.json({ message: 'File uploaded successfully' });
});



app.get('/sub_category/:year/:month/:day/:hour/:minute/:file', (req, res) => {
  const { year, month, day, hour, minute, file } = req.params;
  const imageFilePath = path.join(__dirname, `sub_category/${year}/${month}/${day}/${hour}/${minute}/${file}`);

  // Check if the image file exists
  if (fs.existsSync(imageFilePath)) {
    res.sendFile(imageFilePath);
  } else {
    res.status(404).json({ error: 'Image file not found' });
  }
});


app.delete('/sub_category/:year/:month/:day/:hour/:minute/:file', (req, res) => {
  const { year, month, day, hour, minute, file } = req.params;
  const imageFilePath = path.join(__dirname, `sub_category/${year}/${month}/${day}/${hour}/${minute}/${file}`);

  // Check if the image file exists
  if (fs.existsSync(imageFilePath)) {
    // Delete the image file
    fs.unlinkSync(imageFilePath);
    res.json({ message: 'Image file deleted successfully' });
  } else {
    res.status(404).json({ error: 'Image file not found' });
  }
});

// type

const storageType = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderPath = path.join(__dirname, '../files/type', getCurrentDateTime());
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const fileName = `${file.originalname}`;
    cb(null, fileName);
  },
});

const uploadType = multer({ storage: storageType });

app.post('/type/type_image', uploadType.array('files', 5), (req, res) => {
  res.json({ message: 'File uploaded successfully' });
});



app.get('/type/:year/:month/:day/:hour/:minute/:file', (req, res) => {
  const { year, month, day, hour, minute, file } = req.params;
  const imageFilePath = path.join(__dirname, `type/${year}/${month}/${day}/${hour}/${minute}/${file}`);

  // Check if the image file exists
  if (fs.existsSync(imageFilePath)) {
    res.sendFile(imageFilePath);
  } else {
    res.status(404).json({ error: 'Image file not found' });
  }
});


app.delete('/type/:year/:month/:day/:hour/:minute/:file', (req, res) => {
  const { year, month, day, hour, minute, file } = req.params;
  const imageFilePath = path.join(__dirname, `type/${year}/${month}/${day}/${hour}/${minute}/${file}`);

  // Check if the image file exists
  if (fs.existsSync(imageFilePath)) {
    // Delete the image file
    fs.unlinkSync(imageFilePath);
    res.json({ message: 'Image file deleted successfully' });
  } else {
    res.status(404).json({ error: 'Image file not found' });
  }
});





//  unit

const storageUnit = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderPath = path.join(__dirname, '../files/unit', getCurrentDateTime());
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const fileName = `${file.originalname}`;
    cb(null, fileName);
  },
});

const uploadUnit = multer({ storage: storageUnit });

app.post('/unit/unit_image', uploadUnit.array('files', 5), (req, res) => {
  res.json({ message: 'File uploaded successfully' });
});



app.get('/unit/:year/:month/:day/:hour/:minute/:file', (req, res) => {
  const { year, month, day, hour, minute, file } = req.params;
  const imageFilePath = path.join(__dirname, `unit/${year}/${month}/${day}/${hour}/${minute}/${file}`);

  // Check if the image file exists
  if (fs.existsSync(imageFilePath)) {
    res.sendFile(imageFilePath);
  } else {
    res.status(404).json({ error: 'Image file not found' });
  }
});


app.delete('/unit/:year/:month/:day/:hour/:minute/:file', (req, res) => {
  const { year, month, day, hour, minute, file } = req.params;
  const imageFilePath = path.join(__dirname, `unit/${year}/${month}/${day}/${hour}/${minute}/${file}`);

  // Check if the image file exists
  if (fs.existsSync(imageFilePath)) {
    // Delete the image file
    fs.unlinkSync(imageFilePath);
    res.json({ message: 'Image file deleted successfully' });
  } else {
    res.status(404).json({ error: 'Image file not found' });
  }
});
//  Employee start
const storageEmploye = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderPath = path.join(__dirname, '../files/employe', getCurrentDateTime());
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const fileName = `${file.originalname}`;
    cb(null, fileName);
  },
});

const uploadEmployee = multer({ storage: storageEmploye });

app.post('/employe/employe_image', uploadEmployee.array('files', 5), (req, res) => {
  res.json({ message: 'File uploaded successfully' });
});



app.get('/employe/:year/:month/:day/:hour/:minute/:file', (req, res) => {
  const { year, month, day, hour, minute, file } = req.params;
  const imageFilePath = path.join(__dirname, `employe/${year}/${month}/${day}/${hour}/${minute}/${file}`);

  // Check if the image file exists
  if (fs.existsSync(imageFilePath)) {
    res.sendFile(imageFilePath);
  } else {
    res.status(404).json({ error: 'Image file not found' });
  }
});


app.delete('/employe/:year/:month/:day/:hour/:minute/:file', (req, res) => {
  const { year, month, day, hour, minute, file } = req.params;
  const imageFilePath = path.join(__dirname, `employe/${year}/${month}/${day}/${hour}/${minute}/${file}`);

  // Check if the image file exists
  if (fs.existsSync(imageFilePath)) {
    // Delete the image file
    fs.unlinkSync(imageFilePath);
    res.json({ message: 'Image file deleted successfully' });
  } else {
    res.status(404).json({ error: 'Image file not found' });
  }
});

//  Employee end

//  warranty



const storageWarranty = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderPath = path.join(__dirname, '../files/warranty', getCurrentDateTime());
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const fileName = `${file.originalname}`;
    cb(null, fileName);
  },
});

const uploadWarranty = multer({ storage: storageWarranty });

app.post('/warranty/warranty_image', uploadWarranty.array('files', 5), (req, res) => {
  res.json({ message: 'File uploaded successfully' });
});



app.get('/warranty/:year/:month/:day/:hour/:minute/:file', (req, res) => {
  const { year, month, day, hour, minute, file } = req.params;
  const imageFilePath = path.join(__dirname, `warranty/${year}/${month}/${day}/${hour}/${minute}/${file}`);

  // Check if the image file exists
  if (fs.existsSync(imageFilePath)) {
    res.sendFile(imageFilePath);
  } else {
    res.status(404).json({ error: 'Image file not found' });
  }
});


app.delete('/warranty/:year/:month/:day/:hour/:minute/:file', (req, res) => {
  const { year, month, day, hour, minute, file } = req.params;
  const imageFilePath = path.join(__dirname, `warranty/${year}/${month}/${day}/${hour}/${minute}/${file}`);

  // Check if the image file exists
  if (fs.existsSync(imageFilePath)) {
    // Delete the image file
    fs.unlinkSync(imageFilePath);
    res.json({ message: 'Image file deleted successfully' });
  } else {
    res.status(404).json({ error: 'Image file not found' });
  }
});


// notice folder start

app.get("/notice/:year/:month/:day/:hour/:minute/:file", (req, res) => {
  const { year, month, day, hour, minute, file } = req.params;
  const imageFilePath = path.join(
    __dirname,
    `notice/${year}/${month}/${day}/${hour}/${minute}/${file}`
  );

  if (fs.existsSync(imageFilePath)) {
    res.sendFile(imageFilePath);
  } else {
    res.status(404).json({ error: "Image file not found" });
  }
});

app.delete("/notice/:year/:month/:day/:hour/:minute/:file", (req, res) => {
  const { year, month, day, hour, minute, file } = req.params;
  const imageFilePath = path.join(
    __dirname,
    `notice/${year}/${month}/${day}/${hour}/${minute}/${file}`
  );

  // Check if the image file exists
  if (fs.existsSync(imageFilePath)) {
    // Delete the image file
    fs.unlinkSync(imageFilePath);
    res.json({ message: "Image file deleted successfully" });
  } else {
    res.status(404).json({ error: "Image file not found" });
  }
});

app.get("/get-image/:path", (req, res) => {
  const imagePath = req.params.path;
  const imageFileName = req.params.file;
  const imageFilePath = path.join(
    __dirname,
    "/notice/",
    imagePath,
    imageFileName
  );

  // Check if the image file exists
  if (fs.existsSync(imageFilePath)) {
    res.sendFile(imageFilePath);
  } else {
    res.status(404).json({ error: "Image file not found" });
  }
});

const storageNotice = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderPath = path.join(__dirname, "notice", getCurrentDateTime());

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    // const fileName = `${Date.now()}_${file.originalname}`;
    const fileName = `${file.originalname}`;
    cb(null, fileName);
  },
});

const uploadNotice = multer({ storage: storageNotice });

app.post("/notice", uploadNotice.array("files", 5), (req, res) => {
  res.json({ message: "File uploaded successfully" });
});

// notice folder end

// start editor folder

function formatAMPM(date) {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const strMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${hours}:${strMinutes} ${ampm}`;
}

// Multer Storage Configuration
const storagEeditor = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderPath = path.join(__dirname, "editor");
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const timestamp = new Date();
    const formattedTime = formatAMPM(timestamp);
    const uniqueName = `${timestamp.getTime()}_${formattedTime.replace(
      /:/g,
      "-"
    )}_${file.originalname}`;
    cb(null, uniqueName);
  },
});


const uploadAll = multer({ storage: storagEeditor });

app.post("/editor", uploadAll.single("file"), (req, res) => {
  if (req.file) {
    const imageUrl = `http://192.168.0.185:5003/images/editor/${req.file.filename}`;
    res.json({ link: imageUrl });
  } else {
    res.status(400).json({ error: "Failed to upload image" });
  }
});

app.use("/images/editor", express.static(path.join(__dirname, "editor")));

// end editor folder





  app.get('/', (req, res) => {
 
    res.send('Server running saklain mostak image')
  })

  const port = 5003;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
  });








