const { DataTypes } = require("sequelize")
const db = require("../config/db")
const sequelize = db.sequelize

const Designation = sequelize.define("Designation", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        trim: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
})

module.exports = Designation


const User = require('../models/user.model');

Designation.hasMany(User, {
    foreignKey: 'designationId',
});