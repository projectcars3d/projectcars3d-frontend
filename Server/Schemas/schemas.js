const bcrypt = require('bcrypt');

const mongoose = require('mongoose');

// Mongoose schemas
const userSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true
    },
    userSiteName: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    userPassword: {
        type: String,
        required: true
    },
    userFname: {
        type: String,
        required: true
    },
    userLname: {
        type: String,
        required: true
    },
    userCountry: {
        type: String,
        required: true
    },
    userBirthday: {
        type: Date,
        required: true
    },
    carsOwn: [{ 
        type: Object,
    }],
    userAvatar:{
        type: String
    },
});
// Incrypt the user's password
userSchema.pre('save', async function(next){
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(this.userPassword, salt)
        this.userPassword = hashedPassword
        next()
    }
    
    catch (error) {
        next(error)
    }
})
User = mongoose.model('User', userSchema);



const productSchema = new mongoose.Schema({
    productOwner: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    productDescription: {
        type: String,
        required: true
    },
    productPartNumber: {
        type: String,
    },
    productFiles: [{
        type: String,
        required: true
    }],
    productPictures: [{
        type: String,
        required: true
    }],
    lastUpdateDate:{
        type: Date,
        default: null
    },
    productCategory: {
        type: String,
        required: true
    },
    filamentDropDown: {
        type: String,
    },
    productNozzleTemp: {
        type: Number,
    },
    productBedTemp: {
        type: Number,
    },
    productCommentsArr: {
        type: Array,
        default: []
    },
    productDownloads: {
        type: Number,
        default: 0
    },
    fitCars: [{ 
        type: Object,
        required: true
    }]
});
Product = mongoose.model('Product', productSchema);