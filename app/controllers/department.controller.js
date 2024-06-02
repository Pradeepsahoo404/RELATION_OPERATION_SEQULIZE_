const db = require("../config/db")
const Op = db.Op;
const Department = require("../models/department.model")
const helperFunction = require("../utils/helperFunction")


exports.createDepartment = async (req, res) => {
    try {
        const data = req.body;

        if (!data.name || !data.description) {
            return helperFunction.clientErrorResponse(res, "All fields are required.");
        }

        const existDepartment = await Department.findOne({ where: { name: data.name } });
        if (existDepartment) {
            return helperFunction.clientErrorResponse(res, "This department is already exist.");
        }

        const departmentDetails = await Department.create(data);

        if (!departmentDetails) {
            return helperFunction.errorResponse(res, null, "Failed to create department.");
        }

        return helperFunction.dataResponse(res, departmentDetails, "Department created successfully.");
    } catch (err) {
        return helperFunction.errorResponse(res, err, "Department cannot be created.");
    }
};

exports.getSingleDepartment = async (req, res) => {
    const id = req.params.id;

    try {
        const data = await Department.findByPk(id);
        if (data) {
            return helperFunction.dataResponse(res, data);
        } else {
            return helperFunction.clientErrorResponse(res, `Cannot find Department with id=${id}.`);
        }
    } catch (err) {
        return helperFunction.errorResponse(res, err, `Error retrieving Department with id=${id}`);
    }
};

exports.getAllDepartment = async (req, res) => {
    try {
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const offset = (page - 1) * limit;

        const data = await Department.findAll({
            offset: offset,
            limit: limit,
            order: [['createdAt', 'DESC']],
        });

        const totalCount = await Department.count();
        const remainingCount = Math.max(totalCount - offset - limit, 0);

        return helperFunction.dataResponse(res, { departments: data, limit: limit, totalCount: totalCount, remainingCount: remainingCount }, "all user data is fatched successfully");
    } catch (err) {
        return helperFunction.errorResponse(res, err, "Some error occurred while retrieving Employee.");
    }
};

exports.deleteDepartment = async (req, res) => {
    const id = req.params.id;

    try {
        const num = await Department.destroy({ where: { id: id } });
        if (num == 1) {
            return helperFunction.dataResponse(res, null, "Department was deleted successfully!");
        } else {
            return helperFunction.clientErrorResponse(res, `Cannot delete Department with id=${id}. Maybe User was not found!`);
        }
    } catch (err) {
        return helperFunction.errorResponse(res, err, `Could not delete Department with id=${id}`);
    }
};

exports.updateDepartment = async (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;

    try {
        const departmentDetail = await Department.findByPk(id);

        if (departmentDetail) {
            const updatedDepartment = await departmentDetail.update(updatedData);

            return helperFunction.dataResponse(res, updatedDepartment);
        } else {
            return helperFunction.clientErrorResponse(res, `Cannot find Department with id=${id}.`);
        }
    } catch (err) {
        console.error('Error updating department:', err);
        return helperFunction.errorResponse(res, 'Internal Server Error');
    }
};