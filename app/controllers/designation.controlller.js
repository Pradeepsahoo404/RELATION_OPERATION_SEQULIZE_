const db = require("../config/db")
const Op = db.Op;
const Designation = require("../models/designation.models")
const helperFunction = require("../utils/helperFunction")

exports.createDesignation = async (req, res) => {
    try {
        const { name, description } = req.body;

        // Validate required fields
        if (!name || !description) {
            return helperFunction.clientErrorResponse(res, "all fields are required.");
        }

        // Check if the designation already exists
        const existingDesignation = await Designation.findOne({ where: { name } });
        if (existingDesignation) {
            return helperFunction.clientErrorResponse(res, "This designation already exists.");
        }

        // Create the new designation
        const newDesignation = await Designation.create({ name, description });

        if (!newDesignation) {
            return helperFunction.errorResponse(res, null, "Failed to create designation.");
        }

        return helperFunction.dataResponse(res, newDesignation, "Designation created successfully.");
    } catch (err) {
        return helperFunction.errorResponse(res, err, "Designation cannot be created.");
    }
};

exports.getSingleDesignation = async (req, res) => {
    const id = req.params.id;

    try {
        const designation = await Designation.findByPk(id);

        if (designation) {
            return helperFunction.dataResponse(res, designation);
        } else {
            return helperFunction.clientErrorResponse(res, `Cannot find Designation with id=${id}.`);
        }
    } catch (err) {
        return helperFunction.errorResponse(res, err, `Error retrieving Designation with id=${id}`);
    }
};

exports.getAllDesignations = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const designations = await Designation.findAll({
            offset: offset,
            limit: limit,
            order: [['createdAt', 'DESC']],
        });

        const totalCount = await Designation.count();

        const remainingCount = Math.max(totalCount - offset - limit, 0);

        return helperFunction.dataResponse(res, {
            designations: designations,
            limit: limit,
            totalCount: totalCount,
            remainingCount: remainingCount
        }, "All designations fetched successfully.");

    } catch (err) {
        return helperFunction.errorResponse(res, err, "Some error occurred while retrieving designations.");
    }
};

exports.deleteDesignation = async (req, res) => {
    const id = req.params.id;

    try {
        const numDeleted = await Designation.destroy({ where: { id: id } });
        if (numDeleted === 1) {
            return helperFunction.dataResponse(res, null, "Designation was deleted successfully!");
        } else {
            return helperFunction.clientErrorResponse(res, `Cannot delete Designation with id=${id}. Maybe Designation was not found!`);
        }
    } catch (err) {
        return helperFunction.errorResponse(res, err, `Could not delete Designation with id=${id}`);
    }
};

exports.updateDesignation = async (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;

    try {
        const designation = await Designation.findByPk(id);

        if (designation) {
            await designation.update(updatedData);
            const updatedDesignation = await Designation.findByPk(id);

            return helperFunction.dataResponse(res, updatedDesignation, 'Designation updated successfully.');
        } else {
            return helperFunction.clientErrorResponse(res, `Cannot find Designation with id=${id}.`);
        }
    } catch (err) {
        console.error('Error updating designation:', err);
        return helperFunction.errorResponse(res, err, 'Internal Server Error');
    }
};
