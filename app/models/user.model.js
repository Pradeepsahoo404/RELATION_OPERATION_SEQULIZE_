// Define the User model
const { DataTypes, Model } = require("sequelize");
const db = require("../config/db")
const sequelize = db.sequelize;

const User = sequelize.define("User", {
    name: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    bio: {
        type: DataTypes.STRING
    },
    image: {
        type: DataTypes.STRING
    },
    addharCard: {
        type: DataTypes.STRING
    },
    panCard: {
        type: DataTypes.STRING
    },
    departmentId: {
        type: DataTypes.INTEGER
    },
    designationId: {
        type: DataTypes.INTEGER
    },

})

module.exports = User

// Association setup imported   
const Department = require('../models/department.model');
const Designation = require("../models/designation.models")

User.belongsTo(Department, {
    foreignKey: 'departmentId',
    as: 'department'
});

User.belongsTo(Designation, {
    foreignKey: 'designationId',
    as: 'designation'
});