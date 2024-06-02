const multer = require('multer');
const path = require('path');

function configureMulter(options) {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const uploadDir = path.join(__dirname, '../../profileImage');
            cb(null, uploadDir);
        },
        filename: function (req, file, cb) {
            const uniqueFilename = `${Date.now()}-${file.originalname}`;
            cb(null, uniqueFilename);
        }
    });

    return multer({ storage });
}

function configureMulityMulter(options) {
    // Set default options if not provided
    options = options || {};

    // Define storage configuration
    const storage = multer.diskStorage({
        destination: options.destination || function (req, file, cb) {
            cb(null, 'profileImage/');
        },
        filename: options.filename || function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname);
        }
    });

    // Create and return multer instance with appropriate method for multiple file uploads
    if (options.maxCount && options.fieldName) {
        return multer({ storage }).array(options.fieldName, options.maxCount);
    } else {
        return multer({ storage }).any();
    }
}


module.exports = {
    configureMulter,
    configureMulityMulter
};
