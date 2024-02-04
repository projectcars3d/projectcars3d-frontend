// Set up Express
const express = require('express');
const router = express.Router();
router.use('/Uploads/', express.static('Uploads'));
var bodyParser = require('body-parser');
// router.use(bodyParser.json({ limit: '50mb' }));
// router.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
router.use(bodyParser.json({ limit: '200kb' }));
router.use(bodyParser.urlencoded({ limit: '200kb', extended: true, parameterLimit: 50000 }));
const fs = require('fs');


const allowedPictureFormats = ['.png', '.jpeg', '.jpg', '.gif'];
const allowedFileFormats = ['.stl', '.obj', '.zip'];


// JWT
const jwt = require('jsonwebtoken');
const jwtsecretKey = 'AudiS4B5';
const jwtExpire = {expiresIn: '1d'};

// Set up Mongoose
const schemas = require('../Schemas/schemas');

// Set up Mutler
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let destinationFolder;
      if (req.body.userFname !== undefined){
        destinationFolder = './Uploads/Users_avatars';
      }
      // Check the MIME type of the files to determine the destination folder
      if (file.mimetype.startsWith('image/')) {
        if (req.body.commentText !== undefined) {
          destinationFolder = './Uploads/Comments_images';
        }
        else{
          destinationFolder = './Uploads/Products_pictures';
        }
      } else {
        destinationFolder = './Uploads/Products_files';
      }
  
      cb(null, destinationFolder);
    },

    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, ''));
    },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB in bytes
  },
});


// JWT Function
function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];

    if (!authHeader || !token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, jwtsecretKey, (err,user) => {
        if(err) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        req.user = user;
        next();
    });
};

// All Products APIs
router.post("/get_products", (req, res) => {
    let productSearch = req.body
    console.log(productSearch);

    switch(productSearch.type)
    {
        case "freeText":
          if (productSearch.category === 'All') {
            Product.find({
              productName: { "$regex": productSearch.text, "$options": "i" },
            }, (error, productData) => {
                if(error){
                    console.log(error);
                    res.json(error)
                }
                else{
                    res.json(productData);
                }
            })
          }
          else {
            Product.find({
              productName: { "$regex": productSearch.text, "$options": "i" },
              productCategory: productSearch.category
            }, (error, productData) => {
                if(error){
                    console.log(error);
                    res.json(error)
                }
                else{
                    res.json(productData);
                }
            })
          }
        break;

        case "partNum":
            Product.find({
              productPartNumber: productSearch.text,
            }, (error, productData) => {
                if(error){
                    res.json(error)
                }
                else{
                    res.json(productData);
                }
            }) 
        break;

        case "carModel":
          // Return all categories
          if (productSearch.category === "All") {
            if(productSearch.fromYear === "All" && productSearch.model === "All"){
              Product.find(
                  { 
                    fitCars: { 
                      $elemMatch: { 
                        selectedBrand: productSearch.brand,
                      }
                    }
                  },
                  function(error, productData) {
                    if (error) {
                      res.send(error);
                    } else {
                      res.json(productData);
                    }
                  }
              );
          };
          if (productSearch.fromYear === "All" && productSearch.model !== "All") {
              Product.find({
                  $or: [
                    {
                      fitCars: {
                        $elemMatch: {
                          selectedBrand: productSearch.brand,
                          selectedModel: productSearch.model,
                        }
                      }
                    },
                    {
                      fitCars: {
                        $elemMatch: {
                          selectedBrand: productSearch.brand,
                          selectedModel: "",
                          selectedToYear: 0,
                        }
                      }
                    }
                  ]
                },
                function(error, productData) {
                  if (error) {
                    res.send(error);
                  } else {
                    res.json(productData);
                  }
                }
              );
            };
          if (productSearch.fromYear !== "All" && productSearch.brand !== "") {
              Product.find(
                {
                  $or: [
                    {
                      fitCars: {
                        $elemMatch: {
                          selectedBrand: productSearch.brand,
                          selectedModel: productSearch.model,
                          selectedFromYear: { $lte: Number(productSearch.fromYear) },
                          selectedToYear: { $gte: Number(productSearch.fromYear) },
                        },
                      },
                    },
                    {
                      fitCars: {
                          $elemMatch: {
                            selectedBrand: productSearch.brand,
                            selectedModel: "",
                            selectedToYear: 0,
                          },
                        },
                      },
                      {
                        fitCars: {
                            $elemMatch: {
                              selectedBrand: productSearch.brand,
                              selectedFromYear: { $lte: Number(productSearch.fromYear) },
                              selectedToYear: { $gte: Number(productSearch.fromYear) },
                            },
                        },
                      },
                  ],
                },
                function (error, productData) {
                  if (error) {
                    res.send(error);
                  } else {
                    res.json(productData);
                  }
                }
              );
            }
          }
          
          // Return specific categorie
          else{
            if(productSearch.fromYear === "All" && productSearch.model === "All"){
              Product.find(
                  { 
                    productCategory: productSearch.category,
                    fitCars: { 
                      $elemMatch: { 
                        selectedBrand: productSearch.brand,
                      }
                    }
                  },
                  function(error, productData) {
                    if (error) {
                      res.send(error);
                    } else {
                      res.json(productData);
                    }
                  }
              );
          };
          if (productSearch.fromYear === "All" && productSearch.model !== "All") {
              Product.find({
                  $or: [
                    {
                      productCategory: productSearch.category,
                      fitCars: {
                        $elemMatch: {
                          selectedBrand: productSearch.brand,
                          selectedModel: productSearch.model,
                        }
                      }
                    },
                    {
                      productCategory: productSearch.category,
                      fitCars: {
                        $elemMatch: {
                          selectedBrand: productSearch.brand,
                          selectedModel: "",
                          selectedToYear: 0,
                        }
                      }
                    }
                  ]
                },
                function(error, productData) {
                  if (error) {
                    res.send(error);
                  } else {
                    res.json(productData);
                  }
                }
              );
            };
          if (productSearch.fromYear !== "All" && productSearch.brand !== "") {
              Product.find(
                {
                  $or: [
                    {
                      productCategory: productSearch.category,
                      fitCars: {
                        $elemMatch: {
                          selectedBrand: productSearch.brand,
                          selectedModel: productSearch.model,
                          selectedFromYear: { $lte: Number(productSearch.fromYear) },
                          selectedToYear: { $gte: Number(productSearch.fromYear) },
                        },
                      },
                    },
                    {
                      productCategory: productSearch.category,
                      fitCars: {
                          $elemMatch: {
                            selectedBrand: productSearch.brand,
                            selectedModel: "",
                            selectedToYear: 0,
                          },
                        },
                      },
                      {
                        productCategory: productSearch.category,
                        fitCars: {
                            $elemMatch: {
                              selectedBrand: productSearch.brand,
                              selectedFromYear: { $lte: Number(productSearch.fromYear) },
                              selectedToYear: { $gte: Number(productSearch.fromYear) },
                            },
                        },
                      },
                  ],
                },
                function (error, productData) {
                  if (error) {
                    res.send(error);
                  } else {
                    res.json(productData);
                  }
                }
              );
            }
          }
        break;              

        case "new":
            Product.find({}).sort({ creationDate: -1 }).limit(4).exec((error, productData) => {
                    if(error){
                        res.json(error)
                    }
                    else{
                        res.json(productData);
                    }
                })     
            break;

            case "productId":
              Product.findOne({ _id: productSearch.text }, async (error, rawProductData) => {
                if (error) {
                  res.json(error);
                } else {
                  let agrProductData = rawProductData;
                  for (let i = 0; i < rawProductData.productCommentsArr.length; i++) {
                    try {
                      const user = await User.findById(rawProductData.productCommentsArr[i].userId);
                      if (user && user.userAvatar) {
                        agrProductData.productCommentsArr[i].userProfile = user.userAvatar;
                        agrProductData.productCommentsArr[i].userName = user.userSiteName;
                      }
                    } catch (error) {
                      res.json(error);
                      return; // Stop further processing in case of an error
                    }
                  }
                  res.json(agrProductData);
                }
              });
            break;


        default:
            res.json("Not a valid search type")
        break;
    }
});

router.post("/get_authorized_products", authenticateToken, (req, res) => {
  let authorizedSroductSearch = req.body;
  let tokennUserId = req.user.user._id;
  // if (authorizedSroductSearch.text !== userId) {
  //     return res.status(403).json({ message: 'Forbidden' });
  // }

  switch(authorizedSroductSearch.type)
  {
      case "myProducts":
          Product.find({productOwner: authorizedSroductSearch.text}, (error, productData) => {
              if(error){
                  res.json(error)
              }
              else{
                  res.json(productData);
              }
          })
      break;

      case "productId":
          Product.findOne({_id: authorizedSroductSearch.text}, (error, productData) => {
              if (productData.productOwner !== tokennUserId) {
                  return res.status(403).json({ message: 'Forbidden' });
              }
              if(error){
                  res.json(error)
              }
              else{
                  res.json(productData);
              }
          })        
          break;

      default:
          res.json("Not a valid search type")
      break;
  }
});

router.post("/product_comments", authenticateToken, upload.single('commentImage'), (req, res) => {
  if (req.body.commentText !== ""){
      const newComment = req.body;
      let commentImage = '';
      if (req.file) {
          commentImage = req.file.path.replace("\\","/");
      }

      // Add the image parameter to the new comment
      newComment.commentImage = commentImage

      // Change the rate from string to Number (Due to the FormData)
      newComment.userRate = parseInt(newComment.userRate)

      Product.findOneAndUpdate({_id: newComment.productId}, 
          {$push: {productCommentsArr: newComment}}, 
          (err, result) => {
          try{
              res.status(201).json(newComment)
          }
          catch (err){
              res.status(400).json({message: err.message})
          }
          })
}});

router.post("/add_product", (req, res, next) => {
    upload.fields([{ name: 'productPictures', maxCount: 6 }, { name: 'productFiles', maxCount: 1 }])(req, res, function (err) {
      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        // File size limit exceeded
        return res.status(403).json({ message: 'File size limit exceeded' });
      } else if (err) {
        // Other multer errors
        return res.status(500).json({ message: 'Something went wrong' });
      }

      next();
    });
  },
  (req, res) => {
    const requiredFields = [
      "productName",
      "productDescription",
      "productCategory",
      "fitCars"
    ];
  
    const requiredFiles =[
      "productFiles",
      "productPictures"
    ];
  
    const customFieldNames = {
      "productName": "Name",
      "productDescription": "Description",
      "productCategory": "Category",
      "fitCars": "Cars"
    };
  
    const customFileFieldNames = {
      "productFiles": "File",
      "productPictures":"Pictures"
    };
  
    const missingFields = [];
  
    for (const field of requiredFields) {
      if (!req.body[field] || req.body[field] === '[]' || req.body[field].length <= 2) {
        missingFields.push(customFieldNames[field]);
      }
    }
  
    for (const fieldFiles of requiredFiles) {
      if (!req.files[fieldFiles]) {
        missingFields.push(customFileFieldNames[fieldFiles]);
      }
    }
  
    if (missingFields.length > 0) {
      const message = `The following fields are required: ${missingFields.join(", ")}`;
      res.status(206).json({ message });
      return;
    }
  
  
    let productPicturesArray = [];
    for (i=0; i < req.files.productPictures.length; i++){
        productPicturesArray.push(req.files.productPictures[i].path.replace("\\","/"))
    }
  
    let productFilessArray = [];
    for (i=0; i < req.files.productFiles.length; i++){
        productFilessArray.push(req.files.productFiles[i].path.replace("\\","/"))
    }
    
    if (req.body.productName !== "" || req.body.productOwner !== null || req.body.productCategory !== null){
        const newProductReq = new Product({
            productOwner: req.body.productOwner,
            productName: req.body.productName,
            creationDate: req.body.creationDate,
            productDescription: req.body.productDescription,
            productPartNumber: req.body.productPartNumber,
            productFiles: productFilessArray,
            productPictures: productPicturesArray,
            productCategory: req.body.productCategory,
            filamentDropDown: req.body.filamentDropDown,
            productNozzleTemp: req.body.productNozzleTemp,
            productBedTemp: req.body.productBedTemp,
            fitCars: JSON.parse(req.body.fitCars)
    })
  
    try{
        const newProduct = newProductReq.save()
        res.status(201).json(newProductReq)
    }
    
    catch (err) {
        res.status(400).json({message: err.message})
    }
  }
  }
);

router.post("/delete_products", (req, res) => {
  Product.findOne({_id: req.body.productIdToDelete}, (err, productToDelete) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!productToDelete) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Get the file paths from the product document
    const picturesToDelete = productToDelete.productPictures;
    const filesToDelete = productToDelete.productFiles;
    const commentsPicturesToDelete = productToDelete.productCommentsArr;

    // Delete the comments' pictures
    for (let i = 0; i < commentsPicturesToDelete.length; i++) {
      const absoluteCommentPicturePath = path.join(__dirname, '..', commentsPicturesToDelete[i].commentImage);
      fs.unlinkSync(absoluteCommentPicturePath);
    }

    // Delete the pictures
    picturesToDelete.forEach(picturePath => {
      const absolutePicturePath = path.join(__dirname, '..', picturePath);
      fs.unlinkSync(absolutePicturePath);
    });

    // Delete the files
    filesToDelete.forEach(filePath => {
      const absoluteFilePath = path.join(__dirname, '..', filePath);
      fs.unlinkSync(absoluteFilePath);
    });

    // Remove the product from MongoDB
    Product.findOneAndDelete({ _id: req.body.productIdToDelete }, (err, deletedProduct) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      res.status(200).json({ message: "Product and associated files deleted successfully" });
    });
  });
});

router.post("/edit_products", authenticateToken, (req, res, next) => {
    upload.fields([{ name: 'productPictures', maxCount: 6 }, { name: 'productFiles', maxCount: 1 }])(req, res, function (err) {
      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        // File size limit exceeded
        return res.status(403).json({ message: 'File size limit exceeded' });
      } else if (err) {
        // Other multer errors
        return res.status(500).json({ message: 'Something went wrong' });
      }

      // No multer errors, proceed to the next middleware
      next();
    });
  },
  async (req, res) => {
    let productPicturesArray = [];
    let productFilesArray = [];
    const existingProduct = await Product.findById(req.body._id);

    if (req.files.productPictures === undefined) {
      productPicturesArray = existingProduct.productPictures;
    }
    else{
      // Delete the old productPictures
      for (const oldPictures of existingProduct.productPictures) {
        fs.unlinkSync(oldPictures);
      }

      for (let i = 0; i < req.files.productPictures.length; i++) {
        productPicturesArray.push(req.files.productPictures[i].path.replace("\\", "/"));
      }
    }


    if (req.files.productFiles === undefined) {
      console.log("No new file was added");
      productFilesArray = existingProduct.productFiles;
    }
    else{
      // Delete the old productPictures
      for (const oldFiles of existingProduct.productFiles) {
        fs.unlinkSync(oldFiles);
      }

      for (let i = 0; i < req.files.productFiles.length; i++) {
        productFilesArray.push(req.files.productFiles[i].path.replace("\\", "/"));
      }
    }

    try {
      let lastUpdateDate = Date.now();
      let lastUpdateDateString = lastUpdateDate.toString();

      const updateData = {
        productDescription: req.body.productDescription,
        productName: req.body.productName,
        productPartNumber: req.body.productPartNumber,
        productCategory: req.body.productCategory,
        filamentDropDown: req.body.filamentDropDown,
        productNozzleTemp: req.body.productNozzleTemp,
        productBedTemp: req.body.productBedTemp,
        lastUpdateDate: lastUpdateDate,
        fitCars: JSON.parse(req.body.fitCars),
        productPictures: productPicturesArray,
        productFiles: productFilesArray
      };

      const updatedProduct = await Product.findOneAndUpdate(
        { _id: req.body._id },
        { $set: updateData },
        { new: true }
      );

      res.send(updatedProduct);
      console.log(updatedProduct);
    } catch (err) {
      res.status(500).json({ error: "Something went wrong" });
      console.log(err);
    }
  }
);

router.post("/product_was_downloaded", (req, res) => {
  let counter = req.body.productDownloads
  let incrementCounter = ++counter
  Product.findOneAndUpdate({_id: req.body._id}, {$set:{productDownloads: incrementCounter}}, {new: true}, (err, doc) => {
      if (err){
          // res.sendStatus(500);
          console.log("Something wrong when updating data!");
      }

      res.json(doc)
  })
});

module.exports = router;