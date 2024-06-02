// const db = require("../config/db")
// const { sequelize } = require("../config/db")
const User = require("../models/user.model")
const path = require('path');
const fs = require('fs');
const helperFunction = require("../utils/helperFunction")
const Designation = require("../models/designation.models")
const Department = require("../models/department.model")

exports.create = async (req, res) => {
    try {
        const data = req.body;

        // Check if required fields are present
        if (!data.name || !data.email || !data.bio || !data.departmentId || !data.designationId) {
            return helperFunction.clientErrorResponse(res, "All fields are required.");
        }
        // Create the User record with associated Department and Designation
        const userDetails = await User.create({
            name: data.name,
            email: data.email,
            bio: data.bio,
            departmentId: data.departmentId, // Assign departmentId
            designationId: data.designationId // Assign designationId
        });
        return helperFunction.dataResponse(res, userDetails, "User created successfully");
    } catch (err) {
        console.error('Error creating user:', err);
        return helperFunction.errorResponse(res, err, "User cannot be created");
    }
};


// Find a single User with an id
exports.findOne = async (req, res) => {
    const id = req.params.id;

    try {
        const data = await User.findByPk(id);
        if (data) {
            return helperFunction.dataResponse(res, data);
        } else {
            return helperFunction.clientErrorResponse(res, `Cannot find User with id=${id}.`);
        }
    } catch (err) {
        return helperFunction.errorResponse(res, err, `Error retrieving User with id=${id}`);
    }
};


// Update a User by the id in the request
// exports.update = async (req, res) => {
//     const id = req.params.id;
//     if (!id) {
//         return helperFunction.clientErrorResponse(res, "User ID is required.");
//     }

//     try {
//         // Find the user by ID
//         const user = await User.findByPk(id);
//         if (!user) {
//             return helperFunction.clientErrorResponse(res, "User not found with ID " + id);
//         }

//         let updatedData = { ...req.body };

//         if (req.file) {
//             const fileExtension = req.file.originalname.split('.').pop();
//             const newPath = `${req.file.destination}/${user.id}.${fileExtension}`;
//             updatedData.image = newPath;
//         }

//         // Perform the update operation
//         const [numRowsUpdated] = await User.update(updatedData, { where: { id: id } });

//         if (numRowsUpdated === 1) {
//             // Fetch the updated user
//             const updatedUser = await User.findByPk(id);
//             return helperFunction.dataResponse(res, updatedUser);
//         } else {
//             return helperFunction.clientErrorResponse(res, "User not found with ID " + id);
//         }
//     } catch (err) {
//         return helperFunction.errorResponse(res, err, "Error occurred while updating user.");
//     }
// };

exports.update = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return helperFunction.clientErrorResponse(res, "User ID is required.");
    }

    try {
        // Find the user by ID
        const user = await User.findByPk(id);
        if (!user) {
            return helperFunction.clientErrorResponse(res, `User not found with ID ${id}`);
        }

        // Update user data with request body
        const updatedData = { ...req.body };
        console.log("reqfile", req.file)

        // Check if a file was uploaded
        if (req.file) {
            // Update profile picture path in updatedData
            updatedData.image = req.file.filename; // Assuming `req.file.filename` contains the filename
        }

        // Perform the update operation
        const [numRowsUpdated] = await User.update(updatedData, { where: { id: id } });

        if (numRowsUpdated === 1) {
            // Fetch the updated user
            const updatedUser = await User.findByPk(id);
            return helperFunction.dataResponse(res, updatedUser);
        } else {
            return helperFunction.clientErrorResponse(res, `Failed to update user with ID ${id}`);
        }
    } catch (err) {
        return helperFunction.errorResponse(res, err, "Error occurred while updating user.");
    }
};





// Delete a User with the specified id in the request
exports.delete = async (req, res) => {
    const id = req.params.id;

    try {
        const num = await User.destroy({ where: { id: id } });
        if (num == 1) {
            return helperFunction.dataResponse(res, null, "User was deleted successfully!");
        } else {
            return helperFunction.clientErrorResponse(res, `Cannot delete User with id=${id}. Maybe User was not found!`);
        }
    } catch (err) {
        return helperFunction.errorResponse(res, err, `Could not delete User with id=${id}`);
    }
};




// find all User Tutorial
exports.findAllUser = async (req, res) => {
    try {
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const offset = (page - 1) * limit;

        const data = await User.findAll({
            offset: offset,
            limit: limit,
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: Department,
                    as: 'department',
                    attributes: ['name'],
                },
                { model: Designation, as: 'designation', attributes: ['name'] }
            ]
        });

        const totalCount = await User.count();
        const remainingCount = Math.max(totalCount - offset - limit, 0);

        return helperFunction.dataResponse(res, { users: data, limit: limit, totalCount: totalCount, remainingCount: remainingCount }, "all user data is fatched successfully");
    } catch (err) {
        return helperFunction.errorResponse(res, err, "Some error occurred while retrieving User.");
    }
};




//upload multiy image
exports.uploadImages = async (req, res) => {
    const userId = req.params.id;
    if (!userId) {
        return helperFunction.clientErrorResponse(res, 'User ID is required.');
    }

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return helperFunction.clientErrorResponse(res, `User not found with ID ${userId}`);
        }

        if (!req.files || req.files.length === 0) {
            return helperFunction.clientErrorResponse(res, 'No images uploaded.');
        }

        const proofDir = `profileImage/proof`;

        // await fs.mkdir(proofDir, { recursive: true });

        // Process each uploaded image sequentially
        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];
            const fieldname = file.fieldname; // Get the fieldname of the uploaded file
            const newPath = `${proofDir}/${file.filename}`; // Path for the uploaded file inside the proof directory

            // Move the image file to the proof directory
            // await fs.rename(file.path, newPath);

            // Update user's image path in the database
            user[fieldname] = newPath;

            // Save updated user object with new image path
            await user.save();
        }

        return helperFunction.dataResponse(res, user);
    } catch (err) {
        return helperFunction.errorResponse(res, err, 'Error occurred while uploading images.');
    }
};




//create user and uploading image by using exress-fileupload
exports.createUser = async (req, res) => {
    try {
        const userData = req.body;

        if (!req.files || !req.files.image) {
            return helperFunction.clientErrorResponse(res, 'No image file was uploaded.');
        }

        const imageFile = req.files.image;

        // Define the target directory where the file should be saved
        const uploadDir = path.join(__dirname, '../../profileImage');
        const filePath = path.join(uploadDir, imageFile.name);

        // Check if the directory exists; create it if not
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Move the uploaded image file to the specified path
        imageFile.mv(filePath, async function (err) {
            if (err) {
                return helperFunction.errorResponse(res, err.message || 'An error occurred while uploading the image.', 'File Upload Error');
            }

            const user = {
                name: userData.name,
                email: userData.email,
                image: '/profileImage/' + imageFile.name, // Save image path relative to server root
                bio: userData.bio || '',
                panCard: userData.panCard || '',
                addharCard: userData.addharCard || ''
            };

            // Save User in the database
            const createdUser = await User.create(user);
            return helperFunction.dataResponse(res, createdUser, 'User created successfully');
        });
    } catch (err) {
        return helperFunction.errorResponse(res, err.message || 'Error occurred while creating user.', 'User Creation Error');
    }
};
