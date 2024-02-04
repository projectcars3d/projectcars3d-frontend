// Set up Express
const express = require('express');
const router = express.Router();
router.use(express.json());
router.use('/Uploads/', express.static('Uploads'));
var bodyParser = require('body-parser');
router.use(bodyParser.json({ limit: '50mb' }));
router.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
const fs = require('fs');


// Set up JWT
const jwt = require('jsonwebtoken');
const jwtsecretKey = 'AudiS4B5';
const jwtExpire = {expiresIn: '1d'};

// Set Up BCrypt
const bcrypt = require('bcrypt');

// Set up Mongoose
const schemas = require('../Schemas/schemas');

// Set up Mutler
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if(req.body.userFname !== undefined){
            cb(null, './Uploads/Users_avatars');
        }

        if (req.body.commentText !== undefined) {
            cb(null, './Uploads/Comments_images');
        }

        if(req.body.productCategory !== undefined) {
            cb(null, './Uploads/Products_files');
        }
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, ""))
    }
});
const upload = multer({storage: storage})

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

// All Users APIs
router.post("/add_user", upload.single('userAvatar'), (req, res) => {
 User.find({$or:[{userEmail: req.body.userEmail},{userSiteName: req.body.userSiteName}]}, function(err, user) {
console.log(req.body);
    const requiredFields = [
        "userSiteName",
        "userEmail",
        "userPassword",
        "userFname",
        "userLname",
        "userCountry",
        "userBirthday"
      ];
    
      const customFieldNames = {
        "userSiteName": "User Name",
        "userEmail": "Email",
        "userPassword": "Password",
        "userFname": "First Name",
        "userLname": "Last Name",
        "userCountry": "Country",
        "userBirthday": "Birthday"
      };
    
      const missingFields = [];
    
      for (const field of requiredFields) {
        if (!req.body[field]) {
          missingFields.push(customFieldNames[field]);
        }
      }
    
      if (missingFields.length > 0) {
        const message = `The following fields are required: ${missingFields.join(", ")}`;
        return res.status(206).json({ message });
      }
    
      // Validate email format
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(req.body.userEmail)) {
        const message = "Invalid email format";
        return res.status(400).json({ message });
      }

      if (req.body.userPassword.length < 8) {
        const message = "Invalid password length";
        return res.status(400).json({ message });
      }

    if(user.length > 0){
        if (user[0].userSiteName === req.body.userSiteName){
            console.log("User name already exists");
            res.status(208).json({message: "User name already exists"})
            return
        }

        if (user[0].userEmail === req.body.userEmail){
            console.log("Email already exists");
            res.status(208).json({message: "Email already exists"})
            return
        }
    }   
    else{
        let pathRegex = null;
        if (req.file === undefined || req.file === null){
            pathRegex = null;
        }
        else{
            pathRegex = req.file.path.replace("\\","/");
        }
        if (req.body.userEmail !== ""){
            const newUserReq = new User({
                userEmail: req.body.userEmail,
                userSiteName: req.body.userSiteName,
                userPassword: req.body.userPassword,
                userFname: req.body.userFname,
                userLname: req.body.userLname,
                userCountry: req.body.userCountry,
                userBirthday: req.body.userBirthday,
                userAvatar: pathRegex,
                carsOwn: JSON.parse(req.body.carsOwn)
        })

        try{
            const newUser =  newUserReq.save()
            res.status(201).json(newUserReq)
        }

        catch (err) {
            res.status(400).json({message: err.message})
        }
        }
    }
    });
});

router.post('/loginInfo', async (req, res) => {
  //find user exist or not
  User.findOne({ userEmail: req.body.userEmail })
      .then(user => {
          //if user not exist than return status 400
          if (!user){
              //msg: "User not exist"
              res.status(404).json({message: "Email not found"})
              return
          }

          bcrypt.compare(req.body.userPassword, user.userPassword, (err, result) => {
              //if error than throw error
              if (err){
                  res.json(err)
                  return
              }

              //if both match than you can do anything
              if (result) {
                   const token = jwt.sign({user}, jwtsecretKey, jwtExpire);
                   res.status(200).json({user, token});
                   return
              } else {
                  //msg: "Unauthorised credentials"
                   res.status(401).json({message: "Wrong Password, Please try again"})
                   return
              }
          })
      })
});

router.post('/getProductOwner', function (req, res){
    User.findOne({_id: req.body.text}, (error, productOwner) => {
        if (error) {
            res.json(error)
            return
        }
        else {
            res.json(productOwner);
            return
        }
    }) 
});

router.post('/getUser', authenticateToken, function (req, res){
    User.findOne({_id: req.body.text}, (error, productOwner) => {
        if (error) {
            res.json(error)
            return
        }
        else {
            res.json(req.user);
            return
        }
    }) 
});

router.post("/edit_profile", authenticateToken, upload.single('userAvatar'), (req, res) => {
    User.findOne({_id: req.user.user._id}, (err, user) => {
        if (err){
            console.log("Something wrong when finding user!");
            return res.status(404).json({message: "Internal server error"});
        }
        
        // retrieve the path of the old image
        const oldImagePath = user.userAvatar;

        // update the user with the new data
        const updateData = {
            carsOwn: JSON.parse(req.body.carsOwn),
            userFname: req.body.userFname,
            userLname: req.body.userLname,
            userCountry: req.body.userCountry
        };
        
        if (req.file) {
            updateData.userAvatar = req.file.path.replace("\\","/");
        }

        User.findOneAndUpdate({_id: req.user.user._id}, {$set: updateData}, {new: true}, (err, updatedUser) => {
            if (err){
                console.log("Something wrong when updating data!");
                return res.status(500).json({message: "Internal server error"});
            }
            
            let imageDeleteError = false;
            // delete the old image
            if (oldImagePath) {
                fs.unlink(oldImagePath, (err) => {
                    if (err) {
                        console.log("Something wrong when deleting old image!");
                        imageDeleteError = true;
                    }
                });
            }
            
            // create a new JWT token with the updated user data
            const token = jwt.sign({user: updatedUser}, jwtsecretKey, jwtExpire);

            if (imageDeleteError) {
                return res.status(500).json({message: "Internal server error"});
            } else {
                return res.status(200).json({user: updatedUser, token});
            }
        })
    });
});


module.exports = router;