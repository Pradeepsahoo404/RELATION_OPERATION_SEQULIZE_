const { DataTypes } = require("sequelize");
const db = require("../config/db");
const sequelize = db.sequelize;

const Department = sequelize.define("Department", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        trim: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
});


module.exports = Department;

const User = require('../models/user.model');

Department.hasMany(User, {
    foreignKey: 'departmentId',
});