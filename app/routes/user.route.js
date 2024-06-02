
//# utils
const { configureMulter, configureMulityMulter } = require("../utils/multer")
const single_upload = configureMulter({ destination: `profileImage` })
const multi_upload = configureMulityMulter({
    destination: 'profileImage/',
    fields: [
        { name: 'addhar', maxCount: 8 },
        { name: 'pan', maxCount: 8 }
    ]
});
//# controller
const user = require("../controllers/user.controller")
//# router
var router = require("express").Router()

// const multer = require('multer')
// const upload = multer({ dest: 'uploads/' })

// Create a new Tutorial
router.post("/create", user.create);
router.post("/user", user.findAllUser);  //find all 
router.post("/:id", user.findOne);   //find by id
router.post("/update-user/:id", single_upload.single('profilePicture'), user.update);  //single image upload
// router.post("/update-user/:id", upload.single('avtar'), user.update);  //single image upload
router.post("/delete/:id", user.delete);   //delete user

router.post('/upload-images/:id', multi_upload, user.uploadImages);   //multi image upload
// router.post('/upload-images/:id', upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }]), user.uploadImages);   //multi image upload


//crrating user using express-fileupload
router.post("/create/user", user.createUser)

module.exports = router;

